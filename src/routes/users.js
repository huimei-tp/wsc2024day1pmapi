const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const pool = require('../db');

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// "at least 6 characters including English letters and numbers"
const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z0-9]{6,}$/;

// POST /api/users/signin
// Doubles as sign-up: if the email isn't registered yet, an account is
// created on the fly (matches "[USER] SIGN IN OR SIGN UP" in the spec).
router.post('/signin', async (req, res) => {
  const { userEmailAddress, userPassword } = req.body || {};

  if (!userEmailAddress || !EMAIL_RE.test(userEmailAddress)) {
    return res.status(400).json({ msg: 'Invalid Email' });
  }
  if (!userPassword || !PASSWORD_RE.test(userPassword)) {
    return res.status(400).json({ msg: 'Invalid Password' });
  }

  try {
    const [existing] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [userEmailAddress]
    );

    let userId;

    if (existing.length === 0) {
      // New email -> sign up
      userId = crypto.randomUUID();
      const passwordHash = await bcrypt.hash(userPassword, 10);
      await pool.query(
        'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
        [userId, userEmailAddress, passwordHash]
      );
    } else {
      // Existing email -> sign in, verify password
      const user = existing[0];
      const matches = await bcrypt.compare(userPassword, user.password_hash);
      if (!matches) {
        return res.status(401).json({ msg: 'Incorrect email or password' });
      }
      userId = user.id;
    }

    const token = crypto.randomBytes(24).toString('hex');
    await pool.query(
      'INSERT INTO auth_tokens (token, user_id) VALUES (?, ?)',
      [token, userId]
    );

    return res.json({
      msg: 'Sign in successful',
      data: { auth_token: token }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
