// zenvy/backend/src/server.js
require('dotenv').config(); // 👈 Load environment variables FIRST

const app = require('./app');
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Node.js API running on port ${PORT}`);
});