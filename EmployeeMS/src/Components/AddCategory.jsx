import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prevent empty submission
    if (!category.trim()) {
      return alert('Please enter a category name.');
    }

    axios
      .post('http://localhost:3000/auth/add_category', { category })
      .then((result) => {
        if (result.data.Status) {
          navigate('/dashboard/category');
        } else {
          alert(result.data.Error || 'Something went wrong!');
        }
      })
      .catch((err) => {
        console.error(err);
        alert('Server error. Please try again.');
      });
  };

  return (
    <div className="d-flex justify-content-center align-items-center h-75">
      <div className="p-3 rounded w-25 border">
        <h2>Add Category</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="category">
              <strong>Category:</strong>
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={category}
              placeholder="Enter Category"
              onChange={(e) => setCategory(e.target.value)}
              className="form-control rounded-0"
              required
            />
          </div>

          <button className="btn btn-success w-100 rounded-0 mb-2" type="submit">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;  