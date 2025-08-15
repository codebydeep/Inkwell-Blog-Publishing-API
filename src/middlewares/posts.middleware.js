import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import Post from "../models/posts.model.js";

const checkAuthor = asyncHandler(async(req, res, next) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if(!post){
        throw new ApiError(
            400,
            "Post not found!"
        )
    }

    if(post.author.toString() !== req.user._id.toString()){
        throw new ApiError(
            400,
            "You are not the author of this post!"
        )
    }

    req.post = post;
    next();
});

export { checkAuthor };