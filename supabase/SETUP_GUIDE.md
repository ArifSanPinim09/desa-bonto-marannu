# Supabase Setup Guide

This guide will walk you through setting up the database schema and security policies for the Village Website project.

## Prerequisites

- A Supabase project (already created based on .env.example)
- Access to Supabase Dashboard
- Project URL: `https://wcfbwhzlimdleygxgdcc.supabase.co`

## Step-by-Step Setup

### Step 1: Apply Database Schema

1. Open your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/migrations/20240203000000_initial_schema.sql`
6. Paste into the SQL Editor
7. Click **Run** or press `Ctrl+Enter`
8. Wait for confirmation message: "Success. No rows returned"

This will create:
- ✅ 7 database tables
- ✅ Indexes for performance
- ✅ Row Level Security policies
- ✅ Automatic timestamp triggers

### Step 2: Set Up Storage Buckets

1. Still in the SQL Editor, click **New Query**
2. Copy the entire contents of `supabase/migrations/20240203000001_storage_setup.sql`
3. Paste into the SQL Editor
4. Click **Run** or press `Ctrl+Enter`
5. Wait for confirmation

This will create:
- ✅ 5 storage buckets
- ✅ Storage access policies for public read
- ✅ Storage access policies for authenticated admin

### Step 3: Verify Setup

1. In SQL Editor, click **New Query**
2. Copy the contents of `supabase/verify-setup.sql`
3. Paste and run
4. Review the results to ensure:
   - All 7 tables are created
   - RLS is enabled on all tables
   - Public read policies exist
   - Authenticated policies exist
   - All 5 storage buckets are created

### Step 4: (Optional) Add Seed Data

If you want to test with sample data:

1. In SQL Editor, click **New Query**
2. Copy the contents of `supabase/seed.sql`
3. Paste and run
4. This will add sample data for testing

### Step 5: Verify Storage Buckets in Dashboard

1. Navigate to **Storage** in the left sidebar
2. You should see 5 buckets:
   - hero-images
   - profile-images
   - official-photos
   - destination-images
   - news-images
3. Click on each bucket to verify it's accessible

### Step 6: Create Admin User

1. Navigate to **Authentication** → **Users** in the left sidebar
2. Click **Add User** → **Create new user**
3. Enter email and password for your admin account
4. Click **Create User**
5. Save the credentials securely

### Step 7: Test Authentication

1. Try logging in with the admin credentials you created
2. Verify you can access authenticated routes
3. Test that you can perform CRUD operations

## Verification Checklist

Use this checklist to ensure everything is set up correctly:

- [ ] All 7 tables exist in the database
- [ ] RLS is enabled on all tables
- [ ] Public users can read all tables (except draft news)
- [ ] Authenticated users have full CRUD access
- [ ] All 5 storage buckets are created
- [ ] Storage buckets allow public read access
- [ ] Storage buckets allow authenticated upload/delete
- [ ] Admin user account is created
- [ ] Environment variables are set in .env.local

## Troubleshooting

### Issue: "relation already exists"
**Solution**: The table or bucket already exists. You can skip that migration or drop the existing objects first.

### Issue: "permission denied for schema storage"
**Solution**: Make sure you're running the storage migration with proper permissions. Try running it in the Supabase Dashboard SQL Editor.

### Issue: "RLS policies not working"
**Solution**: 
1. Verify RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
2. Check policies exist: `SELECT * FROM pg_policies WHERE schemaname = 'public';`
3. Ensure you're using the correct Supabase client (authenticated vs anonymous)

### Issue: "Cannot upload to storage bucket"
**Solution**:
1. Verify the bucket exists
2. Check storage policies are created
3. Ensure you're authenticated when uploading
4. Verify file size and MIME type restrictions

## Security Notes

### Requirements Validation

This setup satisfies the following requirements:

- **Requirement 16.1**: ✅ Public users can read all public tables
- **Requirement 16.2**: ✅ Public users cannot write to any tables
- **Requirement 16.3**: ✅ Authenticated admins have full CRUD access
- **Requirement 16.4**: ✅ Unauthenticated users are denied admin operations
- **Requirement 16.5**: ✅ RLS is enforced on all tables

### Best Practices

1. **Never commit .env.local**: Keep your actual credentials secret
2. **Use service role key carefully**: Only use it in server-side code
3. **Test RLS policies**: Always verify policies work as expected
4. **Regular backups**: Set up automatic backups in Supabase Dashboard
5. **Monitor usage**: Keep an eye on database and storage usage

## Next Steps

After completing this setup:

1. ✅ Database schema is ready
2. ✅ Security policies are configured
3. ➡️ Proceed to Task 3: Create TypeScript types and interfaces
4. ➡️ Continue with remaining implementation tasks

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)
- [SQL Editor Guide](https://supabase.com/docs/guides/database/overview)
