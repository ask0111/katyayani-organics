const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const bookRoutes = require("./routes/bookRoutes");
const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bookstore API",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:5000/",
      },
    ],
  },
  apis: ["./src/app.js"],
};

dotenv.config();
connectDB();

const app = express();

app.use(bodyParser.json());
app.use(cors());

const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// swagger for books

/**
 * @swagger
 * /api/books/create-book:
 *   post:
 *     summary: Add a new book
 *     description: Adds a new book to the inventory.
 *     tags:
 *       - Books
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - isbn
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the book
 *               author:
 *                 type: string
 *                 description: Author of the book
 *               genre:
 *                 type: string
 *                 description: Genre of the book
 *               ISBN:
 *                 type: string
 *                 description: Unique ISBN number
 *               price:
 *                 type: number
 *                 description: Price of the book
 *           example:
 *             title: "The Great Gatsby"
 *             author: "F. Scott Fitzgerald"
 *             genre: "Fiction"
 *             ISBN: "9780743273565"
 *             price: 10.99
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/books/get-books:
 *   get:
 *     summary: Get all books
 *     description: Retrieve a list of books with optional filters.
 *     tags:
 *       - Books
 *     parameters:
 *       - name: genre
 *         in: query
 *         description: Filter by genre
 *         schema:
 *           type: string
 *       - name: author
 *         in: query
 *         description: Filter by author
 *         schema:
 *           type: string
 *       - name: priceRange
 *         in: query
 *         description: Filter by price range (e.g., 10-50)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   author:
 *                     type: string
 *                   genre:
 *                     type: string
 *                   price:
 *                     type: number
 *       400:
 *         description: Invalid filter parameters
 */

/**
 * @swagger
 * /api/books/update-book/{id}:
 *   put:
 *     summary: Update a book
 *     description: Updates the details of an existing book.
 *     tags:
 *       - Books
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the book to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               genre:
 *                 type: string
 *               price:
 *                 type: number
 *             example:
 *               title: "Updated Book Title"
 *               author: "Updated Author"
 *               genre: "Updated Genre"
 *               price: 15.99
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/books/delete-book/{id}:
 *   delete:
 *     summary: Delete a book
 *     description: Removes a book from the inventory.
 *     tags:
 *       - Books
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the book to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */


// swagger for orders

/**
 * @swagger
 * /api/orders/create-order:
 *   post:
 *     summary: Create a new order
 *     description: Place an order for one or more books.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerName
 *               - customerEmail
 *               - customerMobile
 *               - customerAddress
 *               - books
 *             properties:
 *               customerName:
 *                 type: string
 *                 description: Name of the customer
 *               customerEmail:
 *                 type: string
 *                 description: Email of the customer
 *               customerMobile:
 *                 type: string
 *                 description: Mobile number of the customer (10-digit)
 *               customerAddress:
 *                 type: string
 *                 description: Address of the customer
 *               books:
 *                 type: array
 *                 description: List of book IDs in the order
 *                 items:
 *                   type: string
 *             example:
 *               customerName: "John Doe"
 *               customerEmail: "john.doe@example.com"
 *               customerMobile: "9876543210"
 *               customerAddress: "123 Main Street, City"
 *               books:
 *                 - "bookId1"
 *                 - "bookId2"
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/orders/get-orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve a list of all orders with optional filters.
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: customerName
 *         in: query
 *         description: Filter by customer name
 *         schema:
 *           type: string
 *       - name: orderDate
 *         in: query
 *         description: Filter by order date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *       - name: status
 *         in: query
 *         description: Filter by order status (e.g., Pending, Completed, Cancelled)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   customerName:
 *                     type: string
 *                   customerEmail:
 *                     type: string
 *                   customerMobile:
 *                     type: string
 *                   customerAddress:
 *                     type: string
 *                   books:
 *                     type: array
 *                     items:
 *                       type: string
 *                   totalPrice:
 *                     type: number
 *                   status:
 *                     type: string
 *                   orderDate:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: Invalid filter parameters
 */

/**
 * @swagger
 * /api/orders/update-order/{id}:
 *   put:
 *     summary: Update an order
 *     description: Update the details of an existing order.
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Status of the order (e.g., Pending, Completed, Cancelled)
 *               books:
 *                 type: array
 *                 description: Updated list of book IDs
 *                 items:
 *                   type: string
 *             example:
 *               status: "Completed"
 *               books:
 *                 - "bookId1"
 *                 - "bookId3"
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/orders/delete-order/{id}:
 *   delete:
 *     summary: Delete an order
 *     description: Cancel an order and remove it from the system.
 *     tags:
 *       - Orders
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the order to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */


app.use("/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/orders", orderRoutes);

module.exports = app;
