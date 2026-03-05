# Food API Integration

## Overview

The Menu Management system now supports importing menu items from TheMealDB API, a free online food database with thousands of recipes from around the world.

## Features

### 1. Search External Meals

- Search for meals by name (e.g., "chicken", "pasta", "dessert")
- Browse results with images, categories, and descriptions
- Filter by cuisine type (Italian, Chinese, American, etc.)

### 2. Import Meals

- Select meals from search results
- Assign to your existing categories
- Set custom prices for your restaurant
- Automatically imports:
  - Meal name
  - Description (cooking instructions)
  - High-quality image
  - List of ingredients
  - Category information

### 3. API Details

- **Provider**: TheMealDB (www.themealdb.com)
- **Cost**: Free (no API key required)
- **Data**: 300+ meals with detailed information
- **Rate Limit**: None for free tier

## How to Use

### For Admin/Manager Users:

1. **Navigate to Menu Management**
   - Go to Menu Management page
   - Click "Import from API" button (gold/yellow button)

2. **Search for Meals**
   - Enter search term (e.g., "chicken curry")
   - Press Enter or click "Search"
   - Browse results with images and details

3. **Import a Meal**
   - Click "Import This Meal" on any result
   - Select a category from your existing categories
   - Enter a price for your restaurant
   - Click "Confirm" to import

4. **Manage Imported Items**
   - Imported items appear in your menu list
   - Edit, toggle availability, or delete as needed
   - All standard menu management features apply

## Backend Endpoints

### Search Meals

```
GET /api/menu/api/search?query=chicken
Authorization: Bearer token
Role: admin, manager
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": "52940",
      "name": "Chicken Curry",
      "category": "Chicken",
      "description": "Heat oil in a large skillet...",
      "image": "https://www.themealdb.com/images/media/meals/...",
      "area": "Indian"
    }
  ]
}
```

### Import Meal

```
POST /api/menu/api/import
Authorization: Bearer token
Role: admin, manager

Body:
{
  "mealId": "52940",
  "categoryId": "60d5ec49f1b2c72b8c8e4f1a",
  "price": 12.99
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Chicken Curry",
    "category": {...},
    "price": 12.99,
    "description": "...",
    "image": "...",
    "ingredients": ["Chicken", "Curry Powder", ...],
    "isAvailable": true
  }
}
```

## Technical Implementation

### Backend

- **File**: `backend/controllers/menuController.js`
- **Functions**:
  - `searchMealsFromAPI()` - Fetches meals from TheMealDB
  - `importMealFromAPI()` - Creates menu item from API data
- **Routes**: `backend/routes/menuRoutes.js`
  - `GET /api/menu/api/search`
  - `POST /api/menu/api/import`

### Frontend

- **File**: `frontend/src/pages/MenuManagement.jsx`
- **Components**:
  - Main modal with search interface
  - `ImportMealCard` component for each result
- **Features**:
  - Real-time search
  - Image previews
  - Category and price selection
  - Loading states

## Benefits

1. **Time Saving**: Import complete menu items in seconds
2. **Professional Content**: High-quality images and descriptions
3. **Ingredient Lists**: Automatically populated for kitchen reference
4. **Variety**: Access to international cuisines
5. **Customization**: Set your own prices and categories

## Future Enhancements

Potential improvements:

- Bulk import multiple items at once
- Save favorite searches
- Auto-categorization based on meal type
- Integration with other food APIs (Spoonacular, Edamam)
- Custom image upload override
- Ingredient-based inventory tracking

## Troubleshooting

**Search returns no results:**

- Try different search terms
- Use general terms (e.g., "chicken" instead of "grilled chicken breast")
- Check internet connection

**Import fails:**

- Ensure you have selected a category
- Verify price is a valid number
- Check that you have admin/manager role

**Images not loading:**

- TheMealDB images are hosted externally
- Check firewall/network settings
- Images may take time to load on slow connections

## Support

For issues or questions:

- Check console for error messages
- Verify API endpoints are accessible
- Ensure proper authentication and authorization
