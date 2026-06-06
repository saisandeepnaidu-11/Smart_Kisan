# Smart Kisan - Docker Deployment Guide

This guide will help you deploy the Smart Kisan application using Docker containers.

## Prerequisites

- Docker Desktop or Docker Engine installed
- Docker Compose installed (included with Docker Desktop)
- MongoDB Atlas account with connection string OR local MongoDB

## Quick Start (Local Docker Deployment)

### 1. Clone/Prepare Your Repository
```bash
cd Smart_Kisan
```

### 2. Create Environment File
```bash
cp .env.example .env
```

Edit `.env` and update the `MONGO_URI` if needed:
```env
MONGO_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/farm?retryWrites=true&w=majority
```

### 3. Build and Start Containers
```bash
docker-compose up -d
```

This will:
- Build the frontend image
- Build the backend image
- Start both services in the background
- Expose frontend on http://localhost:5173
- Expose backend on http://localhost:8000

### 4. Verify Deployment
```bash
# Check if containers are running
docker-compose ps

# View logs
docker-compose logs -f frontend
docker-compose logs -f backend
```

### 5. Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000/api/lands

## Deploying to Production (Cloud)

### Option 1: AWS EC2 with Docker

1. **Launch EC2 Instance:**
   - Ubuntu 22.04 LTS
   - Security groups: Allow ports 80, 443, 5173, 8000

2. **Install Docker:**
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   ```

3. **Install Docker Compose:**
   ```bash
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```

4. **Clone and Deploy:**
   ```bash
   git clone <your-repo-url> smart_kisan
   cd smart_kisan
   cp .env.example .env
   # Edit .env with production values
   docker-compose up -d
   ```

5. **Set up Reverse Proxy (Nginx):**
   ```bash
   sudo apt-get install nginx
   ```
   
   Create `/etc/nginx/sites-available/smart_kisan`:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:5173;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
       }

       location /api {
           proxy_pass http://localhost:8000;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
       }
   }
   ```

   Enable and restart Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/smart_kisan /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### Option 2: Docker Hub Registry

1. **Create Docker Hub Account** (if not already done)

2. **Tag Images:**
   ```bash
   docker build -f Dockerfile.frontend -t yourusername/smart_kisan_frontend:latest .
   docker build -f backend/Dockerfile -t yourusername/smart_kisan_backend:latest ./backend
   ```

3. **Push to Docker Hub:**
   ```bash
   docker push yourusername/smart_kisan_frontend:latest
   docker push yourusername/smart_kisan_backend:latest
   ```

4. **Deploy from Hub:**
   Update `docker-compose.yml` to use images from Docker Hub:
   ```yaml
   services:
     backend:
       image: yourusername/smart_kisan_backend:latest
     frontend:
       image: yourusername/smart_kisan_frontend:latest
   ```

### Option 3: Heroku Deployment

1. **Install Heroku CLI**

2. **Create Heroku Apps:**
   ```bash
   heroku create smart-kisan-backend
   heroku create smart-kisan-frontend
   ```

3. **Deploy Backend:**
   ```bash
   git subtree push --prefix backend heroku-backend main
   ```

4. **Deploy Frontend:**
   ```bash
   git subtree push --prefix . heroku-frontend main
   ```

### Option 4: Google Cloud Run / Azure Container Instances

These platforms support Docker containers natively. Follow their respective documentation for deploying container images.

## Environment Variables for Production

Update `.env` with production values:

```env
# Production MongoDB URI (use managed database)
MONGO_URI=mongodb+srv://prod-user:prod-password@prod-cluster.mongodb.net/farm?retryWrites=true&w=majority

# Production Frontend URL
VITE_API_URL=https://api.yourdomain.com

# Enable HTTPS
NODE_ENV=production
```

## Monitoring and Maintenance

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Stop Services
```bash
docker-compose down
```

### Update and Redeploy
```bash
git pull origin main
docker-compose down
docker-compose up -d --build
```

## Scaling

### Using Docker Swarm
```bash
docker swarm init
docker stack deploy -c docker-compose.yml smart_kisan
```

### Using Kubernetes
Create `deployment.yaml` and deploy:
```bash
kubectl apply -f deployment.yaml
kubectl get pods
```

## Troubleshooting

### Backend can't connect to MongoDB
- Check `MONGO_URI` in `.env`
- Verify MongoDB Atlas IP whitelist includes your server IP

### Frontend showing "Failed to fetch"
- Check if backend is running: `curl http://localhost:8000/api/lands`
- Verify `VITE_API_URL` in frontend environment

### Port Already in Use
```bash
# Find and kill process using port 5173
lsof -i :5173
kill -9 <PID>
```

### Container won't start
```bash
docker-compose logs backend
docker-compose logs frontend
```

## Security Best Practices

1. **Never commit `.env`** to version control
2. **Use environment variables** for all sensitive data
3. **Enable HTTPS** in production (use Let's Encrypt with Nginx)
4. **MongoDB Atlas IP Whitelist** - only allow your server's IP
5. **Regular backups** of MongoDB
6. **Health checks** are configured in docker-compose.yml

## Performance Optimization

For production deployments with high traffic:

1. Add caching layer (Redis)
2. Use CDN for static assets
3. Implement database indexing
4. Set up load balancing
5. Monitor resource usage

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [FastAPI Production Deployment](https://fastapi.tiangolo.com/deployment/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
