import rateLimit from "express-rate-limit";

const limiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000,
    max: 1,
    message: "So many requests at a time, Try again later"
});

export default limiter;