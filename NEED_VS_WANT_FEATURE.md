# Need vs Want Classification Feature

This document describes the Need vs Want classification system implemented for MyFi, which is the primary differentiator of the app.

## Overview

Users can classify each expense as either:
- **Need** (essential: rent, groceries, utilities)
- **Want** (optional: dining, entertainment, shopping)

The system provides insights and financial advice based on the user's spending patterns, with a target ratio of 70% needs and 30% wants for optimal financial health.

## Implementation Details

### Backend Changes

1. **Database Schema**: The `Transaction` model already includes an `isNeed: boolean` field
2. **New Endpoint**: `GET /transactions/stats/overview` - Returns transaction statistics including:
   - Total needs and wants amounts
   - Percentage breakdown
   - Monthly data for trend analysis
   - Personalized financial advice
3. **Enhanced Controllers**: Transaction creation and update endpoints support the `isNeed` field

### Frontend Changes (Web)

1. **TransactionForm Component**: 
   - Radio buttons for Need/Want classification (shown only for expenses)
   - Clear descriptions to help users understand the difference
   - Form validation ensures classification is provided for expenses

2. **Dashboard Component**:
   - Visual breakdown using progress bars
   - Statistics cards showing totals and percentages
   - Financial advice based on spending ratio
   - Monthly breakdown table for trend analysis
   - Color-coded indicators (green for good, red for needs improvement)

3. **Redux Store**:
   - Added `fetchTransactionStats` async thunk
   - Enhanced transaction state with stats and loading states
   - Centralized state management for both transactions and statistics

### Mobile Changes (React Native)

1. **DashboardScreen**:
   - Native mobile UI with cards and progress bars
   - Monthly breakdown with scrollable table
   - Touch-friendly interface with proper spacing
   - Color-coded advice and statistics

2. **AddTransactionScreen**:
   - Modal-based pickers for account, type, and category selection
   - Radio button classification with clear descriptions
   - Form validation and error handling
   - Success feedback after transaction creation

3. **Navigation**: Updated tab navigator to include Dashboard and Add Transaction screens

## API Endpoints

### GET /transactions/stats/overview

**Query Parameters:**
- `months` (optional, default: 12) - Number of months to include in statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "totalNeeds": 1500.00,
    "totalWants": 500.00,
    "needsPercentage": 75.0,
    "wantsPercentage": 25.0,
    "monthlyData": [
      {
        "month": "January",
        "year": 2023,
        "needs": 700.00,
        "wants": 300.00,
        "total": 1000.00,
        "needsPercentage": 70.0,
        "wantsPercentage": 30.0
      }
    ],
    "financialAdvice": "Excellent! Your spending ratio is well-balanced..."
  }
}
```

## Financial Advice Logic

The system provides personalized advice based on the needs percentage:

- **70-80%**: "Excellent! Your spending ratio is well-balanced..."
- **>80%**: "Your needs are quite high. Consider reviewing your expenses..."
- **60-70%**: "Good balance! You're close to the ideal 70/30 ratio..."
- **50-60%**: "Your wants are higher than recommended. Consider redirecting..."
- **<50%**: "Your wants spending is significantly high. Consider creating a budget..."

## Testing

### Backend Tests
- Financial advice generation logic
- Percentage calculations (edge cases included)
- Monthly data aggregation
- Transaction classification edge cases

### Frontend Tests
- Component behavior validation
- Form validation logic
- Percentage calculation utilities
- UI state management

## Key Features

1. **Smart Classification UI**: Only shows Need/Want options for expense transactions
2. **Visual Feedback**: Progress bars and color coding for easy understanding
3. **Monthly Trends**: Historical data to track spending patterns over time
4. **Personalized Advice**: Dynamic recommendations based on actual spending behavior
5. **Cross-Platform**: Consistent experience across web and mobile platforms
6. **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Future Enhancements

1. **AI-Powered Suggestions**: Automatic classification based on transaction description
2. **Category-Based Defaults**: Pre-set classifications for common expense categories
3. **Spending Goals**: Set and track targets for needs/wants ratios
4. **Detailed Insights**: More granular analysis by category and time period
5. **Export Features**: Download spending reports for external analysis

## Target Ratio

The recommended financial health target is:
- **70% Needs**: Essential expenses for living
- **30% Wants**: Discretionary spending for lifestyle

This ratio is based on financial planning principles and provides a balanced approach to meeting both current needs and long-term financial goals.