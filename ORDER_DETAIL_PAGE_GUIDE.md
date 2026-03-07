# Order Detail Page - Feature Guide

## Overview

The Order Detail Page provides a comprehensive, dedicated view for a single order with all its information, timeline, actions, and history. This standalone page offers a clean, printable interface for viewing complete order details.

## Access

**Route**: `/orders/:orderId`
**Roles**: Admin, Manager, Waiter
**Example**: `/orders/507f1f77bcf86cd799439011`

## Features Implemented

### 1. Comprehensive Order Information

**File**: `frontend/src/pages/OrderDetail.jsx`

**Header Section**:

- Order number with priority badge (🔥 URGENT or ⚡ HIGH)
- Current status with color-coded badge
- Creation timestamp
- Back button for easy navigation
- Print and refresh buttons

**Key Metrics Grid**:

- Table number and capacity
- Assigned waiter with email
- Total item count
- Order total amount

### 2. Detailed Order Items Display

**Features**:

- Item images (if available)
- Item name and price
- Quantity and subtotal
- Ingredient list with badges
- Hover effects for better UX

**Totals Breakdown**:

- Subtotal
- Tax (10%)
- Discount (if applicable)
- Grand total (highlighted in brand color)

### 3. Status Timeline

**Visual Timeline**:

- Chronological display of all status changes
- Current status highlighted with green indicator
- Timestamps for each status
- Duration calculation between statuses
- Active status shows time elapsed

**Timeline Features**:

- Vertical line connecting statuses
- Circular indicators (filled for current, gray for past)
- Ring animation on current status
- Duration display (e.g., "15m", "1h 30m")

### 4. Special Instructions & Notes

**Display**:

- Yellow highlighted box for visibility
- Icon indicator
- Full note text
- Only shown if notes exist

### 5. Modification History

**Tracking**:

- Who modified the order
- When modification occurred
- Previous vs new total
- Item count changes
- Blue highlighted boxes for each modification

**Information Shown**:

- Modifier name
- Modification timestamp
- Total change (red → green)
- Item count change

### 6. Quick Actions Panel

**Available Actions**:

- **Update Status**: Change order status (if valid transitions exist)
- **Manage Order**: Navigate to Order Management with this order
- **View Table Map**: Jump to table map view

**Status Update Modal**:

- Shows current status
- Dropdown with valid next statuses only
- Respects status workflow rules
- Confirmation buttons

### 7. Order Metadata

**Information Box**:

- Full order ID (MongoDB ObjectId)
- Creation timestamp
- Last updated timestamp
- Table location (if available)

### 8. Print Functionality

**Print-Optimized Layout**:

- Clean, professional print view
- Hides navigation and action buttons
- Preserves all order information
- Optimized for paper size
- Print button in header

### 9. Error Handling

**Scenarios Covered**:

- Order not found (404)
- Network errors
- Permission errors
- Loading states

**Error Display**:

- Friendly error message
- Icon indicator
- Back to orders button
- Clear explanation

## Layout Structure

### Two-Column Grid

```
┌─────────────────────────────────────────────────────┐
│ Header (Back, Title, Print, Refresh)                │
├──────────────────────────────┬──────────────────────┤
│ Left Column (2/3 width)      │ Right Column (1/3)   │
│                              │                      │
│ • Order Header Card          │ • Status Timeline    │
│ • Order Items List           │ • Quick Actions      │
│ • Special Instructions       │ • Order Metadata     │
│ • Modification History       │                      │
└──────────────────────────────┴──────────────────────┘
```

### Responsive Design

- **Desktop**: Two-column layout
- **Tablet**: Two-column layout (narrower)
- **Mobile**: Single column (stacked)

## Visual Design

### Color Scheme

