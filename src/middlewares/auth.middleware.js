import { application } from "express";
import { asyncHandler } from "../utils/asyncHandler";
 export const verifyJWT = asyncHandler(async (req, res, next) => {
    const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(401, "Authentication token is missing");
    }
   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
 });