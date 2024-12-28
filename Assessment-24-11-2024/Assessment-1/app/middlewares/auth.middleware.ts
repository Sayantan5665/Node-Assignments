import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/user.interface';


declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies['x-access-token'] || req.headers["x-access-token"] || req.body['x-access-token'] || req.query['x-access-token'];

    if (!token) {
      res.status(401).json({ message: 'No authentication token provided. Please login first.' });
      return;
    }

    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = { ...decoded };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

export const adminAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.cookies['x-access-token'] || req.headers["x-access-token"] || req.body['x-access-token'] || req.query['x-access-token'];

    if (!token) {
      res.status(401).json({ message: 'No authentication token provided. Please login first.' });
      return;
    }

    const decoded: JwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (decoded.role!== 'admin') {
      res.status(403).json({ message: 'Unauthorized access' });
      return;
    }
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};