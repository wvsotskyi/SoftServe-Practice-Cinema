import { Request, Response } from 'express';
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser
} from '@services/auth.service.js';
import { APIResponse } from '@utils/apiResponse.js';
import prisma from '@utils/db.js';

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return APIResponse(res, {
        status: 400,
        message: 'Email and password are required'
      });
    }

    const user = await registerUser(email, password, name);

    return APIResponse(res, {
      status: 201,
      message: 'User registered successfully',
      data: user
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Registration failed'
    });
  }
};

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return APIResponse(res, {
        status: 400,
        message: 'Email and password are required'
      });
    }

    const { user, tokens } = await loginUser(email, password);

    // Set refresh token as HTTP-only cookie
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return APIResponse(res, {
      status: 200,
      message: 'Login successful',
      data: {
        user,
        accessToken: tokens.accessToken
      }
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 401,
      message: error.message || 'Login failed'
    });
  }
};

export async function refreshToken(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return APIResponse(res, {
        status: 401,
        message: 'Refresh token is required'
      });
    }

    const { accessToken, user } = await refreshAccessToken(refreshToken);

    return APIResponse(res, {
      status: 200,
      message: 'Token refreshed successfully',
      data: {
        user,
        accessToken
      }
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 401,
      message: error.message || 'Token refresh failed'
    });
  }
};

export async function logout  (req: Request, res: Response)  {
  try {
    const sessionId = req.user?.sessionId;
    const refreshToken = req.cookies.refreshToken;

    if (sessionId) {
      await logoutUser(sessionId, refreshToken);
    }

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    return APIResponse(res, {
      status: 200,
      message: 'Logout successful'
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 400,
      message: error.message || 'Logout failed'
    });
  }
};

export async function getCurrentUser(req: Request, res: Response) {
  try {
    if (!req.user) {
      return APIResponse(res, {
        status: 401,
        message: 'Not authenticated'
      });
    }

    // Get fresh user data from database (optional - you could just return req.user)
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    if (!user) {
      return APIResponse(res, {
        status: 404,
        message: 'User not found'
      });
    }

    return APIResponse(res, {
      status: 200,
      message: 'Current user retrieved successfully',
      data: user
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 500,
      message: error.message || 'Failed to get current user'
    });
  }
}