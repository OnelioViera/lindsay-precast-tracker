# NextAuth v5 Migration Summary

This document outlines the changes made to migrate from NextAuth v4 to v5 (beta.4).

## Changes Made

### 1. Auth Configuration (`src/lib/auth.ts`)

**Key Changes:**
- Changed from exporting `authOptions` object to using `NextAuth()` function
- Now exports `{ handlers, auth, signIn, signOut }` from `NextAuth()`
- Imported `CredentialsProvider` from `next-auth/providers/credentials`
- Updated User.findOne to search by email: `User.findOne({ email: credentials.email })`

### 2. Auth Route Handler (`src/app/api/auth/[...nextauth]/route.ts`)

**Before:**
```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

**After:**
```typescript
import { handlers } from '@/lib/auth';

export const { GET, POST } = handlers;
```

### 3. Middleware (`middleware.ts`)

**Key Changes:**
- Changed from `withAuth` middleware to using `auth()` wrapper
- Updated from callback-based authorization to direct middleware function
- Changed `token` access to `req.auth`
- Role checking now uses `token.user?.role`

### 4. API Routes (All routes in `src/app/api/`)

**Before:**
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const session = await getServerSession(authOptions);
```

**After:**
```typescript
import { auth } from '@/lib/auth';

const session = await auth();
```

**Updated Files:**
- `src/app/api/projects/route.ts`
- `src/app/api/projects/[id]/route.ts`
- `src/app/api/projects/[id]/time/route.ts`
- `src/app/api/customers/route.ts`
- `src/app/api/customers/[id]/route.ts`
- `src/app/api/library/route.ts`
- `src/app/api/library/[id]/route.ts`

### 5. Type Definitions (`src/types/next-auth.d.ts`) - NEW FILE

Created type declarations to extend NextAuth types with custom `role` property:

```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
```

### 6. Mock Models (CodeSandbox compatibility)

Updated all mock database models to accept arguments:
- `src/models/User.ts`
- `src/models/Customer.ts`
- `src/models/Project.ts`
- `src/models/LibraryTemplate.ts`
- `src/models/TimeEntry.ts`

### 7. Mock Validation (CodeSandbox compatibility)

Updated mock Zod schema (`src/lib/validations.ts`) to properly support method chaining:
```typescript
const mockSchema = () => ({
  parse: (data: any) => data,
  optional: () => mockSchema(),
  partial: () => mockSchema(),
  omit: (...args: any[]) => mockSchema(),
  extend: (...args: any[]) => mockSchema(),
});
```

## Environment Variables

Create a `.env.local` file in the project root with:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXTAUTH_URL=http://localhost:3000

# MongoDB Connection (update with your actual connection string)
MONGODB_URI=mongodb://localhost:27017/lindsay-precast-tracker

# AWS S3 Configuration (for file uploads)
# AWS_ACCESS_KEY_ID=
# AWS_SECRET_ACCESS_KEY=
# AWS_REGION=
# AWS_S3_BUCKET=
```

## Testing

After these changes, you should be able to:
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Access the login page without errors
4. Authentication flow should work properly

## Key Differences: NextAuth v4 vs v5

| Feature | v4 | v5 |
|---------|----|----|
| Configuration | Export `authOptions` object | Call `NextAuth()` function |
| Route Handler | `NextAuth(authOptions)` | Import `handlers` |
| Session in API | `getServerSession(authOptions)` | `auth()` |
| Middleware | `withAuth` with callbacks | `auth()` wrapper function |
| Auth access in middleware | `token` | `req.auth` |

## Notes

- The mock models are temporary for CodeSandbox/development
- Replace with actual Mongoose models in production
- The password comparison is currently plaintext (see comment in auth.ts)
- Replace with bcrypt password hashing in production

