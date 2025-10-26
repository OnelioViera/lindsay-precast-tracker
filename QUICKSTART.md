# 🚀 Quick Start Guide

Get your Lindsay Precast Design Management System up and running in 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up MongoDB

### Option A: MongoDB Atlas (Recommended - Free)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free account
3. Create a new cluster (select Free M0 tier)
4. Click "Connect" → "Connect your application"
5. Copy your connection string

### Option B: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/lindsay_precast_db`

## Step 3: Configure Environment

Create `.env.local` file:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add your MongoDB URI:

```env
MONGODB_URI=your-mongodb-connection-string-here
NEXTAUTH_SECRET=run-this-command-to-generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000
```

## Step 4: Run the App

```bash
npm run dev
```

Open http://localhost:3000 🎉

## Step 5: Create Your Account

1. Go to http://localhost:3000/register
2. Fill in your details
3. Select your role (Manager recommended for full access)
4. Click "Create Account"
5. Login and start managing projects!

## 🎯 First Steps

### Create a Customer

1. Navigate to **Customers** from the sidebar
2. Click **New Customer**
3. Fill in customer details
4. Save

### Create a Project

1. Navigate to **Projects**
2. Click **New Project**
3. Select the customer you created
4. Choose product type
5. Enter specifications
6. Click **Create Project**

### Track Time

1. Open a project from the Projects list
2. Scroll to **Time Tracking** section
3. Click **Start** to begin tracking
4. Click **Stop** when done
5. Hours are automatically calculated!

## 🎨 Features Overview

✅ **Dashboard** - Overview of all projects and statistics  
✅ **Projects** - Create and manage design projects  
✅ **Time Tracking** - Built-in timer system  
✅ **Customers** - Customer relationship management  
✅ **Library** - Product templates and specifications  
✅ **Production** - Production handoff workflow  

## 🆘 Need Help?

### MongoDB Connection Issues

```bash
# Test your MongoDB connection
node -e "require('mongodb').MongoClient.connect('YOUR_URI', (e,c) => { console.log(e ? 'Error: ' + e : 'Connected!'); c?.close(); })"
```

### Port Already in Use

```bash
# Use a different port
PORT=3001 npm run dev
```

### Clear Everything and Restart

```bash
rm -rf node_modules .next
npm install
npm run dev
```

## 📚 Learn More

- Full documentation: See README.md
- API documentation: See "API Documentation" section in README
- Deployment guide: See "Deployment" section in README

---

**Happy Designing! 🎨**

