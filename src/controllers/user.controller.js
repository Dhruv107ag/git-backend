import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import upload from "../middlewares/multer.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const generateAccessAndRefreshTokens = async(userId) => {
  try {
    const user=await User.findById(User.id);
    refreshToken=user.generateRefreshToken();
    accessToken=user.generateAccessToken();
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});
    return {accessToken,refreshToken};
  }
  catch(error){
    throw new ApiError(500,"Failed to generate tokens");
  }
};
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, password, username } = req.body;

  if (!fullName) throw new ApiError(400, "Name is required");
  if (!email) throw new ApiError(400, "Email is required");
  if (!password) throw new ApiError(400, "Password is required");
  if (!username) throw new ApiError(400, "Username is required");

  // ✅ await added
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with this email or username already exists");
  }

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar image is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath
    ? await uploadOnCloudinary(coverImageLocalPath)
    : null;

  if (!avatar) {
    throw new ApiError(500, "Failed to upload avatar image");
  }

  // ✅ Model overwrite fixed
  const createdUser = await User.create({
    fullName,
    email,
    password,
    avatar: avatar.url,
    coverImage: coverImage?.url || null,
    username: username.toLowerCase().trim(),
  });

  const safeUser = await User.findById(createdUser._id).select(
    "-password -refreshToken"
  );

  if (!safeUser) {
    throw new ApiError(500, "Failed to create user");
  }

  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", safeUser)
  );
});

const loginUser = asyncHandler(async (req, res) => {
  //req body se data lena
  //username or email pe login
  //find user
  //password match krna
  //access token and refresh token generate krna
  const {email,password,username}=req.body;

  if(!email || !username) throw new ApiError(400,"Email or username is required");
  if(!password) throw new ApiError(400,"Password is required");
  const  user =await User.findOne({ $or: [{ email }, { username }]});
  if(!user) throw new ApiError(404,"User not found");
  const isPasswordMatch = await user.comparePassword(password);
  if(!isPasswordMatch) throw new ApiError(401,"Invalid password");
  const {refreshToken,accessToken}=await generateAccessAndRefreshTokens(user._id);
const loggedInUser=await User.findById(user._id).select("-password -refreshToken");
const options={httpOnly:true,secure:true}
return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).cookie("accessToken",accessToken,options).json(new ApiResponse(200,"User logged in successfully",{user:loggedInUser,accessToken,refreshToken}));
});










































export { registerUser }
{ loginUser };
