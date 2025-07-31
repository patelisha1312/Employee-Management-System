import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Employee from './Components/Employee';
import Category from './Components/Category';
import Profile from './Components/Profile';
import AddCategory from './Components/AddCategory';
import AddEmployee from './Components/AddEmployee';
import EditEmployee from './Components/EditEmployee';

function App() {
  const isLoggedIn = document.cookie.includes('token'); // very basic auth check

  return (
    <BrowserRouter>
      <Routes>
        {/* Login Route */}
        <Route path="/adminlogin" element={<Login />} />

        {/* Dashboard Protected Routes */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/adminlogin" />}
        >
          <Route index element={<Home />} />
          <Route path="employee" element={<Employee />} />
          <Route path="category" element={<Category />} />
          <Route path="profile" element={<Profile />} />
          <Route path="add_category" element={<AddCategory />} />
          <Route path="add_employee" element={<AddEmployee />} />
          <Route path="edit_employee/:id" element={<EditEmployee />} />
        </Route>

        {/* Redirect any unknown route to login */}
        <Route path="*" element={<Navigate to="/adminlogin" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
