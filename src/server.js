require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`WSC2024 TP08 Mobile backend running at http://localhost:${PORT}`);
  console.log(`BASE_URL = localhost, SERVICE_PORT = ${PORT} (use these in the app's Web API base config)`);
});
