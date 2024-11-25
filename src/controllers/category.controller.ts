import { Request, Response } from "express";
import asyncWrapper from "../middleware/asyncwrapper";
import Category from "../models/category.models";
import { BOOL_TRUE, CODE_200, CODE_400, CODE_404, CREATED, NOT_FOUND, PRODUCT_EXIST, SUCCESS, UPDATED } from "../utils/constants";
import ApiResponse from "../errors/ApiResponseCode";
import ApiError from "../errors/ApiError";

// Create a category
export const createCategory = asyncWrapper(async (req: Request, res: Response) => {
  const { name } = req.body;
  const category = await Category.create(req.body);
  await category.save();
  const categoryExist = await Category.findOne(name);
  if (categoryExist) {
    return new ApiError(PRODUCT_EXIST, CODE_400)
  }

  if (!category) {
    return res.json(new ApiError(NOT_FOUND, CODE_404))
  }
  res.status(CODE_200).json(new ApiResponse(CODE_200, category, CREATED, BOOL_TRUE))
})

// Find All
export const categoryAll = asyncWrapper(async (req: Request, res: Response) => {
  const category = await Category.find();
  if (!category) {
    return res.json(new ApiError(NOT_FOUND, CODE_404))
  }
  return res.status(CODE_200).json(new ApiResponse(CODE_200, category, SUCCESS, BOOL_TRUE))
})

// Get by id
export const categoryById = asyncWrapper(async (req: Request, res: Response) => {
  const { id: catId } = req.params;
  const category = await Category.findById({ _id: catId });
  if (!category) {
    return res.json(new ApiError(NOT_FOUND, CODE_404))
  }
  return res.status(CODE_200).json(new ApiResponse(CODE_200, category, SUCCESS, BOOL_TRUE))
})

// Update by id
export const categoryUpdate = asyncWrapper(async (req: Request, res: Response) => {
  const { id: catId } = req.params;
  const category = await Category.findByIdAndUpdate({ _id: catId }, req.body, {
    new: true,
    runValidators: true,
    overwrite: true,
  })
  if (!category) {
    return res.json(new ApiError(NOT_FOUND, CODE_404))
  }
  return res.json(new ApiResponse(CODE_200, category, UPDATED, BOOL_TRUE))
})


// Delete by id
export const categoryDelete = asyncWrapper(async (req: Request, res: Response) => {
  const { id: catId } = req.params;
  const category = await Category.findByIdAndDelete({ _id: catId }, req.body);
  if (!category) {
    return res.json(new ApiError(NOT_FOUND, CODE_404))
  }
  return res.status(CODE_200).json(new ApiResponse(CODE_200, category, SUCCESS, BOOL_TRUE))
})
