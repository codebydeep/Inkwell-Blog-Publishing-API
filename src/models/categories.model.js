import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            maxlength: 50
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
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;