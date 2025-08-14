import dotenv from "dotenv";

import app from "./app.js";
import connectDB from "./db/dbConnect.js";

dotenv.config({
    path: "./.env"
})

const PORT = process.env.PORT || 5000

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server💻 started on PORT: ${PORT}`);
    })
})
.catch((err) => {
    console.error(`MongoDB Connection error`, err);
    process.exit(1);
})