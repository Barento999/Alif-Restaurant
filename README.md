# 🍽️ Alif Restaurant - Full Stack Application

A full-stack, production-ready restaurant application built with the MERN stack featuring online ordering, table reservations, real-time kitchen updates, POS system, inventory management, and comprehensive staff management tools.

## ✨ Features

### Core Functionality

- **Role-Based Access Control (RBAC)**: Admin, Manager, Cashier, Waiter, Kitchen Staff
- **Real-Time Kitchen Dashboard**: Live order updates via Socket.io
- **Point of Sale (POS) System**: Complete order creation and management
- **Menu Management**: Full CRUD operations for menu items and categories
- **Table Management**: Track table status (Available, Occupied, Reserved)
- **Inventory Management**: Stock tracking with low-stock alerts
- **User Management**: Admin can create and manage staff accounts
- **Reports & Analytics**: Daily/monthly revenue, best-selling items
- **Responsive Dark Mode UI**: Modern, accessible interface

### Technical Features

- JWT Authentication with bcrypt password hashing
- RESTful API architecture
- MongoDB with proper indexing and validation
- Real-time updates using Socket.io
- Redux Toolkit for state management
- Tailwind CSS for styling
- Rate limiting and CORS protection

## 🛠️ Tech Stack

### Frontend

- React 18 with Vite
- Redux Toolkit
- React Router v6
- Axios
- Tailwind CSS
- Socket.io Client

### Backend

- Node.js & Express.js
- MongoDB with Mongoose ODM
- JWT Authentication
- Socket.io
- bcryptjs
- Express Rate Limit

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Modern-RMS
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Seed the database with initial data:

```bash
npm run seed
```

Start the backend server:

```bash
npm run dev
```

Backend will run on http://localhost:5000

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:5173

## 👥 Default User Accounts

After running the seed script, you can login with:

| Role    | Email           | Password   |
| ------- | --------------- | ---------- |
| Admin   | admin@rms.com   | admin123   |
| Manager | manager@rms.com | manager123 |
| Waiter  | waiter@rms.com  | waiter123  |
| Kitchen | kitchen@rms.com | kitchen123 |

## 📱 Application Pages

### Public

- **Login Page**: Authentication for all users

### Protected Routes

#### All Authenticated Users

- **Dashboard**: Overview with statistics and quick actions

#### Admin, Manager, Cashier, Waiter

- **POS Screen**: Create and manage orders

#### Admin, Kitchen Staff

- **Kitchen Screen**: View and update order status in real-time

#### Admin, Manager

- **Menu Management**: Add, edit, delete menu items
- **Table Management**: Manage restaurant tables
- **Inventory Management**: Track stock levels
- **Reports**: View analytics and statistics

#### Admin Only

- **User Management**: Create and manage staff accounts

## 🔌 API Endpoints

### Authentication

```
POST   /api/auth/login          - User login
POST   /api/auth/register       - Register new user (Admin only)
GET    /api/auth/me             - Get current user
```

### Menu

```
GET    /api/menu                - Get all menu items
POST   /api/menu                - Create menu item
PUT    /api/menu/:id            - Update menu item
DELETE /api/menu/:id            - Delete menu item
```

### Orders

```
GET    /api/orders              - Get all orders
POST   /api/orders              - Create new order
PATCH  /api/orders/:id/status   - Update order status
```

### Tables

```
GET    /api/tables              - Get all tables
POST   /api/tables              - Create table
PUT    /api/tables/:id          - Update table
DELETE /api/tables/:id          - Delete table
```

### Inventory

```
GET    /api/inventory           - Get inventory items
POST   /api/inventory           - Add inventory item
PUT    /api/inventory/:id       - Update inventory item
```

### Reports

```
GET    /api/reports/daily       - Get daily report
GET    /api/reports/monthly     - Get monthly report
GET    /api/reports/best-sellers - Get best-selling items
```

### Users

```
GET    /api/users               - Get all users (Admin only)
PUT    /api/users/:id           - Update user (Admin only)
```

## 🗄️ Database Schema

### Collections

- **users**: Staff accounts with roles
- **categories**: Menu categories
- **menuItems**: Restaurant menu items
- **tables**: Restaurant tables
- **orders**: Customer orders
- **payments**: Payment records
- **inventory**: Stock items

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based middleware protection
- Rate limiting on API routes
- CORS configuration
- Input validation
- NoSQL injection prevention

## 🌐 Deployment

### Backend (Render/Railway)

1. Create new web service
2. Connect your repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Set environment variables if needed

### Database (MongoDB Atlas)

1. Create a cluster
2. Get connection string
3. Update MONGODB_URI in backend .env

## 📊 Order Workflow

```
Pending → Preparing → Ready → Served → Paid
```

- **Pending**: Order just created
- **Preparing**: Kitchen is working on it
- **Ready**: Food is ready for serving
- **Served**: Delivered to customer
- **Paid**: Payment completed, table freed

## 🎨 UI Features

- Fully responsive design
- Dark mode support
- Modern gradient cards
- Real-time updates
- Loading states
- Error handling
- Toast notifications

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev  # Runs with nodemon for auto-restart
```

### Frontend Development

```bash
cd frontend
npm run dev  # Runs with Vite HMR
```

### Database Seeding

```bash
cd backend
npm run seed  # Populates database with sample data
```

## 📝 Project Structure

```
Modern-RMS/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── middlewares/     # Auth & error handling
│   ├── seeds/           # Database seeding
│   ├── utils/           # Helper functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── features/    # Redux slices
│   │   ├── services/    # API services
│   │   ├── store/       # Redux store
│   │   └── App.jsx      # Main app component
│   └── index.html
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🐛 Known Issues

None at the moment. Please report any bugs you find!

## 📞 Support

For issues and questions, please open an issue on GitHub.

## 🎯 Future Enhancements

- [ ] QR code table ordering
- [ ] Multi-branch support
- [ ] Printable receipts
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Customer loyalty program
- [ ] Online ordering integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)

---

Built with ❤️ using the MERN Stack
