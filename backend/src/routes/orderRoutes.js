const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  filterOrders,
  assignDelivery,
  getOrderStats,
  deleteOrder
} = require('../controllers/orderController');


router.post('/', createOrder);

router.get('/', getAllOrders);

router.get('/filter', filterOrders);

router.get('/stats', getOrderStats);

router.post('/assign', assignDelivery);

router.delete('/:orderId', deleteOrder);

module.exports = router;
