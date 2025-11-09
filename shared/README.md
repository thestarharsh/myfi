# Shared Package

This package contains shared TypeScript types, constants, and utilities used across the mobile and web applications.

## Contents

- **Types**: TypeScript interfaces and types for User, Account, Transaction, Goal, Budget, and API responses
- **Constants**: Transaction categories, account types, API endpoints, currency codes, etc.
- **Utils**: Utility functions for date formatting, currency formatting, validation, etc.

## Usage

Import from the shared package:

```typescript
import { User, Transaction, formatCurrency, formatDate } from '@finance-app/shared';
```

## Building

To build the shared package:

```bash
cd shared
pnpm build
```

This will generate the TypeScript declarations and compiled JavaScript in the `dist/` directory.


