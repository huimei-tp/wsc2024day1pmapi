const pool = require('../db');

// Verifies the `auth_token` request header (as documented in the Web API
// spec, section [FAVORITE]) and attaches req.userId / req.userEmail.
async function requireAuth(req, res, next) {
  const token = req.headers['auth_token'];

  if (!token) {
    return res.status(401).json({ msg: 'Missing auth_token header' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT auth_tokens.user_id, users.email
       FROM auth_tokens
       JOIN users ON users.id = auth_tokens.user_id
       WHERE auth_tokens.token = ?`,
      [token]
    );

    if (rows.length === 0) {
      return res.status(401).json({ msg: 'Invalid or expired auth_token' });
    }

    req.userId = rows[0].user_id;
    req.userEmail = rows[0].email;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
}

module.exports = requireAuth;
