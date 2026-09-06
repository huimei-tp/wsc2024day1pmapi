const express = require('express');
const multer = require('multer');
const pool = require('../db');
const requireAuth = require('../middleware/auth');

const router = express.Router();
const upload = multer(); // parses multipart/form-data fields, no files needed

// GET /api/diary - [DIARY] GET ALL DIARIES
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT diary_id, diary_title, diary_main_text, diary_upload_datetime,
              diary_image, diary_upload_username
       FROM diaries
       ORDER BY diary_upload_datetime DESC`
    );
    res.json({ msg: 'Success', data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// PUT /api/diary/collection - [FAVORITE] INSERT NEW FAVORITE
// Requires header: auth_token
// Body (form-data): diary_id
router.put('/collection', requireAuth, upload.none(), async (req, res) => {
  const { diary_id } = req.body || {};

  if (!diary_id) {
    return res.status(400).json({ msg: 'diary_id is required' });
  }

  try {
    const [diaryRows] = await pool.query(
      'SELECT diary_id FROM diaries WHERE diary_id = ?',
      [diary_id]
    );
    if (diaryRows.length === 0) {
      return res.status(404).json({ msg: 'Diary not found' });
    }

    // Re-favoriting bumps the timestamp so it resurfaces at the top of the list.
    await pool.query(
      `INSERT INTO favorites (user_id, diary_id, favorite_datetime)
       VALUES (?, ?, NOW())
       ON DUPLICATE KEY UPDATE favorite_datetime = NOW()`,
      [req.userId, diary_id]
    );

    const [rows] = await pool.query(
      'SELECT favorite_datetime FROM favorites WHERE user_id = ? AND diary_id = ?',
      [req.userId, diary_id]
    );

    res.json({
      msg: 'Success',
      data: {
        diary_id,
        favorite_datetime: rows[0].favorite_datetime
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

// GET /api/diary/collection - [FAVORITE] GET MY ALL FAVORITES
// Requires header: auth_token
router.get('/collection', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT diary_id, favorite_datetime
       FROM favorites
       WHERE user_id = ?
       ORDER BY favorite_datetime DESC`,
      [req.userId]
    );
    res.json({ msg: 'Success', data: rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Internal server error' });
  }
});

module.exports = router;
