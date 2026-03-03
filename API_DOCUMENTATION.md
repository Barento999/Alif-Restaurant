# 📚 API Documentation - RestaurantOS

Complete API reference for the Restaurant Management System.

## Base URL

```
Development: http://localhost:5000/api
Production: https://your-backend-url.com/api
```

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Login

```http
POST /auth/login
```

**Request Body:**

```json
{
  "email": "admin@rms.com",
  "password": "admin123"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "Admin User",
      "email": "admin@rms.com",
      "role": "admin"
    }
  }
}
```

### Register User (Admin Only)

```http
POST /auth/register
```

**Headers:**

```
Authorization: Bearer <admin_token>
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@rms.com",
  "password": "password123",
  "role": "waiter"
}
```

### Get Current User

```http
GET /auth/me
```

**Headers:**

```
Authorization: Bearer <token>
```

---

## 🍽️ Menu Endpoints

### Get All Menu Items

```http
GET /menu
```

**Query Parameters:**

- `category` (optional): Filter by category ID
- `search` (optional): Search by name

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Caesar Salad",
      "category": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Appetizers"
      },
      "price": 8.99,
      "description": "Fresh romaine lettuce...",
      "isAvailable": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Menu Item (Admin/Manager)

```http
POST /menu
```

**Request Body:**

```json
{
  "name": "Grilled Salmon",
  "category": "507f1f77bcf86cd799439012",
  "price": 24.99,
  "description": "Fresh Atlantic salmon",
  "isAvailable": true,
  "ingredients": ["salmon", "lemon", "herbs"]
}
```

### Update Menu Item (Admin/Manager)

```http
PUT /menu/:id
```

### Delete Menu Item (Admin/Manager)

```http
DELETE /menu/:id
```

---

## 📋 Order Endpoints

### Get All Orders

```http
GET /orders
```

**Query Parameters:**

- `status` (optional): Filter by status (pending, preparing, ready, served, paid)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "orderNumber": "ORD-1704067200000",
      "table": {
        "_id": "507f1f77bcf86cd799439012",
        "tableNumber": "T1"
      },
      "waiter": {
        "_id": "507f1f77bcf86cd799439013",
        "name": "John Waiter"
      },
      "items": [
        {
          "menuItem": {
            "_id": "507f1f77bcf86cd799439014",
            "name": "Caesar Salad"
          },
          "quantity": 2,
          "price": 8.99
        }
      ],
      "subtotal": 17.98,
      "tax": 1.8,
      "total": 19.78,
      "status": "pending",
      "notes": "No croutons",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Order

```http
POST /orders
```

**Request Body:**

```json
{
  "table": "507f1f77bcf86cd799439012",
  "items": [
    {
      "menuItem": "507f1f77bcf86cd799439014",
      "quantity": 2,
      "price": 8.99
    }
  ],
  "notes": "No croutons"
}
```

### Update Order Status

```http
PATCH /orders/:id/status
```

**Request Body:**

```json
{
  "status": "preparing"
}
```

**Status Flow:**

```
pending → preparing → ready → served → paid
```

---

## 🪑 Table Endpoints

### Get All Tables

```http
GET /tables
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "tableNumber": "T1",
      "capacity": 4,
      "status": "available",
      "location": "Main Hall",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Table (Admin/Manager)

```http
POST /tables
```

**Request Body:**

```json
{
  "tableNumber": "T5",
  "capacity": 6,
  "location": "Patio"
}
```

### Update Table (Admin/Manager)

```http
PUT /tables/:id
```

### Delete Table (Admin/Manager)

```http
DELETE /tables/:id
```

---

## 📦 Inventory Endpoints

### Get All Inventory Items

```http
GET /inventory
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Tomatoes",
      "quantity": 50,
      "unit": "kg",
      "lowStockThreshold": 10,
      "category": "Vegetables",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Create Inventory Item (Admin/Manager)

```http
POST /inventory
```

