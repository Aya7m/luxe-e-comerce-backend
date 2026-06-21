# Luxe - Backend

Luxe Backend is a REST API for an e-commerce clothing platform.
It handles authentication, product management, orders, cart, payments, image uploads, and user-admin chat.

## Features

* User authentication and authorization
* Admin role management
* Product CRUD operations
* Upload product images using Multer and Cloudinary
* Cart management
* Order creation and tracking
* Order status updates by admin
* Cash on delivery payment
* Stripe payment integration
* User-admin chat after placing an order
* Secure password handling
* MongoDB database models using Mongoose

## Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB
* Mongoose
* JWT Authentication
* Multer
* Cloudinary
* Stripe API

## Main Modules

* Auth
* Users
* Products
* Cart
* Orders
* Payments
* Chat
* Admin Dashboard

## Installation

```bash
npm install
npm run dev
```

## Environment Variables

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
```

## API Features

### Auth

* Register new user
* Login user
* Protect private routes using JWT

### Products

* Get all products
* Get single product
* Add product by admin
* Update product by admin
* Delete product by admin
* Upload product images to Cloudinary

### Orders

* Create order
* Get user orders
* Get all orders for admin
* Update order status

### Payments

* Cash on delivery
* Stripe checkout/payment

### Chat

* User can contact admin after placing an order
* Admin can reply to user questions about orders

## Project Highlights

* Designed a complete e-commerce backend architecture.
* Built secure admin-only APIs for product and order management.
* Integrated Cloudinary for product image hosting.
* Integrated Stripe for online payments.
* Added order tracking and chat functionality to improve user experience.

## Author

Aya Ahmed
Backend / Full Stack Developer
