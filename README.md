🛒 Simple E-Commerce Web App

A responsive, client-side e-commerce web application built using plain HTML, CSS, and JavaScript.
This project demonstrates key frontend engineering skills including modular design, product listing, filtering, shopping cart functionality, wishlist management, user authentication using session storage, and unit testing of product features using Jest.

---

🚀 Live Preview

> [Live Demo →](https://mensonsundash.github.io/e-commerce/)

---

📦 Features

 ✅ Product Catalog
- Product listing with category, price, stock
- Live search and filter by:
  - Category
  - Price range
  - Stock availability

 ✅ Shopping Cart
- Add products to cart
- Quantity controls with `+` and `–`
- Auto-calculates total
- Saves cart in `localStorage`

 ✅ Wishlist
- Mark/unmark products as favorites
- View wishlist
- Stores wishlist in `localStorage`

 ✅ User Authentication (Session-based)
- Register with name, email, password
- Login/logout using `sessionStorage`
- Personalized welcome panel after login
- Auth-protected features (Add cart)

---

 🛠️ Technologies Used

- HTML5
- CSS3 (responsive design, custom modal styling)
- JavaScript (ES6+ features)
- `localStorage` and `sessionStorage` for data persistence
- Node.js & Jest for unit testing


🧪 Unit Testing Setup
This project includes a Jest configuration and package.json with test scripts.

📄 Instructions to Set Up Testing

1️⃣ Install Node.js

- Download & install from https://nodejs.org/

- Verify installation:

   node -v
   npm -v

2️⃣ Install project dependencies

- Navigate to the project folder

   cd your-project-folder

- Install Jest & dependencies:
   npm install

3️⃣ Run the tests

   npm test

🔷 Notes:
- package.json already contains:

"scripts": {
  "test": "jest"
}

- The Jest configuration (jest.config.js) is included in the project root.

- All tests are placed under the /__tests__/ directory and cover product feature functions.