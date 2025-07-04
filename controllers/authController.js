import { auth, db } from '../firebase.js';
import blockradar from '../services/blockradar.js';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';

/**
 * Register user with phone OTP and setup PIN
 */
export const registerUser = async (req, res) => {
  const { pin } = req.body;
  const phoneNumber = req.phoneNumber; // Set by verifyFirebaseToken middleware

  if (!phoneNumber || !pin) {
    return res.status(400).json({ error: 'Phone number and PIN are required' });
  }

  try {
    const userRef = db.collection('users').doc(phoneNumber);
    const userSnapshot = await userRef.get();

    if (userSnapshot.exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPin = await bcrypt.hash(pin, 10);

    // You can also generate a wallet address here using Blockradar
    const userData = {
      phoneNumber,
      pin: hashedPin,
      createdAt: new Date(),
    };

    await userRef.set(userData);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

  

/**
 * Login user with phoneNumber and PIN
 */


export const loginUser = async (req, res) => {
  const { phoneNumber, pin } = req.body;

  if (!phoneNumber || !pin) {
    return res.status(400).json({ error: 'Phone number and PIN are required' });
  }

  try {
    const userRef = db.collection('users').doc(phoneNumber);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userSnapshot.data();

    const isMatch = await bcrypt.compare(pin, user.pin);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }

    const token = generateToken({ phoneNumber: user.phoneNumber });

    res.json({
      message: 'Login successful',
      token,
      user: {
        phoneNumber: user.phoneNumber,
        blockchain: user.blockchain,
        walletAddress: user.walletAddress,
        walletId: user.walletId,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Login failed' });
  }
};

  

/**
 * Get User Info
 */
export const getUser = async (req, res) => {
  const { phoneNumber } = req.params;

  try {
    const userSnapshot = await db.collection('users').doc(phoneNumber).get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userSnapshot.data();
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};


/**
 * Change PIN
 */


export const changePin = async (req, res) => {
  const { phoneNumber, currentPin, newPin } = req.body;

  if (!phoneNumber || !currentPin || !newPin) {
    return res.status(400).json({ error: 'Phone number, current PIN, and new PIN are required' });
  }

  try {
    const userRef = db.collection('users').doc(phoneNumber);
    const userSnapshot = await userRef.get();

    if (!userSnapshot.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userSnapshot.data();

    const isMatch = await bcrypt.compare(currentPin, user.pin);

    if (!isMatch) {
      return res.status(401).json({ error: 'Current PIN is incorrect' });
    }

    const saltRounds = 10;
    const hashedNewPin = await bcrypt.hash(newPin, saltRounds);

    await userRef.update({ pin: hashedNewPin });

    res.json({ message: 'PIN changed successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Failed to change PIN' });
  }
};

/**
 * Reset PIN
 */

export const resetPin = async (req, res) => {
    const { phoneNumber, newPin } = req.body;
  
    if (!phoneNumber || !newPin) {
      return res.status(400).json({ error: 'Phone number and new PIN are required' });
    }
  
    try {
      const userRef = db.collection('users').doc(phoneNumber);
      const userSnapshot = await userRef.get();
  
      if (!userSnapshot.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const saltRounds = 10;
      const hashedNewPin = await bcrypt.hash(newPin, saltRounds);
  
      await userRef.update({ pin: hashedNewPin });
  
      res.json({ message: 'PIN reset successfully' });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ error: 'Failed to reset PIN' });
    }
  };
  