- **Primary Green** (#0d5f4e): Actions, totals, current status
- **Status Colors**:
  - Pending: Yellow
  - Preparing: Blue
  - Ready: Green
  - Served: Purple
  - Paid: Gray
  - Cancelled: Red
- **Priority Colors**:
  - Urgent: Red with pulse animation
  - High: Orange
  - Normal: No badge

### Card Design

- White background
- Subtle shadow
- Rounded corners (2xl)
- Gray border
- Hover effects on interactive elements

### Typography

- **Headers**: Bold, large (2xl-3xl)
- **Body**: Regular, readable (base)
- **Metadata**: Small, gray (sm)
- **Prices**: Bold, brand color

## Navigation Flow

### Entry Points

1. **From Order Management**: Click "View" button
2. **From Notifications**: Click notification toast
3. **From Table Map**: Click occupied table
4. **Direct URL**: `/orders/:orderId`

### Exit Points

1. **Back Button**: Returns to previous page
2. **Manage Order**: Goes to Order Management
3. **View Table Map**: Goes to Table Map View

## Status Management

### Valid Status Transitions

```
pending → [preparing, cancelled]
preparing → [ready, cancelled]
ready → [served]
served → [paid]
paid → [] (terminal)
cancelled → [] (terminal)
```

### Update Process

1. Click "Update Status" button
2. Modal opens with current status
3. Select new status from dropdown (only valid options shown)
4. Click "Update Status" to confirm
5. Order refreshes with new status
6. Timeline updates automatically

## Data Flow

### Loading Process

```
Component Mounts
    ↓
Fetch Order by ID (GET /api/orders/:id)
    ↓
Display Order Data
    ↓
Auto-refresh available via button
```

### Status Update Process

```
User Clicks "Update Status"
    ↓
Modal Opens
    ↓
User Selects New Status
    ↓
API Call (PATCH /api/orders/:id/status)
    ↓
Success → Reload Order Data
    ↓
Timeline Updates
```

## Use Cases

### For Waiters

1. **Check Order Details**: View complete order before serving
2. **Verify Items**: Ensure all items are correct
3. **Read Special Instructions**: Check dietary requirements or preferences
4. **Track Progress**: See how long order has been in each status
5. **Update Status**: Mark as served when delivered

### For Managers

1. **Monitor Orders**: Review order details and progress
2. **Investigate Issues**: Check modification history
3. **Verify Totals**: Ensure pricing is correct
4. **Track Performance**: See time spent in each status
5. **Print Records**: Generate physical copies for records

### For Admins

1. **Full Oversight**: Complete order information access
2. **Audit Trail**: Review all modifications and status changes
3. **Troubleshooting**: Investigate order issues
4. **Reporting**: Print orders for analysis
5. **System Monitoring**: Check order flow and timing

## Print Functionality

### What Gets Printed

- Order header with number and status
- Table and waiter information
- Complete item list with prices
- Totals breakdown
- Special instructions
- Status timeline
- Modification history
- Order metadata

### What Gets Hidden

- Navigation buttons
- Action buttons
- Back button
- Update status button
- Quick actions panel

### Print Optimization

- Clean white background
- Proper page breaks
- Readable font sizes
- Professional layout
- No unnecessary colors

## Performance Considerations

### Loading Strategy

- Single API call on mount
- No polling (manual refresh only)
- Efficient data structure
- Minimal re-renders

### Data Management

- Order data cached in component state
- Refresh only on user action or status update
- No unnecessary API calls

## Testing Checklist

### Display

- [ ] Order information loads correctly
- [ ] All items display with images
- [ ] Totals calculate correctly
- [ ] Status badge shows correct color
- [ ] Priority badge displays (if applicable)
- [ ] Timeline shows all statuses
- [ ] Duration calculations accurate

### Actions

- [ ] Back button navigates correctly
- [ ] Print button opens print dialog
- [ ] Refresh button reloads data
- [ ] Update status modal opens
- [ ] Status dropdown shows valid options only
- [ ] Status update saves successfully
- [ ] Quick action buttons navigate correctly

### Special Cases

- [ ] Order with no notes (section hidden)
- [ ] Order with no modifications (section hidden)
- [ ] Order with discount (shows in totals)
- [ ] Order with priority (badge displays)
- [ ] Terminal status (no update button)
- [ ] Order not found (error message)

### Responsive

- [ ] Desktop layout (two columns)
- [ ] Tablet layout (two columns, narrower)
- [ ] Mobile layout (single column)
- [ ] Print layout (optimized)

### Permissions

- [ ] Admin can access
- [ ] Manager can access
- [ ] Waiter can access
- [ ] Kitchen cannot access (redirected)
- [ ] Cashier cannot access (redirected)

## Troubleshooting

### Order Not Loading

**Possible Causes**:

1. Invalid order ID in URL
2. Order doesn't exist
3. Network error
4. Permission issue

**Solutions**:

- Check URL for correct order ID
- Verify order exists in database
- Check browser console for errors
- Verify user has correct role

### Status Update Failing

**Possible Causes**:

1. Invalid status transition
2. Order in terminal state
3. Network error
4. Permission issue

**Solutions**:

- Check status workflow rules
- Verify order is not paid/cancelled
- Check API endpoint
- Verify user role permissions

### Print Not Working

**Possible Causes**:

1. Browser print dialog blocked
2. Print styles not loading
3. Content too large for page

**Solutions**:

- Allow popups in browser
- Check CSS print media queries
- Adjust browser print settings

### Timeline Not Showing

**Possible Causes**:

1. No status timestamps in order
2. Data structure issue
3. Rendering error

**Solutions**:

- Check order.statusTimestamps exists
- Verify data format
- Check browser console for errors

## Future Enhancements (Optional)

Potential improvements:

- **Real-time Updates**: WebSocket for live status changes
- **Comments Section**: Add comments/notes to order
- **Photo Upload**: Attach photos to order
- **Customer Info**: Display customer details (if available)
- **Payment Details**: Show payment method and transaction info
- **Refund Option**: Process refunds from detail page
- **Share Link**: Generate shareable link for order
- **Export Options**: Export as PDF, JSON, or CSV
- **Related Orders**: Show other orders from same table/customer
- **Estimated Time**: Show estimated completion time

## Best Practices

### For Staff

1. **Review Before Serving**: Always check order details before serving
2. **Verify Special Instructions**: Read notes carefully
3. **Update Status Promptly**: Keep status current
4. **Print When Needed**: Use print for kitchen copies or records
5. **Use Quick Actions**: Navigate efficiently between pages

### For Managers

1. **Monitor Timing**: Check duration in each status
2. **Review Modifications**: Investigate frequent changes
3. **Track Priority Orders**: Pay attention to urgent flags
4. **Print for Records**: Keep physical copies of important orders
5. **Train Staff**: Ensure team knows how to use the page

## Related Features

- **Order Management**: List view of all orders
- **Table Map View**: Visual table overview
- **Order Notifications**: Real-time alerts
- **Kitchen Screen**: Order preparation view
- **POS Screen**: Order creation

## Summary

The Order Detail Page provides a comprehensive, professional view of individual orders with all relevant information, actions, and history in one place. Its clean design, print functionality, and intuitive layout make it an essential tool for staff to efficiently manage and track orders throughout their lifecycle.

The page serves as a central hub for order information, accessible from multiple entry points throughout the application, ensuring staff always have quick access to complete order details when needed.
