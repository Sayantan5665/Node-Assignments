import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ITokenUser } from '../interfaces/user.interface';
import userRepositories from 'app/modules/user.module/repositories/user.repositories';


declare global {
  namespace Express {
    interface Request {
      user?: ITokenUser;
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

    const decoded: ITokenUser = jwt.verify(token, process.env.JWT_SECRET!) as ITokenUser;
    const _user = await userRepositories.findOneBy('email', decoded.email);
    if (!_user) {
      res.status(401).json({ message: 'Invalid authentication token' });
      return
    }
    req.user = { ...decoded };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication token' });
  }
};

export const authorize = (...roles:Array<"admin" | "student" | "teacher">) => {
  return (req:Request, res:Response, next:NextFunction) => {
    if (!req.user?.role.role || !roles.includes(req.user.role.role)) {
      res.status(403).json({ 
        message: 'You do not have permission to perform this action'
      });
    }
    next();
  };
};