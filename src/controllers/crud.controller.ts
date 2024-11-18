import { Request, Response } from "express";
import User from "../models/users.models";
import { BOOL_TRUE, CODE_200, CODE_400, ERR_FOUND, USER_NOT_FOUND, USR_DELE, USR_UPDTD } from "../utils/constants";
import ApiResponse from "../errors/ApiResponseCode";
import ApiError from "../errors/ApiError";
import asyncWrapper from "../middleware/asyncwrapper";

// Update
export const updateUserById = asyncWrapper(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  try {
    const user = await User.findByIdAndUpdate({ _id: taskId }, req.body, {
      new: true,
      runValidators: true,
      overwrite: true
    });
    res.status(CODE_200).json(new ApiResponse(CODE_200, user, USR_UPDTD, BOOL_TRUE));
  } catch (error) {
    res.status(CODE_400).json(new ApiError(USER_NOT_FOUND, CODE_400));
  }
})

// Delete
export const deleteUser = asyncWrapper(async (req: Request, res: Response) => {
  const { id: taskId } = req.params;
  try {
    const user = await User.findByIdAndDelete({ _id: taskId })
    res.status(CODE_200).json(new ApiResponse(CODE_200, user, USR_DELE, BOOL_TRUE));
  } catch (error) {
    res.status(CODE_400).json(new ApiError(ERR_FOUND, CODE_400));
  }
})
