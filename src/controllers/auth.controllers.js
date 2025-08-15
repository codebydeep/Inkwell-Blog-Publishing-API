import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.models.js";

import jwt from "jsonwebtoken";

const register = asyncHandler(async(req, res) => {
    const {
        fullname,
        email,
        password
    } = req.body;

    if(!fullname || !email || !password){
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({ email});

    if(existingUser){
        throw new ApiError(400, "User already exists");
    }

    const user = await User.create({
        fullname,
        email,
        password,
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();
    // const emailToken = user.generateEmailVerificationToken();
    
    user.refreshToken = refreshToken;
    // user.emailVerificationToken = emailToken;
    user.emailVerificationTokenExpiry = Date.now() + 10 * 60 * 1000;

    user.save({validateBeforeSave: false});

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            "User registered successfully!",
            createdUser
        )
    )
});

const login = asyncHandler(async(req, res) => {
    const {
        email,
        password,
    } = req.body;
    
    if(!email || !password){
        throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({email})
    const loginUser = await User.findById(user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");

    if(!user){
        throw new ApiError(400, "User does not exist")
    }

    const isMatched = await user.isPasswordMatched(password);

    if(!isMatched){
        throw new ApiError(400, "Invalid credentials");
    }

    const refreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = refreshToken;

    user.save({validateBeforeSave: false});

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000
    })

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
    })

    res.status(200).json(
        new ApiResponse(
            200,
            "User logged in successfully!",
            loginUser
        )
    )
});

const logout = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            }
        },
        {
            new: true,
        }
    );

    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: "strict",
    });

    res.clearCookie("accessToken", {
        httpOnly: true,
        sameSite: "strict",
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "User logged out successfully!"
        )
    )
})

const getMe = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry");
    
    return res.status(200).json(
        new ApiResponse(
            200,
            "Profile fetched Successfully",
            user
        )
    )
})

const refreshAccessToken = asyncHandler(async(req, res) => {
    const incomingRefreshToken = req.cookies?.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized request");
    }

    try {
    const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    const user = await User.findById(decoded.id);

    if(!user){
        throw new ApiError(401, "Unauthorized request");
    }

    if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(401, "Refresh Token is expired or used!");
    }

    const newRefreshToken = user.generateRefreshToken();
    const accessToken = user.generateAccessToken();

    user.refreshToken = newRefreshToken;

    await user.save({validateBeforeSave: false});

    res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000
    });

    res.status(200).json(
        new ApiResponse(
            200,
            "Access token refreshed successfully!",
            {
                accessToken: accessToken, 
                refreshToken: newRefreshToken
            }
        )
    )
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token!");
    }
});

const changeCurrentPassword = asyncHandler(async(req, res) => {
    const {
        oldPassword,
        newPassword
    } = req.body;

    const user = await User.findById(req.user._id);

    const isMatched = user.isPasswordMatched(oldPassword);

    if(!isMatched){
        throw new ApiError(400, "Invalid old Password")
    }

    user.password = newPassword;

    await user.save({validateBeforeSave: false})

    return res.status(200).json(
        new ApiResponse(
            200,
            "Password Changed Successfully!"
        )
    )
})

const verifyEmail = asyncHandler(async(req, res) => {
    const token = req.query.token;

    if(!token){
        throw new ApiError(400, "Token is required to verify Email!");
    }

    try {
        const decoded = jwt.verify(token, process.env.EMAIL_VERIFICATION_TOKEN_SECRET);
        
        if(!decoded){
            throw new ApiError(400, "Invalid Email token!");
        }

        const user = await User.findOne({
            _id: decoded.id,
            emailVerificationToken: token,
            emailVerificationTokenExpiry: { $gt: Date.now() }
        });
            
        if(!user){
            throw new ApiError(400, "User not found");
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpiry = undefined;
    
        await user.save({validateBeforeSave: false});
    
        return res.status(200).json(
            new ApiResponse(
                200,
                "Email verified successfully!"
            )
        )
    } catch (error) {
        throw new ApiError(400, "Invalid Email token");
    }
});

export { 
    register, 
    login, 
    logout, 
    getMe, 
    refreshAccessToken, 
    changeCurrentPassword,
    verifyEmail 
};