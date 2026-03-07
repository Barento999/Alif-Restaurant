# Database Menu Setup Guide

## ✅ What Changed

The public menu system now fetches dishes from **your MongoDB database** instead of the external TheMealDB API.

## System Architecture

```
Customer visits website
    ↓
Frontend requests: GET /api/menu/public
    ↓
Backend queries MongoDB (MenuItem collection)
    ↓
Returns only available dishes (isAvailable: true)
    ↓
Frontend displays dishes with prices from database
```

## Database Structure

### MenuItem Model

```javascript
{
  name: String (required),
  category: ObjectId (ref: Category, required),
  price: Number (required),
  description: String,
  image: String,
  isAvailable: Boolean (default: true),
  ingredients: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Category Model

```javascript
{
  name: String (required),
  description: String,
  createdAt: Date,
  updatedAt: Date
}
```

## How to Populate Your Menu

### Option 1: Manual Entry (Admin Panel)

1. Login as admin/manager
2. Go to "Menu Management"
3. Click "Add New Item"
4. Fill in:
   - Name
   - Category
   - Price
   - Description
   - Image URL
   - Ingredients
5. Save

### Option 2: Import from TheMealDB API

1. Login as admin/manager
2. Go to "Menu Management"
3. Look for "Import from API" or similar feature
4. Browse dishes from TheMealDB
5. Select dishes to import
6. Set prices for imported dishes
7. Save to database

### Option 3: Seed Script

Run the seed script to populate with sample data:

```bash
cd backend
npm run seed
```

## API Endpoints

### Public (No Auth)

- `GET /api/menu/public` - Get all available dishes for customers

### Protected (Admin/Manager Only)

- `GET /api/menu` - Get all menu items (including unavailable)
- `POST /api/menu` - Create new menu item
- `PUT /api/menu/:id` - Update menu item
- `DELETE /api/menu/:id` - Delete menu item
- `GET /api/menu/api/all` - Browse TheMealDB API
- `POST /api/menu/api/import` - Import from TheMealDB

## Features

### For Customers (Public Pages)

✅ View all available dishes
✅ Search by name, description, category, ingredients
✅ Filter by category
✅ See real prices from your database
✅ Pagination (12 dishes per page)
✅ Responsive design

### For Admins (Dashboard)

✅ Add/Edit/Delete dishes
✅ Set prices
✅ Toggle availability (hide/show dishes)
✅ Manage categories
✅ Import dishes from TheMealDB API
✅ Upload dish images

## Important Notes

1. **Only available dishes show on public menu**
   - Set `isAvailable: false` to hide dishes temporarily
   - Useful for seasonal items or out-of-stock dishes

2. **Prices are required**
   - Every dish must have a price
   - Displayed on public menu

3. **Categories must exist first**
   - Create categories before adding dishes
   - Categories help with filtering

4. **Images are optional**
   - Fallback image shows if no image URL provided
   - Recommended: Use high-quality food images

5. **Ingredients are optional**
   - Helps with search functionality
   - Displayed on dish cards

## Testing

### Check if dishes are in database:

```bash
# Connect to MongoDB
mongosh

# Use your database
use restaurant_db

# Count menu items
db.menuitems.countDocuments()

# View all items
db.menuitems.find().pretty()

# View only available items
db.menuitems.find({ isAvailable: true }).pretty()
```

### Test the public API:

```bash
# Using curl
curl http://localhost:5000/api/menu/public

# Or visit in browser
http://localhost:5000/api/menu/public
```

## Troubleshooting

### No dishes showing on public menu?

**Check 1**: Are there dishes in the database?

```javascript
// In MongoDB
db.menuitems.countDocuments();
```

**Check 2**: Are dishes marked as available?

```javascript
// In MongoDB
db.menuitems.countDocuments({ isAvailable: true });
```

**Check 3**: Are categories populated?

```javascript
// Check if category references are valid
db.menuitems.find().populate("category");
```

**Check 4**: Is the backend running?

```bash
cd backend
npm run dev
```

**Check 5**: Check browser console for errors

- Open DevTools (F12)
- Check Console tab
- Check Network tab for API calls

### Dishes show in admin but not on public menu?

- Check `isAvailable` field - must be `true`
- Check if category exists and is valid
- Check if backend route `/api/menu/public` is accessible

### Images not showing?

- Verify image URLs are valid and accessible
- Check if images are HTTPS (required for production)
- Fallback image will show if URL is invalid

## Migration from TheMealDB API

If you were using the TheMealDB API before:

1. **Old endpoint**: `/api/menu/api/all` (external API)
2. **New endpoint**: `/api/menu/public` (your database)

The system now uses your database, but you can still:

- Browse TheMealDB API through admin panel
- Import dishes you like
- Set your own prices
- Customize descriptions

## Next Steps

1. ✅ System is configured to use database
2. 📝 Add dishes through admin panel or seed script
3. 💰 Set prices for all dishes
4. 📸 Add high-quality images
5. 🎯 Organize dishes into categories
6. 🚀 Test public menu page
7. 🎉 Launch!

## Benefits of Database Approach

✅ **Full control** - You decide what dishes to show
✅ **Custom pricing** - Set your own prices
✅ **Availability control** - Hide/show dishes anytime
✅ **No external dependency** - Works offline
✅ **Faster** - No external API calls
✅ **Customizable** - Edit descriptions, add ingredients
✅ **Professional** - Your menu, your brand

---

**Status**: ✅ Configured and Ready

**Data Source**: MongoDB Database (MenuItem collection)

**Public Endpoint**: `/api/menu/public`
