import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '@utils/db.js';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Properly typed middleware that doesn't return a Response
export async function authenticate  (req: Request, res: Response, next: NextFunction): Promise<void>  {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    
    const session = await prisma.session.findUnique({
      where: { id: decoded.sessionId }
    });

    if (!session || session.expiresAt < new Date()) {
      res.status(401).json({ message: 'Session expired' });
      return;
    }

    req.user = {
      userId: decoded.userId as number,
      role: decoded.role as string,
      sessionId: decoded.sessionId as string
    };

    next();
  } catch (error) {
    next(error); // Pass to error handler middleware
  }
};

// Middleware factory for routes
export function authenticated()  {
  return (req: Request, res: Response, next: NextFunction) => {
    authenticate(req, res, next).catch(next);
  };
};

export async function verifyAdmin (req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user; 
    
    if (!user || user.role !== 'ADMIN') {
      throw new Error('Unauthorized - Admin access required');
    }
    
    next();
  } catch (error) {
    next(error);
  }
};