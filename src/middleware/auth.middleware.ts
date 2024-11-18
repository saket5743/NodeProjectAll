import { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken'
import { CODE_401, INVLD_TOKEN, UNAUTHORIZED } from '../utils/constants';
import ApiError from '../errors/ApiError';
dotenv.config()

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) return res.status(CODE_401).json(new ApiError(UNAUTHORIZED, CODE_401));

  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET as string);
    req.body.user = decoded;
    next();
  } catch (error) {
    res.status(CODE_401).json(new ApiError(INVLD_TOKEN, CODE_401));
  }
}
