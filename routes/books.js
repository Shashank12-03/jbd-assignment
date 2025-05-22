const { Router } = require('express');
const router = Router();
const { addBook, getAllBooks, getBookById, getBooksByFilter, addReview, deleteReview, updateReview, searchBooks} = require('../controllers/book.js');

router.post('/add', addBook);
router.get('/all', getAllBooks);
router.get('/filter', getBooksByFilter);
router.get('/search', searchBooks);
router.get('/details/:id', getBookById);
router.post('/add-review', addReview);
router.put('/review/update/:id', updateReview);
router.delete('/review/delete/:id', deleteReview);

module.exports = router;