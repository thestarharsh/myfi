import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../middleware/auth.middleware';
import { CreateAccountDto, UpdateAccountDto } from '@finance-app/shared';

export const getAccounts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accounts = await prisma.account.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'desc' },
    });

    res.json({
      success: true,
      data: accounts,
    });
  } catch (error) {
    next(error);
  }
};

export const getAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const account = await prisma.account.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!account) {
      throw new AppError('Account not found', 404);
    }

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const createAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, type, balance, currency }: CreateAccountDto = req.body;

    const account = await prisma.account.create({
      data: {
        userId: req.userId!,
        name,
        type,
        balance: balance || 0,
        currency: currency || 'USD',
      },
    });

    res.status(201).json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const updateAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, type, balance }: UpdateAccountDto = req.body;

    // Verify account belongs to user
    const existingAccount = await prisma.account.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!existingAccount) {
      throw new AppError('Account not found', 404);
    }

    const account = await prisma.account.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(type && { type }),
        ...(balance !== undefined && { balance }),
      },
    });

    res.json({
      success: true,
      data: account,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    // Verify account belongs to user
    const account = await prisma.account.findFirst({
      where: {
        id,
        userId: req.userId!,
      },
    });

    if (!account) {
      throw new AppError('Account not found', 404);
    }

    await prisma.account.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};


