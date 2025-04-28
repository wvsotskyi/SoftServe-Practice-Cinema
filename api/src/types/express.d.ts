import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        role: string;
        sessionId: string;
      };
    }
  }
}

export {}; // Important for module augmentation