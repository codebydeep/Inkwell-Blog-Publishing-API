import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";

import PostReview from "../models/postReview.model.js";
import Post from "../models/posts.model.js";
import { PostStatusEnum } from "../utils/constant.js";

const getPendingPosts = asyncHandler(async(req, res) => {
    const post = await Post.find({
        status: PostStatusEnum.PENDING
    })
    .populate("author", "fullname email")
    .populate("category", "name slug");

    
    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Pending posts fetched successfully!"
        )
    )
});

const approvePost = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id);
    
    if(!post){
        throw new ApiError(
            400,
            "Post not found!"
        )
    }

    post.status = "approved";

    await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post approved successfully!"
        )
    )
});

const rejectPost = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id);
    
    if(!post){
        throw new ApiError(
            400,
            "Post not found!"
        )
    }

    post.status = "rejected";

    await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post rejected successfully!"
        )
    )
});

export { getPendingPosts, approvePost, rejectPost };