const request = require("supertest");
const app = require("../src/app"); 
const Book = require("../src/models/Book");
const mongoose = require("mongoose");

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await Book.deleteMany(); 
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Book API", () => {
  let bookId;

  test("Should create a new book", async () => {
    const response = await request(app).post("/api/books").send({
      title: "Test Book",
      author: "John Doe",
      genre: "Fiction",
      price: 19.99,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("title", "Test Book");
    bookId = response.body._id; 
  });

  test("Should retrieve books with filters", async () => {
    const response = await request(app)
      .get("/api/books")
      .query({ genre: "Fiction", author: "John Doe" });

    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty("genre", "Fiction");
  });

  test("Should update a book", async () => {
    const response = await request(app).put(`/api/books/${bookId}`).send({
      title: "Updated Test Book",
    });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("title", "Updated Test Book");
  });

  test("Should delete a book", async () => {
    const response = await request(app).delete(`/api/books/${bookId}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message", "Book deleted successfully");
  });
});
