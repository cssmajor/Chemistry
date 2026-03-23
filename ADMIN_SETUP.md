# Admin Setup Guide

## Creating an Admin User

To access the admin dashboard, you need to create an admin user in Supabase.

### Steps:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard

2. Navigate to **Authentication** → **Users**

3. Click **Add User** and create a new user with email and password

4. After creating the user, go to **SQL Editor**

5. Run this SQL command to grant admin privileges (replace the email with your admin email):

```sql
UPDATE auth.users
SET raw_app_metadata = raw_app_metadata || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin-email@example.com';
```

6. The admin user can now log in at `/admin` or by visiting the site while logged in

### Admin Features:

- **Materials Management**: Add, edit, delete, and reorder learning materials
- **Videos Management**: Add, edit, delete, and reorder video lectures
- **Tests Management**: Add, edit, delete, and reorder custom tests
- **Drag-and-Drop Ordering**: Reorder items by dragging them in the admin dashboard
- **Database Integration**: All changes are saved to Supabase in real-time

### User Features (No Login Required):

- View all materials, videos, and tests
- Search and filter content by chapter and type
- Take interactive quizzes
- View test history
- Contact form

## Database Structure

The application uses three main tables:

1. **materials** - Learning materials (PDFs, documents, links)
2. **videos** - Video lectures
3. **custom_tests** - Custom tests and quizzes

All tables have:
- Row Level Security (RLS) enabled
- Public read access
- Admin-only write access

## Security

- Admin access is controlled via JWT claims
- Regular users cannot edit, delete, or add content
- All database operations are protected by RLS policies
- Admin authentication required for all write operations
