import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function Category() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3000/auth/category')
      .then(res => res.data.status ? setCats(res.data.result) : setError(res.data.error))
      .catch(() => setError('Failed loading'));
    setLoading(false);
  }, []);

  return (
    <div className="p-3">
      <h3>Category List</h3>
      <Link to="/dashboard/add_category" className="btn btn-success mb-2">Add Category</Link>
      {loading ? <p>Loading...</p>
       : error ? <p className="text-danger">{error}</p>
       : cats.length === 0 ? <p>No categories.</p>
       : <table className="table"><thead><tr><th>Name</th></tr></thead><tbody>{cats.map((c,i)=><tr key={i}><td>{c.name}</td></tr>)}</tbody></table>}
    </div>
  );
}
