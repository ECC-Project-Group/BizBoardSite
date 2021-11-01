// Load environment variables
require('dotenv').config();

const { app } = require('./app');

// Modify for production
app.listen(process.env.PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
