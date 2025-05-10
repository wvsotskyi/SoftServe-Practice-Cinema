import { z } from 'zod';
import { Role } from '@prisma/client';

export const JwtPayloadSchema = z.object({
  userId: z.number().int().positive(),
  role: z.nativeEnum(Role),
  sessionId: z.string().uuid(),
  iat: z.number().optional(),
  exp: z.number().optional()
}).strict();

export type JwtPayload = z.infer<typeof JwtPayloadSchema>;