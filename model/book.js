const mongoose = require('mongoose');
const Review = require('./review.js');
const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    addDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true,
        default: 3,
    },
    reviews: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Review",
        }],
        default: [],
    },
}, { timestamps: true });


const Book = mongoose.model("Book", BookSchema);
module.exports = Book;