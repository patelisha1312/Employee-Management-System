import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home() {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [aCount, eCount, sSum, aList] = await Promise.all([
          axios.get('http://localhost:3000/auth/admin_count'),
          axios.get('http://localhost:3000/auth/employee_count'),
          axios.get('http://localhost:3000/auth/salary_sum'),
          axios.get('http://localhost:3000/auth/admin_records')
        ]);
        setAdminTotal(aCount.data.result[0].admin);
        setEmployeeTotal(eCount.data.result[0].employee);
        setSalaryTotal(sSum.data.result[0].total_salary);
        setAdmins(aList.data.result);
      } catch (e) {
        console.error(e);
        setError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center text-danger mt-5">{error}</p>;

  return (
    <div className="container mt-4">
      {/* cards */}
      <div className="d-flex justify-content-around mb-4">
        <div className="card w-25 text-center"><h5>Admins</h5><h3>{adminTotal}</h3></div>
        <div className="card w-25 text-center"><h5>Employees</h5><h3>{employeeTotal}</h3></div>
        <div className="card w-25 text-center"><h5>Salary ₹</h5><h3>{salaryTotal}</h3></div>
      </div>
      <h4>Admin Accounts</h4>
      {admins.length === 0
        ? <p>No admin found.</p>
        : <table className="table table-bordered"><thead><tr><th>Email</th></tr></thead><tbody>{admins.map((a,i)=><tr key={i}><td>{a.email}</td></tr>)}</tbody></table>}
    </div>
  );
}
