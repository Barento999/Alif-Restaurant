# Promo Code System Guide

## Overview

The promo code system allows you to create and manage promotional offers that customers can apply during checkout.

## Backend Setup

### 1. Seed Initial Promos

Run this command to add the default promos (WELCOME20 and FREEDEL30):

```bash
cd backend
node seeds/seedPromos.js
```

### 2. API Endpoints

**Public Routes:**

- `GET /api/promos/active` - Get all active promos (displayed on landing page)

**Customer Routes (requires authentication):**

- `POST /api/promos/validate` - Validate a promo code
  ```json
  {
    "code": "WELCOME20",
    "orderAmount": 50
  }
  ```

**Admin Routes (requires staff authentication):**

- `GET /api/promos` - Get all promos
- `POST /api/promos` - Create new promo
- `PUT /api/promos/:id` - Update promo
- `DELETE /api/promos/:id` - Delete promo

### 3. Promo Model Fields

```javascript
{
  code: "WELCOME20",           // Unique promo code
  title: "20% OFF First Order", // Display title
  description: "...",           // Description
  type: "percentage",           // percentage | fixed | free_delivery
  value: 20,                    // Discount value (20 for 20%, or dollar amount)
  minOrderAmount: 0,            // Minimum order required
  maxDiscount: 50,              // Maximum discount cap (optional)
  startDate: Date,              // When promo starts
  endDate: Date,                // When promo expires
  usageLimit: null,             // Max uses (null = unlimited)
  usageCount: 0,                // Current usage count
  isActive: true,               // Enable/disable promo
  applicableFor: "first_order"  // all | first_order | returning
}
```

## Frontend Integration

### 1. Landing Page

The Special Offers section automatically fetches and displays active promos from the backend.

### 2. Checkout Integration (Next Step)

To integrate promo codes at checkout:

1. Add promo code input field in Checkout.jsx
2. Call `/api/promos/validate` when customer enters a code
3. Apply discount to order total
4. Store promo ID with the order
5. Increment usage count when order is placed

### 3. Example Checkout Integration

```javascript
const [promoCode, setPromoCode] = useState("");
const [appliedPromo, setAppliedPromo] = useState(null);

const applyPromoCode = async () => {
  try {
    const response = await axios.post(
      "/api/promos/validate",
      {
        code: promoCode,
        orderAmount: totalAmount,
      },
      {
        headers: { Authorization: `Bearer ${customerToken}` },
      },
    );

    if (response.data.success) {
      setAppliedPromo(response.data.data);
      // Apply discount to total
    }
  } catch (error) {
    // Show error message
  }
};
```

## Creating New Promos

### Via API (Postman/Admin Panel):

```json
POST /api/promos
{
  "code": "SUMMER25",
  "title": "Summer Sale - 25% OFF",
  "description": "Get 25% off all orders this summer",
  "type": "percentage",
  "value": 25,
  "minOrderAmount": 20,
  "maxDiscount": 100,
  "startDate": "2024-06-01",
  "endDate": "2024-08-31",
  "usageLimit": 1000,
  "isActive": true,
  "applicableFor": "all"
}
```

## Promo Types

1. **Percentage Discount**
   - `type: "percentage"`
   - `value: 20` (for 20% off)
   - Respects `maxDiscount` cap

2. **Fixed Amount Discount**
   - `type: "fixed"`
   - `value: 10` (for $10 off)

3. **Free Delivery**
   - `type: "free_delivery"`
   - `value: 0`
   - Waives delivery fee

## Next Steps

1. ✅ Backend promo system created
2. ✅ Landing page displays active promos
3. ⏳ Add promo code input to Checkout page
4. ⏳ Integrate promo validation in checkout flow
5. ⏳ Update CustomerOrder model to store promo info
6. ⏳ Create admin panel for promo management

## Testing

1. Seed the promos: `node backend/seeds/seedPromos.js`
2. Visit landing page - should see 2 promo cards
3. Test API endpoints with Postman
4. Verify promo validation logic
