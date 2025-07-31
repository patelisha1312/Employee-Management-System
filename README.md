# Employee-Management-System

The **Employee Management System** is a full-stack web application designed to streamline the management of employee data within an organization. This system provides a secure and efficient way to handle employee information, incorporating user authentication and full CRUD (Create, Read, Update, Delete) operations.

## Key Features

- **Secure User Authentication**
  - User registration and login
  - Password encryption using bcrypt
  - JWT-based session management
  - Password reset functionality via email

- **Employee Data Management**
  - Add, update, delete, and view employee records
  - Real-time updates to the employee list
  - Form validation and user feedback

- **Protected Routes**
  - Only authenticated users can access sensitive operations
  - Frontend route protection via token validation

- **Responsive User Interface**
  - Clean and modern UI using React
  - Mobile-friendly design

## Technology Stack

**Frontend:**
- React.js
- Axios
- React Router DOM

**Backend:**
- Node.js
- Express.js
- JWT for authentication
- bcrypt for password hashing
- Nodemailer for password reset emails

**Database:**
- MongoDB (or MySQL)

**Other Tools:**
- dotenv for environment variables
- CORS for API communication
- Postman for API testing

## Project Structure

