// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize the app
const app = express();
const PORT = 4000;

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
const MONGO_URI = 'mongodb+srv://djain5889:Asnaeb%405511@trial.6giiu.mongodb.net/mydatabase?retryWrites=true&w=majority';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define the schema and model
const entrySchema = new mongoose.Schema({
  images: [String], // Array of image URLs or paths
  longText: { type: String, required: true },
  shortTitle: { type: String, required: true },
  date: { type: Date, required: true }
});

const Entry = mongoose.model('Entry', entrySchema);

// API endpoint to push data
app.post('/api/entries', async (req, res) => {
  try {
    const { images, longText, shortTitle, date } = req.body;

    // Validate input
    if (!images || images.length !== 3) {
      return res.status(400).json({ message: 'Exactly 3 images are required.' });
    }

    const entry = new Entry({
      images,
      longText,
      shortTitle,
      date: new Date(date) // Ensure the date is in Date format
    });

    await entry.save();
    res.status(201).json({ message: 'Entry saved successfully!', entry });
  } catch (error) {
    console.error('Error saving entry:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// API endpoint to fetch all entries
app.get('/api/entries', async (req, res) => {
  try {
    const entries = await Entry.find().sort({ date: -1 }); // Sort by date, newest first
    res.status(200).json(entries);
  } catch (error) {
    console.error('Error fetching entries:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
