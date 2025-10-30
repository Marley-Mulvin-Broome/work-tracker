# Work Tracker

A full-stack web application built with SvelteKit for tracking work hours, comparing productivity with team members, and visualizing work patterns through an intuitive dashboard.

## Features

- 🔐 **Secure Authentication** - Lucia-based authentication with session management
- ⏱️ **Flexible Time Tracking** - Three input methods for logging work activities:
  - Start & End Time
  - Start Time & Duration
  - Duration Only
- 📊 **Personal Dashboard** - View today's hours, weekly hours, and week-over-week comparison
- 🏆 **Team Leaderboard** - Weekly ranking of all users by hours worked
- 📝 **Activity Management** - Create, edit, and delete activities (same-day only for edits/deletes)
- 👥 **User Profiles** - View other team members' activity history (read-only)
- ⚡ **Quick Add** - Floating action button for quick activity entry from any page

## Tech Stack

- **Frontend**: SvelteKit 2, Svelte 5, TailwindCSS 4
- **Backend**: SvelteKit API Routes
- **Database**: PostgreSQL 14+
- **ORM**: Drizzle
- **Authentication**: Lucia (session-based with cookies)
- **Language**: JavaScript/TypeScript

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or pnpm

## Setup Instructions

### 1. Clone the repository

```bash
git clone <repository-url>
cd work-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up the database

Start PostgreSQL using Docker Compose:

```bash
npm run db:start
```

Or configure your own PostgreSQL instance and update the connection string.

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/worktracker"
```

### 5. Push the database schema

```bash
npm run db:push
```

### 6. Create your first user

Since the app has closed registration, you need to create users directly in the database. You can use the Drizzle Studio:

```bash
npm run db:studio
```

Or use SQL directly:

```sql
-- First, hash a password using the demo/lucia/login page's register functionality
-- or use a script to hash with argon2

INSERT INTO "user" (id, username, password_hash)
VALUES ('user_abc123', 'your_username', 'your_hashed_password');
```

**Quick way to create a user**: Temporarily use the demo registration at `/demo/lucia/login` to create your first user, then disable it.

### 7. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Database Commands

- `npm run db:start` - Start PostgreSQL with Docker Compose
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Drizzle Studio (database GUI)

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   └── QuickAddButton.svelte    # Global quick-add FAB
│   ├── server/
│   │   ├── auth.ts                   # Authentication utilities
│   │   ├── utils.ts                  # Server utilities
│   │   └── db/
│   │       ├── index.ts              # Database connection
│   │       └── schema.ts             # Database schema (Drizzle)
│   └── assets/
├── routes/
│   ├── +layout.svelte                # Main layout with navigation
│   ├── +layout.server.ts             # Layout server load
│   ├── +page.svelte                  # Dashboard
│   ├── +page.server.ts               # Dashboard server logic
│   ├── login/                        # Login page
│   ├── logout/                       # Logout handler
│   ├── activities/                   # Activity management page
│   ├── leaderboard/                  # Team leaderboard
│   └── users/[id]/                   # User profile view
└── hooks.server.ts                   # Global server hooks (auth middleware)
```

## Usage

### Adding Activities

1. Click the blue **+** button (bottom-right) from any page
2. Fill in the activity details
3. Choose your preferred input method:
   - **Duration Only**: Quickest - just enter hours worked
   - **Start Time & Duration**: When you know when you started
   - **Start & End Time**: For precise time tracking

### Viewing Statistics

- **Dashboard** (`/`): See your personal work summary
- **Leaderboard** (`/leaderboard`): Compare with team members
- **Activities** (`/activities`): View and manage all your activities

### Editing/Deleting Activities

- You can only edit or delete activities from the current day
- Go to the Activities page
- Click Edit or Delete on today's activities

### Viewing Team Members

- Click on any user in the leaderboard to view their profile
- View their statistics and activity history (read-only)

## Security Notes

- **Closed Registration**: No public registration - users must be created via database
- **Session-Based Auth**: Secure HTTP-only cookies
- **CSRF Protection**: Built-in SvelteKit CSRF protection
- **Same-Day Edits**: Users can only edit/delete today's activities

## Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

## Production Deployment

1. Set `DATABASE_URL` environment variable
2. Run migrations: `npm run db:migrate`
3. Build the app: `npm run build`
4. Start the server: `node build`

Or use adapters for your preferred platform (Vercel, Netlify, etc.)

## License

MIT
