const Book = require("../models/Book");

// Create Book
exports.createBook = async (req, res) => {
    const { title, author, genre, ISBN, price } = req.body;
    try {
      if (!title || !author || !genre || !ISBN || price == null) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const existingBook = await Book.findOne({ ISBN });
      if (existingBook) {
        return res.status(400).json({ message: "ISBN already exists" });
      }
  
      const book = new Book({ title, author, genre, ISBN, price });
      await book.save();
      res.status(201).json({ message: "Book created successfully", book });

    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: messages.join(", ") });
      }
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  };

// Get All Books
exports.getBooks = async (req, res) => {
    const {
      genre,
      author,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
    } = req.query;
  
    const filters = {};
  
    if (genre) filters.genre = genre;
    if (author) filters.author = author;
  
    if (minPrice || maxPrice) {
      filters.price = {
        ...(minPrice && { $gte: parseFloat(minPrice) }),
        ...(maxPrice && { $lte: parseFloat(maxPrice) }),
      };
    }
  
    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: "i" } }, // Case-insensitive regex for title
        { description: { $regex: search, $options: "i" } }, // Case-insensitive regex for description
      ];
    }
  
    try {
      const skip = (page - 1) * limit;
  
      const books = await Book.find(filters)
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ title: 1 }); 
  
      const totalBooks = await Book.countDocuments(filters);
  
      const pagination = {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalBooks / limit),
        totalBooks,
      };
  
      res.status(200).json({ books, pagination });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// Update Book
exports.updateBook = async (req, res) => {
    try {
      const updates = req.body;
      const allowedUpdates = ["title", "author", "genre", "ISBN", "price"];
      const invalidFields = Object.keys(updates).filter((field) => !allowedUpdates.includes(field));
  
      if (invalidFields.length > 0) {
        return res.status(400).json({
          message: `Invalid fields: ${invalidFields.join(", ")}`,
        });
      }
  
      if (updates.ISBN) {
        const existingBook = await Book.findOne({ ISBN: updates.ISBN });
        if (existingBook && existingBook._id.toString() !== req.params.id) {
          return res.status(400).json({ message: "ISBN already exists" });
        }
      }
  
      const book = await Book.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      res.status(200).json({
        message: "Book updated successfully",
        book,
      });
    } catch (error) {
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({ message: messages.join(", ") });
      }
  
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  };

// Delete Book
exports.deleteBook = async (req, res) => {
    try {
      const book = await Book.findById(req.params.id);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      await book.deleteOne();
      res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
      if (error.name === "CastError") {
        return res.status(400).json({ message: "Invalid book ID format" });
      }
  
      res.status(500).json({ message: "An error occurred", error: error.message });
    }
  };
