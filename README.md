Food Delivery Order Manager

Food Delivery Order Manager is a full-stack web application built to manage food delivery orders efficiently with automatic delivery assignment based on distance. The application helps streamline delivery operations by allowing users to create and manage orders, track payment status, filter orders, and automatically assign deliveries.

Core Logic

The delivery assignment follows a clear business rule. Paid orders are ignored, orders beyond the maximum delivery distance are excluded, eligible orders are sorted by distance, and the nearest unpaid order is assigned. This ensures optimal and fast delivery allocation.

Frontend

The frontend is built using React with TypeScript and styled using Tailwind CSS. It provides a clean and responsive interface that works smoothly on desktop and mobile. Features include real-time form validation, toast notifications, tab-based navigation, and an order statistics dashboard.

Backend

The backend is developed using Node.js and Express.js with MongoDB as the database. Mongoose is used for schema modeling and validation. The backend exposes RESTful APIs, includes proper error handling, input validation, and CORS support for frontend integration.

Tech Stack

The frontend uses React, TypeScript, Vite, and Tailwind CSS. The backend uses Node.js, Express.js, MongoDB, and Mongoose.

Project Structure

The project is divided into two main parts: a frontend folder containing the React application and a backend folder containing the Express server and database configuration.

API Overview

The API allows creating orders, fetching all orders, filtering orders by payment status and distance, assigning deliveries automatically, retrieving order statistics, and deleting orders. The APIs are designed to be simple, fast, and production-ready.

Setup and Deployment

The project can be run locally by installing dependencies separately for frontend and backend and configuring environment variables. It is easy to deploy using platforms like Vercel for the frontend, Render for the backend, and MongoDB Atlas for the database.

Data Model

Each order includes an order ID, restaurant name, item count, payment status, delivery distance, and creation timestamp. Indexing is used to improve filtering and delivery assignment performance.

Summary

This project demonstrates real-world full-stack development using the MERN stack, including REST API design, database modeling, frontend integration, and business-driven logic implementation.
