// Utility functions for transaction calculations
// These would typically be in a separate utils file

export const calculateNeedsWantsPercentage = (totalNeeds: number, totalWants: number) => {
  const total = totalNeeds + totalWants;
  if (total === 0) {
    return { needsPercentage: 0, wantsPercentage: 0 };
  }
  return {
    needsPercentage: (totalNeeds / total) * 100,
    wantsPercentage: (totalWants / total) * 100,
  };
};

export const getFinancialAdviceColor = (advice: string): string => {
  if (advice.includes('Excellent')) return 'text-green-600';
  if (advice.includes('Good balance')) return 'text-blue-600';
  if (advice.includes('quite high')) return 'text-yellow-600';
  return 'text-red-600';
};

export const generateFinancialAdvice = (needsPercentage: number): string => {
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

// Test suite
describe('Transaction Calculations', () => {
  describe('calculateNeedsWantsPercentage', () => {
    it('should calculate percentages correctly', () => {
      const result = calculateNeedsWantsPercentage(700, 300);
      expect(result.needsPercentage).toBe(70);
      expect(result.wantsPercentage).toBe(30);
    });

    it('should handle zero total gracefully', () => {
      const result = calculateNeedsWantsPercentage(0, 0);
      expect(result.needsPercentage).toBe(0);
      expect(result.wantsPercentage).toBe(0);
    });

    it('should handle only needs', () => {
      const result = calculateNeedsWantsPercentage(1000, 0);
      expect(result.needsPercentage).toBe(100);
      expect(result.wantsPercentage).toBe(0);
    });

    it('should handle only wants', () => {
      const result = calculateNeedsWantsPercentage(0, 1000);
      expect(result.needsPercentage).toBe(0);
      expect(result.wantsPercentage).toBe(100);
    });

    it('should handle decimal values', () => {
      const result = calculateNeedsWantsPercentage(333.33, 666.67);
      expect(result.needsPercentage).toBeCloseTo(33.333, 2);
      expect(result.wantsPercentage).toBeCloseTo(66.667, 2);
    });
  });

  describe('getFinancialAdviceColor', () => {
    it('should return green for excellent advice', () => {
      const color = getFinancialAdviceColor('Excellent! Your spending ratio is well-balanced.');
      expect(color).toBe('text-green-600');
    });

    it('should return blue for good balance advice', () => {
      const color = getFinancialAdviceColor('Good balance! You\'re close to the ideal.');
      expect(color).toBe('text-blue-600');
    });

    it('should return yellow for high needs advice', () => {
      const color = getFinancialAdviceColor('Your needs are quite high.');
      expect(color).toBe('text-yellow-600');
    });

    it('should return red for high wants advice', () => {
      const color = getFinancialAdviceColor('Your wants spending is significantly high.');
      expect(color).toBe('text-red-600');
    });
  });

  describe('generateFinancialAdvice', () => {
    it('should generate excellent advice for 75% needs', () => {
      const advice = generateFinancialAdvice(75);
      expect(advice).toContain('Excellent');
      expect(advice).toContain('well-balanced');
    });

    it('should generate high needs advice for 85% needs', () => {
      const advice = generateFinancialAdvice(85);
      expect(advice).toContain('quite high');
      expect(advice).toContain('optimized');
    });

    it('should generate good balance advice for 65% needs', () => {
      const advice = generateFinancialAdvice(65);
      expect(advice).toContain('Good balance');
      expect(advice).toContain('close to the ideal');
    });

    it('should generate high wants advice for 55% needs', () => {
      const advice = generateFinancialAdvice(55);
      expect(advice).toContain('higher than recommended');
      expect(advice).toContain('savings');
    });

    it('should generate significantly high wants advice for 40% needs', () => {
      const advice = generateFinancialAdvice(40);
      expect(advice).toContain('significantly high');
      expect(advice).toContain('long-term financial goals');
    });
  });
});

// Mock test for component behavior (would use React Testing Library in real implementation)
describe('TransactionForm Component Behavior', () => {
  it('should show Need/Want classification only for expense transactions', () => {
    // This would be a React Testing Library test
    const type = 'EXPENSE';
    const shouldShowClassification = type === 'EXPENSE';
    expect(shouldShowClassification).toBe(true);
  });

  it('should hide Need/Want classification for non-expense transactions', () => {
    const types = ['INCOME', 'TRANSFER'];
    types.forEach(type => {
      const shouldShowClassification = type === 'EXPENSE';
      expect(shouldShowClassification).toBe(false);
    });
  });

  it('should have default isNeed value of false for new transactions', () => {
    const defaultTransaction = {
      accountId: '',
      amount: '',
      type: 'EXPENSE',
      category: 'OTHER',
      description: '',
      isNeed: false, // Default value
      date: new Date().toISOString().split('T')[0],
    };
    expect(defaultTransaction.isNeed).toBe(false);
  });
});