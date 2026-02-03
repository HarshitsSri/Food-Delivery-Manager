const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { orderId, restaurantName, itemCount, isPaid, deliveryDistance } = req.body;

    const validationErrors = [];

    if (!orderId || orderId.trim() === '') {
      validationErrors.push('Order ID is required');
    }

    if (!restaurantName || restaurantName.trim() === '') {
      validationErrors.push('Restaurant name is required');
    }

    if (itemCount === undefined || itemCount === null) {
      validationErrors.push('Item count is required');
    } else if (!Number.isInteger(Number(itemCount)) || Number(itemCount) < 1) {
      validationErrors.push('Item count must be a positive whole number');
    }

    if (isPaid === undefined || isPaid === null) {
      validationErrors.push('Payment status is required');
    }

    if (deliveryDistance === undefined || deliveryDistance === null) {
      validationErrors.push('Delivery distance is required');
    } else if (isNaN(deliveryDistance) || Number(deliveryDistance) < 0) {
      validationErrors.push('Delivery distance must be a non-negative number');
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const existingOrder = await Order.findOne({ orderId: orderId.trim() });
    if (existingOrder) {
      return res.status(409).json({
        success: false,
        message: 'Order ID already exists',
        error: `An order with ID "${orderId}" already exists`
      });
    }

    const order = await Order.create({
      orderId: orderId.trim(),
      restaurantName: restaurantName.trim(),
      itemCount: Number(itemCount),
      isPaid: Boolean(isPaid),
      deliveryDistance: Number(deliveryDistance)
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order',
      error: error.message
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
};

const filterOrders = async (req, res) => {
  try {
    const { isPaid, maxDistance } = req.query;
    const filter = {};

    if (isPaid !== undefined) {
      filter.isPaid = isPaid === 'true';
    }

    if (maxDistance !== undefined && maxDistance !== '') {
      const maxDist = Number(maxDistance);
      if (isNaN(maxDist) || maxDist < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid maxDistance parameter',
          error: 'maxDistance must be a non-negative number'
        });
      }
      filter.deliveryDistance = { $lte: maxDist };
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      filters: { isPaid, maxDistance },
      data: orders
    });

  } catch (error) {
    console.error('Error filtering orders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while filtering orders',
      error: error.message
    });
  }
};

const assignDelivery = async (req, res) => {
  try {
    const { maxDistance } = req.body;

    if (maxDistance === undefined || maxDistance === null) {
      return res.status(400).json({
        success: false,
        message: 'maxDistance is required',
        error: 'Please provide maxDistance in the request body'
      });
    }

    const maxDist = Number(maxDistance);
    if (isNaN(maxDist) || maxDist < 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid maxDistance',
        error: 'maxDistance must be a non-negative number'
      });
    }

    const nearestOrder = await Order.findNearestUnpaid(maxDist);

    if (!nearestOrder) {
      return res.status(200).json({
        success: true,
        message: 'No order available',
        data: null,
        explanation: 'No unpaid orders found within the specified maximum distance'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Delivery assigned successfully',
      data: nearestOrder,
      assignmentDetails: {
        assignedOrderId: nearestOrder.orderId,
        restaurant: nearestOrder.restaurantName,
        distance: nearestOrder.deliveryDistance,
        itemCount: nearestOrder.itemCount
      }
    });

  } catch (error) {
    console.error('Error assigning delivery:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while assigning delivery',
      error: error.message
    });
  }
};

const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.getStatistics();

    res.status(200).json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('Error fetching order statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching statistics',
      error: error.message
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const deletedOrder = await Order.findOneAndDelete({ orderId });

    if (!deletedOrder) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
        error: `No order found with ID "${orderId}"`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
      data: deletedOrder
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting order',
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  filterOrders,
  assignDelivery,
  getOrderStats,
  deleteOrder
};
