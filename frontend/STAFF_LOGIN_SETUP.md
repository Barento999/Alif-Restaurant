# Staff Login Route Configuration

## Security Setup

The staff login route is configured via environment variable to keep it secret and not exposed in the codebase.

### Setup Instructions

1. Copy `frontend/.env.example` to `frontend/.env`
2. Set your custom staff login route:

   ```
   VITE_STAFF_LOGIN_ROUTE=/your-custom-secret-route
   ```

3. The route should be:
   - Hard to guess
   - Not obvious (avoid words like "admin", "staff", "login")
   - Unique to your deployment

### Current Configuration

- The `.env` file is gitignored and will NOT be pushed to GitHub
- Only `.env.example` is committed (with placeholder value)
- Each deployment should have its own unique route

### Default Behavior

If `VITE_STAFF_LOGIN_ROUTE` is not set, the app will fall back to `/alif-mgmt-2024`

### Security Notes

- Common routes like `/login`, `/staff-portal`, `/admin-login` redirect to home page
- Only the route specified in `.env` will show the staff login form
- Change this route regularly for better security
- Never commit the actual `.env` file to version control
