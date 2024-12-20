import { Request, Response } from "express";
import User from "../models/users.models";
import { BOOL_TRUE, CODE_200, CODE_201, CODE_400, INVLD_CRED, INVLD_REFERRER_CODE, LOG_IN, LOGOUT_SUCCESSFULLY, NOT_LOG_IN, USER_CRT, USER_NOT_CRT, USER_NOT_FOUND } from "../utils/constants";
import ApiError from "../errors/ApiError";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import ApiResponse from "../errors/ApiResponseCode";
import passport from "passport";
dotenv.config();

interface IUserLogin {
  username: string,
  email: string,
  password: string
}

// Code Generator
const generateUniqueReferralCode = (username: string): string => {
  return `${username}-${Date.now().toString(12)}`;
};

// Register
export const register = async (req: Request, res: Response): Promise<void> => {

  const { username, email, password }: IUserLogin = req.body;
  try {

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const referrerId = generateUniqueReferralCode(username);

    const userCr = await User.create({ username, email, password: hashedPassword, referrerId });
    res.status(CODE_201).json(new ApiResponse(CODE_201, userCr, USER_CRT, BOOL_TRUE))
  }
  catch (error) {
    res.status(CODE_400).json(new ApiError(USER_NOT_CRT, CODE_400))
  }
}


// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password }: IUserLogin = req.body;
  try {

    const user = await User.findOne({ email });

    if (!user) res.status(CODE_400).json(new ApiError(USER_NOT_FOUND, CODE_400));

    const isMatch = await bcrypt.compare(password, user!.password);
    if (!isMatch) res.status(CODE_400).json(new ApiError(INVLD_CRED, CODE_400));

    const token = jwt.sign({ id: user!._id, username: user!.username, email: user!.email }, process.env.JWTSECRET as string, { expiresIn: "1h" });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    passport.authenticate("local", { failureRedirect: "/register" })
    res.status(CODE_201).json(new ApiResponse(CODE_201, user, LOG_IN, BOOL_TRUE))
  } catch (error) {
    console.log(error)
    res.status(CODE_400).json(new ApiError(NOT_LOG_IN, CODE_400));
  }
}

// Logout
export const logout = (req: Request, res: Response) => {
  res.clearCookie("token").status(CODE_200).json(new ApiResponse(CODE_200, {}, LOGOUT_SUCCESSFULLY, BOOL_TRUE));
}

