const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
require('dotenv').config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cloudcart')

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
  price: { type: Number, required: true },
  image: { type: String, required: true }
}, { timestamps: true })

const Product = mongoose.model('Product', productSchema)

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({})
    await Product.deleteMany({})

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    await User.create({
      name: 'Admin User',
      email: 'admin@cloudcart.com',
      password: hashedPassword,
      isAdmin: true
    })

    // Create sample products
    const products = [
      {
        name: 'Wireless Headphones',
        description: 'High-quality wireless headphones with noise cancellation',
        price: 99.99,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300',
        category: 'Electronics',
        stock: 50
      },
      {
        name: 'Smartphone',
        description: 'Latest smartphone with advanced features',
        price: 699.99,
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300',
        category: 'Electronics',
        stock: 25
      },
      {
        name: 'Laptop',
        description: 'Powerful laptop for work and gaming',
        price: 1299.99,
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=300',
        category: 'Computers',
        stock: 15
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracking smartwatch',
        price: 249.99,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300',
        category: 'Wearables',
        stock: 30
      },
      {
        name: 'Tablet',
        description: 'Lightweight tablet for entertainment',
        price: 399.99,
        image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300',
        category: 'Electronics',
        stock: 20
      },
      {
        name: 'Camera',
        description: 'Professional DSLR camera',
        price: 899.99,
        image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300',
        category: 'Photography',
        stock: 10
      }
    ]

    await Product.insertMany(products)

    console.log('Database seeded successfully!')
    console.log('Admin login: admin@cloudcart.com / admin123')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedData()