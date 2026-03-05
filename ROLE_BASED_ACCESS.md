# Role-Based Access Control (RBAC) Documentation

## Overview

The Restaurant Management System implements comprehensive role-based access control across all features, ensuring users only see and access functionality appropriate to their role.

## User Roles

### 1. Admin

**Full System Access** - Complete control over all features

**Dashboard Access:**

- ✅ Today's Revenue (with percentage change)
- ✅ Today's Orders (with percentage change)
- ✅ Pending Orders
- ✅ Table Occupancy
- ✅ Low Stock Items Alert
- ✅ Weekly Revenue Chart
- ✅ Orders Trend Chart
- ✅ Top Selling Items
- ✅ Recent Orders (all columns including financials)
- ✅ Performance Summary Cards
- ✅ Table Status Grid

**Quick Actions:**

- New Order (POS)
- Kitchen Screen
- Tables Management
- Menu Management
- Inventory Management
- Reports & Analytics
- User Management

---

### 2. Manager

**Business Management Access** - All operational features except user management

**Dashboard Access:**

- ✅ Today's Revenue (with percentage change)
- ✅ Today's Orders (with percentage change)
- ✅ Pending Orders
- ✅ Table Occupancy
- ✅ Low Stock Items Alert
- ✅ Weekly Revenue Chart
- ✅ Orders Trend Chart
- ✅ Top Selling Items
- ✅ Recent Orders (all columns including financials)
- ✅ Performance Summary Cards
- ✅ Table Status Grid

**Quick Actions:**

- New Order (POS)
- Tables Management
- Menu Management
- Inventory Management
- Reports & Analytics

---

### 3. Cashier

**Order & Payment Processing** - Focus on transactions

**Dashboard Access:**

- ❌ Today's Revenue (hidden)
- ✅ Today's Orders
- ✅ Pending Orders
- ✅ Table Occupancy
- ❌ Low Stock Items (hidden)
- ❌ Weekly Revenue Chart (hidden)
- ❌ Orders Trend Chart (hidden)
- ❌ Top Selling Items (hidden)
- ✅ Recent Orders (without financial details)
- ❌ Performance Summary (hidden)
- ✅ Table Status Grid

**Quick Actions:**

- New Order (POS)
- Tables View
- Payment Processing

---

### 4. Waiter

**Service & Order Management** - Customer-facing operations

**Dashboard Access:**

- ❌ Today's Revenue (hidden)
- ✅ Today's Orders
- ✅ Pending Orders
- ✅ Table Occupancy
- ❌ Low Stock Items (hidden)
- ❌ Weekly Revenue Chart (hidden)
- ❌ Orders Trend Chart (hidden)
- ❌ Top Selling Items (hidden)
- ✅ Recent Orders (without financial details)
- ❌ Performance Summary (hidden)
- ✅ Table Status Grid

**Quick Actions:**

- New Order (POS)
- Tables Management
- My Orders (assigned to them)

---

### 5. Kitchen

**Food Preparation** - Kitchen operations only

**Dashboard Access:**

- ❌ Today's Revenue (hidden)
- ✅ Orders to Prepare (relabeled)
- ✅ In Kitchen (relabeled pending orders)
- ❌ Table Occupancy (hidden)
- ❌ Low Stock Items (hidden)
- ❌ Weekly Revenue Chart (hidden)
- ❌ Orders Trend Chart (hidden)
- ❌ Top Selling Items (hidden)
- ✅ Kitchen Orders (filtered for preparation)
- ❌ Performance Summary (hidden)
- ❌ Table Status (hidden)

**Quick Actions:**

- Kitchen Screen

---

## Permission Matrix

| Feature              | Admin | Manager | Cashier | Waiter | Kitchen |
| -------------------- | ----- | ------- | ------- | ------ | ------- |
| **Financial Data**   |
| Revenue Stats        | ✅    | ✅      | ❌      | ❌     | ❌      |
| Revenue Charts       | ✅    | ✅      | ❌      | ❌     | ❌      |
| Order Totals         | ✅    | ✅      | ❌      | ❌     | ❌      |
| Performance Summary  | ✅    | ✅      | ❌      | ❌     | ❌      |
| **Operations**       |
| Order Management     | ✅    | ✅      | ✅      | ✅     | ✅      |
| Table Management     | ✅    | ✅      | ✅      | ✅     | ❌      |
| POS Access           | ✅    | ✅      | ✅      | ✅     | ❌      |
| Kitchen Screen       | ✅    | ❌      | ❌      | ❌     | ✅      |
| **Inventory**        |
| Stock Levels         | ✅    | ✅      | ❌      | ❌     | ❌      |
| Low Stock Alerts     | ✅    | ✅      | ❌      | ❌     | ❌      |
| Inventory Management | ✅    | ✅      | ❌      | ❌     | ❌      |
| **Analytics**        |
| Reports              | ✅    | ✅      | ❌      | ❌     | ❌      |
| Best Sellers         | ✅    | ✅      | ❌      | ❌     | ❌      |
| Weekly Trends        | ✅    | ✅      | ❌      | ❌     | ❌      |
| **Administration**   |
| User Management      | ✅    | ❌      | ❌      | ❌     | ❌      |
| Menu Management      | ✅    | ✅      | ❌      | ❌     | ❌      |
| System Settings      | ✅    | ❌      | ❌      | ❌     | ❌      |

---

## Implementation Details

### Frontend Access Control

```javascript
// Role-based permissions
const role = user?.role;
const canAccessReports = ["admin", "manager"].includes(role);
const canAccessInventory = ["admin", "manager"].includes(role);
const canAccessTables = ["admin", "manager", "waiter", "cashier"].includes(
  role,
);
const canAccessFinancials = ["admin", "manager"].includes(role);
```

### Backend API Protection

All sensitive endpoints are protected with role-based middleware:

```javascript
// Example: Reports endpoint
router.get(
  "/reports/dashboard",
  protect,
  authorize("admin", "manager"),
  getDashboardStats,
);
```

### Dynamic UI Rendering

- Components conditionally render based on user role
- API calls are only made for data the user can access
- Navigation and quick actions adapt to role permissions
- Table columns hide financial data for non-authorized roles

---

## Security Features

1. **Backend Authorization**: All API endpoints verify user roles
2. **Frontend Validation**: UI elements hidden for unauthorized roles
3. **Data Filtering**: Responses filtered based on role permissions
4. **Session Management**: Role verified on every request
5. **Audit Trail**: All actions logged with user role information

---

## Testing Role-Based Access

### Test Users (from seed data):

- **Admin**: admin@restaurant.com / admin123
- **Manager**: manager@restaurant.com / manager123
- **Cashier**: cashier@restaurant.com / cashier123
- **Waiter**: waiter@restaurant.com / waiter123
- **Kitchen**: kitchen@restaurant.com / kitchen123

### Verification Steps:

1. Login with different role accounts
2. Verify dashboard shows appropriate content
3. Check quick actions match role permissions
4. Attempt to access restricted endpoints (should fail)
5. Verify financial data visibility

---

## Best Practices

1. **Always check permissions** on both frontend and backend
2. **Never expose sensitive data** in API responses for unauthorized roles
3. **Log access attempts** for security auditing
4. **Update permissions** when role requirements change
5. **Test thoroughly** with each role type

---

## Future Enhancements

- [ ] Custom role creation
- [ ] Granular permission settings
- [ ] Role-based notifications
- [ ] Activity logs per role
- [ ] Permission inheritance
- [ ] Temporary role elevation
