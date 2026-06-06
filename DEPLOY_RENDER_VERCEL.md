# 🚀 Smart Kisan - Render + Vercel Deployment Guide

**Status:** ✅ Code on GitHub  
**Repository:** https://github.com/saisandeepnaidu-11/Smart_Kisan

---

## 📍 Final Architecture

```
Your Smart Kisan App
├── Frontend (React/Vite) → Vercel.com (FREE)
├── Backend (Python/FastAPI) → Render.com (FREE)
└── Database → MongoDB Atlas (FREE)
```

---

## 📋 STEP 1: Deploy Backend to Render (15 minutes)

### 1.1 Create Render Account
1. Go to **https://render.com**
2. Click **"Get Started"** 
3. Choose **"Sign up with GitHub"**
4. Authorize Render to access your repositories

### 1.2 Create New Service on Render
1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Select **"Deploy an existing repository"**
3. Click **"Connect"** to link your GitHub account
4. Search for and select **Smart_Kisan** repository
5. Click **"Connect"**

### 1.3 Configure Render Service
Fill in the deployment settings:

```
Name: smart-kisan-backend
Environment: Python 3
Region: Frankfurt (EU) or closest to you
Branch: main
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: python main.py
```

### 1.4 Set Environment Variables
1. Scroll to **"Environment"** section
2. Click **"Add Environment Variable"**
3. Add:
   ```
   Key: MONGO_URI
   Value: mongodb+srv://nandukumar9980:kumar456@cluster0.ecnna5x.mongodb.net/farm?retryWrites=true&w=majority
   ```
4. Click **"Add"**

### 1.5 Enable Health Check (Optional)
- Health Check Path: `/api/lands`
- Health Check Protocol: HTTP
- This ensures your service stays healthy

### 1.6 Deploy!
1. Click **"Create Web Service"**
2. Render will:
   - Pull your code from GitHub
   - Install dependencies
   - Build your Docker image
   - Deploy your service (2-5 minutes)
3. You'll see a green "Live" status when ready

### 1.7 Get Your Backend URL
In Render dashboard:
1. Go to your service
2. At the top, copy your service URL
3. **Format:** `https://smart-kisan-backend.onrender.com`
4. **Save this URL** - you need it for Vercel!

### ✅ Test Backend is Working
```bash
# Open in browser:
https://smart-kisan-backend.onrender.com/api/lands

# Should return JSON with lands data
```

---

## 📋 STEP 2: Deploy Frontend to Vercel (10 minutes)

### 2.1 Create Vercel Account (if not already done)
1. Go to **https://vercel.com**
2. Click **"Sign Up"**
3. Choose **"Sign Up with GitHub"**
4. Authorize and connect

### 2.2 Import Project
1. In Vercel, click **"Add New"** → **"Project"**
2. Search and select **Smart_Kisan**
3. Click **"Import"**

### 2.3 Configure Settings
Vercel auto-detects Vite. Verify:
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`

### 2.4 Add Environment Variables
1. Click **"Environment Variables"**
2. Add:
   ```
   Name: VITE_API_URL
   Value: https://smart-kisan-backend.onrender.com
   ```
   (Use your Render backend URL from Step 1.7)
3. Click **"Save"**

### 2.5 Deploy
1. Click **"Deploy"**
2. Vercel builds and deploys (2-3 minutes)
3. When complete, you'll see your live URL

### 2.6 Get Your Frontend URL
Your app is live at:
- **Example:** `https://smart-kisan.vercel.app`

---

## ✅ STEP 3: Test Everything Works

### 3.1 Test Frontend Loads
1. Open your Vercel URL in browser
2. Should see Smart Kisan login page

### 3.2 Test Login
1. Click **"I'm a Farmer"**
2. Click **"Sign In"**
3. Use credentials:
   - Email: `f@gmail.com`
   - Password: `1234`
4. Should see Farmer Dashboard

### 3.3 Test Backend Connection
1. Click **"Refresh"** button in Available Lands section
2. Should see land listings load
3. Check browser console (F12) - no "Failed to fetch" errors

