# 🌐 MongoDB Atlas Setup Guide

## Step-by-Step Setup

### 1. **Create MongoDB Atlas Account**
1. Go to https://cloud.mongodb.com/
2. Sign up for free account
3. Verify your email address

### 2. **Create New Cluster**
1. Click "Build a Database"
2. Choose **M0 Sandbox** (Free tier)
3. **Cloud Provider**: AWS (recommended)
4. **Region**: Choose closest to your deployment
5. **Cluster Name**: `internhub-production`
6. Click "Create" (takes 3-5 minutes)

### 3. **Create Database User**
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. **Authentication**: Password
4. **Username**: `internhub_user`
5. **Password**: Generate secure password (SAVE THIS!)
6. **Privileges**: "Read and write to any database"
7. Click "Add User"

### 4. **Configure Network Access**
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. **Comment**: "Production deployment"
5. Click "Confirm"

### 5. **Get Connection String**
1. Go to "Clusters"
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and "4.1 or later"
5. **Copy the connection string**

**Example connection string:**
```
mongodb+srv://internhub_user:<password>@internhub-production.abc123.mongodb.net/?retryWrites=true&w=majority
```

### 6. **Update Environment Variables**

**For Local Development (.env):**
```env
# Production MongoDB Atlas
MONGODB_URI=mongodb+srv://internhub_user:YOUR_PASSWORD@internhub-production.abc123.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=internhub
PORT=4000
NODE_ENV=development
```

**For Production Deployment:**
```env
MONGODB_URI=mongodb+srv://internhub_user:YOUR_PASSWORD@internhub-production.abc123.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=internhub
PORT=4000
NODE_ENV=production
```

### 7. **Test Connection**
Run your application locally with the new connection string:
```bash
cd server
npm start
```

You should see:
```
✅ Successfully connected to MongoDB Atlas!
```

## 🚀 **Deployment Platforms**

### **Option A: Render**
1. Connect GitHub repository
2. Set environment variables in Render dashboard
3. Deploy automatically

### **Option B: Railway**
1. Import from GitHub
2. Add environment variables
3. Deploy with one click

### **Option C: Vercel (Backend)**
1. Import repository
2. Configure as Node.js project
3. Set environment variables

## 🔒 **Security Best Practices**

1. **Never commit** connection strings to Git
2. **Use environment variables** for all credentials
3. **Rotate passwords** regularly
4. **Monitor database access** in Atlas dashboard

## 📊 **MongoDB Atlas Features**

- ✅ **Free M0 tier**: 512 MB storage
- ✅ **Automatic backups**
- ✅ **Built-in monitoring**
- ✅ **Global clusters**
- ✅ **99.995% uptime SLA**

## 🔍 **Monitoring Your Database**

1. **Atlas Dashboard**: https://cloud.mongodb.com/
2. **Metrics**: Real-time performance monitoring
3. **Logs**: Database operation logs
4. **Alerts**: Set up email/SMS alerts
5. **Data Explorer**: Browse your collections

Your InternHub application will now have a production-ready database! 🎉