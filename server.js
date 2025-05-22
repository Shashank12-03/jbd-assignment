const express = require('express');
const connect = require('./connect.js');
const authRoutes = require('./routes/auth.js');
const dotenv = require('dotenv');
const bookRoutes = require('./routes/books.js');
const { checkAuthentication } = require('./middleware/auth.js');
const { errorLogRequests, logRequests } = require('./middleware/log.js');
dotenv.config();

// database connection
const url = process.env.MONGO_URL;
console.log(url);
connect(url)
.then(()=> console.log("Mongodb connected"))
.catch((err)=> console.log("Error occured: ", err));

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(logRequests);
app.use(errorLogRequests);

// routes
app.use('/api/auth', authRoutes);
app.use('/api/books',checkAuthentication, bookRoutes);

// server start
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFiY0BnbWFpbC5jb20iLCJpZCI6IjY4MmVmMGRiMWMwYjY5Y2UxOTUwM2E5YiIsImlhdCI6MTc0NzkwNjc3OX0.rJGKHN3oKu-gHeCSm0IDid7CIu9q6s7e03UPTVkO7aM