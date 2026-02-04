# Row Level Security (RLS) Policies Reference

This document provides a comprehensive overview of all RLS policies implemented in the Village Website database.

## Security Model Overview

The Village Website uses a two-tier access model:

1. **Public Access** (Unauthenticated): Read-only access to display content
2. **Admin Access** (Authenticated): Full CRUD operations for content management

## Table Policies

### 1. hero_sections

| Policy Name | Role | Operation | Condition | Purpose |
|-------------|------|-----------|-----------|---------|
| Public read access for hero_sections | public | SELECT | true | Allow visitors to view hero sections |
| Authenticated full access for hero_sections | authenticated | ALL | true | Allow admins to manage hero content |

**Requirements**: 16.1, 16.2, 16.3, 16.4, 16.5

---

### 2. village_profile

| Policy Name | Role | Operation | Condition | Purpose |
|-------------|------|-----------|-----------|---------|
| Public read access for village_profile | public | SELECT | true | Allow visitors to view village information |
| Authenticated full access for village_profile | authenticated | ALL | true | Allow admins to update village profile |

**Requirements**: 16.1, 16.2, 16.3, 16.4, 16.5

---

### 3. organization_structure

| Policy Name | Role | Operation | Condition | Purpose |
|-------------|------|-----------|-----------|---------|
| Public read access for organization_structure | public | SELECT | true | Allow visitors to view officials |
| Authenticated full access for organization_structure | authenticated | ALL | true | Allow admins to manage officials |

**Requirements**: 16.1, 16.2, 16.3, 16.4, 16.5

---

### 4. residents

| Policy Name | Role | Operation | Condition | Purpose |
|-------------|------|-----------|-----------|---------|
| Public read access for residents | public | SELECT | true | Allow visitors to view population statistics |
| Authenticated full access for residents | authenticated | ALL | true | Allow admins to manage resident data |

**Requirements**: 16.1, 16.2, 16.3, 16.4, 16.5

**Note**: While resident data is readable by public, the application should only expose aggregated statistics, not individual records.

---

### 5. tourist_destinations

| Policy Name | Role | Operation | Condition | Purpose |
|-------------|------|-----------|-----------|---------|
| Public read access for tourist_destinations | public | SELECT | true | Allow visitors to browse destinations |
| Authenticated full access for tourist_destinations | authenticated | ALL | true | Allow admins to manage destinations |

**Requirements**: 16.1, 16.2, 16.3, 16.4, 16.5

---

### 6. destination_images

| Policy Name | Role | Operation | Condition | Purpose |
|-------------|------|-----------|-----------|---------|
| Public read access for destination_images | public | SELECT | true | Allow visitors to view destination photos |
| Authenticated full access for destination_images | authenticated | ALL | true | Allow admins to manage destination images |

**Requirements**: 16.1, 16.2, 16.3, 16.4, 16.5

---

### 7. news

| Policy Name | Role | Operation | Condition | Purpose |
|-------------|------|-----------|-----------|---------|
| Public read published news | public | SELECT | status = 'published' | Allow visitors to read only published articles |
| Authenticated full access for news | authenticated | ALL | true | Allow admins to manage all articles |

**Requirements**: 16.1, 16.2, 16.3, 16.4, 16.5

**Special Note**: This is the only table with conditional public access. Draft articles are hidden from public view.

---

## Storage Policies

### Storage Buckets Access Matrix

| Bucket | Public Read | Public Write | Auth Read | Auth Write | Auth Delete |
|--------|-------------|--------------|-----------|------------|-------------|
| hero-images | ✅ | ❌ | ✅ | ✅ | ✅ |
| profile-images | ✅ | ❌ | ✅ | ✅ | ✅ |
| official-photos | ✅ | ❌ | ✅ | ✅ | ✅ |
| destination-images | ✅ | ❌ | ✅ | ✅ | ✅ |
| news-images | ✅ | ❌ | ✅ | ✅ | ✅ |

### Storage Policy Details

Each bucket has 4 policies:

1. **Public Read**: `SELECT` access for public users
2. **Authenticated Insert**: `INSERT` access for authenticated users
3. **Authenticated Update**: `UPDATE` access for authenticated users
4. **Authenticated Delete**: `DELETE` access for authenticated users

**Requirements**: 16.1, 16.2, 16.3, 16.4, 16.5

---

## Policy Testing

### Test Public Access (Unauthenticated)

