# Supabase Client Utilities

This directory contains Supabase client utilities for authentication and data access.

## Files

- **client.ts**: Browser client for Client Components
- **server.ts**: Server client for Server Components and API Routes
- **auth.ts**: Authentication helper functions
- **index.ts**: Barrel export for easy imports

## Usage

### Client Components

```typescript
import { createBrowserClient, signIn, signOut, getClientSession } from '@/src/lib/supabase'

// Create a client
const supabase = createBrowserClient()

// Sign in
await signIn('email@example.com', 'password')

// Sign out
await signOut()

// Get current session
const session = await getClientSession()
```

### Server Components

```typescript
import { createServerClient, getSession, getUser, isAuthenticated } from '@/src/lib/supabase'

// Create a server client
const supabase = await createServerClient()

// Get current session
const session = await getSession()

// Get current user
const user = await getUser()

// Check if authenticated
const authenticated = await isAuthenticated()
```

### Middleware

The middleware in `middleware.ts` automatically:
- Refreshes authentication sessions
- Protects `/admin/*` routes (redirects to `/login` if not authenticated)
- Redirects authenticated users away from `/login` to `/admin/dashboard`

## Environment Variables

Required environment variables (see `.env.example`):
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for admin operations)

## Requirements Satisfied

This implementation satisfies the following requirements:
- **7.1**: Admin authentication via login page
- **7.2**: Authentication using Supabase Auth
- **7.3**: Access granted to authenticated admins
- **7.4**: Logout functionality with session termination
- **7.5**: Redirect unauthenticated users to login page
