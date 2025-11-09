# Finance App - Personal Finance Management Application

A cross-platform personal finance management application built with React Native (Expo) for mobile, React (Vite) for web, and Node.js (Express) for the backend.

## Project Structure

```
finance-app/
├── mobile/              # React Native with Expo
├── web/                 # React with Vite
├── backend/             # Node.js + Express + Prisma
├── shared/              # Shared TypeScript types, utils, constants
├── pnpm-workspace.yaml  # pnpm workspace configuration
├── package.json         # Root workspace package.json
└── README.md
```

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0
- PostgreSQL >= 14.0 (for backend)
- Expo CLI (for mobile development)

## Installation

1. Install pnpm globally (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. Install dependencies for all packages:
   ```bash
   pnpm install
   ```

## Environment Setup

### Backend

Create a `.env` file in the `backend/` directory (copy from `backend/.env.example`):

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/financedb"

# JWT Secrets
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-token-secret"

# JWT Expiration
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN="*"
```

**Important**: Change the JWT secrets in production to secure random strings.

### Mobile

Create a `.env` file in the `mobile/` directory:

```env
# API Configuration
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

For production, update the API URL to point to your production backend.

### Web

Create a `.env` file in the `web/` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api/v1
```

For production, update the API URL to point to your production backend.

## Development

### Run all services

You can run each service in a separate terminal:

```bash
# Backend
pnpm dev:backend

# Mobile
pnpm dev:mobile

# Web
pnpm dev:web
```

### Database Setup

1. Make sure PostgreSQL is running and create a database:
   ```bash
   createdb financedb
   ```
   Or using psql:
   ```sql
   CREATE DATABASE financedb;
   ```

2. Update the `DATABASE_URL` in `backend/.env` with your PostgreSQL credentials.

3. Generate Prisma client:
   ```bash
   cd backend
   pnpm prisma generate
   ```

4. Run migrations:
   ```bash
   pnpm prisma migrate dev --name init
   ```

5. (Optional) Open Prisma Studio to view your database:
   ```bash
   pnpm prisma studio
   ```

## Scripts

- `pnpm dev:mobile` - Start mobile app development server
- `pnpm dev:web` - Start web app development server
- `pnpm dev:backend` - Start backend development server
- `pnpm build:mobile` - Build mobile app
- `pnpm build:web` - Build web app
- `pnpm build:backend` - Build backend
- `pnpm test:backend` - Run backend tests
- `pnpm test:mobile` - Run mobile tests
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages

## Technology Stack

### Mobile
- React Native with Expo
- React Navigation v6
- Redux Toolkit
- expo-sqlite
- react-i18next

### Web
- React 18+
- Vite
- React Router v6
- Redux Toolkit
- Tailwind CSS
- react-i18next

### Backend
- Node.js 18+
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- TypeScript

### Shared
- TypeScript types and interfaces
- Shared constants
- Shared utility functions

## Architecture

The application follows a monorepo structure using pnpm workspaces:

- **Shared Package**: Contains TypeScript types, constants, and utilities shared across mobile and web
- **Backend**: RESTful API server with PostgreSQL database
- **Mobile**: React Native app using Expo managed workflow
- **Web**: React web application with Vite

## Security

- JWT tokens for authentication
- bcrypt for password hashing
- Helmet for security headers
- CORS configuration
- Rate limiting on API endpoints
- SQLite encryption for mobile local storage

## License

MIT

