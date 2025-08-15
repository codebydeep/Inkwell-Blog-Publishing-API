import asyncHandler from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import Post from "../models/posts.model.js";

const createPost = asyncHandler(async(req, res) => {
    const {
        title,
        description,
        content,
        coverImage,
        category
    } = req.body;
    
    if(!title || !description || !content || !coverImage){
        throw new ApiError(
            400,
            "All fields are required!"
        )
    };
    
    const urlKey = title.replace(/\s+/g, '-').toLowerCase();
    
    const existingPost = await Post.findOne({urlKey});

    if(existingPost){
        throw new ApiError(
            400,
            "Post already exists!"
        )
    };


    const post = await Post.create({
        title,
        description,
        content,
        coverImage,
        urlKey
    });

    post.user = req.user._id;

    await post.save({validateBeforeSave: false});

    return res.status(201).json(
        new ApiResponse(
            201,
            "Post created successfully!",
            post
        )
    )
});

const getPosts = asyncHandler(async(req, res) => {
    
    const posts = await Post.find().populate("user").sort({
        createdAt: -1
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            "Posts fetched successfully!",
            posts
        )
    )
});

export { createPost, getPosts };