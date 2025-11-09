import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import prisma from '../utils/prisma';
import { AppError } from '../middleware/errorHandler';
import { CreateUserDto, LoginDto } from '@finance-app/shared';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password, name, country, currency, language }: CreateUserDto = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        country,
        currency: currency || 'USD',
        language: language || 'en',
      },
      select: {
        id: true,
        email: true,
        name: true,
        country: true,
        currency: true,
        language: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate tokens
    const accessToken = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
    const refreshToken = jwt.sign({ userId: user.id }, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiresIn,
    });

    res.status(201).json({
      success: true,
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password }: LoginDto = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = jwt.sign({ userId: user.id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
    const refreshToken = jwt.sign({ userId: user.id }, config.jwtRefreshSecret, {
      expiresIn: config.jwtRefreshExpiresIn,
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          country: user.country,
          currency: user.currency,
          language: user.language,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token required', 400);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as { userId: string };

    // Generate new access token
    const accessToken = jwt.sign({ userId: decoded.userId }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });

    res.json({
      success: true,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};


