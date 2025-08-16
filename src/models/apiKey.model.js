import mongoose, { Schema } from "mongoose";

const apiKeySchema = new mongoose.Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        apiKey: {
            type: String,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

const ApiKey = mongoose.model("ApiKey", apiKeySchema);

export default ApiKey;