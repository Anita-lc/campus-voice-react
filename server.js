const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create uploads directory if it doesn't exist
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  }
});

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  next();
};

// Utility functions
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, department, yearOfStudy } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        department,
        yearOfStudy: yearOfStudy ? parseInt(yearOfStudy) : null
      }
    });

    // Generate token
    const token = generateToken(user);

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'register',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email, isActive: true }
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate token
    const token = generateToken(user);

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: 'login',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed' });
  }
});

// User Routes
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        department: true,
        yearOfStudy: true,
        role: true,
        profileImage: true,
        createdAt: true
      }
    });

    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
});

// Categories Routes
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json({ success: true, categories });
  } catch (error) {
    console.error('Categories fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
});

// Feedback Routes
app.post('/api/feedback', authenticateToken, upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, description, categoryId, location, priority, isAnonymous } = req.body;
    const attachments = req.files ? req.files.map(file => file.filename) : [];

    const feedback = await prisma.feedback.create({
      data: {
        userId: req.user.id,
        categoryId: parseInt(categoryId),
        title,
        description,
        location,
        priority: priority || 'MEDIUM',
        isAnonymous: isAnonymous === 'true',
        attachments: attachments.length > 0 ? attachments : null
      },
      include: {
        category: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.user.id,
        action: 'submit_feedback',
        entityType: 'feedback',
        entityId: feedback.id,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully',
      feedback
    });
  } catch (error) {
    console.error('Feedback submission error:', error);
    res.status(500).json({ success: false, message: 'Failed to submit feedback' });
  }
});

app.get('/api/feedback', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, categoryId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      userId: req.user.id
    };

    if (status) where.status = status;
    if (categoryId) where.categoryId = parseInt(categoryId);

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        include: {
          category: true,
          _count: {
            select: {
              comments: true,
              votes: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.feedback.count({ where })
    ]);

    res.json({
      success: true,
      feedback,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
});

app.get('/api/feedback/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const feedback = await prisma.feedback.findFirst({
      where: {
        id: parseInt(id),
        userId: req.user.id
      },
      include: {
        category: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                role: true
              }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        votes: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });

    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    // Increment view count
    await prisma.feedback.update({
      where: { id: parseInt(id) },
      data: { views: { increment: 1 } }
    });

    res.json({ success: true, feedback });
  } catch (error) {
    console.error('Feedback fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
});

// Dashboard Stats
app.get('/api/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const stats = await prisma.feedback.groupBy({
      by: ['status'],
      where: { userId },
      _count: { status: true }
    });

    const totalFeedback = await prisma.feedback.count({
      where: { userId }
    });

    const unreadNotifications = await prisma.notification.count({
      where: { userId, isRead: false }
    });

    const statsObj = {
      total: totalFeedback,
      pending: 0,
      inProgress: 0,
      resolved: 0,
      rejected: 0,
      unreadNotifications
    };

    stats.forEach(stat => {
      statsObj[stat.status.toLowerCase()] = stat._count.status;
    });

    res.json({ success: true, stats: statsObj });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats' });
  }
});

// Admin Routes
app.get('/api/admin/feedback', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority, categoryId } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (categoryId) where.categoryId = parseInt(categoryId);

    const [feedback, total] = await Promise.all([
      prisma.feedback.findMany({
        where,
        include: {
          category: true,
          user: {
            select: {
              firstName: true,
              lastName: true,
              email: true
            }
          },
          _count: {
            select: {
              comments: true,
              votes: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.feedback.count({ where })
    ]);

    res.json({
      success: true,
      feedback,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Admin feedback fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch feedback' });
  }
});

app.put('/api/admin/feedback/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminResponse } = req.body;

    const feedback = await prisma.feedback.update({
      where: { id: parseInt(id) },
      data: {
        status,
        adminResponse,
        resolvedAt: status === 'RESOLVED' ? new Date() : null
      },
      include: {
        user: true,
        category: true
      }
    });

    // Create notification for user
    await prisma.notification.create({
      data: {
        userId: feedback.userId,
        title: 'Feedback Status Updated',
        message: `Your feedback "${feedback.title}" status has been updated to ${status}`,
        type: 'FEEDBACK_UPDATE',
        relatedId: feedback.id
      }
    });

    res.json({ success: true, message: 'Status updated successfully', feedback });
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ success: false, message: 'Failed to update status' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large' });
    }
  }
  
  console.error('Error:', error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
