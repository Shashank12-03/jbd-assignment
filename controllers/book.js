const Book = require('../model/book');
const Review = require('../model/review');

const addBook = async (req, res) => {
    const { title, author, genre, summary} = req.body;
    try {
        console.log(req.user);
        const addedBy = req.user.id;
        if (!title || !author || !genre || !summary) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newBook = new Book({
            title,
            author,
            genre,
            addedBy,
            summary,
        });
        await newBook.save();
        res.status(201).json({ message: 'Book added successfully', book: newBook });
    } catch (error) {
        res.status(500).json({ message: 'Error adding book', error });
    }
}

const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find()
            .skip(skip)
            .limit(limit)
            .exec();

        const total = await Book.countDocuments();

        res.status(200).json({
            books,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
}

const getBooksByFilter = async (req, res) => {
    try {
        const { author, genre } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let filter = {};
        if (author) filter.author = author;
        if (genre) filter.genre = genre;

        const books = await Book.find(filter)
            .skip(skip)
            .limit(limit)
            .exec();

        const total = await Book.countDocuments(filter);

        res.status(200).json({
            books,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
}

const getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error });
    }
}
const addReview = async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        const bookId = req.query.id;
        console.log(bookId);
        const userId = req.user.id;

        if (!rating || !reviewText) {
            return res.status(400).json({ message: 'Rating and comment are required' });
        }

        // Check if book exists
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Check if user already reviewed this book
        const existingReview = await Review.findOne({ book: bookId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this book' });
        }

        // Create review
        const review = new Review({
            book: bookId,
            user: userId,
            rating,
            reviewText
        });
        await review.save();

        const reviews = await Review.find({ book: bookId });
        book.reviews.push(review._id);
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
        book.rating = avgRating;
        await book.save();

        res.status(201).json({ message: 'Review added successfully', review, averageRating: avgRating });
    } catch (error) {
        res.status(500).json({ message: 'Error adding review', error });
    }
}
const updateReview = async (req, res) => {
    try {
        const { rating, reviewText } = req.body;
        const bookId = req.params.id;
        console.log(bookId);
        const userId = req.user.id;
        const review = await Review.findOne({ book: bookId, user: userId });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        const reviewId = review.id;
        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        if (rating !== undefined) review.rating = rating;
        if (reviewText !== undefined) review.comment = reviewText;
        await review.save();

        const reviews = await Review.find({ book: review.book });
        const avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
        await Book.findByIdAndUpdate(review.book, { rating: avgRating });

        res.status(200).json({ message: 'Review updated successfully', review, averageRating: avgRating });
    } catch (error) {
        res.status(500).json({ message: 'Error updating review', error });
    }
}

const deleteReview = async (req, res) => {
    try {
        const bookId = req.params.id;
        const userId = req.user.id;
        const review = await Review.findOne({ book: bookId, user: userId });
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        const reviewId = review.id;

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        if (review.user.toString() !== userId) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }
        await review.deleteOne();

        // Update book average rating
        const reviews = await Review.find({ book: bookId });
        let avgRating = 0;
        if (reviews.length > 0) {
            avgRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;
        }
        await Book.findByIdAndUpdate(bookId, { rating: avgRating });

        res.status(200).json({ message: 'Review deleted successfully', averageRating: avgRating });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error });
    }
}

const searchBooks = async (req, res) => {
    try {
        const { author, title } = req.query;
        if (!author && !title) {
            return res.status(400).json({ message: 'At least one of author or title is required for search' });
        }

        let filter = {};
        if (author) {
            filter.author = { $regex: author, $options: 'i' };
        }
        if (title) {
            filter.title = { $regex: title, $options: 'i' };
        }

        const books = await Book.find(filter);
        res.status(200).json({ books });
    } catch (error) {
        res.status(500).json({ message: 'Error searching books', error });
    }
}
module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    getBooksByFilter,
    addReview,
    updateReview,
    deleteReview,
    searchBooks
}