# 🚀 Quick Start Guide - RestaurantOS

Get your Restaurant Management System up and running in 5 minutes!

## ⚡ Prerequisites

Make sure you have these installed:

- Node.js (v16 or higher) - [Download](https://nodejs.org/)
- MongoDB Atlas account - [Sign up free](https://www.mongodb.com/cloud/atlas)
- Git - [Download](https://git-scm.com/)

## 📥 Installation

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Modern-RMS

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Backend

```bash
# In the backend folder
cd backend

# Copy environment file
cp .env.example .env

# Edit .env with your details
# Update MONGODB_URI with your MongoDB Atlas connection string
```

Your `.env` should look like:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/restaurant_db
JWT_SECRET=your_super_secret_key_min_32_characters_long
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Step 3: Seed Database

```bash
# Still in backend folder
npm run seed
```

You should see:

```
Connected to MongoDB
Seed data created successfully
```

### Step 4: Start Backend

```bash
# In backend folder
npm run dev
```

You should see:

```
Server running on port 5000
MongoDB Connected: cluster0.xxxxx.mongodb.net
```

### Step 5: Start Frontend

Open a NEW terminal:

```bash
# In frontend folder
cd frontend
npm run dev
```

You should see:

```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

## 🎉 You're Ready!

Open your browser and go to: **http://localhost:5173**

## 👤 Login Credentials

Use these demo accounts:

| Role        | Email           | Password   | Access Level          |
| ----------- | --------------- | ---------- | --------------------- |
| **Admin**   | admin@rms.com   | admin123   | Full system access    |
| **Manager** | manager@rms.com | manager123 | Operations management |
| **Waiter**  | waiter@rms.com  | waiter123  | Order taking          |
| **Kitchen** | kitchen@rms.com | kitchen123 | Order preparation     |

## 🎯 What to Try First

### As Admin:

1. **Dashboard** - View overall statistics
2. **Menu Management** - Add/edit menu items
3. **Table Management** - Create tables
4. **User Management** - Create staff accounts
5. **Reports** - View analytics and charts

### As Waiter:

1. **POS Screen** - Create a new order
2. **Dashboard** - View your statistics

### As Kitchen Staff:

1. **Kitchen Dashboard** - See live orders
2. Update order status (Pending → Preparing → Ready)

## 🔧 Troubleshooting

### Backend won't start?

```bash
# Check if MongoDB connection string is correct
# Check if port 5000 is available
netstat -ano | findstr :5000  # Windows
lsof -i :5000                  # Mac/Linux

# If port is in use, kill the process or change PORT in .env
```

### Frontend won't start?

```bash
# Check if port 5173 is available
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Can't connect to MongoDB?

1. Check your MongoDB Atlas connection string
2. Verify your IP is whitelisted in MongoDB Atlas
3. Check username and password are correct
4. Ensure database name is included in connection string

### CORS errors?

1. Make sure CLIENT_URL in backend .env matches frontend URL
2. Restart backend server after changing .env

## 📱 Testing the System

### Test Order Flow:

1. Login as **Waiter** (waiter@rms.com / waiter123)
2. Go to **POS Screen**
3. Select a table
4. Add items to cart
5. Place order
6. Logout

7. Login as **Kitchen** (kitchen@rms.com / kitchen123)
8. Go to **Kitchen Dashboard**
9. See your order appear in real-time!
10. Click "Start Cooking"
11. Click "Mark Ready"

### Test Reports:

1. Login as **Admin** (admin@rms.com / admin123)
2. Go to **Reports**
3. View daily/monthly statistics
4. See best-selling items chart

## 🌐 Access URLs

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/api/health

## 📚 Next Steps

1. **Customize**: Edit menu items, add your restaurant's data
2. **Explore**: Try all features with different user roles
3. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md) to go live
4. **Learn**: Read [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🆘 Need Help?

- Check [README.md](./README.md) for detailed documentation
- Review [FEATURES.md](./FEATURES.md) for complete feature list
- See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for API reference
- Open an issue on GitHub

## 🎨 Customization Tips

### Change Colors:

Edit `frontend/tailwind.config.js` to customize the color scheme

### Add Logo:

Replace logo in `frontend/src/components/Layout.jsx`

### Modify Tax Rate:

Edit tax calculation in `backend/controllers/orderController.js`

### Add Menu Categories:

Use the seed script or add via MongoDB directly

## ⚙️ Development Commands

### Backend:

```bash
npm run dev      # Start with nodemon (auto-restart)
npm start        # Start production server
npm run seed     # Seed database with sample data
```

### Frontend:

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🔐 Security Notes

⚠️ **Important for Production:**

1. Change JWT_SECRET to a strong random string
2. Use environment-specific .env files
3. Enable MongoDB Atlas IP whitelist
4. Use HTTPS in production
5. Never commit .env files to Git

## 📊 System Requirements

**Minimum:**

- 2GB RAM
- 1 CPU core
- 10GB storage

**Recommended:**

- 4GB RAM
- 2 CPU cores
- 20GB storage

## 🎯 Performance Tips

1. **Database**: Create indexes for frequently queried fields
2. **Frontend**: Enable code splitting and lazy loading
3. **Backend**: Implement caching with Redis
4. **Network**: Use CDN for static assets

## ✅ Verification Checklist

After setup, verify:

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Can login with demo accounts
- [ ] Can create orders
- [ ] Real-time updates working
- [ ] Reports showing data
- [ ] All pages accessible

## 🎊 Success!

You now have a fully functional Restaurant Management System!

**Enjoy using RestaurantOS! 🍽️**

---

**Pro Tip**: Keep both terminal windows open while developing. The backend and frontend will auto-reload when you make changes!
