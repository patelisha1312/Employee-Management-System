import express from 'express';
import cors from 'cors';
import { adminRouter } from './Routes/AdminRoute.js';
import bodyParser from 'body-parser';
import path from 'path';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static images from /uploads as /Images
app.use('/Images', express.static('uploads'));

// Routes
app.use('/auth', adminRouter);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
