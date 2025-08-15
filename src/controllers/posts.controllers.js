import { asyncHandler } from "../utils/async-handler.js";
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
    
    post.author = req.user._id;
    
    await post.save({});

    return res.status(201).json(
        new ApiResponse(
            201,
            "Post created successfully!",
            post
        )
    )
});

const getPosts = asyncHandler(async(req, res) => {
    
    const posts = await Post.find({})
    .populate("author", "fullname email")
    .populate("category", "name urlKey").sort({
        createdAt: -1
    });

    return res.status(200).json(
        new ApiResponse(
            200,
             posts,
            "Posts fetched successfully!"
        )
    )
});

const viewPublishPost = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const post = await Post.findById(id);

    if(!post){
        throw new ApiError(
            400,
            "Post not found!"
        )
    }

    if(post.status !== "published"){
        throw new ApiError(
            400,
            "Post is not published!"
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post fetched successfully!"
        )
    )
});

const editPost = asyncHandler(async(req, res) => {
    const { id } = req.params;
    const {
        title,
        description,
        content,
        coverImage,
        category
    } = req.body;

    const post = await Post.findById(id);

    if(!post){
        throw new ApiError(
            400,
            "Post not found"
        )
    }

    if(post.status === "approved"){
        throw new ApiError(
            400,
            "Post is not editable"  
        )
    }

    post.title = title;
    post.description = description;
    post.content = content;
    post.coverImage = coverImage;
    post.category = category;

    await post.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post fetched successfully!"
        )
    )
});

const deletePost = asyncHandler(async(req, res) => {
    const { id } = req.params;

    const post = await Post.findByIdAndDelete(id);

    if(!post){
        throw new ApiError(
            400,
            "Post not found"
        )
    }

    if(post.status === "approved"){
        throw new ApiError(
            400,
            "Post is not deleteable"  
        )
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            post,
            "Post deleted successfully!"
        )
    )
});

export { createPost, getPosts, viewPublishPost, editPost, deletePost };