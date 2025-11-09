# MyFi - Personal Finance Management Application

A modern, cross-platform personal finance management application built with cutting-edge technologies. Track expenses, manage budgets, set financial goals, and gain insights into your spending habits across mobile and web platforms.

## Features

- User authentication with JWT
- Account management (Checking, Savings, Credit Card, Investment, Cash)
- Transaction tracking with categories
- Budget management with period-based tracking
- Financial goal setting and tracking
- Multi-currency support
- Internationalization (i18n) support
- Secure local storage with encryption
- Real-time data synchronization
- Interactive API documentation (Swagger)

## Project Structure

```
myfi/
├── mobile/              # React Native 0.82 with Expo 54
│   ├── app/            # Expo Router file-based routing
│   └── src/            # Components, hooks, store, services
├── web/                 # React 19 with Vite 7
│   └── src/            # Components, pages, store, services
├── backend/             # Node.js with Express 5 + Prisma 6
│   ├── src/            # Controllers, routes, middleware, utils
│   └── prisma/         # Database schema and migrations
├── shared/              # Shared TypeScript types and utilities
│   └── src/            # Types, constants, validation
├── pnpm-workspace.yaml  # pnpm workspace configuration
├── package.json         # Root workspace package.json
└── README.md
```

## Prerequisites

- **Node.js** >= 20.0.0
- **pnpm** >= 10.0.0
- **PostgreSQL** >= 14.0 (for backend database)
- **Expo Go** app (for mobile development on physical devices)

## Quick Start

