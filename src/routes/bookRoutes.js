const express = require("express");
const router = express.Router();
const { createBook, getBooks, updateBook, deleteBook } = require("../controllers/bookController");
const { protect, isAdmin } = require("../middlewares/auth.middleware");

router.post("/create-book", protect, isAdmin, createBook);
router.get("/get-books", getBooks);
router.put("/update-book/:id", protect, isAdmin, updateBook);
router.delete("/delete-book/:id", protect, isAdmin, deleteBook);

module.exports = router;
