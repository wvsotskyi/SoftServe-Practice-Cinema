import { Request, Response } from 'express';
import { getHallWithSeats, getHallSize, getAllHalls, getAllHallsBasic } from '@services/hall.service.js';
import { APIResponse } from '@utils/apiResponse.js';

export async function getHallWithSeatsController(req: Request, res: Response) {
  try {
    const { hallId } = req.params;
    const { showtimeId } = req.query;

    const hall = await getHallWithSeats(
      Number(hallId),
      showtimeId ? Number(showtimeId) : undefined
    );

    if (!hall) {
      return APIResponse(res, {
        status: 404,
        message: 'Hall not found'
      });
    }

    return APIResponse(res, {
      status: 200,
      message: 'Hall with seats retrieved successfully',
      data: hall
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: error.status || 500,
      message: error.message || 'Failed to retrieve hall with seats'
    });
  }
};

export async function getHallSizeController(req: Request, res: Response) {
  try {
    const { hallId } = req.params;
    const hallSize = await getHallSize(Number(hallId));

    if (!hallSize) {
      return APIResponse(res, {
        status: 404,
        message: 'Hall not found or has no seats'
      });
    }

    return APIResponse(res, {
      status: 200,
      message: 'Hall size retrieved successfully',
      data: hallSize
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: error.status || 500,
      message: error.message || 'Failed to retrieve hall size'
    });
  }
};

export async function getAllHallsController(req: Request, res: Response) {
  try {
    const { showtimeId } = req.query;
    const halls = await getAllHalls(showtimeId ? Number(showtimeId) : undefined);

    return APIResponse(res, {
      status: 200,
      message: 'Halls retrieved successfully',
      data: halls
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 500,
      message: error.message || 'Failed to retrieve halls'
    });
  }
};

export async function getAllHallsBasicController(req: Request, res: Response) {
  try {
    const halls = await getAllHallsBasic();

    return APIResponse(res, {
      status: 200,
      message: 'Halls retrieved successfully',
      data: halls
    });
  } catch (error: any) {
    return APIResponse(res, {
      status: 500,
      message: error.message || 'Failed to retrieve halls'
    });
  }
};