1. **Install pnpm globally** (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd myfi
   ```

3. **Install dependencies** for all packages:
   ```bash
   pnpm install
   ```

4. **Set up environment variables** (see Environment Setup section below)

5. **Generate Prisma Client**:
   ```bash
   cd backend
   pnpm prisma:generate
   ```

6. **Run database migrations**:
   ```bash
   pnpm prisma:migrate
   ```

7. **Start development servers**:
   ```bash
   # Terminal 1 - Backend
   pnpm dev:backend

   # Terminal 2 - Web
   pnpm dev:web

   # Terminal 3 - Mobile
   pnpm dev:mobile
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

### Mobile (`@finance-app/mobile`)
- **React Native** 0.82.1 - Native mobile framework
- **Expo** ~54.0 - Development platform with managed workflow
- **Expo Router** ~6.0 - File-based routing system
- **React** 19.2.0 - Latest React with modern features
- **React Navigation** 7.x - Bottom tabs & stack navigation
- **Redux Toolkit** 2.10.1 - State management
- **Axios** 1.13.2 - HTTP client
- **i18next** 25.6.1 - Internationalization
- **expo-sqlite** ~16.0 - Local database
- **expo-secure-store** ~15.0 - Encrypted storage
- **expo-local-authentication** ~17.0 - Biometric authentication
- **TypeScript** 5.9.3 - Type safety

### Web (`@finance-app/web`)
- **React** 19.2.0 - Latest React with modern features
- **Vite** 7.2.2 - Next-generation build tool
- **React Router** 7.9.5 - Client-side routing
- **Redux Toolkit** 2.10.1 - State management
- **Tailwind CSS** 4.1.17 - Utility-first CSS framework
- **Axios** 1.13.2 - HTTP client
- **i18next** 25.6.1 - Internationalization
- **TypeScript** 5.9.3 - Type safety

### Backend (`@finance-app/backend`)
- **Node.js** 20+ - JavaScript runtime
- **Express** 5.1.0 - Web framework
- **PostgreSQL** - Relational database
- **Prisma** 6.19.0 - Modern ORM with type safety
- **JWT** (jsonwebtoken 9.0.2) - Authentication
- **bcryptjs** 3.0.3 - Password hashing
- **Helmet** 8.1.0 - Security headers
- **CORS** 2.8.5 - Cross-origin resource sharing
- **express-rate-limit** 8.2.1 - API rate limiting
- **express-validator** 7.3.0 - Request validation
- **Swagger** (swagger-ui-express & swagger-jsdoc) - API documentation
- **TypeScript** 5.9.3 - Type safety
- **ts-node-dev** 2.0.0 - Hot reload in development

### Shared (`@finance-app/shared`)
- **TypeScript** 5.9.3 - Shared types, interfaces, constants
- Centralized type definitions for API contracts
- Shared utility functions and validation logic

## Architecture

This project uses a **monorepo architecture** with **pnpm workspaces**, providing:

### Benefits
- **Code Reusability**: Shared types and utilities across all platforms
- **Type Safety**: End-to-end TypeScript coverage with shared contracts
- **Consistent Versioning**: Unified dependency management
- **Simplified Development**: Single repository for all code
- **Better DX**: Changes propagate automatically across workspaces

### Structure
- **Shared Package**: TypeScript types, constants, and utilities used by all platforms
- **Backend**: RESTful API server with PostgreSQL, Prisma ORM, and comprehensive middleware
- **Mobile**: React Native app using Expo's managed workflow with file-based routing
- **Web**: React SPA with Vite for fast builds and HMR

### Data Flow
```
Mobile/Web → API Gateway → Backend Services → Prisma ORM → PostgreSQL
     ↓                                                           ↑
Local Storage (SQLite/LocalStorage)                    Database Migrations
```

## Database Schema

The application uses Prisma with PostgreSQL to manage:
- **Users**: Authentication and user profiles
- **Accounts**: Multiple account types (Checking, Savings, Credit Card, Investment, Cash)
- **Transactions**: Income, Expense, and Transfer tracking with categories
- **Goals**: Financial goal setting with target amounts and dates
- **Budgets**: Period-based budget management (Daily, Weekly, Monthly, Yearly)

## API Documentation

Interactive API documentation is available via Swagger UI when running the backend:
- **Local**: http://localhost:3000/api-docs
- Explore all endpoints, request/response schemas, and test API calls directly

## Security

This application implements multiple security best practices:

- **Authentication**: JWT-based stateless authentication with refresh tokens
- **Password Security**: bcryptjs hashing with salt rounds
- **HTTP Security**: Helmet middleware for security headers
- **CORS**: Configurable cross-origin resource sharing
- **Rate Limiting**: Express rate-limit to prevent abuse
- **Input Validation**: express-validator for request sanitization
- **SQL Injection Prevention**: Prisma ORM with parameterized queries
- **Mobile Storage**: expo-secure-store for encrypted local data
- **Environment Variables**: Sensitive data stored in .env files (not committed)

## Development Guidelines

### Code Style
- Use TypeScript for all code
- Follow ESLint configurations
- Use shared types from `@finance-app/shared`
- Write meaningful commit messages

### Testing
- Backend: Jest unit tests
- Mobile: Jest + React Native Testing Library
- Run tests before committing: `pnpm test:backend` or `pnpm test:mobile`

### Git Workflow
1. Create feature branches from `main`
2. Make your changes
3. Run linting: `pnpm lint`
4. Run type checking: `pnpm type-check`
5. Create a pull request

## Troubleshooting

### Common Issues

**Prisma Client Not Found**
```bash
cd backend
pnpm prisma:generate
```

**Port Already in Use**
- Backend: Change `PORT` in `backend/.env`
- Web: Vite will automatically try the next available port
- Mobile: Stop other Expo processes

**Database Connection Failed**
- Ensure PostgreSQL is running
- Verify `DATABASE_URL` in `backend/.env`
- Check database exists: `createdb financedb`

**Expo Build Errors**
- Clear cache: `cd mobile && expo start -c`
- Reinstall dependencies: `rm -rf node_modules && pnpm install`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Author

Built with modern web and mobile technologies for efficient personal finance management.

## Acknowledgments

- Expo team for excellent mobile development platform
- Prisma team for the powerful ORM
- React and Vite communities for amazing tools

