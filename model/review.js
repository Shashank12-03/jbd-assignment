const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book",
        required: true,
    },
    reviewText: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
