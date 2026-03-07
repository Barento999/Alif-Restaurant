# Table Map View - Feature Guide

## Overview

The Table Map View provides a real-time visual overview of all restaurant tables, showing their current status and associated order information. This feature helps managers and waiters quickly identify available tables, occupied tables, and orders that need attention.

## Features Implemented

### 1. Real-Time Table Status Display

- **Visual Grid Layout**: Tables displayed in an organized grid grouped by location
- **Color-Coded Status**:
  - Green = Available (no active order)
  - Red = Occupied (has active order)
- **Pulsing Indicators**: Occupied tables have animated status dots

### 2. Comprehensive Statistics Dashboard

Six key metrics displayed at the top:

- **Total Tables**: Overall table count
- **Available**: Tables without active orders
- **Occupied**: Tables with active orders
- **Pending**: Orders waiting to be prepared
- **Preparing**: Orders currently in kitchen
- **Ready/Served**: Orders ready for delivery or already served

### 3. Order Information Per Table

For occupied tables, displays:

- Order number
- Current status (with color-coded badge)
- Priority flag (🔥 URGENT or ⚡ HIGH if applicable)
- Number of items
- Order total amount
- Time in current status
- Assigned waiter name

### 4. Smart Filtering

Filter tables by:

- All Tables
- Available only
- Occupied only
- Pending orders
- Preparing orders
- Ready to serve orders

### 5. Location-Based Grouping

- Tables automatically grouped by location (e.g., "Main Floor", "Patio", "VIP")
- Each location section shows table count
- Easy to identify which area needs attention

### 6. Auto-Refresh Feature

- Toggle auto-refresh ON/OFF
- Refreshes data every 10 seconds when enabled
- Visual indicator (spinning icon) when auto-refresh is active
- Manual refresh button always available

### 7. Interactive Navigation

- **Click Available Table**: Opens POS screen to create new order
- **Click Occupied Table**: Opens Order Management with that specific order
- Seamless workflow integration

### 8. Priority Order Highlighting

- Urgent orders show with red pulsing badge
- High priority orders show with orange badge
- Helps staff identify critical orders at a glance

## Access Control

- **Roles**: Admin, Manager, Waiter
- **Route**: `/table-map`
- **Navigation**: Available in sidebar as "Table Map"

## Technical Implementation

### Frontend Component

**File**: `frontend/src/pages/TableMapView.jsx`

**Key Features**:

- Fetches tables and orders data simultaneously
- Matches orders to tables by table ID
- Calculates time in status for each order
- Auto-refresh with 10-second interval
- Responsive grid layout (2-6 columns based on screen size)

### Route Configuration

**File**: `frontend/src/App.jsx`

- Added route: `/table-map`
- Protected route with role-based access
- Accessible to admin, manager, and waiter roles

### Navigation

**File**: `frontend/src/components/Sidebar.jsx`

- Added "Table Map" menu item with map icon
- Positioned after "Tables" in the sidebar
- Visible to admin, manager, and waiter roles

## Usage Scenarios

### For Managers

1. **Quick Overview**: See all tables and their status at a glance
2. **Identify Bottlenecks**: Spot orders stuck in one status too long
3. **Monitor Priority Orders**: Urgent orders are clearly highlighted
4. **Capacity Planning**: See available vs occupied tables

### For Waiters

1. **Find Available Tables**: Quickly seat new customers
2. **Track Own Orders**: See all orders assigned to them
3. **Monitor Order Progress**: Check which orders are ready to serve
4. **Time Management**: See how long orders have been in each status

### For Kitchen Staff

While primarily for front-of-house, kitchen can use it to:

- See overall order volume
- Identify priority orders
- Understand table turnover

## Visual Design

### Color Scheme

- **Primary Green** (#0d5f4e): Available tables, success states
- **Red**: Occupied tables, urgent priorities
- **Orange**: High priority orders
- **Yellow**: Pending orders
- **Blue**: Preparing orders
- **Purple**: Ready/Served orders

### Layout

- **Statistics Bar**: 6 metric cards at top
- **Filter Buttons**: Horizontal row below statistics
- **Location Sections**: Grouped table grids
- **Table Cards**: Compact cards with all relevant info

## Best Practices

1. **Keep Auto-Refresh ON**: Ensures real-time accuracy
2. **Use Filters**: Focus on specific table states when busy
3. **Monitor Time**: Watch for orders spending too long in one status
4. **Check Priority Flags**: Address urgent orders first
5. **Group by Location**: Organize tables by physical location for easier management

## Future Enhancements (Optional)

Potential additions:

- Floor plan view with drag-and-drop table positioning
- Table reservation system integration
- Customer wait time tracking
- Table combination/splitting
- Heat map showing busiest areas
- Historical occupancy analytics
- Server section assignments
- Table turn time tracking

## Testing Checklist

- [ ] View loads with all tables displayed
- [ ] Statistics show correct counts
- [ ] Filters work correctly
- [ ] Auto-refresh updates data every 10 seconds
- [ ] Clicking available table opens POS
- [ ] Clicking occupied table opens order details
- [ ] Priority badges display correctly
- [ ] Time in status updates accurately
- [ ] Location grouping works
- [ ] Responsive on mobile/tablet
- [ ] Role-based access enforced

## Troubleshooting

**Tables not showing?**

- Check if tables exist in database
- Verify API endpoint `/tables` is working
- Check browser console for errors

**Orders not matching tables?**

- Ensure orders have valid table references
- Check order status (paid/cancelled orders are excluded)
- Verify table IDs match between orders and tables

**Auto-refresh not working?**

- Check if toggle is ON
- Look for JavaScript errors in console
- Verify API endpoints are accessible

**Navigation not working?**

- Check user role permissions
- Verify routes are properly configured
- Ensure table/order IDs are valid

## Related Features

- **Order Management**: Full order CRUD operations
- **Table Management**: Add/edit/delete tables
- **POS Screen**: Create new orders
- **Kitchen Screen**: View orders to prepare
- **Priority Flags**: Mark urgent orders

## Summary

The Table Map View provides a powerful, real-time visualization of restaurant operations, helping staff make quick decisions about seating, order prioritization, and service delivery. Its intuitive design and comprehensive information display make it an essential tool for efficient restaurant management.
