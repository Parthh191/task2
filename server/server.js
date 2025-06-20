require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const sequelize = require('./config/database');
const User = require('./models/User');
const Blog = require('./models/Blog');
const { verifyToken, authorize } = require('./middleware/auth');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs').promises;
const { fileTypeFromBuffer } = require('file-type');

const app = express();

// Configure multer with secure settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `${randomName}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mime = allowedTypes.test(file.mimetype);

    if (!mime || !ext) {
      return cb(new Error('Only images allowed'), false);
    }
    cb(null, true);
  }
});

// Middleware to verify actual file content
const verifyUpload = async (req, res, next) => {
  if (!req.file) return next();
  
  try {
    const buffer = await fs.readFile(req.file.path);
    const fileType = await fileTypeFromBuffer(buffer);
    
    // Verify if it's actually an image
    if (!fileType || !fileType.mime.startsWith('image/')) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Verify that the actual mime type matches what was claimed
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(fileType.mime)) {
      await fs.unlink(req.file.path);
      return res.status(400).json({ error: 'Unsupported image format' });
    }

    next();
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ error: 'Error processing upload' });
  }
};

// Ensure uploads directory exists
const fsExtra = require('fs-extra');
fsExtra.ensureDirSync('uploads');

// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Auth routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password, role = 'lead' } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password) and token
    res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Blog routes
app.get('/api/blogs', verifyToken, async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [{ model: User, as: 'author', attributes: ['name'] }]
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/blogs/:id', verifyToken, async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: [{ model: User, as: 'author', attributes: ['name'] }]
    });
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/blogs', verifyToken, authorize('super_admin', 'admin'), upload.single('image'), verifyUpload, async (req, res) => {
  try {
    const blogData = {
      ...req.body,
      authorId: req.user.id,
      image: req.file ? `/uploads/${req.file.filename}` : null
    };
    const blog = await Blog.create(blogData);
    res.status(201).json(blog);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/blogs/:id', verifyToken, authorize('super_admin', 'admin'), upload.single('image'), async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      if (req.file) {
        await fs.unlink(req.file.path);
      }
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Delete old image if exists and new image is uploaded
    if (blog.image && req.file) {
      const oldImagePath = path.join(__dirname, blog.image);
      try {
        await fs.access(oldImagePath);
        await fs.unlink(oldImagePath);
      } catch (err) {
        // Ignore error if file doesn't exist
      }
    }

    await blog.update({
      ...req.body,
      image: req.file ? `/uploads/${req.file.filename}` : blog.image
    });
    
    res.json(blog);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path);
    }
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/blogs/:id', verifyToken, authorize('super_admin'), async (req, res) => {
  try {
    const blog = await Blog.findByPk(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    await blog.destroy();
    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User management routes (super_admin only)
app.get('/api/users', verifyToken, authorize('super_admin'), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/:id/role', verifyToken, authorize('super_admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!['super_admin', 'admin', 'lead'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    await user.update({ role });
    res.json({ id: user.id, name: user.name, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3000;

// Sync database and start server
sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});