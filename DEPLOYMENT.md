# 🚀 Deployment Guide - RestaurantOS

Complete guide for deploying your Restaurant Management System to production.

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Environment variables configured
- [ ] Database seeded with initial data
- [ ] Application tested locally
- [ ] Git repository created

## 🗄️ Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new cluster (M0 Free tier is sufficient for testing)

### 2. Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a username and strong password
4. Set privileges to "Read and write to any database"

### 3. Configure Network Access

1. Go to "Network Access"
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your server's IP address

### 4. Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `restaurant_db`

Example:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
```

## 🔧 Backend Deployment (Render)

### 1. Prepare Backend

1. Ensure `package.json` has start script:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

### 2. Deploy to Render

1. Go to [Render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your repository
5. Configure:
   - **Name**: restaurant-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 3. Set Environment Variables

Add these in Render dashboard:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key_min_32_characters
JWT_EXPIRE=7d
NODE_ENV=production
CLIENT_URL=https://your-frontend-url.vercel.app
```

### 4. Deploy

1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://restaurant-backend.onrender.com`

### 5. Seed Database

After deployment, run seed script:

```bash
# SSH into Render or use their shell
npm run seed
```

## 🎨 Frontend Deployment (Vercel)

### 1. Update API URL

Update `frontend/src/services/api.js`:

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});
```

Create `frontend/.env.production`:

```
VITE_API_URL=https://restaurant-backend.onrender.com/api
```

### 2. Deploy to Vercel

1. Go to [Vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New" → "Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

### 3. Set Environment Variables

Add in Vercel dashboard:

```
VITE_API_URL=https://restaurant-backend.onrender.com/api
```

### 4. Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Your app will be live at: `https://your-app.vercel.app`

## 🔄 Alternative: Deploy to Railway

### Backend on Railway

1. Go to [Railway.app](https://railway.app)
2. Click "Start a New Project"
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables
6. Deploy

### Frontend on Netlify

1. Go to [Netlify.com](https://netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub
4. Configure:
   - **Base directory**: frontend
   - **Build command**: `npm run build`
   - **Publish directory**: frontend/dist
5. Add environment variables
6. Deploy

## 🐳 Docker Deployment

### Create Dockerfiles

**backend/Dockerfile**:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**frontend/Dockerfile**:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

Create `docker-compose.yml`:

```yaml
version: "3.8"
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - JWT_EXPIRE=7d
      - NODE_ENV=production
    depends_on:
      - mongo

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

Run with:

```bash
docker-compose up -d
```

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET to a strong random string
- [ ] Use HTTPS in production
- [ ] Enable CORS only for your frontend domain
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Regular security updates
- [ ] Database backups enabled
- [ ] Environment variables secured
- [ ] Remove console.logs in production
- [ ] Enable MongoDB Atlas IP whitelist

## 📊 Post-Deployment

### 1. Test the Application

- [ ] Login with all user roles
- [ ] Create orders
- [ ] Test real-time updates
- [ ] Check reports
- [ ] Test all CRUD operations

### 2. Monitor Performance

- Set up monitoring (Render/Vercel dashboards)
- Check error logs
- Monitor database performance
- Set up alerts

### 3. Backup Strategy

- Enable MongoDB Atlas automated backups
- Export database regularly
- Keep environment variables backed up

## 🔧 Troubleshooting

### Backend Issues

**Problem**: Server not starting

- Check environment variables
- Verify MongoDB connection string
- Check Render logs

**Problem**: CORS errors

- Update CLIENT_URL in backend .env
- Check CORS configuration in server.js

### Frontend Issues

**Problem**: API calls failing

- Verify VITE_API_URL is correct
- Check network tab in browser
- Ensure backend is running

**Problem**: Build fails

- Clear node_modules and reinstall
- Check for TypeScript errors
- Verify all dependencies are installed

### Database Issues

**Problem**: Connection timeout

- Check MongoDB Atlas IP whitelist
- Verify connection string
- Check network access settings

## 📱 Mobile Optimization

The application is responsive, but for better mobile experience:

1. Add PWA support
2. Optimize images
3. Implement lazy loading
4. Add touch gestures

## 🚀 Performance Optimization

1. **Frontend**:
   - Enable code splitting
   - Optimize bundle size
   - Use CDN for static assets
   - Implement caching

2. **Backend**:
   - Add Redis for caching
   - Optimize database queries
   - Use connection pooling
   - Enable compression

3. **Database**:
   - Create proper indexes
   - Optimize aggregation pipelines
   - Regular maintenance

## 📈 Scaling

### Horizontal Scaling

- Use load balancer
- Multiple backend instances
- Database replication

### Vertical Scaling

- Upgrade server resources
- Optimize code
- Database sharding

## 🎯 Production Best Practices

1. **Monitoring**: Set up application monitoring (New Relic, Datadog)
2. **Logging**: Implement structured logging
3. **Backups**: Automated daily backups
4. **CI/CD**: Set up automated deployments
5. **Testing**: Implement automated tests
6. **Documentation**: Keep docs updated
7. **Security**: Regular security audits

## 📞 Support

For deployment issues:

- Check application logs
- Review environment variables
- Verify database connection
- Test API endpoints manually

---

**Congratulations!** 🎉 Your Restaurant Management System is now live in production!