**Request Body:**

```json
{
  "name": "Chicken Breast",
  "quantity": 100,
  "unit": "kg",
  "lowStockThreshold": 20,
  "category": "Meat"
}
```

### Update Inventory Item (Admin/Manager)

```http
PUT /inventory/:id
```

---

## 📊 Report Endpoints

### Get Daily Report (Admin/Manager)

```http
GET /reports/daily
```

**Response:**

```json
{
  "success": true,
  "data": {
    "date": "2024-01-01T00:00:00.000Z",
    "totalOrders": 45,
    "revenue": 1250.5
  }
}
```

### Get Monthly Report (Admin/Manager)

```http
GET /reports/monthly
```

**Response:**

```json
{
  "success": true,
  "data": {
    "month": "2024-01-01T00:00:00.000Z",
    "totalOrders": 1350,
    "revenue": 38750.25
  }
}
```

### Get Best Sellers (Admin/Manager)

```http
GET /reports/best-sellers
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "item": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Caesar Salad"
      },
      "totalQuantity": 150,
      "totalRevenue": 1348.5
    }
  ]
}
```

---

## 👥 User Endpoints

### Get All Users (Admin Only)

```http
GET /users
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@rms.com",
      "role": "waiter",
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Update User (Admin Only)

```http
PUT /users/:id
```

**Request Body:**

```json
{
  "isActive": false
}
```

---

## 📂 Category Endpoints

### Get All Categories

```http
GET /categories
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Appetizers",
      "description": "Starters and small bites",
      "isActive": true
    }
  ]
}
```

---

## 💳 Payment Endpoints

### Create Payment

```http
POST /payments
```

**Request Body:**

```json
{
  "order": "507f1f77bcf86cd799439011",
  "amount": 19.78,
  "method": "card"
}
```

**Payment Methods:**

- `cash`
- `card`
- `mobile`

### Get All Payments

```http
GET /payments
```

---

## 🔌 WebSocket Events

### Connect to Socket.io

```javascript
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");
```

### Events

#### New Order

```javascript
socket.on("newOrder", (order) => {
  console.log("New order received:", order);
});
```

#### Order Status Update

```javascript
socket.on("orderStatusUpdate", (order) => {
  console.log("Order status updated:", order);
});
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Not authorized"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Access denied"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Server Error

```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## 🔑 Role Permissions

| Endpoint                 | Admin | Manager | Cashier | Waiter | Kitchen |
| ------------------------ | ----- | ------- | ------- | ------ | ------- |
| POST /auth/register      | ✅    | ✅      | ❌      | ❌     | ❌      |
| GET /menu                | ✅    | ✅      | ✅      | ✅     | ✅      |
| POST /menu               | ✅    | ✅      | ❌      | ❌     | ❌      |
| POST /orders             | ✅    | ✅      | ✅      | ✅     | ❌      |
| PATCH /orders/:id/status | ✅    | ✅      | ✅      | ✅     | ✅      |
| GET /reports/\*          | ✅    | ✅      | ❌      | ❌     | ❌      |
| GET /users               | ✅    | ❌      | ❌      | ❌     | ❌      |

---

## 📝 Rate Limiting

- **Window**: 15 minutes
- **Max Requests**: 100 per window
- **Applies to**: All /api/\* routes

---

## 🧪 Testing with cURL

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@rms.com","password":"admin123"}'
```

### Get Menu (with auth)

```bash
curl -X GET http://localhost:5000/api/menu \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Create Order

```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "table": "TABLE_ID",
    "items": [{"menuItem": "ITEM_ID", "quantity": 2, "price": 8.99}]
  }'
```

---

## 📚 Additional Resources

- [Postman Collection](./postman_collection.json) - Import for easy testing
- [API Changelog](./CHANGELOG.md) - Version history
- [Contributing Guide](./CONTRIBUTING.md) - How to contribute

---

**Need Help?** Open an issue on GitHub or contact support.
