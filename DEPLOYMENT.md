# 🚀 Deployment Guide

Complete guide for deploying Lindsay Precast Design Management System to production.

## Prerequisites

- MongoDB Atlas database (production cluster)
- Vercel account (or other hosting platform)
- Domain name (optional)
- AWS S3 bucket for file uploads (optional)

## Option 1: Deploy to Vercel (Recommended)

### Step 1: Prepare Your Repository

```bash
# Initialize git if you haven't
git init
git add .
git commit -m "Initial commit"

# Push to GitHub/GitLab/Bitbucket
git remote add origin YOUR_REPO_URL
git push -u origin main
```

### Step 2: Set Up MongoDB Atlas Production Cluster

1. Go to MongoDB Atlas
2. Create a new **M10 or higher** cluster for production
3. Configure **IP Whitelist**: Add `0.0.0.0/0` (allow from anywhere)
4. Create a **database user** with read/write permissions
5. Get your connection string

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"New Project"**
3. Import your repository
4. Configure project:
   - Framework Preset: **Next.js**
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. Add Environment Variables:

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/lindsay_precast_db
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-domain.vercel.app
```

6. Click **"Deploy"**
7. Wait for deployment to complete (2-3 minutes)

### Step 4: Verify Deployment

1. Visit your deployed URL
2. Register a new admin user
3. Test creating projects and customers
4. Verify all features work correctly

### Step 5: Set Up Custom Domain (Optional)

1. In Vercel dashboard, go to **Settings → Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` environment variable to your domain

## Option 2: Deploy to Railway

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub

### Step 2: Deploy Application

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add MongoDB plugin
railway add mongodb

# Deploy
railway up
```

### Step 3: Configure Environment Variables

In Railway dashboard:
1. Select your project
2. Go to **Variables**
3. Add all required environment variables
4. Redeploy

## Option 3: Deploy to DigitalOcean App Platform

### Step 1: Create App

1. Go to DigitalOcean App Platform
2. Click **"Create App"**
3. Connect your repository

### Step 2: Configure

```yaml
# app.yaml
name: lindsay-precast
services:
  - name: web
    github:
      repo: your-username/your-repo
      branch: main
    build_command: npm run build
    run_command: npm start
    environment_slug: node-js
    envs:
      - key: MONGODB_URI
        value: ${MONGODB_URI}
      - key: NEXTAUTH_SECRET
        value: ${NEXTAUTH_SECRET}
      - key: NEXTAUTH_URL
        value: ${APP_URL}
```

### Step 3: Deploy

Click **"Create Resources"** and wait for deployment.

## Environment Variables Reference

### Required Variables

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET=your-secret-key-here

# Application URL (your production domain)
NEXTAUTH_URL=https://yourdomain.com
```

### Optional Variables

```env
# AWS S3 for File Uploads
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Email Service (SendGrid)
SENDGRID_API_KEY=your-api-key

# Sentry Error Tracking
SENTRY_DSN=your-sentry-dsn
```

## Post-Deployment Checklist

- [ ] Verify MongoDB connection
- [ ] Test user registration and login
- [ ] Create test customer and project
- [ ] Test time tracking functionality
- [ ] Verify PDF generation works
- [ ] Check all API endpoints
- [ ] Test on mobile devices
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure SSL/HTTPS
- [ ] Set up automated backups

## MongoDB Production Best Practices

### 1. Database Backups

Enable **Continuous Backups** in MongoDB Atlas:
- Settings → Backup → Enable Cloud Backup
- Configure backup schedule
- Test restore procedure

### 2. Performance Monitoring

- Enable **Performance Advisor**
- Set up **Alerts** for:
  - High CPU usage
  - Connection count
  - Query performance
  - Storage usage

### 3. Security

```
✅ Use strong passwords
✅ Enable IP whitelist
✅ Use TLS/SSL connections
✅ Regular security audits
✅ Implement rate limiting
```

## Performance Optimization

### 1. Next.js Optimization

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['your-cdn.com'],
    formats: ['image/avif', 'image/webp'],
  },
  compress: true,
  poweredByHeader: false,
}
```

### 2. MongoDB Indexes

Ensure indexes are created:

```bash
# Connect to MongoDB
mongosh "your-connection-string"

# Create indexes
db.projects.createIndex({ projectNumber: 1 })
db.projects.createIndex({ customerId: 1 })
db.projects.createIndex({ status: 1 })
db.projects.createIndex({ createdAt: -1 })
db.customers.createIndex({ "contactInfo.email": 1 })
db.users.createIndex({ email: 1 })
```

### 3. CDN Configuration

If using Vercel:
- Static assets automatically cached
- Edge network distribution
- Automatic image optimization

## Monitoring & Logging

### Vercel Analytics

Already included! View in Vercel dashboard:
- Page views
- Load times
- Web Vitals
- Error rates

### Custom Monitoring

Add Sentry for error tracking:

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

## Scaling Considerations

### When to Scale

Monitor these metrics:
- Response time > 2 seconds
- CPU usage > 80%
- Memory usage > 80%
- Database connections > 80% of limit

### Scaling Options

1. **Database**: Upgrade MongoDB cluster tier
2. **Application**: Vercel automatically scales
3. **CDN**: Enable for static assets
4. **Caching**: Implement Redis for sessions

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Environment Variables Not Loading

1. Verify variables are set in platform dashboard
2. Redeploy application
3. Check for typos in variable names

### MongoDB Connection Issues

1. Verify IP whitelist includes `0.0.0.0/0`
2. Check connection string format
3. Ensure database user has proper permissions
4. Test connection with MongoDB Compass

### NextAuth Issues

1. Ensure `NEXTAUTH_URL` matches your domain exactly
2. Verify `NEXTAUTH_SECRET` is set
3. Clear browser cookies
4. Check that callbacks are properly configured

## Rollback Procedure

### Vercel

1. Go to **Deployments**
2. Find previous working deployment
3. Click **"Promote to Production"**

### Railway

```bash
railway rollback
```

## Security Hardening

### 1. Rate Limiting

Add to API routes:

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

### 2. Security Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};
```

### 3. CORS Configuration

Already configured in API routes with proper origin checking.

## Maintenance

### Weekly Tasks
- [ ] Check error logs
- [ ] Review performance metrics
- [ ] Test critical flows
- [ ] Verify backups

### Monthly Tasks
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization
- [ ] User feedback review

### Quarterly Tasks
- [ ] Major feature releases
- [ ] Infrastructure review
- [ ] Cost optimization
- [ ] Disaster recovery test

## Support

For deployment issues:
1. Check Vercel/Railway documentation
2. Review error logs in platform dashboard
3. Test locally with production environment variables
4. Contact platform support if needed

---

**Deployment Checklist Summary**

```
✅ Repository pushed to Git
✅ MongoDB Atlas production cluster
✅ Environment variables configured
✅ Application deployed
✅ Custom domain configured (optional)
✅ SSL/HTTPS enabled
✅ Monitoring set up
✅ Backups enabled
✅ Performance tested
✅ Security hardened
```

**You're ready to go! 🚀**

