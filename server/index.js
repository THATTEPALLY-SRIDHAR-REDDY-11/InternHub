import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'internhub';

app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://localhost:8082',
    'http://localhost:8083'
  ],
  credentials: true
}));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed'));
  }
});

let dbConnected = false;

// Simple in-memory fallback data when DB is not connected
const memoryProjects = [
  {
    _id: 'demo-1',
    title: 'Sample Project',
    description: 'This is a sample project served from memory. Add MongoDB URI to use Atlas.',
    image_url: null,
    status: 'active',
    apply_url: 'https://example.com/apply/sample-project',
    skills: ['React', 'TypeScript'],
    owner_name: 'Demo User',
    created_at: new Date().toISOString()
  }
];

// In-memory applications store
const memoryApplications = [];

// Temporary file storage for when MongoDB is unavailable
const dataDir = path.join(__dirname, 'temp-data');
let memoryProfiles = [];
let memoryResumes = [];
let memoryPostedInternships = [];

const initFileStorage = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // Load existing data
  try {
    if (fs.existsSync(path.join(dataDir, 'profiles.json'))) {
      memoryProfiles = JSON.parse(fs.readFileSync(path.join(dataDir, 'profiles.json'), 'utf8'));
    }
    if (fs.existsSync(path.join(dataDir, 'resumes.json'))) {
      memoryResumes = JSON.parse(fs.readFileSync(path.join(dataDir, 'resumes.json'), 'utf8'));
    }
    if (fs.existsSync(path.join(dataDir, 'posted-internships.json'))) {
      memoryPostedInternships = JSON.parse(fs.readFileSync(path.join(dataDir, 'posted-internships.json'), 'utf8'));
      // Add posted internships to the main internships array
      memoryInternships.push(...memoryPostedInternships);
    }
    console.log('[InternHub] 📁 Temporary file storage initialized');
  } catch (error) {
    console.error('[InternHub] Error loading temporary data:', error.message);
  }
};

const saveToFile = (filename, data) => {
  try {
    fs.writeFileSync(path.join(dataDir, filename), JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`[InternHub] Error saving ${filename}:`, error.message);
  }
};



const memoryInternships = [
  {
    _id: 'demo-1',
    title: 'Frontend Intern',
    company_name: 'Example Co',
    description: 'Sample internship served from memory. Add MongoDB URI to use Atlas.',
    status: 'active',
    location: 'Remote',
    remote: true,
    duration: '3 months',
    stipend: '₹10,000/month',
    skills: ['React', 'CSS'],
    apply_url: 'https://example.com/apply/frontend-intern',
    created_at: new Date().toISOString()
  }
];

// Mongoose models
let Project;
let Internship;

