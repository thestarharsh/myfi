import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateBudgetDto, UpdateBudgetDto } from '@finance-app/shared';

export const getBudgets = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const budgets = await prisma.budget.findMany({
      where: { userId: req.userId! },
      orderBy: { startDate: 'desc' },
    });

    res.json({
      success: true,
      data: budgets,
    });
  } catch (error) {
    next(error);
  }
};

export const getBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const createBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, amount, period, startDate, endDate, currency }: CreateBudgetDto = req.body;

    const budget = await prisma.budget.create({
      data: {
        userId: req.userId!,
        category,
        amount,
        period,
        spent: 0,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        currency: currency || 'USD',
      },
    });

    res.status(201).json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { category, amount, period, startDate, endDate }: UpdateBudgetDto = req.body;

    // Verify budget belongs to user
    const existingBudget = await prisma.budget.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!existingBudget) {
      throw new AppError('Budget not found', 404);
    }

    const budget = await prisma.budget.update({
      where: { id },
      data: {
        ...(category && { category }),
        ...(amount !== undefined && { amount }),
        ...(period && { period }),
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate && { endDate: new Date(endDate) }),
      },
    });

    res.json({
      success: true,
      data: budget,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBudget = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Verify budget belongs to user
    const budget = await prisma.budget.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!budget) {
      throw new AppError('Budget not found', 404);
    }

    await prisma.budget.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Budget deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


