const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
    },
    dateJoined: {
        type: Date,
        default: Date.now
    },
    bookIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Book"
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;