# Quick Setup Guide

This guide will help you get the Finance App up and running quickly.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) - Install with `npm install -g pnpm`
- **PostgreSQL** (v14 or higher)
- **Expo CLI** (for mobile development) - Install with `npm install -g expo-cli`

## Step 1: Clone and Install

```bash
# Install all dependencies
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

4. Generate Prisma client and run migrations:
   ```bash
   cd backend
   pnpm prisma generate
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
Web app will run on http://localhost:3001

## Step 5: Build Shared Package (if needed)

The shared package needs to be built before it can be used:

```bash
cd shared
pnpm build
```

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL in backend/.env
- Ensure database `financedb` exists

### Port Already in Use
- Backend: Change PORT in backend/.env
- Web: Update port in web/vite.config.ts

### Module Not Found Errors
- Run `pnpm install` in root directory
- Build shared package: `cd shared && pnpm build`

### Expo Issues
- Clear cache: `expo start -c`
- Reinstall dependencies: `cd mobile && pnpm install`

## Next Steps

1. Test API endpoints using Swagger UI at http://localhost:3000/api-docs
2. Create a user account via `/api/v1/auth/register`
3. Login and get access token
4. Use the token to access protected endpoints

## Project Structure

```
finance-app/
├── mobile/          # React Native (Expo) app
├── web/             # React (Vite) app
├── backend/         # Node.js (Express) API
└── shared/          # Shared TypeScript code
```

## Available Scripts

- `pnpm dev:backend` - Start backend server
- `pnpm dev:mobile` - Start mobile app
- `pnpm dev:web` - Start web app
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm test:backend` - Run backend tests

For more information, see the main [README.md](./README.md).


