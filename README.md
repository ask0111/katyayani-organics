# Book Management

## API Documentation

For detailed API documentation, please refer to the following Google Docs link:



## Endpoints

### Authentication
- **POST /api/auth/register**: Register a new user.
- **POST /api/auth/login**: Log in and receive a JWT token.

### Books
- **GET /api/books/get-books**: Retrieve a list of books.
- **POST /api/books/create-book**: Create a new book (Admin only).
- **PUT /api/books/update-book/:id**: Update a book (Admin only).
- **DELETE /api/books/delete-book/:id**: Delete a book (Admin only).
  
### Orders
- **GET /api/books/get-orders**: Retrieve a list of orders.
- **POST /api/books/create-order**: Create a new orders.
- **PUT /api/books/update-order/:id**: Update a orders.
- **DELETE /api/books/delete-order/:id**: Delete a orders.


### Note: Authantication not apply on orders
