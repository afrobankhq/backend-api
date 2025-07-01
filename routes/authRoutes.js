import express from 'express';
import {
  registerUser,
  loginUser,
  getUser,
  changePin,
  resetPin,
} from '../controllers/authController.js';

import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', (req, res, next) => {
  console.log('Register endpoint called at:', new Date().toISOString(), 'Body:', req.body);
  next();
}, registerUser);

router.post('/login', (req, res, next) => {
  console.log('Login endpoint called at:', new Date().toISOString(), 'Body:', req.body);
  next();
}, loginUser);

router.get('/user/:phoneNumber', (req, res, next) => {
  console.log('Get user endpoint called at:', new Date().toISOString(), 'Phone:', req.params.phoneNumber);
  next();
}, authenticate, getUser); // Protected

router.post('/change-pin', (req, res, next) => {
  console.log('Change pin endpoint called at:', new Date().toISOString(), 'Body:', req.body);
  next();
}, authenticate, changePin);     // Protected

router.post('/reset-pin', (req, res, next) => {
  console.log('Reset pin endpoint called at:', new Date().toISOString(), 'Body:', req.body);
  next();
}, resetPin); // No auth — rely on OTP client-side

export default router;
