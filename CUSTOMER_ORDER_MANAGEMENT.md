# Customer Order Management System

## Overview

Customer orders from the public website are now integrated with the staff management system. Admin and Manager staff can view and manage all customer orders from a dedicated page.

## How It Works

### Customer Side (Public Website)

1. Customer browses menu at `/menu`
2. Adds items to cart
3. Proceeds to checkout at `/checkout`
4. Places order with delivery details
5. Views order history at `/customer-profile` (My Orders tab)

### Staff Side (Management System)

1. Admin/Manager logs into staff dashboard
2. Navigates to "Customer Orders" in sidebar
3. Views all customer orders with full details
4. Updates order status through workflow
5. Manages order fulfillment

## Staff Access

**Who Can Access**: Admin and Manager roles only

**Location**: Sidebar → "Customer Orders" or navigate to `/customer-orders`

## Order Status Workflow

### Status Progression

```
pending → confirmed → preparing → out_for_delivery → delivered
         ↓
      cancelled
```

### Status Actions by Staff

**Pending Orders**:

- ✅ Confirm Order (moves to "confirmed")
- ❌ Cancel Order (moves to "cancelled")

**Confirmed Orders**:

- 🍳 Start Preparing (moves to "preparing")

**Preparing Orders**:

- 🚗 Out for Delivery (moves to "out_for_delivery")

**Out for Delivery**:

- ✅ Mark as Delivered (moves to "delivered")

**Delivered/Cancelled**:

- No further actions (final states)

## Features

### Order Display

- Order number and timestamp
- Customer information (name, email, phone)
- Delivery address (street, city, state, ZIP)
- Order items with quantities and prices
- Price breakdown (subtotal, delivery fee, tax, total)
- Payment method and status
- Special notes from customer

### Filtering & Search

- **Search**: By order number, customer name, or email
- **Filter**: By status (all, pending, confirmed, preparing, out for delivery, delivered, cancelled)

### Statistics Dashboard

- Pending orders count
- Confirmed orders count
- Preparing orders count
- Out for delivery count

### Real-time Updates

- Status changes reflect immediately
- Orders sorted by newest first

## API Endpoints

### Staff Endpoints (Admin/Manager)

- `GET /api/customer-orders/all` - Get all customer orders
- `PUT /api/customer-orders/:id/status` - Update order status

### Customer Endpoints

- `POST /api/customers/orders` - Create new order
- `GET /api/customers/orders` - Get customer's orders
- `GET /api/customers/orders/:id` - Get single order
- `PUT /api/customers/orders/:id/cancel` - Cancel order (customer)

## Database Models

### CustomerOrder Model

```javascript
{
  orderNumber: "ORD1234567890",
  customer: ObjectId (ref: Customer),
  items: [{
    menuItem: ObjectId (ref: MenuItem),
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  contactPhone: String,
  subtotal: Number,
  deliveryFee: Number,
  tax: Number,
  total: Number,
  status: String (enum),
  paymentMethod: String,
  paymentStatus: String,
  notes: String,
  estimatedDeliveryTime: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## Integration Points

### Separate from In-Restaurant Orders

- Customer orders (online) → `CustomerOrder` collection
- In-restaurant orders → `Order` collection
- Different workflows and management pages

### Customer Stats Integration

When order is placed:

- Customer's `totalOrders` incremented
- Customer's `totalSpent` increased
- Customer's `loyaltyPoints` earned (1 point per dollar)

## Files Created/Modified

### Frontend

- `frontend/src/pages/CustomerOrderManagement.jsx` - Staff order management page
- `frontend/src/App.jsx` - Added `/customer-orders` route
- `frontend/src/components/Sidebar.jsx` - Added "Customer Orders" menu item

### Backend

- `backend/routes/customerOrderRoutes.js` - Updated with staff routes
- `backend/controllers/customerOrderController.js` - Added staff functions
- `backend/server.js` - Registered customer order routes

## Usage Instructions

### For Staff (Admin/Manager)

1. **View Orders**:
   - Login to staff dashboard
   - Click "Customer Orders" in sidebar
   - See all orders with current status

2. **Process New Order**:
   - Find pending order
   - Click "Confirm Order"
   - Order moves to confirmed status

3. **Start Preparation**:
   - Find confirmed order
   - Click "Start Preparing"
   - Kitchen can begin cooking

4. **Send for Delivery**:
   - Find preparing order
   - Click "Out for Delivery"
   - Driver can pick up order

5. **Complete Order**:
   - Find out for delivery order
   - Click "Mark as Delivered"
   - Order completed

6. **Cancel Order** (if needed):
   - Find pending order
   - Click "Cancel Order"
   - Customer will see cancelled status

### For Customers

1. **Track Order**:
   - Login to customer account
   - Go to "My Orders" tab
   - See current status of all orders

2. **Cancel Order** (before preparation):
   - Find pending/confirmed order
   - Click "Cancel Order"
   - Order cancelled immediately

## Benefits

✅ Centralized order management for staff
✅ Clear status workflow
✅ Real-time order tracking
✅ Customer self-service order history
✅ Separate from in-restaurant orders
✅ Role-based access control
✅ Search and filter capabilities
✅ Complete order details at a glance

## Next Steps (Optional Enhancements)

- Real-time notifications (Socket.io) when new orders arrive
- Email notifications to customers on status changes
- SMS notifications for delivery updates
- Print order receipts for kitchen
- Delivery driver assignment
- Order analytics and reporting
- Customer order rating system
