# 🚀 Getting Started - Step by Step

This guide will walk you through setting up and running your Lindsay Precast Design Management System for the **first time**.

---

## ⚡ Prerequisites Check

Before you begin, make sure you have:

- [ ] **Node.js 20+** installed ([Download](https://nodejs.org))
- [ ] **Git** installed ([Download](https://git-scm.com))
- [ ] A **code editor** (VS Code recommended)
- [ ] A **MongoDB Atlas** account (free) or local MongoDB

Check Node.js version:
```bash
node --version
# Should show v20.0.0 or higher
```

---

## 📦 Step 1: Install Dependencies

Open your terminal in the project folder and run:

```bash
npm install
```

This will install all required packages (~200MB). Takes about 2-3 minutes.

**Expected output:**
```
added 1234 packages in 2m
```

---

## 🗄️ Step 2: Set Up MongoDB Database

### Option A: MongoDB Atlas (Recommended - Free & Cloud)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas/register
   - Sign up with Google/GitHub or email

2. **Create Cluster**
   - Click "Create" (free M0 tier)
   - Choose a cloud provider (AWS recommended)
   - Select region closest to you
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create Database User**
   - Click "Database Access" in left menu
   - Click "Add New Database User"
   - Username: `lindsay_admin`
   - Password: Generate secure password (save it!)
   - User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Click "Network Access" in left menu
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Click "Database" in left menu
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://lindsay_admin:<password>@cluster0.xxxxx.mongodb.net/`

### Option B: Local MongoDB

```bash
# Install MongoDB Community Edition
# Mac:
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Your connection string:
# mongodb://localhost:27017/lindsay_precast_db
```

---

## 🔐 Step 3: Configure Environment Variables

1. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** file with your favorite editor:

   ```env
   # MONGODB_URI - Replace with your connection string
   MONGODB_URI=mongodb+srv://lindsay_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/lindsay_precast_db

   # NEXTAUTH_SECRET - Generate a random secret
   NEXTAUTH_SECRET=your-secret-here-change-this

   # NEXTAUTH_URL - Your app URL (use this for local development)
   NEXTAUTH_URL=http://localhost:3000
   ```

3. **Generate NEXTAUTH_SECRET**

   Run this command and copy the output:
   ```bash
   openssl rand -base64 32
   ```

   Paste the output into your `.env.local` file.

4. **Update MongoDB URI**
   - Replace `YOUR_PASSWORD` with your database password
   - Replace `cluster0.xxxxx` with your actual cluster address
   - Make sure to keep `/lindsay_precast_db` at the end

**Example Complete `.env.local`:**
```env
MONGODB_URI=mongodb+srv://lindsay_admin:MyP@ssw0rd123@cluster0.abc123.mongodb.net/lindsay_precast_db
NEXTAUTH_SECRET=XvZ2J8K9L4M5N6P7Q8R9S0T1U2V3W4X5Y6Z7A8B9C0D1
NEXTAUTH_URL=http://localhost:3000
```

---

## 🚀 Step 4: Run the Application

Start the development server:

```bash
npm run dev
```

**Expected output:**
```
  ▲ Next.js 14.2.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

✅ **Your app is now running!**

---

## 🎨 Step 5: Open the Application

Open your web browser and go to:

```
http://localhost:3000
```

You should see the **login page** with the beautiful purple gradient background! 🎉

---

## 👤 Step 6: Create Your First User

1. Click **"Register here"** link at the bottom
2. Fill in the registration form:
   - **Full Name**: Your name
   - **Email**: your-email@company.com
   - **Password**: At least 6 characters
   - **Role**: Choose "Project Manager" (for full access)
3. Click **"Create Account"**
4. You'll be redirected to the login page

---

## 🔑 Step 7: Login

1. Enter your email and password
2. Click **"Login"**
3. You'll see the **Dashboard** with statistics and quick actions

---

## 📝 Step 8: Create Your First Customer

Before creating projects, you need customers:

1. Click **"Customers"** in the left sidebar
2. Click **"New Customer"** button
3. Fill in customer details:
   - Name: "Test Construction Co"
   - Email: test@construction.com
   - Phone: (555) 123-4567
4. Click **"Create Customer"**

---

## 🎯 Step 9: Create Your First Project

Now create a project:

1. Click **"Projects"** in the sidebar
2. Click **"New Project"** button
3. Fill in project details:
   - **Customer**: Select "Test Construction Co"
   - **Product Type**: Storm
   - **Length**: 8 feet
   - **Width**: 10 feet
   - **Height**: 12 feet
   - **Notes**: "Test project"
4. Click **"Create Project"**

Your first project is created with a number like **PRJ-2025-001**! 🎉

---

## ⏱️ Step 10: Try Time Tracking

1. Click on your project to open details
2. Scroll to **"Time Tracking"** section
3. Click **"Start"** to start the timer
4. Watch it count up in real-time
5. Click **"Stop"** to stop
6. Total hours are automatically calculated!

---

## 🎉 You're All Set!

Congratulations! Your Lindsay Precast Design Management System is up and running!

---

## 🌟 Optional: Add Sample Data

Want to see the app with realistic data?

```bash
npm run seed
```

This will create:
- ✅ 3 sample users (designer, engineer, manager)
- ✅ 3 sample customers
- ✅ 3 product library templates

**Sample Login Credentials:**
```
Manager:  manager@lindsayprecast.com  | password123
Engineer: engineer@lindsayprecast.com | password123
Designer: designer@lindsayprecast.com | password123
```

---

## 🔧 Common Issues & Solutions

### Issue: "npm install" fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force
# Try again
npm install
```

### Issue: "Cannot connect to MongoDB"

**Solutions:**
1. Check your MongoDB URI is correct in `.env.local`
2. Verify your database password has no special characters issues
3. Make sure you whitelisted IP address (0.0.0.0/0) in MongoDB Atlas
4. Try wrapping password in quotes if it has special characters

### Issue: "NEXTAUTH_SECRET is not defined"

**Solution:**
- Make sure you created `.env.local` file (not `.env`)
- Verify `NEXTAUTH_SECRET` is set in `.env.local`
- Restart the dev server (`npm run dev`)

### Issue: Port 3000 is already in use

**Solution:**
```bash
# Use a different port
PORT=3001 npm run dev
```

### Issue: Page won't load or shows errors

**Solution:**
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run dev
```

### Issue: Changes not reflecting

**Solution:**
- Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart dev server

---

## 📚 Next Steps

Now that you're up and running:

1. **Explore Features**
   - Create multiple projects
   - Add more customers
   - Browse the library
   - Try different user roles

2. **Read Documentation**
   - `README.md` - Complete documentation
   - `FEATURES.md` - All available features
   - `DEPLOYMENT.md` - Deploy to production

3. **Customize**
   - Update colors in `app/globals.css`
   - Add your company logo
   - Customize email templates
   - Add more product types

4. **Deploy to Production**
   - Follow `DEPLOYMENT.md` guide
   - Deploy to Vercel (recommended)
   - Set up custom domain
   - Configure production database

---

## 💬 Need Help?

- **Configuration Issues**: Check `.env.local` file
- **MongoDB Issues**: Verify Atlas setup
- **General Questions**: See `README.md`
- **Feature Questions**: See `FEATURES.md`

---

## ✅ Setup Checklist

- [ ] Node.js 20+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB database created
- [ ] `.env.local` file configured
- [ ] Dev server running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Created first user account
- [ ] Logged in successfully
- [ ] Created first customer
- [ ] Created first project
- [ ] Tested time tracking

---

**Welcome to Lindsay Precast Design Management System! 🎨**

**Happy designing!** 🚀

