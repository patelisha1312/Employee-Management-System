import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .get('http://localhost:3000/auth/logout', { withCredentials: true })
      .then((res) => {
        if (res.data.status) {
            navigate('/adminlogin');
        } else {
            alert('Logout failed. Try again.');
        }

      })
      .catch((err) => {
        console.error('Logout error:', err);
        alert('Server error during logout.');
      });
  };

  return (
    <>
      <style>{`
        .nav-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
          transition: background-color 0.3s ease;
        }
        .sidebar-icon {
          font-size: 1.3rem;
        }
      `}</style>

      <div className="container-fluid">
        <div className="row flex-nowrap">
          {/* Sidebar */}
          <div
            className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark"
            style={{ minHeight: '100vh' }}
          >
            <div className="d-flex flex-column align-items-center align-items-sm-start px-4 pt-3 text-white">
              <Link
                to="/dashboard"
                className="d-flex align-items-center pb-4 mb-3 mt-md-2 text-white text-decoration-none"
              >
                <span className="fs-4 fw-bold d-none d-sm-inline">Isha Patel</span>
              </Link>

              <ul className="nav nav-pills flex-column mb-sm-auto mb-0 w-100">
                {[
                  {
                    to: '/dashboard',
                    label: 'Dashboard',
                    icon: 'bi-speedometer2',
                  },
                  {
                    to: '/dashboard/employee',
                    label: 'Manage Employees',
                    icon: 'bi-people-fill',
                  },
                  {
                    to: '/dashboard/category',
                    label: 'Category',
                    icon: 'bi-grid-fill',
                  },
                  {
                    to: '/dashboard/profile',
                    label: 'Profile',
                    icon: 'bi-person',
                  },
                ].map(({ to, label, icon }, index) => (
                  <li className="mb-3" key={index}>
                    <Link
                      to={to}
                      className="nav-link text-white d-flex align-items-center"
                      style={{ padding: '12px 18px', borderRadius: '8px' }}
                    >
                      <i className={`bi ${icon} me-2 sidebar-icon`}></i>
                      <span className="d-none d-sm-inline">{label}</span>
                    </Link>
                  </li>
                ))}

                <li className="mb-3">
                  <button
                    onClick={handleLogout}
                    className="nav-link text-white d-flex align-items-center btn btn-link p-0"
                    style={{ padding: '12px 18px', borderRadius: '8px' }}
                  >
                    <i className="bi bi-power me-2 sidebar-icon"></i>
                    <span className="d-none d-sm-inline">Logout</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Main content area */}
          <div className="col p-0 m-0">
            <div className="p-2 d-flex justify-content-center shadow">
              <h4 className="m-0">Employee Management System</h4>
            </div>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
