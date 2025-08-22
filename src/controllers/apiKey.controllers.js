import ApiKey from "../models/apiKey.model.js";
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

import crypto from "crypto";
import bcrypt from "bcryptjs";


const generateApiKey = asyncHandler(async(req, res) => {
    const key = crypto.randomBytes(32).toString('hex')
    // console.log(key);

    const hashedKey = await bcrypt.hash(key, 10)

    const alreadyKey = await ApiKey.findOne({
        user: req.user._id
    })

    if(alreadyKey){
        return res.status(400).json(
            new ApiError(
                400,
                false,
                ["Key is already present!"]
            )
        )
    }

    const api = await ApiKey.create({
        user: req.user._id,
        apiKey: hashedKey,
    })

    
    res.status(201).json(
        new ApiResponse(
            201,
            "Key generated Successfully!",
            { "api-key": key }
        )
    )
});

export { generateApiKey };