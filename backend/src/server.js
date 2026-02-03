const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
console.log('CORS origin allowed:', process.env.FRONTEND_URL);

if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Food Delivery Order Manager API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      orders: {
        create: 'POST /api/orders',
        getAll: 'GET /api/orders',
        filter: 'GET /api/orders/filter?isPaid=true|false&maxDistance=X',
        assign: 'POST /api/orders/assign',
        stats: 'GET /api/orders/stats',
        delete: 'DELETE /api/orders/:orderId'
      }
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('='.repeat(50));
  console.log('Food Delivery Order Manager API');
  console.log('='.repeat(50));
  console.log(`Server running on port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API URL: http://localhost:${PORT}`);
  console.log('='.repeat(50));
});

module.exports = app;
