import { Response } from "express";

interface APIResponseOptions {
  status: number;
  message: string;
  data?: any;
  errors?: any;
}

export function APIResponse (
  res: Response,
  { status, message, data, errors }: APIResponseOptions
)  {
  return res.status(status).json({
    success: status >= 200 && status < 300,
    message,
    data,
    errors,
  });
};