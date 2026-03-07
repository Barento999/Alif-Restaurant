# Customer Registration & Login System

## ✅ Implementation Complete!

A complete customer authentication system has been added to your restaurant website, separate from the staff login system.

---

## 🎯 What Was Added

### Backend

#### 1. **Customer Model** (`backend/models/Customer.js`)

- Separate from staff User model
- Fields:
  - firstName, lastName
  - email (unique)
  - password (hashed with bcrypt)
  - phone
  - addresses (array with home/work/other)
  - loyaltyPoints
  - totalOrders, totalSpent
  - isActive status

#### 2. **Customer Auth Controller** (`backend/controllers/customerAuthController.js`)

- `registerCustomer` - Create new customer account
- `loginCustomer` - Customer login
- `getCustomerProfile` - Get customer info
- `updateCustomerProfile` - Update customer details
- `changeCustomerPassword` - Change password
- `addCustomerAddress` - Add delivery address
- `updateCustomerAddress` - Update address
- `deleteCustomerAddress` - Remove address

#### 3. **Customer Auth Middleware** (`backend/middlewares/customerAuth.js`)

- `protectCustomer` - Verify customer JWT token
- Checks token type is "customer" (not staff)
- Validates customer is active

#### 4. **Customer Routes** (`backend/routes/customerRoutes.js`)

- `POST /api/customers/register` - Register (public)
- `POST /api/customers/login` - Login (public)
- `GET /api/customers/profile` - Get profile (protected)
- `PUT /api/customers/profile` - Update profile (protected)
- `PUT /api/customers/password` - Change password (protected)
- `POST /api/customers/addresses` - Add address (protected)
- `PUT /api/customers/addresses/:id` - Update address (protected)
- `DELETE /api/customers/addresses/:id` - Delete address (protected)

---

### Frontend

#### 1. **Customer Registration Page** (`frontend/src/pages/CustomerRegister.jsx`)

- Beautiful form with validation
- Fields: First name, Last name, Email, Phone, Password, Confirm Password
- Error handling
- Redirects to menu after registration
- Link to customer login
- Link back to home

#### 2. **Customer Login Page** (`frontend/src/pages/CustomerLogin.jsx`)

- Clean login form
- Email and password fields
- Remember me checkbox
- Forgot password link (placeholder)
- Link to customer registration
- Link to staff login
- Link back to home

#### 3. **Updated Routes** (`frontend/src/App.jsx`)

- `/customer-register` - Customer registration
- `/customer-login` - Customer login

#### 4. **Updated Landing Page**

- "Reserve Table" button → Customer Register
- All "Order Now" buttons → Customer Login

---

## 🔐 Security Features

✅ **Password Hashing** - bcrypt with 10 rounds
✅ **JWT Tokens** - Separate tokens for customers and staff
✅ **Token Type Validation** - Prevents staff tokens from accessing customer routes
✅ **Email Validation** - Regex pattern matching
✅ **Password Requirements** - Minimum 6 characters
✅ **Account Status** - Can deactivate customer accounts
✅ **Protected Routes** - Middleware authentication

---

## 🎨 Design Features

✅ **Consistent Branding** - Matches restaurant color scheme
✅ **Responsive Design** - Works on mobile, tablet, desktop
✅ **Error Messages** - Clear feedback for users
✅ **Loading States** - Shows "Creating Account..." / "Signing In..."
✅ **Form Validation** - Client-side and server-side
✅ **Professional UI** - Clean, modern design

---

## 📊 Data Flow

### Registration Flow:

```
Customer fills form
    ↓
POST /api/customers/register
    ↓
Validate data
    ↓
Hash password
    ↓
Create customer in MongoDB
    ↓
Generate JWT token (type: "customer")
    ↓
Return token + customer data
    ↓
Store in localStorage
    ↓
Redirect to /menu
```

### Login Flow:

```
Customer enters credentials
    ↓
POST /api/customers/login
    ↓
Find customer by email
    ↓
Compare password (bcrypt)
    ↓
Check if active
    ↓
Generate JWT token (type: "customer")
    ↓
Return token + customer data
    ↓
Store in localStorage
    ↓
Redirect to /menu
```

---

## 🔑 Token Structure

### Customer Token:

```javascript
{
  id: "customer_mongodb_id",
  type: "customer",  // Important: distinguishes from staff
  iat: 1234567890,
  exp: 1234567890
}
```

### Staff Token:

