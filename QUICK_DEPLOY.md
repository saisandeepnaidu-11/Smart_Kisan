# ⚡ Quick Deploy Checklist - Render + Vercel

## ✅ What's Done
- [x] GitHub repository ready
- [x] Backend (Python/FastAPI) configured
- [x] Frontend (React/Vite) configured  
- [x] Database (MongoDB) ready
- [x] Dockerfiles created

## 🚀 Quick Deploy (25 minutes total)

### PHASE 1: Deploy Backend (15 min)
```
1. Go to https://render.com
2. Sign up with GitHub
3. New → Web Service
4. Select Smart_Kisan repo
5. Root Directory: backend
6. Start Command: python main.py
7. Add MONGO_URI environment variable
8. Click Deploy
9. Copy your Render URL
```

**Your Backend URL:** 
```
https://smart-kisan-backend.onrender.com
```

### PHASE 2: Deploy Frontend (10 min)
```
1. Go to https://vercel.com
2. Add New → Project
3. Select Smart_Kisan repo
4. Add Environment Variable:
   - VITE_API_URL = [Your Render URL]
5. Click Deploy
6. Copy your Vercel URL
```

**Your Frontend URL:**
```
https://smart-kisan.vercel.app
```

## 🧪 Test (5 min)
- [ ] Open Vercel URL
- [ ] Login (f@gmail.com / 1234)
- [ ] See dashboard load
- [ ] Click "Contact Owner"
- [ ] See landowner details

## 📊 Final Result

| Item | Status |
|------|--------|
| Frontend URL | Ready |
| Backend URL | Ready |
| Database | Connected |
| Cost | FREE ($7/mo optional) |
| Auto-Deploy | Enabled |

## 🎯 Share Your App
```
https://smart-kisan.vercel.app
```

---

**Documentation:**
- Full guide: `DEPLOY_RENDER_VERCEL.md`
- GitHub: https://github.com/saisandeepnaidu-11/Smart_Kisan
