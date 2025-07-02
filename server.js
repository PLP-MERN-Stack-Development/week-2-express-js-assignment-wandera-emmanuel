const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/products');
const loggerMiddleware = require('./middleware/logger');
const authMiddleware = require('./middleware/auth');
const errorMiddleware = require('./middleware/error');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(loggerMiddleware);

// Routes
app.get('/', (req, res) => {
 res.json({ message: 'Hello World' });
});

// API Routes
app.use('/api/products', authMiddleware, productRoutes);

// Error Handling Middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
 console.log(`Server is running on port ${PORT}`);
});