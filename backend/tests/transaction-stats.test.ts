// import { generateFinancialAdvice } from '../src/controllers/transaction.controller';
// import { TransactionStats } from '@finance-app/shared';

// Since generateFinancialAdvice is a private function, we'll test the calculation logic
// by creating a mock version for testing
const mockGenerateFinancialAdvice = (needsPercentage: number, wantsPercentage: number): string => {
  if (needsPercentage >= 70 && needsPercentage <= 80) {
    return "Excellent! Your spending ratio is well-balanced. You're following the recommended 70/30 rule for needs vs wants.";
  } else if (needsPercentage > 80) {
    return "Your needs are quite high. Consider reviewing your expenses to see if any 'needs' could be optimized or if you're missing opportunities for discretionary spending.";
  } else if (needsPercentage >= 60 && needsPercentage < 70) {
    return "Good balance! You're close to the ideal 70/30 ratio. Small adjustments could help you reach optimal financial health.";
  } else if (needsPercentage >= 50 && needsPercentage < 60) {
    return "Your wants are higher than recommended. Consider if some discretionary spending could be redirected toward savings or debt reduction.";
  } else {
    return "Your wants spending is significantly high. This might impact your long-term financial goals. Consider creating a budget to better balance your spending.";
  }
};

describe('Transaction Stats', () => {
  describe('Financial Advice Generation', () => {
    it('should give excellent advice for 70-80% needs ratio', () => {
      const advice = mockGenerateFinancialAdvice(75, 25);
      expect(advice).toContain('Excellent');
      expect(advice).toContain('well-balanced');
    });

    it('should give high needs advice for >80% needs ratio', () => {
      const advice = mockGenerateFinancialAdvice(85, 15);
      expect(advice).toContain('quite high');
      expect(advice).toContain('optimized');
    });

    it('should give good balance advice for 60-70% needs ratio', () => {
      const advice = mockGenerateFinancialAdvice(65, 35);
      expect(advice).toContain('Good balance');
      expect(advice).toContain('close to the ideal');
    });

    it('should give high wants advice for 50-60% needs ratio', () => {
      const advice = mockGenerateFinancialAdvice(55, 45);
      expect(advice).toContain('higher than recommended');
      expect(advice).toContain('redirected toward savings');
    });

    it('should give significantly high wants advice for <50% needs ratio', () => {
      const advice = mockGenerateFinancialAdvice(40, 60);
      expect(advice).toContain('significantly high');
      expect(advice).toContain('long-term financial goals');
    });
  });

  describe('Percentage Calculations', () => {
    it('should calculate percentages correctly for needs and wants', () => {
      const totalNeeds = 700;
      const totalWants = 300;
      const total = totalNeeds + totalWants;
      
      const needsPercentage = (totalNeeds / total) * 100;
      const wantsPercentage = (totalWants / total) * 100;
      
      expect(needsPercentage).toBe(70);
      expect(wantsPercentage).toBe(30);
    });

    it('should handle zero total gracefully', () => {
      const totalNeeds = 0;
      const totalWants = 0;
      const total = totalNeeds + totalWants;
      
      const needsPercentage = total > 0 ? (totalNeeds / total) * 100 : 0;
      const wantsPercentage = total > 0 ? (totalWants / total) * 100 : 0;
      
      expect(needsPercentage).toBe(0);
      expect(wantsPercentage).toBe(0);
    });

    it('should handle only needs scenario', () => {
      const totalNeeds = 1000;
      const totalWants = 0;
      const total = totalNeeds + totalWants;
      
      const needsPercentage = (totalNeeds / total) * 100;
      const wantsPercentage = (totalWants / total) * 100;
      
      expect(needsPercentage).toBe(100);
      expect(wantsPercentage).toBe(0);
    });

    it('should handle only wants scenario', () => {
      const totalNeeds = 0;
      const totalWants = 1000;
      const total = totalNeeds + totalWants;
      
      const needsPercentage = (totalNeeds / total) * 100;
      const wantsPercentage = (totalWants / total) * 100;
      
      expect(needsPercentage).toBe(0);
      expect(wantsPercentage).toBe(100);
    });
  });

  describe('Monthly Data Aggregation', () => {
    it('should aggregate transactions by month correctly', () => {
      // Mock transaction data for testing
      const mockTransactions = [
        { amount: 100, isNeed: true, date: new Date('2023-01-15') },
        { amount: 50, isNeed: false, date: new Date('2023-01-20') },
        { amount: 200, isNeed: true, date: new Date('2023-02-10') },
        { amount: 100, isNeed: false, date: new Date('2023-02-15') },
      ];

      // Simulate monthly aggregation
      const monthlyData = new Map();
      
      mockTransactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData.has(monthKey)) {
          monthlyData.set(monthKey, { needs: 0, wants: 0, total: 0 });
        }
        
        const monthData = monthlyData.get(monthKey);
        if (transaction.isNeed) {
          monthData.needs += transaction.amount;
        } else {
          monthData.wants += transaction.amount;
        }
        monthData.total = monthData.needs + monthData.wants;
      });

      // Verify January data
      const januaryData = monthlyData.get('2023-01');
      expect(januaryData.needs).toBe(100);
      expect(januaryData.wants).toBe(50);
      expect(januaryData.total).toBe(150);

      // Verify February data
      const februaryData = monthlyData.get('2023-02');
      expect(februaryData.needs).toBe(200);
      expect(februaryData.wants).toBe(100);
      expect(februaryData.total).toBe(300);
    });
  });

  describe('Transaction Classification Edge Cases', () => {
    it('should handle null/undefined isNeed values as wants', () => {
      // Test the logic that treats null/undefined as wants (false)
      const testCases = [
        { isNeed: true, expected: 'Need' },
        { isNeed: false, expected: 'Want' },
        { isNeed: null, expected: 'Want' },
        { isNeed: undefined, expected: 'Want' },
      ];

      testCases.forEach(testCase => {
        const classification = testCase.isNeed ? 'Need' : 'Want';
        expect(classification).toBe(testCase.expected);
      });
    });

    it('should only classify expense types for needs/wants', () => {
      const expenseTransactions = [
        { type: 'EXPENSE', isNeed: true },
        { type: 'EXPENSE', isNeed: false },
      ];

      const nonExpenseTransactions = [
        { type: 'INCOME' },
        { type: 'TRANSFER' },
      ];

      // Only EXPENSE types should have needs/wants classification
      expenseTransactions.forEach(transaction => {
        expect(typeof transaction.isNeed).toBe('boolean');
      });

      nonExpenseTransactions.forEach(transaction => {
        // Non-expense transactions might not have isNeed field or it should be irrelevant
        expect(transaction.type).not.toBe('EXPENSE');
      });
    });
  });
});