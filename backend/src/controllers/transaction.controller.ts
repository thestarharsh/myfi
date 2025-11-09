import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateTransactionDto, UpdateTransactionDto, PaginationParams } from '@finance-app/shared';

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


