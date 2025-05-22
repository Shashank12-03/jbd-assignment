# Database Schema Design

## Overview

The Book Review System uses MongoDB with Mongoose ODM. The database consists of three main collections: Users, Books, and Reviews, with well-defined relationships between them.

## Collections

### 1. Users Collection

**Collection Name**: `users`

```javascript
{
  _id: ObjectId,
  email: String (required, unique),
  password: String (required, hashed),
  username: String (required),
  dateJoined: Date (default: Date.now),
  bookIds: [ObjectId] (references to Book documents),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Indexes**:
- `email`: Unique index for fast user lookup
- `username`: Regular index for search functionality

**Example Document**:
```json
{
  "_id": "64a1b2c3d4e5f678901234ab",
  "email": "john@example.com",
  "password": "$2b$10$hashedPasswordString",
  "username": "john_reader",
  "dateJoined": "2024-01-15T10:30:00.000Z",
  "bookIds": ["64a1b2c3d4e5f678901234cd", "64a1b2c3d4e5f678901234ef"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### 2. Books Collection

**Collection Name**: `books`

```javascript
{
  _id: ObjectId,
  title: String (required),
  author: String (required),
  genre: String (required),
  addDate: Date (default: Date.now, required),
  addedBy: ObjectId (reference to User, required),
  summary: String (required),
  rating: Number (min: 1, max: 5, default: 3),
  reviews: [ObjectId] (references to Review documents),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Indexes**:
- `title`: Text index for search functionality
- `author`: Text index for search functionality
- `genre`: Regular index for filtering
- `addedBy`: Regular index for user's books lookup
- `rating`: Regular index for sorting by rating

**Example Document**:
```json
{
  "_id": "64a1b2c3d4e5f678901234cd",
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "genre": "Fiction",
  "addDate": "2024-01-16T14:20:00.000Z",
  "addedBy": "64a1b2c3d4e5f678901234ab",
  "summary": "A classic American novel set in the Jazz Age...",
  "rating": 4.2,
  "reviews": ["64a1b2c3d4e5f678901234gh", "64a1b2c3d4e5f678901234ij"],
  "createdAt": "2024-01-16T14:20:00.000Z",
  "updatedAt": "2024-01-17T09:15:00.000Z"
}
```

### 3. Reviews Collection

**Collection Name**: `reviews`

```javascript
{
  _id: ObjectId,
  user: ObjectId (reference to User, required),
  book: ObjectId (reference to Book, required),
  reviewText: String (required),
  rating: Number (min: 1, max: 5, required),
  date: Date (default: Date.now),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

**Indexes**:
- `user`: Regular index for user's reviews lookup
- `book`: Regular index for book's reviews lookup
- `user, book`: Compound unique index to prevent duplicate reviews
- `rating`: Regular index for rating-based queries

**Example Document**:
```json
{
  "_id": "64a1b2c3d4e5f678901234gh",
  "user": "64a1b2c3d4e5f678901234ab",
  "book": "64a1b2c3d4e5f678901234cd",
  "reviewText": "An incredible masterpiece that captures the essence of the American Dream...",
  "rating": 5,
  "date": "2024-01-17T09:15:00.000Z",
  "createdAt": "2024-01-17T09:15:00.000Z",
  "updatedAt": "2024-01-17T09:15:00.000Z"
}
```

## Relationships

### Entity Relationship Diagram (Textual)

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    Users    │         │    Books    │         │   Reviews   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ _id (PK)    │    ┌────│ _id (PK)    │    ┌────│ _id (PK)    │
│ email       │    │    │ title       │    │    │ reviewText  │
│ password    │    │    │ author      │    │    │ rating      │
│ username    │    │    │ genre       │    │    │ date        │
│ dateJoined  │    │    │ summary     │    │    │ user (FK)   │──┐
│ bookIds[]   │────┘    │ rating      │    │    │ book (FK)   │──┼──┐
└─────────────┘         │ addedBy(FK) │────┘    └─────────────┘  │  │
                        │ reviews[]   │────────────────────────────┘  │
                        └─────────────┘                              │
                                                                     │
                        └────────────────────────────────────────────┘
```

### Relationship Details

1. **User ↔ Book** (One-to-Many):
   - One user can add multiple books
   - `books.addedBy` references `users._id`
   - `users.bookIds[]` array stores references to books added by the user

2. **User ↔ Review** (One-to-Many):
   - One user can write multiple reviews
   - `reviews.user` references `users._id`

3. **Book ↔ Review** (One-to-Many):
   - One book can have multiple reviews
   - `reviews.book` references `books._id`
   - `books.reviews[]` array stores references to all reviews for the book

4. **User ↔ Book** (Many-to-Many through Reviews):
   - Users can review multiple books
   - Books can be reviewed by multiple users
   - The relationship is managed through the Reviews collection

## Data Integrity Constraints

### Mongoose Schema Validations

1. **Required Fields**: All essential fields are marked as required
2. **Unique Constraints**: User email must be unique
3. **Data Types**: Strict typing with ObjectId references
4. **Range Validations**: Ratings constrained to 1-5 range
5. **Default Values**: Sensible defaults for optional fields

### Business Logic Constraints

1. **One Review Per User Per Book**: 
   - Enforced in application logic
   - Prevents users from reviewing the same book multiple times

2. **Review Ownership**: 
   - Users can only update/delete their own reviews
   - Enforced through authentication middleware

3. **Book Ownership**: 
   - Only the user who added a book can perform certain operations
   - Managed through `addedBy` field validation

