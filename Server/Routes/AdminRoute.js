import express from 'express';
import con from '../utils/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer config with file filter
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  }
});

// ---------------- ADMIN LOGIN ----------------
router.post('/adminlogin', (req, res) => {
  const { email, password } = req.body;
  con.query('SELECT * FROM admin WHERE email = ?', [email], (err, result) => {
    if (err) return res.json({ loginStatus: false, error: 'Database error' });
    if (!result.length) return res.json({ loginStatus: false, error: 'Admin not found' });

    const admin = result[0];
    if (admin.password === password) {
      const token = jwt.sign({ role: 'admin', email }, 'jwt_secret_key', { expiresIn: '1d' });
      res.cookie('token', token, { httpOnly: true });
      return res.json({ loginStatus: true });
    } else {
      return res.json({ loginStatus: false, error: 'Invalid credentials' });
    }
  });
});

// ---------------- CATEGORY ----------------
router.get('/category', (req, res) => {
  con.query('SELECT * FROM category', (err, result) => {
    if (err) return res.json({ status: false, error: 'Error fetching categories' });
    res.json({ status: true, result });
  });
});

router.post('/add_category', (req, res) => {
  const { category } = req.body;
  if (!category || !category.trim()) {
    return res.json({ status: false, error: 'Category is required' });
  }
  con.query('INSERT INTO category (name) VALUES (?)', [category], err => {
    if (err) return res.json({ status: false, error: 'Error adding category' });
    res.json({ status: true });
  });
});

// ---------------- EMPLOYEES ----------------
router.post('/add_employee', upload.single('image'), (req, res) => {
  const { name, email, password, address, salary, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !email || !password || !address || !salary || !category_id) {
    return res.json({ status: false, error: 'All fields are required' });
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.json({ status: false, error: 'Error hashing password' });

    con.query(
      'INSERT INTO employee (name, email, password, address, salary, image, category_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hash, address, salary, image, category_id],
      err => {
        if (err) return res.json({ status: false, error: 'Error adding employee' });
        res.json({ status: true });
      }
    );
  });
});

router.get('/employees', (req, res) => {
  con.query('SELECT * FROM employee', (err, result) => {
    if (err) return res.json({ status: false, error: 'Error fetching employees' });
    res.json({ status: true, result });
  });
});

router.get('/employee/:id', (req, res) => {
  con.query('SELECT * FROM employee WHERE id = ?', [req.params.id], (err, result) => {
    if (err) return res.json({ status: false, error: 'Error fetching employee' });
    if (!result.length) return res.json({ status: false, error: 'Employee not found' });
    res.json({ status: true, result: result[0] });
  });
});

router.put('/employee/:id', upload.single('image'), (req, res) => {
  const { name, email, address, salary, category_id, password } = req.body;
  const image = req.file ? req.file.filename : null;

  con.query('SELECT image, password FROM employee WHERE id = ?', [req.params.id], (err, result) => {
    if (err || !result.length) return res.json({ status: false, error: 'Error fetching employee data' });

    const existing = result[0];
    const finalImage = image || existing.image;

    const performUpdate = (hashedPassword) => {
      const sql = password
        ? 'UPDATE employee SET name=?, email=?, address=?, salary=?, image=?, category_id=?, password=? WHERE id=?'
        : 'UPDATE employee SET name=?, email=?, address=?, salary=?, image=?, category_id=? WHERE id=?';

      const values = password
        ? [name, email, address, salary, finalImage, category_id, hashedPassword, req.params.id]
        : [name, email, address, salary, finalImage, category_id, req.params.id];

      con.query(sql, values, err => {
        if (err) return res.json({ status: false, error: 'Error updating employee' });
        res.json({ status: true });
      });
    };

    if (password) {
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) return res.json({ status: false, error: 'Error hashing new password' });
        performUpdate(hash);
      });
    } else {
      performUpdate(existing.password);
    }
  });
});

router.delete('/delete_employee/:id', (req, res) => {
  con.query('SELECT image FROM employee WHERE id = ?', [req.params.id], (err, result) => {
    if (err || !result.length) return res.json({ status: false, error: 'Error fetching employee image' });

    const imagePath = path.join(uploadDir, result[0].image);
    fs.unlink(imagePath, () => {
      con.query('DELETE FROM employee WHERE id = ?', [req.params.id], err => {
        if (err) return res.json({ status: false, error: 'Error deleting employee' });
        res.json({ status: true });
      });
    });
  });
});

// ---------------- DASHBOARD STATS ----------------
router.get('/admin_count', (req, res) => {
  con.query('SELECT COUNT(id) AS admin FROM admin', (err, result) => {
    if (err) return res.json({ status: false, error: 'Error counting admins' });
    res.json({ status: true, result });
  });
});

router.get('/employee_count', (req, res) => {
  con.query('SELECT COUNT(id) AS employee FROM employee', (err, result) => {
    if (err) return res.json({ status: false, error: 'Error counting employees' });
    res.json({ status: true, result });
  });
});

router.get('/salary_sum', (req, res) => {
  con.query('SELECT SUM(salary) AS total_salary FROM employee', (err, result) => {
    if (err) return res.json({ status: false, error: 'Error calculating salaries' });
    res.json({ status: true, result });
  });
});

router.get('/admin_records', (req, res) => {
  con.query('SELECT * FROM admin', (err, result) => {
    if (err) return res.json({ status: false, error: 'Error fetching admin records' });
    res.json({ status: true, result });
  });
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ status: true });
});

export { router as adminRouter };