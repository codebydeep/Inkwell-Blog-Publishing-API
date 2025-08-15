import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import User from "../models/user.models.js";

const authMiddleware = asyncHandler(async(req, res, next) => {
    let token = req.cookies?.accessToken;

    if(!token){
        throw new ApiError(
            401,
            "Unauthorized request"
        )
    }

    const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if(!decode){
        throw new ApiError(
            401,
            "Unauthorized request"
        )
    }

    const user = await User.findById(decode.id);

    if(!user){
        throw new ApiError(
            401,
            "Account not found"
        )
    }

    req.user = user;
    next();
});

const checkAdmin = asyncHandler(async(req, res, next) => {
    if(req.user.role !== "admin"){
        throw new ApiError(
            403,
            "Access Denied! || You are not authorized to access this resource!"
        )
    }
    next();
})

export { authMiddleware, checkAdmin };