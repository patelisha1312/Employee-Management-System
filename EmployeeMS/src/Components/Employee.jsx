import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('http://localhost:3000/auth/employees')
      .then((res) => {
        if (res.data.status) {
          setEmployees(res.data.result);
        } else {
          setError(res.data.error || 'Failed to fetch employees.');
        }
      })
      .catch(() => {
        setError('Server error while fetching employees.');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;

    axios
      .delete(`http://localhost:3000/auth/delete_employee/${id}`)
      .then((res) => {
        if (res.data.status) {
          setEmployees((prev) => prev.filter((emp) => emp.id !== id));
        } else {
          alert(res.data.error || 'Failed to delete employee.');
        }
      })
      .catch(() => {
        alert('Server error while deleting employee.');
      });
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center mb-3">
        <h3>Employee List</h3>
      </div>

      <div className="d-flex justify-content-end mb-3">
        <Link to="/dashboard/add_employee" className="btn btn-success">
          Add Employee
        </Link>
      </div>

      {loading ? (
        <p className="text-center">Loading employees...</p>
      ) : error ? (
        <p className="text-center text-danger">{error}</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>
                    <img
                      src={
                        emp.image
                          ? `http://localhost:3000/Images/${emp.image}`
                          : 'https://via.placeholder.com/50'
                      }
                      alt={emp.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        objectFit: 'cover',
                        borderRadius: '50%',
                      }}
                    />
                  </td>
                  <td>{emp.email}</td>
                  <td>{emp.address}</td>
                  <td>{emp.salary}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <Link
                        to={`/dashboard/edit_employee/${emp.id}`}
                        className="btn btn-warning btn-sm"
                      >
                        Edit
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(emp.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Employee;
