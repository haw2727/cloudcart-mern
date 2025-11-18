const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const session = require('express-session')
const multer = require('multer')
const path = require('path')
require('dotenv').config()

const app = express()

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(session({
  secret: process.env.SESSION_SECRET || 'cloudcart-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}))

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files allowed'))
    }
  }
})

// Serve uploaded files
app.use('/uploads', express.static('uploads'))

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudcart', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err))

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  category: { type: String, default: 'General' },
  stock: { type: Number, default: 0, min: 0 }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

// Order Schema
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true }
  }],
  total: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
  paymentMethod: { type: String, default: 'card' },
  paymentProof: { type: String }, // Receipt/transaction image URL
  transactionNumber: { type: String },
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  }
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
      return res.status(401).json({ message: 'No token provided' })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }
    
    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

// Admin middleware
const adminAuth = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' })
  }
  next()
}

// Auth Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' })
    }
    
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }
    
    const hashedPassword = await bcrypt.hash(password, 12)
    const user = new User({ name, email, password: hashedPassword })
    await user.save()
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    req.session.userId = user._id
    res.json({ user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' })
    }
    
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' })
    req.session.userId = user._id
    res.json({ user: { id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin }, token })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/api/user', auth, (req, res) => {
  res.json({ id: req.user._id, name: req.user.name, email: req.user.email, isAdmin: req.user.isAdmin })
})

app.get('/api/users', auth, adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('-password')
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete('/api/users/:id', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json({ message: 'User deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/api/users/:id/admin', auth, adminAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isAdmin: req.body.isAdmin }, 
      { new: true }
    ).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Product Routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.post('/api/products', auth, adminAuth, async (req, res) => {
  try {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/api/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.delete('/api/products/:id', auth, adminAuth, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json({ message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Order Routes
app.post('/api/orders', auth, async (req, res) => {
  try {
    const { items, total, shippingAddress } = req.body
    const order = new Order({
      user: req.user._id,
      items,
      total,
      shippingAddress
    })
    await order.save()
    await order.populate('items.product')
    res.status(201).json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.get('/api/orders', auth, async (req, res) => {
  try {
    const orders = req.user.isAdmin 
      ? await Order.find().populate('user', 'name email').populate('items.product')
      : await Order.find({ user: req.user._id }).populate('items.product')
    res.json(orders)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/api/orders/:id/status', auth, adminAuth, async (req, res) => {
  try {
    const { status } = req.body
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('user', 'name email').populate('items.product')
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    res.json(order)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

app.put('/api/orders/:id/payment', auth, upload.single('receipt'), async (req, res) => {
  try {
    const { transactionNumber } = req.body
    const order = await Order.findById(req.params.id)
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' })
    }
    
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' })
    }
    
    const paymentProof = req.file ? `/uploads/${req.file.filename}` : null
    
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { paymentProof, transactionNumber },
      { new: true }
    ).populate('items.product')
    
    res.json(updatedOrder)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/dist')))
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/dist/index.html'))
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})