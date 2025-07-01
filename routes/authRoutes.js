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

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user/:phoneNumber', authenticate, getUser); // Protected
router.post('/change-pin', authenticate, changePin);     // Protected
router.post('/reset-pin', resetPin); // No auth — rely on OTP client-side

export default router;
