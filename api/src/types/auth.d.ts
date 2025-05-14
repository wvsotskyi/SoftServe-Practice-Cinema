import { JwtPayload } from './schemas';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}