# Book Review System

A RESTful API for managing books and reviews built with Node.js, Express.js, and MongoDB.

## Features

- **User Authentication**: JWT-based registration and login
- **Book Management**: Add, view, search, and filter books
- **Review System**: Add, update, delete reviews with 1-5 star ratings
- **Pagination**: Efficient book listing with pagination
- **Input Validation**: Comprehensive validation using express-validator
- **Search Functionality**: Search books by title or author
- **Rating Calculation**: Automatic average rating calculation for books

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Password Security**: bcrypt for hashing

## Project Structure

```
├── controllers/
│   ├── authentication.js    # User auth logic
│   └── book.js             # Book and review logic
├── model/
│   ├── user.js             # User schema
│   ├── book.js             # Book schema
│   └── review.js           # Review schema
├── routes/
│   ├── auth.js             # Authentication routes
│   └── books.js            # Book routes
└── middleware/
    └── auth.js             # JWT verification (needed)
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd book-review-system
   ```

2. **Install dependencies**
   ```bash
   npm install express mongoose bcrypt jsonwebtoken express-validator
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/bookreviews
   JWT_SECRET_KEY=your_super_secret_jwt_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - Or use MongoDB Atlas cloud connection

5. **Run the application**
   ```bash
   npm start
   # or for development with nodemon
   npm run dev
   ```

## API Documentation

### Authentication Endpoints

#### Register User
```bash
POST /api/auth/signup
Content-Type: application/json

{
  "userName": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login User
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User logged in",
  "token": "jwt_token_here",
  "name": "john_doe"
}
```

### Book Endpoints

#### Add Book (Protected)
```bash
POST /api/books/add
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "summary": "A classic American novel..."
}
```

#### Get All Books
```bash
GET /api/books/all?page=1&limit=10
```

#### Search Books
```bash
GET /api/books/search?title=gatsby&author=fitzgerald
```

#### Filter Books
```bash
GET /api/books/filter?genre=Fiction&author=F. Scott Fitzgerald
```

#### Get Book Details
```bash
GET /api/books/details/64a1b2c3d4e5f6789012345
```

### Review Endpoints

#### Add Review (Protected)
```bash
POST /api/books/add-review?id=64a1b2c3d4e5f6789012345
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "rating": 5,
  "reviewText": "Excellent book! Highly recommend."
}
```

#### Update Review (Protected)
```bash
PUT /api/books/review/update/64a1b2c3d4e5f6789012345
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "rating": 4,
  "reviewText": "Updated review text"
}
```

#### Delete Review (Protected)
```bash
DELETE /api/books/review/delete/64a1b2c3d4e5f6789012345
Authorization: Bearer <jwt_token>
```

## Example Usage with curl

### 1. Register a new user
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "bookworm",
    "email": "reader@example.com",
    "password": "securepass123"
  }'
```

### 2. Login and get token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "reader@example.com",
    "password": "securepass123"
  }'
```

### 3. Add a book (use token from login)
```bash
curl -X POST http://localhost:3000/api/books/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "genre": "Dystopian Fiction",
    "summary": "A dystopian social science fiction novel"
  }'
```

### 4. Get all books
```bash
curl -X GET http://localhost:3000/api/books/all
```

### 5. Add a review
```bash
curl -X POST "http://localhost:3000/api/books/add-review?id=BOOK_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "rating": 5,
    "reviewText": "Masterpiece of literature!"
  }'
```


## Design Decisions

1. **JWT Authentication**: Chosen for stateless authentication, suitable for APIs
2. **Mongoose ODM**: Provides schema validation and easier MongoDB interaction
3. **Bcrypt**: Industry standard for password hashing
4. **Express-validator**: Comprehensive input validation
5. **Pagination**: Implemented to handle large datasets efficiently
6. **Average Rating**: Automatically calculated when reviews are added/updated/deleted

## Database Schema

See `DATABASE_SCHEMA.md` for detailed schema design and relationships.

## Error Handling

The API returns consistent error responses:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.