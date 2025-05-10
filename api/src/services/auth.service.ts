import bcrypt from 'bcrypt';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '@utils/db.js';
import { User } from '@prisma/client';

const JWT_CONFIG = {
  secret: process.env.JWT_SECRET as Secret || 'random-strong-secret',
  options: {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    algorithm: 'HS256' as const
  } as SignOptions
};

const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

interface TokenPayload {
  userId: number;
  role: string;
  sessionId: string;
}

export async function registerUser(
  email: string,
  password: string,
  name?: string
): Promise<Omit<User, 'password'>> {
  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    throw new Error('Email already in use');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name }
  });

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid email or password');
  }

  // Create session and refresh token
  const session = await prisma.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
    }
  });

  const refreshToken = await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: uuidv4(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
    }
  });

  // Create JWT payload
  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
    sessionId: session.id
  };

  // Sign token with proper typing
  const accessToken = jwt.sign(
    payload,
    JWT_CONFIG.secret,
    JWT_CONFIG.options
  );

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    tokens: {
      accessToken,
      refreshToken: refreshToken.token
    }
  };
};

export async function refreshAccessToken  (refreshToken: string)  {
  const tokenData = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true }
  });

  if (!tokenData || tokenData.expiresAt < new Date()) {
    throw new Error('Invalid or expired refresh token');
  }

  // Create new session
  const newSession = await prisma.session.create({
    data: {
      userId: tokenData.user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
    }
  });

  // Create JWT payload
  const payload: TokenPayload = {
    userId: tokenData.user.id,
    role: tokenData.user.role,
    sessionId: newSession.id
  };

  // Sign new token
  const newAccessToken = jwt.sign(
    payload,
    JWT_CONFIG.secret,
    JWT_CONFIG.options
  );

  return {
    accessToken: newAccessToken,
    user: {
      id: tokenData.user.id,
      email: tokenData.user.email,
      name: tokenData.user.name,
      role: tokenData.user.role
    }
  };
};

export async function logoutUser(sessionId: string, refreshToken?: string) {
  await prisma.session.delete({ where: { id: sessionId } });

  if (refreshToken) {
    await prisma.refreshToken.delete({ where: { token: refreshToken } });
  }
};