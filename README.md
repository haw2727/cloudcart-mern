# CloudCart MERN Stack E-commerce

A full-stack e-commerce application built with MongoDB, Express, React (Vite), and Node.js.

## Features
- Product catalog with MongoDB storage
- Shopping cart functionality
- User authentication
- Admin product management
- Responsive design
- Cloud deployment ready

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
cd client && npm install
```

### 2. Environment Variables
Create `.env` file in root:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/cloudcart
NODE_ENV=development
```

### 3. Run Development
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## Deployment

### Heroku
1. Create Heroku app
2. Add MongoDB Atlas connection string to Heroku config vars
3. Deploy: `git push heroku main`

### Vercel/Netlify
1. Build the client: `cd client && npm run build`
2. Deploy the `client/dist` folder

## API Endpoints
- GET `/api/products` - Get all products
- POST `/api/products` - Add new product
- DELETE `/api/products/:id` - Delete product
- POST `/api/register` - Register user
- POST `/api/login` - Login user

## Tech Stack
- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Styling**: CSS3
- **Icons**: Font Awesome