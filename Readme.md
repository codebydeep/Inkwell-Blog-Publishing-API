# Inkwell - Blog-Publishing-API

A RESTful API for managing blog posts, categories, and reviews, built with **Node.js**, **Express**, and **MongoDB**.  
Supports role-based access control, post approval workflows, and category management.

---
## Features
- JWT auth + API Key System
- Role Based Access (Admin or User) 

- CRUD for Posts & Categories
- Middlewares for (JWT, CheckAdmin, checkAuthor, API-Key)
- Rate-limiting for API-Key End-points

---

## 🛠 Tech Stack

- **Backend Framework:** Node.js + Express
- **Database:** MongoDB + Mongoose
- **Auth:** JWT Authentication
- **Utilities:** Slugify for URL keys, Mongoose middlewares
- **Error Handling:** Custom `ApiError` and `ApiResponse` classes

---


## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/codebydeep/Event-Management.git
   cd event-management-api

   ```

2. **Install all the dependencies**
   ```bash
   npm install
   ```

3. **Copy the environment variables from .env.example file**
   ```bash
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/mongodb
   REFRESH_TOKEN_SECRET=your_secret
   REFRESH_TOKEN_EXPIRY=
   ACCESS_TOKEN_SECRET=your_secret
   ACCESS_TOKEN_EXPIRY=
   EMAIL_VERIFICATION_TOKEN_SECRET=your-secret
   EMAIL_VERIFICATION_TOKEN_EXPIRY=
   ```

## Postman Collection-
  ```bash
  https://postman-api-team-5911.postman.co/workspace/My-Workspace~850edd4a-5a81-416a-85da-6fea6ae2c084/collection/43147937-0ffd71bc-a239-49e8-a8ef-88b56120ee20?action=share&creator=43147937
  ```

---