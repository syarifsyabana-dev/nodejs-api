const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const routes = require('./routes');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const dbConnect = process.env.DB_URI + process.env.DB_NAME;

async function startServer() {
  try {
    await mongoose.connect(dbConnect, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    app.use(cors());
    app.use(express.json());

    // Routes
    app.use('/api', routes);

    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: 'Internal server error' });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

startServer();
