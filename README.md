# E-Commerce Application Backend API Documentation
Welcome to the documentation for the E-Commerce Application Backend API. This document provides an overview of the available endpoints, their functionalities, and usage instructions.

### Introduction
This API serves as the backend for our E-Commerce Application, providing various endpoints to manage products, orders, users, and authentication.

`Base URL`: https://ecommerce-backend-k6ms.onrender.com/api/v1

## Endpoints
`Authentication`

POST /user/login: Log in with a username and password to obtain an access token.

POST /user/register: Register a new user account.

POST /user/logout: Register a new user account.


`Address Update`

POST /user/address: Update the address of the user.

`wishlist`

POST /user/add_to_wishlist: Users can add products to their wishlist.

GET /user/get_the_wishlist: The list of the whole wishlist.

`Products`

POST /product: Create a new product.

PATCH /product: Update a product.

GET /product: Retrieve details of products.

DELETE /product: Delete a product by ID.

POST /product/like/{product_id}: to like a product.

POST /product/dislike/{product_id}: to dislike a product.

GET /product/product_details?productId={product_id}: get details for a particular product.

`Coupon`

POST /coupon: post a coupon with a discount.

GET /coupon/all: get the list of the coupon.

`Cart`

POST /cart: post a 

5. Orders
GET /orders: Retrieve a list of all orders.
GET /orders/{id}: Retrieve details of a specific order by ID.
POST /orders: Place a new order.
PUT /orders/{id}: Update status of an existing order by ID.
DELETE /orders/{id}: Cancel an order by ID.
6. Users
GET /users/{id}: Retrieve user details by ID.
PUT /users/{id}: Update user details by ID.
DELETE /users/{id}: Delete user account by ID.
Error Handling
Errors are returned in JSON format with appropriate status codes and messages. Refer to the API documentation for specific error responses.

Rate Limiting
To ensure fair usage and prevent abuse, API requests are rate-limited. The rate limits are subject to change based on usage patterns and server load.

Authentication
Most endpoints require authentication using an API key. Include the API key in the request headers as follows:
Authorization: Bearer <API_KEY>
Contributing
We welcome contributions to improve and enhance the functionality of our API. Feel free to fork this repository, make your changes, and submit a pull request.

Contact
If you have any questions, feedback, or need assistance, please contact our support team at support@example.com.