const initDb = async () => {
  if (!MONGODB_URI || MONGODB_URI.includes('<username>') || MONGODB_URI.includes('<password>')) {
    console.error('[InternHub] ❌ MONGODB_URI not configured properly.');
    console.error('[InternHub] Please update your .env file with a valid MongoDB Atlas connection string.');
    console.error('[InternHub] Example: mongodb+srv://username:password@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority');
    return;
  }
  try {
    console.log('[InternHub] 🔄 Connecting to MongoDB Atlas...');
    console.log('[InternHub] Connection string:', MONGODB_URI.replace(/:[^:@]*@/, ':****@'));
    
    // MongoDB Atlas connection options
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 20000,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    
    dbConnected = true;
    console.log('[InternHub] ✅ Successfully connected to MongoDB Atlas!');
    console.log('[InternHub] Database:', mongoose.connection.db.databaseName);
    console.log('[InternHub] Environment:', process.env.NODE_ENV || 'development');

    const projectSchema = new mongoose.Schema({
      title: { type: String, required: true },
      description: { type: String, required: true },
      image_url: { type: String },
      status: { type: String, default: 'active' },
      apply_url: { type: String },
      skills: { type: [String], default: [] },
      owner_name: { type: String },
      created_at: { type: Date, default: Date.now }
    }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

    const internshipSchema = new mongoose.Schema({
      title: { type: String, required: true },
      company_name: { type: String, required: true },
      description: { type: String, required: true },
      status: { type: String, default: 'active' },
      location: { type: String },
      remote: { type: Boolean, default: false },
      duration: { type: String },
      stipend: { type: String },
      skills: { type: [String], default: [] },
      apply_url: { type: String },
      source: { type: String },
      source_id: { type: String },
      created_at: { type: Date, default: Date.now }
    }, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

    // Unique index on source/source_id for deduplication when aggregating
    internshipSchema.index({ source: 1, source_id: 1 }, { unique: true, sparse: true });

    Project = mongoose.models.Project || mongoose.model('Project', projectSchema);
    Internship = mongoose.models.Internship || mongoose.model('Internship', internshipSchema);

    console.log(`[InternHub] Connected to MongoDB Atlas (db: ${MONGODB_DB_NAME})`);
  } catch (err) {
    dbConnected = false;
    console.error('[InternHub] ❌ MongoDB connection failed:', err.message);
    console.error('[InternHub] 🔄 Falling back to temporary file storage...');
    console.error('[InternHub] ⚠️  Data will be stored locally until MongoDB is connected.');
    console.error('[InternHub] 💡 Recommendation: Create a new MongoDB Atlas cluster.');
    
    // Initialize temporary file storage
    initFileStorage();
  }
};

// Add Profile schema & routes
const profileSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // will store auth provider id
  email: { type: String },
  full_name: { type: String },
  avatar_url: { type: String },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema);

// Review schema
const reviewSchema = new mongoose.Schema({
  target_type: { type: String, enum: ['internship', 'project'], required: true },
  target_id: { type: String, required: true },
  user_id: { type: String, required: true },
  user_name: { type: String, default: 'Anonymous' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

// Resume schema
const resumeSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  personal_info: {
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    summary: { type: String }
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    start_date: String,
    end_date: String,
    grade: String
  }],
  experience: [{
    company: String,
    position: String,
    location: String,
    start_date: String,
    end_date: String,
    description: String,
    current: Boolean
  }],
  projects: [{
    title: String,
    description: String,
    technologies: [String],
    url: String,
    start_date: String,
    end_date: String
  }],
  skills: [String],
  certifications: [{
    name: String,
    issuer: String,
    date: String,
    url: String
  }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

const Resume = mongoose.models.Resume || mongoose.model('Resume', resumeSchema);

// Upsert profile
app.post('/profiles', async (req, res) => {
  try {
    const { id, email, full_name, avatar_url, metadata } = req.body;
    if (!id) return res.status(400).json({ error: 'id is required' });
    
    if (dbConnected && Profile) {
      const profile = await Profile.findOneAndUpdate(
        { id },
        { $set: { email, full_name, avatar_url, metadata } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json(profile);
    }
    
    // Temporary file storage fallback
    const existingIndex = memoryProfiles.findIndex(p => p.id === id);
    const profileData = {
      id,
      email,
      full_name,
      avatar_url,
      metadata,
      created_at: existingIndex >= 0 ? memoryProfiles[existingIndex].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      memoryProfiles[existingIndex] = profileData;
    } else {
      memoryProfiles.push(profileData);
    }
    
    saveToFile('profiles.json', memoryProfiles);
    res.json(profileData);
  } catch (err) {
    console.error('Profile save error', err);
    res.status(500).json({ error: 'internal' });
  }
});

// Get profile
app.get('/profiles/:id', async (req, res) => {
  try {
    if (dbConnected && Profile) {
      const profile = await Profile.findOne({ id: req.params.id });
      if (!profile) return res.status(404).json({ error: 'not found' });
      return res.json(profile);
    }
    
    // Temporary file storage fallback
    const profile = memoryProfiles.find(p => p.id === req.params.id);
    if (!profile) return res.status(404).json({ error: 'not found' });
    res.json(profile);
  } catch (err) {
    console.error('Profile fetch error', err);
    res.status(500).json({ error: 'internal' });
  }
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to InternHub API', version: '1.0.0' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', db: dbConnected ? 'connected' : 'not_connected' });
});

// Projects endpoints
app.get('/projects', async (req, res) => {
  try {
    if (dbConnected && Project) {
      const projects = await Project.find().sort({ created_at: -1 });
      return res.json(projects);
    }
    return res.json(memoryProjects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects', details: err.message });
  }
});

// Create project
app.post('/projects', async (req, res) => {
  try {
    const { title, description, image_url, status = 'active', apply_url, skills = [], owner_name, github_url, demo_url } = req.body || {};
    if (!title || !description) {
      return res.status(400).json({ error: 'title and description are required' });
    }

    if (dbConnected && Project) {
      const project = await Project.create({ title, description, image_url, status, apply_url, skills, owner_name, github_url, demo_url });
      return res.status(201).json(project);
    }

    const newProject = {
      _id: `mem-${Date.now()}`,
      title,
      description,
      image_url: image_url || null,
      status,
      apply_url: apply_url || null,
      skills: Array.isArray(skills) ? skills : String(skills || '').split(',').map(s => s.trim()).filter(Boolean),
      owner_name: owner_name || 'Anonymous',
      github_url: github_url || null,
      demo_url: demo_url || null,
      created_at: new Date().toISOString(),
    };
    memoryProjects.unshift(newProject);
    return res.status(201).json(newProject);
  } catch (err) {
    console.error('Create project error', err);
    res.status(500).json({ error: 'Failed to create project', details: err.message });
  }
});

// Apply to join project (collaboration request)
app.post('/projects/:id/applications', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, applicant_name, applicant_email } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });

    // Verify project exists
    let project;
    if (dbConnected && Project) {
      project = await Project.findById(id);
    } else {
      project = memoryProjects.find(p => String(p._id) === String(id));
    }
    if (!project) return res.status(404).json({ error: 'project not found' });

    const record = {
      _id: `app-${Date.now()}`,
      project_id: dbConnected ? project._id : project._id,
      message,
      applicant_name: applicant_name || 'Anonymous',
      applicant_email: applicant_email || null,
      status: 'pending',
      created_at: new Date().toISOString(),
    };

    // For simplicity, store in-memory when DB not connected. If DB connected, you may later persist in a collection.
    memoryApplications.unshift(record);
    return res.status(201).json(record);
  } catch (err) {
    console.error('Apply to project error', err);
    res.status(500).json({ error: 'Failed to apply', details: err.message });
  }
});

