import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateGoalDto, UpdateGoalDto } from '@finance-app/shared';

export const getGoals = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const goals = await prisma.goal.findMany({
      where: { userId: req.userId! },
      orderBy: { targetDate: 'asc' },
    });

    res.json({
      success: true,
      data: goals,
    });
  } catch (error) {
    next(error);
  }
};

export const getGoal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!goal) {
      throw new AppError('Goal not found', 404);
    }

    res.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, targetAmount, targetDate, currency }: CreateGoalDto = req.body;

    const goal = await prisma.goal.create({
      data: {
        userId: req.userId!,
        name,
        targetAmount,
        currentAmount: 0,
        targetDate: new Date(targetDate),
        currency: currency || 'USD',
      },
    });

    res.status(201).json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, targetAmount, currentAmount, targetDate }: UpdateGoalDto = req.body;

    // Verify goal belongs to user
    const existingGoal = await prisma.goal.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!existingGoal) {
      throw new AppError('Goal not found', 404);
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(targetAmount !== undefined && { targetAmount }),
        ...(currentAmount !== undefined && { currentAmount }),
        ...(targetDate && { targetDate: new Date(targetDate) }),
      },
    });

    res.json({
      success: true,
      data: goal,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Verify goal belongs to user
    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!goal) {
      throw new AppError('Goal not found', 404);
    }

    await prisma.goal.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Goal deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


