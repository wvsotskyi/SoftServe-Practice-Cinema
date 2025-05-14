import { Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '@utils/db.js';
import { z } from 'zod';
import { JwtPayloadSchema } from 'types/schemas.js';

const JWT_SECRET = z.string().min(32).parse(process.env.JWT_SECRET);

export async function authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Authorization header missing or invalid' });
      return;
    }

    const token = authHeader.split(' ')[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const payload = JwtPayloadSchema.safeParse(decoded);
    if (!payload.success) {
      res.status(401).json({
        message: 'Invalid token payload',
        errors: payload.error.errors
      });
      return;
    }

    const session = await prisma.session.findUnique({
      where: { id: payload.data.sessionId },
      select: { expiresAt: true, userId: true }
    });

    if (!session) {
      res.status(401).json({ message: 'Session not found' });
      return;
    }

    if (session.expiresAt < new Date()) {
      res.status(401).json({ message: 'Session expired' });
      return;
    }

    if (session.userId !== payload.data.userId) {
      res.status(401).json({ message: 'Session user mismatch' });
      return;
    }

    req.user = payload.data;
    next();

  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: 'Token expired' });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    next(error);
  }
}

export function verifyAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  if (req.user.role !== Role.ADMIN) {
    res.status(403).json({ message: 'Admin access required' });
    return;
  }

  next();
}