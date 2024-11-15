const Order = require("../models/Order");
const Book = require("../models/Book");

// Create a new order
exports.createOrder = async (req, res) => {
  const {
    customerName,
    customerEmail,
    customerMobile,
    customerAddress,
    books,
  } = req.body;

  try {
    if (
      !customerName ||
      !customerEmail ||
      !customerMobile ||
      !customerAddress ||
      !Array.isArray(books) ||
      books.length === 0
    ) {
      return res
        .status(400)
        .json({
          message: "All customer details and at least one book are required",
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(customerMobile)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }

    const bookDetails = [];
    for (const bookId of books) {
      const book = await Book.findById(bookId);
      if (!book) {
        return res
          .status(404)
          .json({ message: `Book with ID ${bookId} not found` });
      }
      bookDetails.push(book);
    }

    const totalPrice = bookDetails.reduce(
      (total, book) => total + book.price,
      0
    );

    const order = new Order({
      customerName,
      customerEmail,
      customerMobile,
      customerAddress,
      books: books.map((id) => ({ bookId: id })),
      totalPrice,
      status: "Pending",
    });

    await order.save();
    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// get orders with optional filters
exports.getOrders = async (req, res) => {
  try {
    const { customerName, customerEmail, orderDate, status } = req.query;

    const filters = {};
    if (customerName) {
      filters.customerName = { $regex: customerName, $options: "i" };
    }
    if (customerEmail) {
      filters.customerEmail = { $regex: customerEmail, $options: "i" };
    }
    if (orderDate) {
      const startOfDay = new Date(orderDate);
      const endOfDay = new Date(orderDate);
      endOfDay.setDate(endOfDay.getDate() + 1);
      filters.createdAt = { $gte: startOfDay, $lt: endOfDay };
    }
    if (status) {
      filters.status = status;
    }

    const orders = await Order.find(filters).populate(
      "books.bookId",
      "title author genre ISBN price"
    );

    res.status(200).json({
      message: "Orders get successfully",
      orders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// Update an order
exports.updateOrder = async (req, res) => {
  try {
    const { status, books } = req.body;

    if (!status && !books) {
      return res
        .status(400)
        .json({
          message: "At least one field (status or books) is required to update",
        });
    }

    if (books && books.length > 0) {
      const bookIds = books.map((book) => book.bookId);
      const foundBooks = await Book.find({ _id: { $in: bookIds } });
      if (foundBooks.length !== books.length) {
        return res
          .status(400)
          .json({
            message: "One or more books are not available in the inventory",
          });
      }
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (status) {
      order.status = status;
    }

    if (books) {
      order.books = books;
    }

    await order.save();

    res.status(200).json({
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await order.remove();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};