### 3.4 Test Contact Owner Feature
1. Click **"Contact Owner"** on any land
2. Should see landowner details
3. Should see phone, email, name

✅ **If all tests pass, you're done!**

---

## 🎯 Your Live URLs

| Component | URL | Platform |
|-----------|-----|----------|
| Frontend | https://smart-kisan.vercel.app | Vercel |
| Backend | https://smart-kisan-backend.onrender.com | Render |
| Database | MongoDB Atlas | Cloud |

---

## 💰 Cost Breakdown

| Service | Free Tier | After |
|---------|-----------|-------|
| Render Backend | ✅ 750 hours/month | $7/month |
| Vercel Frontend | ✅ Unlimited | Free forever |
| MongoDB | ✅ 512MB | $57+/month |
| **Total** | **FREE** | **~$7/month** |

---

## 🔄 Auto-Deploy on GitHub Push

Both platforms auto-deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# Automatic redeploy:
# - Render rebuilds backend (1-2 min)
# - Vercel rebuilds frontend (1-2 min)
```

**Monitor deployments:**
- Render: https://dashboard.render.com
- Vercel: https://vercel.com/dashboard

---

## 🆘 Troubleshooting

### Vercel shows "Failed to fetch"
- Check `VITE_API_URL` environment variable
- Ensure Render backend is running (green status)
- Wait 2 minutes for Render service to warm up

### Render deployment fails
- Check logs: Go to "Logs" tab in Render
- Verify `requirements.txt` has all dependencies
- Ensure `MONGO_URI` is correct

### Backend not responding
- Render free tier might be sleeping
- Services sleep after 15 minutes of inactivity
- Make a request to wake it up
- Upgrade to paid plan for always-on ($7/month)

### Database connection fails
- Verify MongoDB connection string is correct
- Check MongoDB Atlas IP whitelist (should be: 0.0.0.0/0 for free tier)

---

## 💡 Pro Tips

1. **Free Tier Limitations (Render):**
   - Services sleep after 15 minutes of no traffic
   - First request wakes them (takes 30 seconds)
   - Upgrade to "Starter" ($7/month) for always-on

2. **Faster Wakeup:**
   - Keep a browser tab open with your app
   - Or use monitoring service to ping periodically

3. **Custom Domain:**
   - Vercel: Free (vercel.com/account/domains)
   - Render: Paid feature

4. **SSL Certificate:**
   - Automatic on both platforms

---

## 📋 Quick Reference

### Render Service Management
```bash
# View logs
# In dashboard: Logs tab

# Restart service
# In dashboard: Settings → "Restart Service"

# View environment variables
# In dashboard: Environment
```

### Vercel Deployments
```bash
# View all deployments
# In dashboard: Deployments tab

# Rollback to previous version
# Click deployment → "Rollback"

# Set custom domain
# Settings → Domains
```

---

## 🚀 Share Your App!

**Your Smart Kisan Live URL:**
```
https://smart-kisan.vercel.app
```

Share with:
- Farmers in your area
- Landowners
- Agricultural communities
- Friends & family

---

## 📊 Deployment Comparison

| Platform | Backend | Frontend | Cost |
|----------|---------|----------|------|
| Render + Vercel | ✅ | ✅ | FREE ($7/mo upgrade) |
| Railway | ✅ | ❌ | $5/month |
| Heroku | ✅ | ✅ | Paid |
| AWS | ✅ | ✅ | Paid |

**Render + Vercel is the best free option!** 🎉

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Vercel Docs:** https://vercel.com/docs
- **FastAPI:** https://fastapi.tiangolo.com
- **MongoDB:** https://docs.mongodb.com

---

**Next Steps:**
1. ✅ Deploy backend to Render (15 min)
2. ✅ Deploy frontend to Vercel (10 min)
3. ✅ Test your app
4. ✅ Share with users!

**Congratulations!** Your Smart Kisan app is deployed! 🌾