```sql
-- Should succeed: Read hero sections
SELECT * FROM hero_sections;

-- Should succeed: Read published news
SELECT * FROM news WHERE status = 'published';

-- Should fail: Read draft news
SELECT * FROM news WHERE status = 'draft';

-- Should fail: Insert data
INSERT INTO hero_sections (title, cta_text, cta_link, image_url) 
VALUES ('Test', 'Test', '/test', '/test.jpg');

-- Should fail: Update data
UPDATE hero_sections SET title = 'Updated' WHERE id = 'some-id';

-- Should fail: Delete data
DELETE FROM hero_sections WHERE id = 'some-id';
```

### Test Authenticated Access (Admin)

```sql
-- Should succeed: Read all data
SELECT * FROM hero_sections;
SELECT * FROM news; -- Including drafts

-- Should succeed: Insert data
INSERT INTO hero_sections (title, cta_text, cta_link, image_url) 
VALUES ('Test', 'Test', '/test', '/test.jpg');

-- Should succeed: Update data
UPDATE hero_sections SET title = 'Updated' WHERE id = 'some-id';

-- Should succeed: Delete data
DELETE FROM hero_sections WHERE id = 'some-id';
```

---

## Security Considerations

### ✅ What's Protected

1. **Write Operations**: Only authenticated admins can create, update, or delete data
2. **Draft Content**: Draft news articles are hidden from public view
3. **Storage Uploads**: Only authenticated admins can upload files
4. **Data Integrity**: Foreign key constraints prevent orphaned records

### ⚠️ Important Notes

1. **Resident Privacy**: While residents table is publicly readable (for statistics), the application layer should only expose aggregated data, not individual records
2. **Authentication Required**: All admin operations require valid Supabase authentication
3. **RLS Always On**: RLS cannot be bypassed except with service role key (use carefully)
4. **Policy Order**: Policies are evaluated with OR logic - if any policy allows access, the operation succeeds

### 🔒 Best Practices

1. **Use Authenticated Client**: Always use authenticated Supabase client for admin operations
2. **Validate on Client**: Add client-side validation before attempting operations
3. **Handle Errors**: Properly handle RLS policy violations in your application
4. **Test Policies**: Regularly test that policies work as expected
5. **Monitor Access**: Use Supabase Dashboard to monitor database access patterns

---

## Troubleshooting RLS Issues

### Issue: "new row violates row-level security policy"

**Cause**: Trying to insert/update data without proper authentication or with invalid data

**Solutions**:
1. Verify user is authenticated
2. Check the policy conditions are met
3. Ensure you're using the authenticated Supabase client

### Issue: "permission denied for table"

**Cause**: RLS is enabled but no policies allow the operation

**Solutions**:
1. Verify policies exist: `SELECT * FROM pg_policies WHERE tablename = 'your_table';`
2. Check if RLS is enabled: `SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'your_table';`
3. Ensure you're authenticated for admin operations

### Issue: Public users can't read data

**Cause**: Public read policy might be missing or incorrect

**Solutions**:
1. Verify public read policy exists
2. Check policy condition (should be `true` for most tables)
3. For news table, ensure articles have `status = 'published'`

---

## Policy Maintenance

### Adding New Tables

When adding new tables, always:

1. Enable RLS: `ALTER TABLE new_table ENABLE ROW LEVEL SECURITY;`
2. Add public read policy (if applicable)
3. Add authenticated full access policy
4. Test both authenticated and unauthenticated access

### Modifying Policies

To modify an existing policy:

```sql
-- Drop old policy
DROP POLICY "policy_name" ON table_name;

-- Create new policy
CREATE POLICY "policy_name" ON table_name
FOR operation TO role
USING (condition);
```

### Disabling RLS (Not Recommended)

```sql
-- Only do this if absolutely necessary
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

**Warning**: Disabling RLS removes all access control. Only use for testing in development.

---

## Compliance

This RLS implementation satisfies all security requirements:

- ✅ **Requirement 16.1**: Public users can read all public tables
- ✅ **Requirement 16.2**: Public users cannot write to any tables  
- ✅ **Requirement 16.3**: Authenticated admins have full CRUD access
- ✅ **Requirement 16.4**: Unauthenticated users are denied admin operations
- ✅ **Requirement 16.5**: RLS is enforced on all tables

---

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Documentation](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Supabase Auth Helpers](https://supabase.com/docs/guides/auth/auth-helpers)
