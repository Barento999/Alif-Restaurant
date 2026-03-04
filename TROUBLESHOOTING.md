# 🔧 Troubleshooting Guide - RestaurantOS

Common issues and their solutions.

---

## 🚨 429 Too Many Requests Error

### Problem

```
Failed to load resource: the server responded with a status of 429 (Too Many Requests)
```

### Cause

The rate limiter is protecting your API from too many requests. This is a security feature.

### Solution

**For Development:**
The rate limit is now set to **1000 requests per 15 minutes** in development mode.

**If you still hit the limit:**

1. Wait 15 minutes for the limit to reset
2. Or restart the backend server:

```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

**For Production:**
Keep the limit at 100 requests per 15 minutes for security.

### Configuration

In `backend/server.js`:

```javascript
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 1000,
});
```

---

## 🔌 Backend Connection Issues

### Problem: "Cannot connect to backend"

**Check 1: Is backend running?**

```bash
# Should see: Server running on port 5000
# If not, start it:
cd backend
npm run dev
```

**Check 2: Correct port?**

- Backend should be on: http://localhost:5000
- Frontend should be on: http://localhost:5173

\*\*Check 3: CORS sennection Issues

### Problem: "MongoDB connection failed"

**Solution 1: Check connection string**

```bash
# In backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant_db
```

**Solution 2: Check MongoDB Atlas**

1. Go to MongoDB Atlas dashboard
2. Network Access → Add IP Address
3. Allow access from anywhere (0.0.0.0/0) for development

**Solution 3: Verify credentials**

- Username and password correct?
- Special characters in password? URL encode them
- Database name included in connection string?

---

## 🎨 Frontend Issues

### Problem: "Blank page" or "White screen"

**Check browser console:**

```
Right-click → Inspect → Console tab
```

**Common fixes:**

1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard refresh (Ctrl+Shift+R)
3. Check if frontend is running:

```bash
cd frontend
npm run dev
```

### Problem: "Module not found"

**Solution:**

```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## 🔐 Authentication Issues

### Problem: "Invalid token" or "Not authorized"

**Solution 1: Clear localStorage**

```javascript
// In browser console:
localStorage.clear();
// Then refresh page
```

**Solution 2: Check JWT_SECRET**

```bash
# In backend/.env
JWT_SECRET=your_secret_key_min_32_characters
```

**Solution 3: Re-login**

- Logout and login again
- Token might have expired (7 days default)

---

## 🔄 Real-Time Updates Not Working

### Problem: Socket.io not connecting

**Check 1: Backend Socket.io running**

```bash
# Should see in backend logs:
Client connected: [socket-id]
```

**Check 2: CORS configuration**
In `backend/server.js`:

```javascript
const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
});
```

**Check 3: Frontend connection**
In browser console, should see WebSocket connection.

---

## 📦 Installation Issues

### Problem: "npm install" fails

**Solution 1: Clear npm cache**

```bash
npm cache clean --force
npm install
```

**Solution 2: Use different registry**

```bash
npm config set registry https://registry.npmjs.org/
npm install
```

**Solution 3: Check Node version**

```bash
node --version  # Should be v16 or higher
npm --version   # Should be v8 or higher
```

---

## 🚀 Deployment Issues

### Problem: "Build fails"

**Frontend build:**

```bash
cd frontend
npm run build
# Check for errors in output
```

**Backend:**

```bash
cd backend
npm start
# Should start without errors
```

### Problem: "Environment variables not working"

**Check:**

1. `.env` file exists in backend folder
2. Variables don't have quotes: `PORT=5000` not `PORT="5000"`
3. Restart server after changing .env
4. In production, set env vars in hosting platform

---

## 🎯 Common Errors

### Error: "Port already in use"

**Solution:**

```bash
# Windows
netstat -ano | findstr :5000
taskkill /F /PID [PID_NUMBER]

# Mac/Linux
lsof -i :5000
kill -9 [PID_NUMBER]
```

### Error: "EADDRINUSE"

Same as above - port is already in use.

### Error: "Cannot find module"

**Solution:**

```bash
npm install
# Or for specific module:
npm install [module-name]
```

### Error: "Unexpected token"

**Cause:** Syntax error in code

**Solution:**

1. Check the file mentioned in error
2. Look for missing brackets, commas, semicolons
3. Check for typos

---

## 🔍 Debugging Tips

### Enable Detailed Logging

**Backend:**

```javascript
// In server.js, add:
app.use((req, res, next) => {
  console.log(`${req.methttings**
In `backend/.env`:

```

CLIENT_URL=http://localhost:5173

```

---

## 🗄️ Database Co
```
