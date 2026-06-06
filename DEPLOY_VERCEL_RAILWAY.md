# Smart Kisan - Vercel + Railway Deployment Guide

Deploy your Smart Kisan application for free using Vercel (Frontend) and Railway (Backend)!

## 🎯 Final Architecture

```
┌─────────────────────────────────────────────┐
│         Your Smart Kisan App                │
├─────────────────┬───────────────────────────┤
│  Frontend       │     Backend               │
│  (React/Vite)   │   (Python/FastAPI)       │
│  ↓              │     ↓                     │
│  Vercel         │     Railway              │
│  (Free)         │     (Free/$5/mo)         │
└─────────────────┴───────────────────────────┘
         ↓                    ↓
    https://         https://smart-kisan-backend
    smart-kisan      .railway.app
    .vercel.app
```

---

## 📋 Prerequisites

- GitHub account (for version control)
- Vercel account (sign up with GitHub)
- Railway account (free tier)
- MongoDB Atlas account (already set up ✓)

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### **PHASE 1: Deploy Backend to Railway (15 minutes)**

#### Step 1.1: Create GitHub Repository

```bash
cd C:\Users\SAI SANDEEP NAIDU\Downloads\Smart_Kisan

# Initialize Git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Smart Kisan Application"

# Add GitHub remote (replace with your repo URL)
git remote add origin https://github.com/YOUR-USERNAME/smart-kisan.git

# Push to GitHub
git branch -M main
git push -u origin main
```

#### Step 1.2: Deploy Backend Using Railway Dashboard

1. **Go to Railway:** https://railway.app
2. **Sign up** with GitHub
3. **Create New Project** → "Deploy from GitHub repo"
4. **Select** your `smart-kisan` repository
5. **Select** `backend` folder during setup

#### Step 1.3: Configure Environment Variables on Railway

1. In Railway dashboard, go to your project
2. Click **Variables** tab
3. Add:
   ```
   MONGO_URI = mongodb+srv://nandukumar9980:kumar456@cluster0.ecnna5x.mongodb.net/farm?retryWrites=true&w=majority
   PORT = 8000
   ```

#### Step 1.4: Get Backend URL

1. Go to **Deployments** tab
2. Click on the successful deployment
3. Copy the URL (looks like: `https://smart-kisan-prod-xxxx.railway.app`)
4. **Save this URL** - you'll need it for frontend

---

### **PHASE 2: Deploy Frontend to Vercel (10 minutes)**

#### Step 2.1: Import Project to Vercel

1. **Go to Vercel:** https://vercel.com
2. **Sign in** with GitHub
3. **Import Project** → Select your GitHub repo
4. **Configure Project:**
   - Framework: `Vite`
   - Root Directory: Leave default
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### Step 2.2: Add Environment Variables

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add:
   ```
   Name: VITE_API_URL
   Value: https://smart-kisan-prod-xxxx.railway.app
   (Use the Railway backend URL from Step 1.4)
   ```
3. Apply to: Production, Preview, Development

#### Step 2.3: Deploy

1. Click **Deploy**
2. Wait for build to complete (2-3 minutes)
3. You'll see your live app URL (looks like: `https://smart-kisan.vercel.app`)

---

## ✅ Verification Checklist

After deployment, verify everything works:

```bash
# 1. Test Backend
curl https://smart-kisan-prod-xxxx.railway.app/api/lands

# 2. Check Frontend
Visit https://smart-kisan.vercel.app in browser

# 3. Try Login
Use test credentials:
- Email: f@gmail.com
- Password: 1234

# 4. Test Contact Owner Button
Click on any land listing → "Contact Owner"
```

---

## 🔄 Continuous Deployment (Auto-Deploy on Push)

Both Vercel and Railway are already configured with GitHub integration:

```bash
# Every push to main branch automatically redeploys
git add .
git commit -m "Fix bug in component"
git push origin main

# Watch deployment in dashboard:
# - Vercel: https://vercel.com/dashboard
# - Railway: https://railway.app/dashboard
```

---

## 📊 Cost Breakdown

| Service | Free Tier | Pro Tier | Notes |
|---------|-----------|----------|-------|
| Vercel | ✓ Unlimited | $20/mo | Best for frontend |
| Railway | ✓ $5/month | $12+/mo | Best for Python backend |
| MongoDB Atlas | ✓ 512MB | $57+/mo | Already set up |
| **Total** | **FREE** | ~$77/mo | Super affordable! |

---

## 🔧 Troubleshooting

### Frontend shows "Failed to fetch"
**Fix:** Verify `VITE_API_URL` environment variable in Vercel matches Railway backend URL

### Backend not accessible from frontend
**Fix:** Check CORS is enabled (already configured in your code ✓)

### Deployment fails on Vercel
**Fix:** Run locally: `npm run build` - fix any build errors first

### Deployment fails on Railway
**Fix:** Check logs: `railway logs` in terminal

### Changes not appearing after push
**Fix:** 
- Vercel: Clear cache in Settings → Advanced
- Railway: Manually trigger redeploy

---

## 🔐 Production Security Checklist

Before going public:

- [ ] Never commit `.env` file to GitHub
- [ ] Use `.env.example` template
- [ ] MongoDB connection string is secure
- [ ] Enable HTTPS (automatic on both platforms)
- [ ] Set proper CORS origins in backend
- [ ] Enable Railway logging for debugging

---

## 📈 Monitoring & Updates

### View Logs
```bash
# Railway backend logs
railway logs

# Vercel frontend logs
vercel logs
```

### Update Application
```bash
# Make changes locally
git add .
git commit -m "Feature: Add new functionality"
git push origin main

# Auto-deployed to both Vercel and Railway!
```

---

## 🎓 Next Steps for Production

1. **Custom Domain**
   - Vercel: Settings → Domains → Add custom domain
   - Railway: Premium feature

2. **SSL Certificate**
   - Automatic on both platforms

3. **Database Backups**
   - MongoDB Atlas: Automatic daily backups

4. **Monitoring**
   - Vercel: Analytics built-in
   - Railway: Metrics dashboard

5. **Performance**
   - Add caching layer (Redis - optional)
   - Optimize images
   - Enable CDN

---

## 💡 Pro Tips

1. **Preview Deployments**: Every GitHub PR automatically gets a preview URL
2. **Rollback**: One-click rollback to previous deployment
3. **A/B Testing**: Deploy different versions to different audiences
4. **Analytics**: Both platforms provide detailed performance metrics

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Railway Docs**: https://docs.railway.app
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **FastAPI**: https://fastapi.tiangolo.com

---

## ✨ Congratulations!

Your Smart Kisan application is now live on the internet! 🎉

- **Frontend**: https://smart-kisan.vercel.app
- **Backend API**: https://smart-kisan-prod-xxxx.railway.app
- **Database**: MongoDB Atlas (already configured)

Share your app URL with friends and start farming! 🌾

---

## 📝 Quick Reference Commands

```bash
# View Railway logs
railway logs

# Redeploy on Railway
railway up

# Link existing Railway project
railway link <project-id>

# Check Vercel deployment
vercel --prod

# Create preview deployment
vercel --prebuilt
```
