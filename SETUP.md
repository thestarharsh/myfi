# Quick Setup Guide

This guide will help you get **MyFi** up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.0.0 or higher) - [Download](https://nodejs.org/)
- **pnpm** (v10.0.0 or higher) - Install with `npm install -g pnpm`
- **PostgreSQL** (v14 or higher) - [Download](https://www.postgresql.org/download/)
- **Expo Go** app on your mobile device (for testing mobile app) - [iOS](https://apps.apple.com/app/expo-go/id982107779) / [Android](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Step 1: Clone and Install

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd myfi

# Install all dependencies for all workspaces
pnpm install
```

## Step 2: Database Setup

1. Start PostgreSQL service
2. Create a database:
   ```bash
   createdb financedb
   ```

3. Set up environment variables for backend:
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env and update DATABASE_URL with your PostgreSQL credentials
   ```

4. **IMPORTANT**: Generate Prisma client (required before starting the backend):
   ```bash
   cd backend
   pnpm prisma:generate
   ```

5. Run database migrations:
   ```bash
   pnpm prisma:migrate
   ```

   Or to create a new migration:
   ```bash
   pnpm prisma migrate dev --name init
   ```

## Step 3: Configure Environment Variables

### Backend (`backend/.env`)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/financedb"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-token-secret"
PORT=3000
NODE_ENV=development
```

### Mobile (`mobile/.env`)
```env
EXPO_PUBLIC_API_URL=http://localhost:3000/api/v1
```

### Web (`web/.env`)
```env
VITE_API_URL=http://localhost:3000/api/v1
```

## Step 4: Start Development Servers

Open three terminal windows:

### Terminal 1 - Backend
```bash
pnpm dev:backend
```
Backend will run on http://localhost:3000
API docs available at http://localhost:3000/api-docs

### Terminal 2 - Mobile
```bash
pnpm dev:mobile
```
This will start Expo development server. Scan QR code with Expo Go app.

### Terminal 3 - Web
```bash
pnpm dev:web
```
Web app will run on http://localhost:5173 (Vite default port)

## Step 5: Verify Installation

Once all servers are running:

1. **Backend API**: http://localhost:3000
2. **API Documentation**: http://localhost:3000/api-docs
3. **Web App**: http://localhost:5173 (Vite default port)
4. **Mobile App**: Scan QR code in Expo Dev Tools with Expo Go app

## Optional: Build Shared Package

The shared package is used automatically by other packages. If you need to build it manually:

```bash
cd shared
pnpm build
```

## Troubleshooting

### ❌ Prisma Client Not Found Error
**Problem**: `Error: Cannot find module '.prisma/client/default'`

**Solution**: Generate Prisma client before starting the backend
```bash
cd backend
pnpm prisma:generate
```

### ❌ Database Connection Issues
- Verify PostgreSQL is running: `pg_isready` or check system services
- Check DATABASE_URL in `backend/.env`
- Ensure database exists: `psql -l | grep financedb`
- Create database if missing: `createdb financedb`

### ❌ Port Already in Use
- **Backend**: Change `PORT` in `backend/.env` (default: 3000)
- **Web**: Vite will automatically use next available port or update in `web/vite.config.ts`
- **Mobile**: Stop other Expo processes or use `--port` flag

### ❌ Module Not Found Errors
- Run `pnpm install` in root directory
- Clear node_modules: `rm -rf node_modules && pnpm install`
- Build shared package: `cd shared && pnpm build`

### ❌ Expo / Mobile Issues
- Clear cache: `cd mobile && pnpm start -- --clear`
- Reinstall dependencies: `cd mobile && rm -rf node_modules && pnpm install`
- Reset Metro bundler: Kill all Node processes and restart

### ❌ TypeScript Errors
- Run type check: `pnpm type-check`
- Restart TypeScript server in your IDE
- Ensure all dependencies are installed: `pnpm install`

### ❌ pnpm Build Scripts Warning
If you see warnings about ignored build scripts:
```bash
pnpm approve-builds
```
Then select which packages should be allowed to run build scripts.

## Next Steps

1. Test API endpoints using Swagger UI at http://localhost:3000/api-docs
2. Create a user account via `/api/v1/auth/register`
3. Login and get access token
4. Use the token to access protected endpoints

## Project Structure

```
myfi/
├── mobile/          # React Native 0.82 with Expo 54 (Expo Router)
├── web/             # React 19 with Vite 7 + Tailwind CSS 4
├── backend/         # Node.js 20+ with Express 5 + Prisma 6
└── shared/          # Shared TypeScript types and utilities
```

## Available Scripts

**Development:**
- `pnpm dev:backend` - Start backend development server with hot reload
- `pnpm dev:mobile` - Start Expo development server for mobile
- `pnpm dev:web` - Start Vite development server for web

**Building:**
- `pnpm build:backend` - Build backend for production
- `pnpm build:mobile` - Build mobile app (Expo)
- `pnpm build:web` - Build web app for production

**Testing & Quality:**
- `pnpm test:backend` - Run backend Jest tests
- `pnpm test:mobile` - Run mobile Jest tests
- `pnpm lint` - Lint all packages with ESLint
- `pnpm type-check` - Type check all packages with TypeScript

**Database (Backend):**
- `cd backend && pnpm prisma:generate` - Generate Prisma Client
- `cd backend && pnpm prisma:migrate` - Run database migrations
- `cd backend && pnpm prisma:studio` - Open Prisma Studio (DB GUI)

**Cleanup:**
- `pnpm clean` - Clean all build artifacts

## Quick Tips

1. **First time setup?** Always run `pnpm prisma:generate` after installing dependencies
2. **Making schema changes?** Run `pnpm prisma:generate` after modifying `prisma/schema.prisma`
3. **API testing?** Use Swagger UI at http://localhost:3000/api-docs
4. **Database GUI?** Use Prisma Studio: `cd backend && pnpm prisma:studio`
5. **Mobile not loading?** Ensure backend is running and API_URL in mobile/.env is correct

For more detailed information, see the main [README.md](./README.md).


