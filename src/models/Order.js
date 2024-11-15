const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    },
    customerMobile: {
      type: String,
      required: true,
      match: /^[0-9]{10}$/, 
    },
    customerAddress: {
      type: String,
      required: true,
      trim: true,
    },
    books: [
      {
        bookId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book', 
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Processing', 'Completed', 'Cancelled'], 
      default: 'Pending',
    },
    orderDate: {
      type: Date,
      default: Date.now, 
    },
  },
  { timestamps: true } 
);

module.exports = mongoose.model('Order', orderSchema);
