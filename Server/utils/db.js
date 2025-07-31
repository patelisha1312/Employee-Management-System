import mysql from 'mysql';
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'employeems'
});
con.connect(err => {
  if (err) console.error('DB connect error:', err);
  else console.log('DB connected');
});
export default con;
