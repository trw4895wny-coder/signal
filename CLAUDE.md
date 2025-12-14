# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Signal is a professional networking platform where users express their current state through intentional, time-bound signals rather than traditional profiles. Users can discover others by their active signals and connect internally.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm lint
```

## Architecture

### Tech Stack
- **Next.js 15** with App Router (server components by default)
- **Supabase** for PostgreSQL database, auth, and Row Level Security (RLS)
- **TypeScript** with full type safety
- **Tailwind CSS** for styling
- **Deployed on Vercel**

### Core Data Model

The platform revolves around a **signal taxonomy** system:

1. **signal_categories** - 4 categories (availability, learning, contribution, perspective)
2. **signals** - Individual signals within categories (e.g., "Looking for work", "Learning Python")
3. **profiles** - User profiles (extends Supabase auth.users)
4. **user_signals** - Junction table linking users to their active signals with expiration
5. **connections** - Connection requests between users (pending/accepted/rejected)
6. **messages** - Internal messaging between connected users

### Signal Constraints

Defined in `types/signals.ts`:
- Maximum 5 total signals per user
- Category limits: availability (2), learning (99), contribution (99), perspective (3)
- Signals can have expiration dates (auto-expire after N days)
- Helper functions: `canAddSignal()`, `isSignalExpired()`, `getDaysUntilExpiration()`

### Database Migrations

Located in `supabase/migrations/`, run in order:
1. `00001_initial_schema.sql` - Core tables and RLS policies
2. `00002_seed_taxonomy.sql` - Signal taxonomy data
3. `00003_seed_example_profiles.sql` - Example data (optional)
4. `00004_auto_create_profile.sql` - Trigger to auto-create profiles
5. `00005_connections_and_messages.sql` - Connection and messaging system

### Server vs Client Components

**Server Components** (default in Next.js 15):
- All page.tsx files in app/ directory
- Data fetching with `lib/signals.ts` helpers
- Use Supabase server client from `lib/supabase/server.ts`
- Must use `await cookies()` for Next.js 15 compatibility

**Client Components** (marked with `'use client'`):
- Interactive UI: SignalSelector, FilterChips, ProfileView, ConnectionRequests
- Use React hooks (useState, useEffect)
- Call API routes for data fetching (not server actions from client)

### Authentication Flow

Server actions in `app/auth/actions/auth.ts`:
- `signUp()` - Creates auth user + profile (auto-created by database trigger)
- `signIn()` - Password authentication, redirects to /profile
- `signOut()` - Clears session, redirects to /
- `getUser()` - Returns current authenticated user

### API Routes

Located in `app/api/`:

**Signals:**
- `GET /api/signals/categories` - List all signal categories
- `GET /api/signals` - List all signals with categories

**Profiles:**
- `GET /api/profiles` - Discover profiles (excludes current user, includes signals)

**Connections:**
- `GET /api/connections` - Get user's connections (pending/accepted/rejected)
- `POST /api/connections` - Send connection request
- `PATCH /api/connections/[id]` - Accept/reject connection request

**Auth:**
- `GET /api/auth/user` - Get current user ID and email

### TypeScript Type Casting Workaround

**IMPORTANT**: The `connections` and `messages` tables are not in the auto-generated Supabase types (`types/database.ts`). To work with these tables, cast the Supabase client to `any`:

```typescript
const { data, error } = await (supabase as any)
  .from('connections')
  .select('*')
```

This is a known workaround until types are regenerated with:
```bash
npx supabase gen types typescript --project-id gommkoszlajnufvbhysi > types/database.ts
```

### Component Architecture

**Discovery Flow:**
1. `app/discover/page.tsx` - Server component fetches all profiles and signals
2. `components/signals/FilterChips.tsx` - Cascading hover menu for signal filters
3. Client-side filtering with AND logic (profiles must have ALL selected signals)
4. Pagination: 20 profiles per page
5. `components/profiles/ProfileCard.tsx` - Grid display of profiles
6. `components/profiles/ProfileModal.tsx` - Modal with connection request button

**Profile Management:**
1. `app/profile/page.tsx` - Fetches user data, signals, and connection stats
2. `components/profiles/ProfileView.tsx` - Display and edit signals with chip UI
3. `components/signals/SignalSelector.tsx` - Add/remove signals per category
4. `components/connections/ConnectionRequests.tsx` - Manage pending/accepted connections

**Connection System:**
- Users send connection requests (status: 'pending')
- Receivers can accept/reject (status: 'accepted' or 'rejected')
- Only accepted connections can message each other (RLS enforced)
- UI shows: pending incoming (blue border), accepted (green badge), sent requests (yellow badge)

### Row Level Security (RLS)

All tables have RLS enabled. Key policies:

**Profiles**: Public read, users can only update their own
**User Signals**: Public read, users can only insert/delete their own
**Connections**: Users see connections where they're requester OR receiver
**Messages**: Only visible/sendable in accepted connections

### Design Patterns

**Filter Logic (Discover Page):**
- Empty state by default (no profiles shown until filters added)
- AND logic: profiles must match ALL selected signal filters
- Filters displayed as removable chips
- Cascading menu expands on hover (not click)

**Signal Display:**
- Chip-based UI (rounded pills with dark background)
- Color-coded expiration indicators:
  - Red (<7 days remaining)
  - Yellow (7-30 days)
  - Gray (>30 days or no expiration)
- Shows days remaining with clock icon

**Profile Modal:**
- Compact design (max-w-lg, not full screen)
- Zoom animation on open
- Hides connection button for own profile
- Shows existing connection status

### Next.js 15 Compatibility Notes

- `searchParams` in pages must be awaited: `const params = await searchParams`
- `cookies()` must be awaited: `const cookieStore = await cookies()`
- Server component params must be typed as `Promise<{ id: string }>`

### Common Patterns

**Fetching User Signals:**
```typescript
const userSignals = await getUserSignals(user.id)
```

**Adding a Signal:**
```typescript
await addUserSignal(userId, signalId)
```

**Checking Constraints:**
```typescript
const { allowed, reason } = canAddSignal(currentSignals, newSignal)
if (!allowed) {
  // Show error message
}
```

**Sending Connection Request:**
```typescript
await fetch('/api/connections', {
  method: 'POST',
  body: JSON.stringify({ receiver_id: targetUserId })
})
```

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Deployment

- Push to GitHub triggers Vercel auto-deployment
- Production: https://signal-ivory-six.vercel.app
- Environment variables must be set in Vercel dashboard
