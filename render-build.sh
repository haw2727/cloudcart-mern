#!/usr/bin/env bash
# Build script for Render deployment

# Install dependencies
npm install

# Build client
cd client
npm install
npm run build
cd ..

# Create uploads directory
mkdir -p uploads