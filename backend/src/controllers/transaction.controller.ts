import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateTransactionDto, UpdateTransactionDto, PaginationParams, TransactionStats, MonthlyTransactionData } from '@finance-app/shared';

export const getTransactions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page = 1, limit = 20, accountId, startDate, endDate } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      userId: req.userId!,
    };

    if (accountId) {
      where.accountId = accountId as string;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.date.lte = new Date(endDate as string);
      }
    }

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { date: 'desc' },
        include: {
          account: {
            select: {
              id: true,
              name: true,
              type: true,
            },
          },
        },
      }),
      prisma.transaction.count({ where }),
    ]);

    res.json({
      success: true,
      data: transactions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { accountId, amount, type, category, description, isNeed, date }: CreateTransactionDto = req.body;

    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: req.userId!,
      },
    });

    if (!account) {
      throw new AppError('Account not found', 404);
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: req.userId!,
        accountId,
        amount,
        type,
        category,
        description,
        isNeed: isNeed || false,
        date: new Date(date),
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    // Update account balance
    const balanceChange = type === 'INCOME' ? amount : type === 'EXPENSE' ? -amount : 0;
    await prisma.account.update({
      where: { id: accountId },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    });

    res.status(201).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateTransactionDto = req.body;

    // Verify transaction belongs to user
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!existingTransaction) {
      throw new AppError('Transaction not found', 404);
    }

    // Update transaction
    const transaction = await prisma.transaction.update({
      where: { id },
      data: {
        ...(updateData.accountId && { accountId: updateData.accountId }),
        ...(updateData.amount !== undefined && { amount: updateData.amount }),
        ...(updateData.type && { type: updateData.type }),
        ...(updateData.category && { category: updateData.category }),
        ...(updateData.description !== undefined && { description: updateData.description }),
        ...(updateData.isNeed !== undefined && { isNeed: updateData.isNeed }),
        ...(updateData.date && { date: new Date(updateData.date) }),
      },
      include: {
        account: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Verify transaction belongs to user
    const transaction = await prisma.transaction.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!transaction) {
      throw new AppError('Transaction not found', 404);
    }

    await prisma.transaction.delete({
      where: { id },
    });

    // Revert account balance
    const balanceChange = transaction.type === 'INCOME' ? -transaction.amount : transaction.type === 'EXPENSE' ? transaction.amount : 0;
    await prisma.account.update({
      where: { id: transaction.accountId },
      data: {
        balance: {
          increment: balanceChange,
        },
      },
    });

    res.json({
      success: true,
      message: 'Transaction deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getTransactionStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { months = 12 } = req.query;
    const monthsCount = Number(months);
    
    // Calculate date range for the specified months
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - monthsCount + 1);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Get all expense transactions in the date range
    const transactions = await prisma.transaction.findMany({
      where: {
        userId: req.userId!,
        type: 'EXPENSE',
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        amount: true,
        isNeed: true,
        date: true,
      },
    });

    // Calculate total needs and wants
    const totalNeeds = transactions
      .filter(t => t.isNeed)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalWants = transactions
      .filter(t => !t.isNeed)
      .reduce((sum, t) => sum + t.amount, 0);
    
    const total = totalNeeds + totalWants;
    
    const needsPercentage = total > 0 ? (totalNeeds / total) * 100 : 0;
    const wantsPercentage = total > 0 ? (totalWants / total) * 100 : 0;

    // Group transactions by month
    const monthlyDataMap = new Map<string, MonthlyTransactionData>();
    
    for (let i = 0; i < monthsCount; i++) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                         'July', 'August', 'September', 'October', 'November', 'December'];
      
      monthlyDataMap.set(monthKey, {
        month: monthNames[date.getMonth()],
        year: date.getFullYear(),
        needs: 0,
        wants: 0,
        total: 0,
        needsPercentage: 0,
        wantsPercentage: 0,
      });
    }

    // Populate monthly data
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthlyData = monthlyDataMap.get(monthKey);
      
      if (monthlyData) {
        if (transaction.isNeed) {
          monthlyData.needs += transaction.amount;
        } else {
          monthlyData.wants += transaction.amount;
        }
        monthlyData.total = monthlyData.needs + monthlyData.wants;
        monthlyData.needsPercentage = monthlyData.total > 0 ? (monthlyData.needs / monthlyData.total) * 100 : 0;
        monthlyData.wantsPercentage = monthlyData.total > 0 ? (monthlyData.wants / monthlyData.total) * 100 : 0;
      }
    });

    const monthlyData = Array.from(monthlyDataMap.values()).reverse();

    // Generate financial advice based on the ratio
    const financialAdvice = generateFinancialAdvice(needsPercentage, wantsPercentage);

    const stats: TransactionStats = {
      totalNeeds,
      totalWants,
      needsPercentage,
      wantsPercentage,
      monthlyData,
      financialAdvice,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

const generateFinancialAdvice = (needsPercentage: number, wantsPercentage: number): string => {
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


