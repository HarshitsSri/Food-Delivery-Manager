const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
    unique: true,
    trim: true,
    index: true
  },
  restaurantName: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true,
    minlength: [1, 'Restaurant name cannot be empty']
  },
  itemCount: {
    type: Number,
    required: [true, 'Item count is required'],
    min: [1, 'Item count must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Item count must be a whole number'
    }
  },
  isPaid: {
    type: Boolean,
    required: [true, 'Payment status is required'],
    default: false,
    index: true
  },
  deliveryDistance: {
    type: Number,
    required: [true, 'Delivery distance is required'],
    min: [0, 'Delivery distance cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

orderSchema.index({ isPaid: 1, deliveryDistance: 1 });

orderSchema.statics.findNearestUnpaid = async function(maxDistance) {
  const order = await this.findOne({
    isPaid: false,
    deliveryDistance: { $lte: maxDistance }
  }).sort({ deliveryDistance: 1 });

  return order;
};

orderSchema.statics.getStatistics = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        paidOrders: {
          $sum: { $cond: [{ $eq: ['$isPaid', true] }, 1, 0] }
        },
        unpaidOrders: {
          $sum: { $cond: [{ $eq: ['$isPaid', false] }, 1, 0] }
        },
        avgDistance: { $avg: '$deliveryDistance' },
        totalItems: { $sum: '$itemCount' }
      }
    }
  ]);

  return stats[0] || {
    totalOrders: 0,
    paidOrders: 0,
    unpaidOrders: 0,
    avgDistance: 0,
    totalItems: 0
  };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
