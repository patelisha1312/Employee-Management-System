import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    password: '',
    salary: '',
    address: '',
    category_id: '',
    image: null,
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/category', { withCredentials: true })
      .then((res) => {
        if (res.data.status) {
          setCategories(res.data.result);
        } else {
          setError(res.data.error || 'Failed to load categories.');
        }
      })
      .catch(() => setError('Server error. Please try again later.'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key, value) => {
    setEmployee((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData();
    Object.entries(employee).forEach(([key, value]) => {
      formData.append(key, value);
    });

    axios
      .post('http://localhost:3000/auth/add_employee', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.status) {
          navigate('/dashboard/employee');
        } else {
          alert(res.data.error || 'Failed to add employee.');
        }
      })
      .catch((err) => {
        console.error('Error adding employee:', err);
        alert('Server error occurred.');
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-3">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center">Add Employee</h3>

        {loading ? (
          <p>Loading categories...</p>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <form className="row g-2" onSubmit={handleSubmit}>
            {[{ label: 'Name', type: 'text', key: 'name' },
              { label: 'Email', type: 'email', key: 'email' },
              { label: 'Password', type: 'password', key: 'password' },
              { label: 'Salary', type: 'number', key: 'salary' },
              { label: 'Address', type: 'text', key: 'address' },
            ].map(({ label, type, key }) => (
              <div className="col-12" key={key}>
                <label className="form-label">{label}</label>
                <input
                  type={type}
                  className="form-control"
                  required
                  value={employee[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            ))}

            <div className="col-12">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                required
                value={employee.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Upload Image</label>
              <input
                type="file"
                className="form-control"
                required
                onChange={(e) => handleChange('image', e.target.files[0])}
              />
            </div>

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Add Employee'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddEmployee;
