// Utility functions for mobile transaction calculations
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

export const getAdviceColor = (advice: string): string => {
  if (advice.includes('Excellent')) return '#10B981';
  if (advice.includes('Good balance')) return '#3B82F6';
  if (advice.includes('quite high')) return '#F59E0B';
  return '#EF4444';
};

export const validateTransactionForm = (formData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!formData.accountId) {
    errors.push('Account is required');
  }
  
  if (!formData.amount || parseFloat(formData.amount) <= 0) {
    errors.push('Amount must be greater than 0');
  }
  
  if (!formData.date) {
    errors.push('Date is required');
  }
  
  if (formData.type === 'EXPENSE' && formData.isNeed === undefined) {
    errors.push('Need/Want classification is required for expenses');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Test suite
describe('Mobile Transaction Calculations', () => {
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
  });

  describe('getAdviceColor', () => {
    it('should return green for excellent advice', () => {
      const color = getAdviceColor('Excellent! Your spending ratio is well-balanced.');
      expect(color).toBe('#10B981');
    });

    it('should return blue for good balance advice', () => {
      const color = getAdviceColor('Good balance! You\'re close to ideal.');
      expect(color).toBe('#3B82F6');
    });

    it('should return amber for high needs advice', () => {
      const color = getAdviceColor('Your needs are quite high.');
      expect(color).toBe('#F59E0B');
    });

    it('should return red for high wants advice', () => {
      const color = getAdviceColor('Your wants spending is significantly high.');
      expect(color).toBe('#EF4444');
    });
  });

  describe('validateTransactionForm', () => {
    it('should validate a complete expense transaction', () => {
      const formData = {
        accountId: 'account-123',
        amount: '100',
        type: 'EXPENSE',
        category: 'FOOD',
        description: 'Grocery shopping',
        isNeed: true,
        date: '2023-01-15',
      };
      
      const result = validateTransactionForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate a complete income transaction', () => {
      const formData = {
        accountId: 'account-123',
        amount: '1000',
        type: 'INCOME',
        category: 'INCOME',
        description: 'Salary',
        isNeed: undefined, // Not required for income
        date: '2023-01-15',
      };
      
      const result = validateTransactionForm(formData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject transaction without account', () => {
      const formData = {
        accountId: '',
        amount: '100',
        type: 'EXPENSE',
        isNeed: true,
        date: '2023-01-15',
      };
      
      const result = validateTransactionForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Account is required');
    });

    it('should reject transaction with invalid amount', () => {
      const formData = {
        accountId: 'account-123',
        amount: '0',
        type: 'EXPENSE',
        isNeed: true,
        date: '2023-01-15',
      };
      
      const result = validateTransactionForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Amount must be greater than 0');
    });

    it('should reject transaction without date', () => {
      const formData = {
        accountId: 'account-123',
        amount: '100',
        type: 'EXPENSE',
        isNeed: true,
        date: '',
      };
      
      const result = validateTransactionForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Date is required');
    });

    it('should reject expense without need/want classification', () => {
      const formData = {
        accountId: 'account-123',
        amount: '100',
        type: 'EXPENSE',
        isNeed: undefined,
        date: '2023-01-15',
      };
      
      const result = validateTransactionForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Need/Want classification is required for expenses');
    });

    it('should collect multiple errors', () => {
      const formData = {
        accountId: '',
        amount: '0',
        type: 'EXPENSE',
        isNeed: undefined,
        date: '',
      };
      
      const result = validateTransactionForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
    });
  });
});

// Mock test for mobile component behavior
describe('Mobile Component Behavior', () => {
  it('should show classification radio buttons for expense type', () => {
    const transactionType = 'EXPENSE';
    const showClassification = transactionType === 'EXPENSE';
    expect(showClassification).toBe(true);
  });

  it('should hide classification radio buttons for non-expense types', () => {
    const nonExpenseTypes = ['INCOME', 'TRANSFER'];
    nonExpenseTypes.forEach(type => {
      const showClassification = type === 'EXPENSE';
      expect(showClassification).toBe(false);
    });
  });

  it('should format currency correctly for display', () => {
    const amounts = [100, 1234.56, 0.99];
    const expected = ['$100.00', '$1,234.56', '$0.99'];
    
    amounts.forEach((amount, index) => {
      const formatted = `$${amount.toFixed(2)}`;
      expect(formatted).toBe(expected[index]);
    });
  });

  it('should calculate progress bar width correctly', () => {
    const percentages = [0, 25, 50, 75, 100, 150]; // 150% should be capped at 100%
    const expected = ['0%', '25%', '50%', '75%', '100%', '100%'];
    
    percentages.forEach((percentage, index) => {
      const width = `${Math.min(percentage, 100)}%`;
      expect(width).toBe(expected[index]);
    });
  });
});