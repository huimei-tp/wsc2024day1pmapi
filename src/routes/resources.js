const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Project root (one level up from src/) -- resource paths in diary records
// already include the "resources/" prefix, e.g. "resources/Efil/2.jpg",
// so we resolve relative paths against the project root, not the folder itself.
const PROJECT_ROOT = path.join(__dirname, '..', '..');
const RESOURCES_DIR = path.join(PROJECT_ROOT, 'resources');

// GET /api/user-agreement - [RESOURCES] VISIT USER AGREEMENT (WEBSITE)
router.get('/user-agreement', (req, res) => {
  res.sendFile(path.join(PROJECT_ROOT, 'public', 'user-agreement.html'));
});

// GET /api/{path} - [RESOURCES] GET RESOURCE FILE
// e.g. GET /api/resources/Musee%20d%20Orsay/d1.json
router.get('/*', (req, res) => {
  const relativePath = decodeURIComponent(req.params[0] || '');
  const resolvedPath = path.normalize(path.join(PROJECT_ROOT, relativePath));

  // Prevent path traversal outside the resources folder
  if (!resolvedPath.startsWith(RESOURCES_DIR + path.sep)) {
    return res.status(400).json({ msg: 'Invalid path' });
  }

  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isFile()) {
    return res.status(404).json({ msg: 'Resource not found' });
  }

  if (resolvedPath.toLowerCase().endsWith('.json')) {
    res.type('application/json');
  }
  res.sendFile(resolvedPath);
});

module.exports = router;
