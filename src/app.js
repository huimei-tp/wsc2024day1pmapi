const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users');
const diaryRouter = require('./routes/diary');
const resourcesRouter = require('./routes/resources');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ msg: 'WSC2024 TP08 Module A (P.M.) - My France backend is running' });
});

app.use('/api/users', usersRouter);   // POST /api/users/signin
app.use('/api/diary', diaryRouter);   // GET /api/diary, PUT+GET /api/diary/collection
app.use('/api', resourcesRouter);     // GET /api/user-agreement, GET /api/{path}

app.use((req, res) => {
  res.status(404).json({ msg: 'Not found' });
});

module.exports = app;