// Recommend projects based on skills overlap
app.get('/projects/recommend', async (req, res) => {
  try {
    const skillsParam = req.query.skills;
    const skills = Array.isArray(skillsParam)
      ? skillsParam
      : String(skillsParam || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

    // Load projects
    let projects = [];
    if (dbConnected && Project) {
      projects = await Project.find().sort({ created_at: -1 });
    } else {
      projects = memoryProjects;
    }

    if (skills.length === 0) return res.json(projects);

    // Score by overlap count
    const scored = projects.map(p => {
      const overlap = (p.skills || []).filter(s => skills.includes(s)).length;
      return { score: overlap, project: p };
    });
    scored.sort((a, b) => b.score - a.score);
    res.json(scored.map(s => s.project));
  } catch (err) {
    res.status(500).json({ error: 'Failed to recommend projects', details: err.message });
  }
});

// Internships endpoints
app.get('/internships', async (req, res) => {
  try {
    // Query params: skills (comma), remote (true/false), location (string), q (search), page, limit
    const skillsParam = req.query.skills;
    const skills = Array.isArray(skillsParam)
      ? skillsParam
      : String(skillsParam || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
    const remoteParam = String(req.query.remote || '').toLowerCase();
    const remote = remoteParam === 'true' ? true : remoteParam === 'false' ? false : undefined;
    const location = req.query.location ? String(req.query.location) : undefined;
    const q = req.query.q ? String(req.query.q) : undefined;
    const page = Math.max(1, parseInt(String(req.query.page || '1'), 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(String(req.query.limit || '20'), 10) || 20));

    if (dbConnected && Internship) {
      const query = {};
      if (skills && skills.length > 0) {
        query.skills = { $in: skills };
      }
      if (typeof remote === 'boolean') {
        query.remote = remote;
      }
      if (location) {
        query.location = { $regex: new RegExp(location, 'i') };
      }
      // Perform base query
      let cursor = Internship.find(query).sort({ created_at: -1 });
      // Apply pagination
      cursor = cursor.skip((page - 1) * limit).limit(limit);
      let results = await cursor.exec();
      // Fallback text filter client-side if q provided
      if (q) {
        const qLower = q.toLowerCase();
        results = results.filter(r =>
          (r.title || '').toLowerCase().includes(qLower) ||
          (r.company_name || '').toLowerCase().includes(qLower) ||
          (r.description || '').toLowerCase().includes(qLower)
        );
      }
      return res.json(results);
    }

    // In-memory filtering
    let list = [...memoryInternships];
    if (skills && skills.length > 0) {
      list = list.filter(i => (i.skills || []).some(s => skills.includes(s)));
    }
    if (typeof remote === 'boolean') {
      list = list.filter(i => Boolean(i.remote) === remote);
    }
    if (location) {
      const re = new RegExp(location, 'i');
      list = list.filter(i => re.test(String(i.location || '')));
    }
    if (q) {
      const qLower = q.toLowerCase();
      list = list.filter(i =>
        (i.title || '').toLowerCase().includes(qLower) ||
        (i.company_name || '').toLowerCase().includes(qLower) ||
        (i.description || '').toLowerCase().includes(qLower)
      );
    }
    const start = (page - 1) * limit;
    const end = start + limit;
    return res.json(list.slice(start, end));
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch internships', details: err.message });
  }
});

// Create new internship
app.post('/internships', async (req, res) => {
  try {
    const { 
      title, 
      company_name, 
      description, 
      location, 
      remote, 
      duration, 
      stipend, 
      skills, 
      apply_url, 
      poster_id, 
      poster_name 
    } = req.body;

    if (!title || !company_name || !description) {
      return res.status(400).json({ error: 'Title, company name, and description are required' });
    }

    const internshipData = {
      title,
      company_name,
      description,
      location: location || '',
      remote: Boolean(remote),
      duration: duration || '',
      stipend: stipend || '',
      skills: Array.isArray(skills) ? skills : [],
      apply_url: apply_url || '',
      poster_id: poster_id || '',
      poster_name: poster_name || 'Anonymous',
      status: 'active',
      created_at: new Date().toISOString()
    };

    if (dbConnected && Internship) {
      const newInternship = new Internship(internshipData);
      const savedInternship = await newInternship.save();
      return res.status(201).json(savedInternship);
    }

    // Temporary file storage fallback
    const newInternship = {
      _id: `internship-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      ...internshipData
    };
    
    memoryInternships.unshift(newInternship);
    memoryPostedInternships.unshift(newInternship);
    
    // Save to file
    saveToFile('posted-internships.json', memoryPostedInternships);
    
    res.status(201).json(newInternship);
  } catch (error) {
    console.error('Create internship error:', error);
    res.status(500).json({ error: 'Failed to create internship', details: error.message });
  }
});

// Sync internships from external sources (stubbed aggregator)
app.post('/internships/sync', async (req, res) => {
  try {
    // Stubbed external data. Replace with real connectors (AICTE, Internshala, LinkedIn)
    const externalItems = [
      {
        title: 'AICTE Software Intern',
        company_name: 'AICTE Partner Org',
        description: 'Work on educational software projects. Basic JS required.',
        status: 'active',
        location: 'Bengaluru',
        remote: false,
        duration: '6 months',
        stipend: '₹12,000/month',
        skills: ['JavaScript', 'Node.js'],
        apply_url: 'https://aicte.example/apply/soft-intern',
        source: 'aicte',
        source_id: 'aicte-001',
        created_at: new Date(),
      },
      {
        title: 'Internshala React Intern',
        company_name: 'Startup Labs',
        description: 'Build UI components and polish UX.',
        status: 'active',
        location: 'Remote',
        remote: true,
        duration: '3 months',
        stipend: '₹8,000/month',
        skills: ['React', 'CSS'],
        apply_url: 'https://internshala.example/apply/react-intern',
        source: 'internshala',
        source_id: 'internshala-123',
        created_at: new Date(),
      },
    ];

    let upserted = 0;
    if (dbConnected && Internship) {
      for (const item of externalItems) {
        await Internship.findOneAndUpdate(
          { source: item.source, source_id: item.source_id },
          { $set: item },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        upserted += 1;
      }
    } else {
      // Merge into in-memory list with simple dedupe by apply_url or title,
      // and ensure unique IDs to avoid React key collisions
      externalItems.forEach((item, idx) => {
        const exists = memoryInternships.find(i => i.apply_url === item.apply_url || (i.title === item.title && i.company_name === item.company_name));
        const uniqueId = `mem-${Date.now()}-${Math.random().toString(36).slice(2,8)}-${idx}`;
        const toPush = {
          _id: exists?._id || uniqueId,
          ...item,
          created_at: new Date().toISOString(),
        };
        if (!exists) {
          memoryInternships.unshift(toPush);
          upserted += 1;
        }
      });
    }
    res.json({ status: 'ok', upserted });
  } catch (err) {
    console.error('Internships sync error', err);
    res.status(500).json({ error: 'Failed to sync internships', details: err.message });
  }
});

// Recommend internships based on skills overlap
app.get('/internships/recommend', async (req, res) => {
  try {
    const skillsParam = req.query.skills;
    const skills = Array.isArray(skillsParam)
      ? skillsParam
      : String(skillsParam || '')
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);

    // Load internships
    let internships = [];
    if (dbConnected && Internship) {
      internships = await Internship.find().sort({ created_at: -1 });
    } else {
      internships = memoryInternships;
    }

    if (skills.length === 0) return res.json(internships);

    const scored = internships.map(i => {
      const overlap = (i.skills || []).filter(s => skills.includes(s)).length;
      return { score: overlap, internship: i };
    });
    scored.sort((a, b) => b.score - a.score);
    res.json(scored.map(s => s.internship));
  } catch (err) {
    res.status(500).json({ error: 'Failed to recommend internships', details: err.message });
  }
});

// ==================== FILE UPLOAD ENDPOINTS ====================

// Upload file endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({
      message: 'File uploaded successfully',
      filename: req.file.filename,
      url: fileUrl,
      originalName: req.file.originalname,
      size: req.file.size
    });
  } catch (err) {
    console.error('File upload error', err);
    res.status(500).json({ error: 'Failed to upload file', details: err.message });
  }
});

// ==================== REVIEW ENDPOINTS ====================

// Create review
app.post('/reviews', async (req, res) => {
  try {
    const { target_type, target_id, user_id, user_name, rating, comment } = req.body;
    if (!target_type || !target_id || !user_id || !rating || !comment) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    if (dbConnected && Review) {
      const review = await Review.create({
        target_type,
        target_id,
        user_id,
        user_name: user_name || 'Anonymous',
        rating,
        comment
      });
      return res.status(201).json(review);
    }

    // In-memory fallback
    const newReview = {
      _id: `review-${Date.now()}`,
      target_type,
      target_id,
      user_id,
      user_name: user_name || 'Anonymous',
      rating,
      comment,
      created_at: new Date().toISOString()
    };
    res.status(201).json(newReview);
  } catch (err) {
    console.error('Create review error', err);
    res.status(500).json({ error: 'Failed to create review', details: err.message });
  }
});

// Get reviews for a target (internship or project)
app.get('/reviews/:target_type/:target_id', async (req, res) => {
  try {
    const { target_type, target_id } = req.params;

    if (dbConnected && Review) {
      const reviews = await Review.find({ target_type, target_id }).sort({ created_at: -1 });
      const avgRating = reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;
      return res.json({ reviews, avgRating: Math.round(avgRating * 10) / 10, count: reviews.length });
    }

    res.json({ reviews: [], avgRating: 0, count: 0 });
  } catch (err) {
    console.error('Fetch reviews error', err);
    res.status(500).json({ error: 'Failed to fetch reviews', details: err.message });
  }
});

// ==================== RESUME ENDPOINTS ====================

// Create or update resume
app.post('/resumes', async (req, res) => {
  try {
    const { user_id, personal_info, education, experience, projects, skills, certifications } = req.body;
    if (!user_id || !personal_info) {
      return res.status(400).json({ error: 'user_id and personal_info are required' });
    }

    if (dbConnected && Resume) {
      const resume = await Resume.findOneAndUpdate(
        { user_id },
        {
          $set: {
            personal_info,
            education: education || [],
            experience: experience || [],
            projects: projects || [],
            skills: skills || [],
            certifications: certifications || [],
            updated_at: new Date()
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.json(resume);
    }

    // Temporary file storage fallback
    const existingIndex = memoryResumes.findIndex(r => r.user_id === user_id);
    const resumeData = {
      _id: `resume-${user_id}`,
      user_id,
      personal_info,
      education: education || [],
      experience: experience || [],
      projects: projects || [],
      skills: skills || [],
      certifications: certifications || [],
      created_at: existingIndex >= 0 ? memoryResumes[existingIndex].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    if (existingIndex >= 0) {
      memoryResumes[existingIndex] = resumeData;
    } else {
      memoryResumes.push(resumeData);
    }
    
    saveToFile('resumes.json', memoryResumes);
    res.json(resumeData);
  } catch (err) {
    console.error('Save resume error', err);
    res.status(500).json({ error: 'Failed to save resume', details: err.message });
  }
});

// Get resume by user_id
app.get('/resumes/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    if (dbConnected && Resume) {
      const resume = await Resume.findOne({ user_id });
      if (!resume) {
        return res.status(404).json({ error: 'Resume not found' });
      }
      return res.json(resume);
    }

    // Temporary file storage fallback
    const resume = memoryResumes.find(r => r.user_id === user_id);
    if (!resume) {
      return res.status(404).json({ error: 'Resume not found' });
    }
    res.json(resume);
  } catch (err) {
    console.error('Fetch resume error', err);
    res.status(500).json({ error: 'Failed to fetch resume', details: err.message });
  }
});

// Delete resume
app.delete('/resumes/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    if (dbConnected && Resume) {
      const result = await Resume.findOneAndDelete({ user_id });
      if (!result) {
        return res.status(404).json({ error: 'Resume not found' });
      }
      return res.json({ message: 'Resume deleted successfully' });
    }

    res.status(404).json({ error: 'Resume not found' });
  } catch (err) {
    console.error('Delete resume error', err);
    res.status(500).json({ error: 'Failed to delete resume', details: err.message });
  }
});

// Start server
app.listen(PORT, async () => {
  await initDb();
  console.log(`[InternHub] API server listening on http://localhost:${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to local MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));