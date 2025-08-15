import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import Category from "../models/categories.model.js";

import slugify from "slugify";

const addCategory = asyncHandler(async(req, res) => {
    const { 
        name,
        description
    } = req.body;

    if(!name || !description){
        throw new ApiError(
            400,
            "All the fields are required"
        )
    }

    const category = await Category.create({
        name,
        description
    });

    category.slug = slugify(category.name);
    
    await category.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            category,
            "Category added successfully!"
        )
    )
});


const getCategories = asyncHandler(async(req, res) => {
    const categories = await Category.find({}).populate("name");

    return res.status(200).json(
        new ApiResponse(
            200,
            categories,
            "Categories fetched successfully!"
        )
    )
});

export { addCategory, getCategories };