import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://intern-hub.vercel.app'],
  credentials: true
}));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://internhub_user:213064727@internhub-production.nka6k7e.mongodb.net/?retryWrites=true&w=majority&appName=internhub-production';

mongoose.connect(MONGODB_URI, {
  dbName: 'internhub'
}).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Internship Schema
const internshipSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  requirements: [String],
  salary: String,
  duration: String,
  applicationDeadline: String,
  createdAt: { type: Date, default: Date.now }
});

const Internship = mongoose.model('Internship', internshipSchema);

// Routes
app.get('/api/internships', async (req, res) => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch internships' });
  }
});

app.post('/api/internships', async (req, res) => {
  try {
    const internship = new Internship(req.body);
    await internship.save();
    res.status(201).json(internship);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create internship' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'InternHub API is running' });
});

// For Vercel serverless functions
export default app;