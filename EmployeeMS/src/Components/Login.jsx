import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // make sure this file exists

export default function Login() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agree, setAgree] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    if (!values.email || !values.password) {
      setError('All fields are required');
      return;
    }
    if (!agree) {
      setError('You must agree with terms & conditions');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:3000/auth/adminlogin', values);
      if (res.data.loginStatus) navigate('/dashboard');
      else setError(res.data.error);
    } catch {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        {error && <div className="error-text">{error}</div>}
        <h2 className="text-center">Login Page</h2>
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            placeholder="admin@gmail.com"
            value={values.email}
            onChange={e => setValues({ ...values, email: e.target.value })}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            placeholder="******"
            value={values.password}
            onChange={e => setValues({ ...values, password: e.target.value })}
            required
          />

          <div className="checkbox-wrapper">
            <input
              type="checkbox"
              checked={agree}
              onChange={e => setAgree(e.target.checked)}
            />
            <span>You agree with <strong>terms & conditions</strong></span>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
