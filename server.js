require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require('./models/User');
const Auction = require('./models/Auction');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auction_system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Add this to handle MongoDB errors globally
mongoose.connection.on('error', err => {
  console.error('MongoDB error:', err);
});

// Create uploads directory
const uploadDir = 'public/uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Models
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const User = mongoose.model('User', userSchema);

// Routes
app.post('/api/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Email already registered. Please use a different email or sign in.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        message: 'Please enter a valid email address' 
      });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      email,
      password: hashedPassword
    });

    await user.save();

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      'your_jwt_secret',
      { expiresIn: '24h' }
    );

    res.status(201).json({ 
      token,
      message: 'Account created successfully!' 
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Error creating account. Please try again.' 
    });
  }
});

app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Create token
    const token = jwt.sign(
      { userId: user._id },
      'your_jwt_secret', // Replace with your secret key
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in' });
  }
});

// Auction Schema
const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  startingPrice: { type: Number, required: true },
  currentBid: { type: Number },
  currentBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  images: [String],
  category: { type: String, required: true },
  isClosed: { type: Boolean, default: false },
  location: { type: String, required: true }
});

const Auction = mongoose.model('Auction', auctionSchema);

// Middleware to check if auction is closed
const checkAuctionStatus = async (req, res, next) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ message: 'Auction not found' });
    }
    
    if (new Date() > new Date(auction.endDate)) {
      auction.isClosed = true;
      await auction.save();
    }
    
    req.auction = auction;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Error checking auction status' });
  }
};

// Update the auth middleware
const auth = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// Update the auction creation route with detailed logging
app.post('/api/auctions', auth, upload.array('images', 5), async (req, res) => {
  try {
    const imageUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    const auction = new Auction({
      title: req.body.title,
      description: req.body.description,
      startingPrice: Number(req.body.startingPrice),
      currentBid: Number(req.body.startingPrice),
      seller: req.userId,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      category: req.body.category,
      location: req.body.location,
      images: imageUrls
    });

    const savedAuction = await auction.save();
    res.status(201).json(savedAuction);
  } catch (error) {
    console.error('Error creating auction:', error);
    res.status(500).json({ message: 'Error creating auction', details: error.message });
  }
});

// Get all auctions
app.get('/api/auctions', async (req, res) => {
  try {
    const auctions = await Auction.find()
      .populate('seller', 'email')
      .populate('currentBidder', 'email');
    res.json(auctions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching auctions' });
  }
});

// Place bid
app.post('/api/auctions/:id/bid', auth, checkAuctionStatus, async (req, res) => {
  try {
    const { amount } = req.body;
    const auction = req.auction;

    if (auction.isClosed) {
      return res.status(400).json({ message: 'Auction is closed' });
    }

    if (amount <= auction.currentBid) {
      return res.status(400).json({ message: 'Bid must be higher than current bid' });
    }

    auction.currentBid = amount;
    auction.currentBidder = req.userId;
    await auction.save();

    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: 'Error placing bid' });
  }
});

// Delete auction
app.delete('/api/auctions/:id', auth, async (req, res) => {
  try {
    const auction = await Auction.findOne({
      _id: req.params.id,
      seller: req.userId
    });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found or unauthorized' });
    }

    await auction.remove();
    res.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting auction' });
  }
});

// Edit auction
app.put('/api/auctions/:id', auth, async (req, res) => {
  try {
    const auction = await Auction.findOne({
      _id: req.params.id,
      seller: req.userId
    });

    if (!auction) {
      return res.status(404).json({ message: 'Auction not found or unauthorized' });
    }

    if (auction.isClosed) {
      return res.status(400).json({ message: 'Cannot edit closed auction' });
    }

    // Only allow editing certain fields
    const allowedUpdates = [
      'title',
      'description',
      'category',
      'location',
      'endDate'
    ];

    allowedUpdates.forEach(update => {
      if (req.body[update]) {
        auction[update] = req.body[update];
      }
    });

    await auction.save();
    res.json(auction);
  } catch (error) {
    res.status(500).json({ message: 'Error updating auction' });
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static('public/uploads'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
