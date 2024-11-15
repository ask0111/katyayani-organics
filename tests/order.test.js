// const request = require("supertest");
// const app = require("../app"); 
// const Order = require("../src/models/Order"); 
// const Book = require("../src/models/Book"); 
// const mongoose = require("mongoose");

// beforeAll(async () => {
//   await mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
//   await Order.deleteMany(); // Clear test database
//   await Book.deleteMany(); // Clear books for a clean slate
// });

// afterAll(async () => {
//   await mongoose.connection.close();
// });

// describe("Order API", () => {
//   let bookId1, bookId2, orderId;

//   beforeAll(async () => {
//     const book1 = await Book.create({
//       title: "Book 1",
//       author: "Author 1",
//       genre: "Fiction",
//       price: 10,
//     });
//     const book2 = await Book.create({
//       title: "Book 2",
//       author: "Author 2",
//       genre: "Non-Fiction",
//       price: 15,
//     });

//     bookId1 = book1._id;
//     bookId2 = book2._id;
//   });

//   test("Should create a new order", async () => {
//     const response = await request(app).post("/api/orders/create-order").send({
//       customerName: "John Doe",
//       customerEmail: "john.doe@example.com",
//       customerMobile: "9876543210",
//       customerAddress: "123 Main Street",
//       books: [bookId1, bookId2],
//     });

//     expect(response.status).toBe(201);
//     expect(response.body).toHaveProperty("order");
//     expect(response.body.order).toHaveProperty("customerName", "John Doe");
//     expect(response.body.order).toHaveProperty("totalPrice", 25); // 10 + 15
//     orderId = response.body.order._id; // Store order ID for later tests
//   });

//   test("Should retrieve all orders", async () => {
//     const response = await request(app).get("/api/orders/get-orders");

//     expect(response.status).toBe(200);
//     expect(response.body.length).toBeGreaterThan(0);
//     expect(response.body[0]).toHaveProperty("customerName", "John Doe");
//   });

//   test("Should update an order", async () => {
//     const response = await request(app)
//       .put(`/api/orders/update-order/${orderId}`)
//       .send({
//         status: "completed",
//       });

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("message", "Order updated successfully");
//     expect(response.body.order).toHaveProperty("status", "completed");
//   });

//   test("Should delete an order", async () => {
//     const response = await request(app).delete(`/api/orders/delete-order/${orderId}`);

//     expect(response.status).toBe(200);
//     expect(response.body).toHaveProperty("message", "Order deleted successfully");

//     // Verify the order was deleted
//     const orders = await Order.find();
//     expect(orders.length).toBe(0);
//   });
// });
