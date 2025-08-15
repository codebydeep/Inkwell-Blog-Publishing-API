import mongoose from "mongoose";
import { AvailablePostStatus, PostStatusEnum } from "../utils/constant.js";

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 100,
        },
        urlKey: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
            unique: true
        },
        description: {
            type: String,
            required: true,
            maxlength: 200
        },
        content: {
            type: String,
            required: true,
        },
        coverImage: {
            type: String,
        },
        status: {
            type: String,
            enum: AvailablePostStatus,
            default: PostStatusEnum.DRAFT
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            // required: true,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            // required: true,
        },
        isActive: {
            type: Boolean,
            default: true
        },
        likeCount: {
            type: Number,
            default: 0
        },
        commentCount: {
            type: Number,
            default: 0
        },
        viewCount: {
            type: Number,
            default: 0
        },
    },
    {
        timestamps: true
    }
);

const Post = mongoose.model("Post", postSchema);

export default Post;