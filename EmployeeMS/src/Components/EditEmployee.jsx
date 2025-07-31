import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: '',
    email: '',
    salary: '',
    address: '',
    category_id: ''
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoryRes, employeeRes] = await Promise.all([
          axios.get('http://localhost:3000/auth/category', { withCredentials: true }),
          axios.get(`http://localhost:3000/auth/employee/${id}`)
        ]);

        if (!categoryRes.data.status) throw new Error(categoryRes.data.error || 'Failed to load categories.');
        if (!employeeRes.data.status) throw new Error(employeeRes.data.error || 'Failed to load employee data.');

        setCategories(categoryRes.data.result);

        const emp = employeeRes.data.result;
        setEmployee({
          name: emp.name,
          email: emp.email,
          salary: emp.salary,
          address: emp.address,
          category_id: emp.category_id || ''
        });
      } catch (error) {
        console.error('Loading error:', error);
        setErrorMsg(error.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await axios.put(`http://localhost:3000/auth/employee/${id}`, employee);
      if (res.data.status) {
        navigate('/dashboard/employee');
      } else {
        alert(res.data.error || 'Failed to update employee.');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Server error during update.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center mt-3'>
      <div className='p-3 rounded w-50 border'>
        <h3 className='text-center'>Edit Employee</h3>

        {loading ? (
          <p className="text-center">Loading data...</p>
        ) : errorMsg ? (
          <p className="text-center text-danger">{errorMsg}</p>
        ) : (
          <form className='row g-2' onSubmit={handleSubmit}>
            {[{ label: 'Name', type: 'text', key: 'name' },
              { label: 'Email', type: 'email', key: 'email' },
              { label: 'Salary', type: 'number', key: 'salary' },
              { label: 'Address', type: 'text', key: 'address' }
            ].map(({ label, type, key }) => (
              <div className='col-12' key={key}>
                <label className='form-label'>{label}</label>
                <input
                  type={type}
                  name={key}
                  className='form-control'
                  required
                  value={employee[key]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <div className='col-12 mb-2'>
              <label className='form-label'>Category</label>
              <select
                name="category_id"
                className='form-select'
                required
                value={employee.category_id}
                onChange={handleChange}
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className='col-12'>
              <button
                type="submit"
                className='btn btn-primary w-100'
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Employee'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditEmployee;
