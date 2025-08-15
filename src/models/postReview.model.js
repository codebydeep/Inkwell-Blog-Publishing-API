import mongoose from "mongoose";

const postReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: true
        },
        review: {
            type: String,
            required: true
        },
        isApproved: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const PostReview = mongoose.model("PostReview", postReviewSchema);

export default PostReview;