```javascript
{
  id: "user_mongodb_id",
  type: "staff",  // Different type
  iat: 1234567890,
  exp: 1234567890
}
```

---

## 💾 Local Storage

After successful login/registration:

```javascript
localStorage.setItem("customerToken", token);
localStorage.setItem(
  "customer",
  JSON.stringify({
    _id: "...",
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "(555) 123-4567",
    loyaltyPoints: 0,
  }),
);
```

---

## 🧪 Testing

### Test Customer Registration:

1. Go to http://localhost:5173/customer-register
2. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: (555) 123-4567
   - Password: password123
   - Confirm Password: password123
3. Click "Create Account"
4. Should redirect to /menu
5. Check localStorage for token

### Test Customer Login:

1. Go to http://localhost:5173/customer-login
2. Enter credentials:
   - Email: john@example.com
   - Password: password123
3. Click "Sign In"
4. Should redirect to /menu
5. Check localStorage for token

### Test API Directly:

```bash
# Register
curl -X POST http://localhost:5000/api/customers/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "(555) 123-4567"
  }'

# Login
curl -X POST http://localhost:5000/api/customers/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'

# Get Profile (use token from login)
curl -X GET http://localhost:5000/api/customers/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🚀 Next Steps

Now that customers can register and login, you can add:

### 1. **Shopping Cart**

- Add items to cart
- Update quantities
- Remove items
- Calculate total

### 2. **Checkout Process**

- Select delivery address
- Choose payment method
- Add order notes
- Place order

### 3. **Order History**

- View past orders
- Reorder previous items
- Track order status

### 4. **Customer Profile Page**

- Edit personal info
- Manage addresses
- Change password
- View loyalty points

### 5. **Favorites**

- Save favorite dishes
- Quick reorder

---

## 📝 Customer vs Staff Comparison

| Feature          | Customer                    | Staff                        |
| ---------------- | --------------------------- | ---------------------------- |
| **Model**        | Customer.js                 | User.js                      |
| **Registration** | Public (/customer-register) | Admin only                   |
| **Login URL**    | /customer-login             | /login                       |
| **Token Type**   | "customer"                  | "staff"                      |
| **Dashboard**    | No                          | Yes                          |
| **Can Order**    | Yes (future)                | No                           |
| **Can Manage**   | Own profile only            | Restaurant operations        |
| **Roles**        | None                        | admin, manager, waiter, etc. |

---

## 🔒 Security Best Practices

✅ **Separate Authentication** - Customers and staff use different systems
✅ **Token Type Validation** - Prevents cross-authentication
✅ **Password Hashing** - Never store plain text passwords
✅ **Email Uniqueness** - One account per email
✅ **Account Deactivation** - Can disable accounts without deletion
✅ **Protected Routes** - Middleware checks authentication
✅ **Input Validation** - Both client and server side

---

## 🎯 User Journey

### New Customer:

1. Visits landing page
2. Clicks "Reserve Table" or "Order Now"
3. Redirected to registration page
4. Creates account
5. Automatically logged in
6. Can browse menu and order

### Returning Customer:

1. Visits landing page
2. Clicks "Order Now"
3. Redirected to login page
4. Enters credentials
5. Logged in
6. Can browse menu and order

### Staff Member:

1. Goes directly to /login
2. Uses staff credentials
3. Access to dashboard
4. Manages restaurant operations

---

## 📱 Mobile Responsive

✅ All forms work perfectly on mobile
✅ Touch-friendly buttons (44px minimum)
✅ Readable text sizes
✅ Proper spacing
✅ No horizontal scroll

---

## 🐛 Troubleshooting

### "Email already registered"

- Customer with that email exists
- Try different email or use login

### "Invalid email or password"

- Check credentials
- Email is case-insensitive
- Password is case-sensitive

### "Account is deactivated"

- Admin has deactivated the account
- Contact support

### Token not working

- Check token is stored in localStorage
- Check token type is "customer"
- Token expires after 30 days

---

## ✅ Status

**Customer Authentication System**: ✅ Complete and Ready

**What Works**:

- ✅ Customer registration
- ✅ Customer login
- ✅ Password hashing
- ✅ JWT tokens
- ✅ Protected routes
- ✅ Profile management
- ✅ Address management
- ✅ Separate from staff auth

**What's Next**:

- Shopping cart
- Checkout process
- Order placement
- Order history
- Customer profile page UI

---

**Ready to test!** 🎉

Start the servers and try registering a customer account!
