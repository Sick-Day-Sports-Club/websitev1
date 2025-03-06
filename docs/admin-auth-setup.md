# Admin Portal Authentication Setup

This document provides instructions on how to set up and use Supabase authentication for the admin portal.

## Prerequisites

- Supabase project set up with the following environment variables in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADMIN_CREATION_SECRET` (a secure random string to protect admin creation)

## Database Setup

1. Run the Supabase migration to create the `user_roles` table:

```bash
npx supabase migration up
```

This will create:
- A `user_roles` table to store admin roles
- Row Level Security (RLS) policies to protect the data
- A function to add admin roles

## Creating an Admin User

To create an admin user, run the following script:

```bash
node scripts/create-admin.js
```

You will be prompted to enter:
- Admin email
- Admin password
- Admin creation secret (should match `ADMIN_CREATION_SECRET` in `.env.local`)

Alternatively, you can set these values as environment variables:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_CREATION_SECRET`

## How Authentication Works

1. The application uses Supabase authentication to manage user sessions.
2. When a user logs in to the admin portal, their credentials are verified against Supabase Auth.
3. If authenticated, the system checks if the user has an admin role in the `user_roles` table.
4. Only users with the admin role can access the admin portal and its features.

## Security Considerations

- The `ADMIN_CREATION_SECRET` should be a strong, random string.
- The admin password should be complex and not shared.
- The service role key (`SUPABASE_SERVICE_ROLE_KEY`) is only used in secure server-side API routes.
- Row Level Security (RLS) policies ensure that users can only access data they are authorized to see.

## Troubleshooting

If you encounter issues with admin authentication:

1. Ensure all environment variables are correctly set in `.env.local`.
2. Check that the user has been properly created in Supabase Auth.
3. Verify that the user has an admin role in the `user_roles` table.
4. Clear browser storage/cookies if you're experiencing persistent session issues. 