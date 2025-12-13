# Signal

Professional signals, not noise. A minimal networking platform for professionals to express their current state through intentional signals.

## Features

- **Signal Selection**: Choose up to 5 signals across 4 categories
- **Automatic Expiration**: Time-bound signals expire automatically
- **Discovery**: Find professionals by their signals, not keywords
- **Constraint Enforcement**: Category limits and total signal caps built-in
- **Clean Design**: Minimal, elegant UI focused on content

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Styling**: Tailwind CSS
- **TypeScript**: Full type safety
- **Deployment**: Vercel

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Database Setup

1. Create a Supabase project
2. Run migrations in order from `supabase/migrations/`:
   - `00001_initial_schema.sql` - Creates tables and RLS policies
   - `00002_seed_taxonomy.sql` - Populates signal taxonomy

3. (Optional) Run `00003_seed_example_profiles.sql` to add example profiles

## Deployment

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Architecture

- **Server Components**: Default for data fetching
- **Client Components**: Interactive UI (signal selection, filters)
- **Server Actions**: Mutations (add/remove signals)
- **API Routes**: Public data endpoints for discovery
- **RLS Policies**: Row-level security for data access

## Design Principles

- Minimal and functional
- Elegant typography-first design
- Scalable architecture from day one
- Type-safe throughout
- Production-ready patterns
