# TanStack Start Template

This is a full-stack React application using TanStack Start. It implements a Todo app with authentication features.

## Tech Stack

| Category | Technology |
|---------|------|
| Framework | [TanStack Start](https://tanstack.com/start) |
| Database | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/) |
| Authentication | [Better Auth](https://www.better-auth.com/) |
| UI | [Shadcn UI](https://ui.shadcn.com/) + [Tailwind CSS v4](https://tailwindcss.com/) |
| Testing | [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) |

## Setup

### Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL
- Docker (for starting the database)

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local and set DATABASE_URL
```

### Environment Variables

Please set the following in your `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
BETTER_AUTH_SECRET=your-secret-key
```

## Development

### Development Server

```bash
docker compose up -d

pnpm run db:push

pnpm dev
```

## Testing

```bash
pnpm test
```

## Project Structure

```
src/
├── components/     # UI Components
│   ├── todos/      # Todo related components
│   └── ui/         # Shadcn UI components
├── db/             # Database configuration & schema
├── integrations/   # External library integrations
├── lib/            # Utilities & Configuration
├── middlewares/    # Server function middlewares
├── routes/         # File-based routing
└── services/       # Business logic layer
    ├── auth/       # Authentication service
    └── todos/      # Todo service
```

## Build

```bash
# Production build
pnpm build

# Preview production build
pnpm preview
```

## License

MIT License
