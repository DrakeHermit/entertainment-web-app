# Frontend Mentor - Entertainment web app solution

This is a solution to the [Entertainment web app challenge on Frontend Mentor](https://www.frontendmentor.io/challenges/entertainment-web-app-J-UhgAW1X). Frontend Mentor challenges help you improve your coding skills by building realistic projects.

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
  - [Links](#links)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
  - [Continued development](#continued-development)
  - [Useful resources](#useful-resources)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment variables](#environment-variables)
  - [Installation](#installation)
  - [Database setup](#database-setup)
- [Project structure](#project-structure)
- [Author](#author)

## Overview

### The challenge

Users should be able to:

- View the optimal layout for the app depending on their device's screen size
- See hover states for all interactive elements on the page
- Navigate between Home, Movies, TV Series, and Bookmarked Shows pages
- Add/Remove bookmarks from all movies and TV series
- Search for relevant shows on all pages
- **Bonus**: Build this project as a full-stack application
- **Bonus**: If you're building a full-stack app, we provide authentication screen (sign-up/login) designs if you'd like to create an auth flow

### Screenshot

![](./screenshot.jpg)

### Links

- Solution URL: [GitHub](https://github.com/DrakeHermit/entertainment-web-app)
- Live Site URL: [Live Site](https://entertainment-web-app-18ib.vercel.app/)

## My process

### Built with

- [Next.js 16](https://nextjs.org/) - React framework (App Router)
- [React 19](https://react.dev/) - JS library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) - TypeScript ORM for PostgreSQL
- [Neon](https://neon.tech/) - Serverless PostgreSQL
- [TMDB API](https://www.themoviedb.org/documentation/api) - Movie and TV series data
- [Cloudinary](https://cloudinary.com/) - Avatar image uploads
- [Zod](https://zod.dev/) - Schema validation
- [Jose](https://github.com/panva/jose) + [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - JWT authentication
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) - Password hashing
- [Lucide React](https://lucide.dev/) - Icons
- [Sonner](https://sonner.emilkowal.dev/) - Toast notifications
- Mobile-first workflow
- CSS custom properties
- Flexbox & CSS Grid

### What I learned

This project was built as a full-stack application, which gave me the opportunity to work with several technologies together:

**JWT authentication with refresh tokens** — Implemented a complete auth flow with access and refresh tokens stored as HTTP-only cookies. The refresh mechanism automatically issues new tokens when the access token expires:

```ts
const { payload } = await jwtVerify(
  refreshToken,
  new TextEncoder().encode(env.REFRESH_TOKEN_SECRET)
);
```

**Drizzle ORM with Neon** — Used Drizzle's type-safe query builder with Neon's serverless PostgreSQL driver, defining the full schema including users, bookmarks, comments, and reactions:

```ts
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 50 }).notNull().unique(),
  password: text("password").notNull(),
  jwt_token: text("jwt_token"),
  refresh_token: text("refresh_token"),
  avatar_url: text("avatar_url"),
});
```

**Optimistic UI with React 19** — Leveraged `useOptimistic` for instant bookmark toggling without waiting for the server response, paired with React Context for cross-component state sharing.

**Server Actions** — Handled mutations (auth, bookmarks, comments, profile updates) through Next.js server actions with Zod validation and rate limiting.

### Continued development

- Add proper "recommended" section algorithm based on the user's bookmarks
- Add infinite scroll for movie/TV series listings
- Add unit and integration tests

### Useful resources

- [Next.js App Router Docs](https://nextjs.org/docs/app) - Comprehensive guide for the App Router, layouts, and server components
- [Drizzle ORM Docs](https://orm.drizzle.team/docs/overview) - Schema definitions, migrations, and query building
- [TMDB API Docs](https://developer.themoviedb.org/docs) - Endpoints for fetching movie and TV data
- [Jose Library](https://github.com/panva/jose) - JWT verification that works in edge runtimes

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- A [Neon](https://neon.tech/) PostgreSQL database (or any PostgreSQL instance)
- A [TMDB](https://www.themoviedb.org/) API bearer token
- A [Cloudinary](https://cloudinary.com/) account (for avatar uploads)

### Environment variables

Create a `.env` file in the project root with the following variables:

```
DATABASE_URL=            # PostgreSQL connection string
JWT_SECRET=              # Secret for signing access tokens
JWT_EXPIRATION_TIME=     # Access token lifetime in seconds
REFRESH_TOKEN_SECRET=    # Secret for signing refresh tokens
REFRESH_TOKEN_EXPIRATION_TIME=  # Refresh token lifetime in seconds
CLOUDINARY_CLOUD_NAME=   # Cloudinary cloud name
CLOUDINARY_API_KEY=      # Cloudinary API key
CLOUDINARY_API_SECRET=   # Cloudinary API secret
TMDB_BEARER_TOKEN=       # TMDB API read access token
```

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd entertainment-web-app

# Install dependencies
npm install

# Run the development server
npm run dev
```

### Database setup

The project uses Drizzle ORM for migrations. To set up the database:

```bash
# Generate migrations from the schema
npx drizzle-kit generate

# Apply migrations to the database
npx drizzle-kit migrate
```

Available scripts:

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `next dev` | Start development server |
| `build` | `next build` | Create production build |
| `start` | `next start` | Start production server |
| `lint` | `eslint` | Run linting |

## Project structure

```
entertainment-web-app/
├── app/
│   ├── globals.css               # Tailwind config & theme variables
│   ├── layout.tsx                # Root layout (Toaster, global styles)
│   ├── (auth)/                   # Auth route group
│   │   ├── layout.tsx            # Centered auth layout with logo
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/                   # Main browsing route group
│   │   ├── layout.tsx            # NavBar, search, bookmark provider
│   │   ├── page.tsx              # Home (trending + recommended)
│   │   ├── movies/page.tsx
│   │   └── tv-series/page.tsx
│   ├── (bookmarks)/
│   │   └── bookmarks/page.tsx    # Bookmarked shows
│   ├── (profile)/
│   │   └── profile/page.tsx      # User profile management
│   ├── (details)/
│   │   ├── movie/[id]/page.tsx   # Movie detail page
│   │   └── tv/[id]/page.tsx      # TV series detail page
│   └── api/
│       ├── search/route.ts       # TMDB search proxy
│       ├── refresh/route.ts      # JWT token refresh
│       └── upload-avatar/route.ts
├── actions/                      # Server actions
│   ├── auth/                     # Login, register, logout
│   ├── bookmarks/                # Add/remove bookmarks
│   ├── comments/                 # CRUD + reactions
│   └── profile/                  # Profile, password, avatar updates
├── components/                   # React components
│   ├── NavBar.tsx                # Sidebar/top navigation
│   ├── SearchComponent.tsx       # Debounced search input
│   ├── Carousel.tsx              # Horizontal trending carousel
│   ├── TrendingCard.tsx          # Trending item card
│   ├── RecommendedCard.tsx       # Recommended item card
│   ├── BookmarkButton.tsx        # Bookmark toggle (detail pages)
│   ├── Comment.tsx               # Comment with replies
│   ├── CommentList.tsx           # Comments list
│   ├── ProfilePage.tsx           # Profile form
│   ├── UserAvatar.tsx            # Avatar with fallback
│   └── UserMenu.tsx              # Auth dropdown menu
├── contexts/
│   ├── BookmarkContext.tsx        # Bookmark state (useOptimistic)
│   └── CommentContext.tsx        # Comment state (useReducer)
├── lib/
│   ├── auth/                     # JWT verification & generation
│   ├── db/
│   │   ├── drizzle.ts            # Database client
│   │   └── schema.ts             # Drizzle schema (users, bookmarks, comments)
│   ├── hooks/                    # Custom React hooks
│   ├── rateLimit.ts              # In-memory rate limiting
│   ├── tmdb.ts                   # TMDB API fetch helpers
│   ├── env.ts                    # Environment variable validation
│   ├── helpers.ts                # Utility functions
│   ├── types/types.ts            # TypeScript type definitions
│   └── validations/auth.ts       # Zod schemas for auth forms
├── queries/                      # Database query functions
│   ├── bookmarks/                # Bookmark queries
│   └── comments/                 # Comment queries
├── migrations/                   # Drizzle database migrations
├── proxy.ts                      # Auth middleware logic
├── drizzle.config.ts
├── next.config.mjs
└── package.json
```

## Author

- Frontend Mentor - [@DrakeHermit](https://www.frontendmentor.io/profile/DrakeHermit)
