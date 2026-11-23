# 📚 Book Worm — Online Bookstore

A dynamic online bookstore web application built using **Node.js, Express.js, MongoDB and EJS**. Book Worm provides an interactive platform to explore books, browse categories, manage a shopping cart and place orders, along with an admin interface for managing the book inventory.

## 🌐 Live Demo

🔗 **Live Project:** [Book Worm – Online Bookstore](https://bookstore-pfau.onrender.com)

📂 **Source Code:** [GitHub Repository](https://github.com/honey-035/BookStore)
---

## ✨ Features

### 🛍️ Customer Features
- **Book Catalog:** Browse available books with titles, authors, prices and cover images.
- **Category-Based Browsing:** Explore books based on different categories.
- **Shopping Cart:** Add books to the cart and manage item quantities.
- **Cart Management:** Increase, decrease and remove items from the cart.
- **Checkout:** Review orders and view order confirmation.
- **Contact Form:** Send enquiries through an integrated email functionality.

### 🔐 Admin Features
- **Admin Authentication:** Session-based administrator login.
- **Book Management:** Add new books to the bookstore.
- **Update Inventory:** Edit existing book information.
- **Delete Books:** Remove books from the catalog.
- **Image Uploads:** Upload book cover images using Multer.

### ⚙️ Backend Features
- MongoDB database integration using Mongoose.
- Server-side rendering with EJS templates.
- Session-based cart management.
- Email functionality using Nodemailer.
- Environment-based application configuration.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | Database modeling |
| EJS | Server-side rendering |
| JavaScript | Application logic |
| HTML5 & CSS3 | Frontend structure and styling |
| Multer | Image upload handling |
| Nodemailer | Email integration |
| Express Session | Session management |
| dotenv | Environment configuration |

---

## 📂 Project Structure

```text
BookStore/
│
├── public/
│   ├── css/                # Stylesheets
│   ├── images/             # Static images
│   └── uploads/            # Uploaded book covers
│
├── views/
│   ├── home.ejs            # Homepage
│   ├── books.ejs           # Book catalog
│   ├── cart.ejs            # Shopping cart
│   ├── checkout.ejs        # Checkout page
│   ├── adminlogin.ejs      # Admin login
│   ├── categories.ejs      # Book categories
│   └── ...                 # Other EJS templates
│
├── .env.example            # Environment template
├── .gitignore
├── index.js                # Main Express application
├── package.json
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to run Book Worm locally.

### 1. Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)
- A code editor such as Visual Studio Code

### 2. Clone the Repository

```bash
git clone https://github.com/honey-035/BookStore.git
```

Navigate into the project directory:

```bash
cd BookStore
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory using `.env.example` as a reference.

Configure the following variables with your own values:

```env
MONGODB_URI=your_mongodb_connection_string

ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_admin_password

SESSION_SECRET=your_private_session_secret

EMAIL_USER=your_email_address
EMAIL_APP_PASSWORD=your_email_app_password

CONTACT_EMAIL=your_contact_email
CONTACT_PHONE=your_contact_number
WHATSAPP_NUMBER=your_whatsapp_number

GITHUB_URL=https://github.com/your-username
STORE_LOCATION=Your City, India
SITE_NAME=Book Worm
```

**Important:** Never commit your `.env` file or expose database credentials, email passwords or session secrets publicly.

### 5. Start the Application

Run the following command:

```bash
npm start
```

For development with automatic restarts:

```bash
npm run end
```

### 6. Open in Browser

Visit:

```text
http://localhost:3000
```

Your Book Worm application is now running locally!

---

## 🔑 Application Modules

| Module | Functionality |
|---|---|
| Home | Featured books and bookstore landing page |
| Books | Browse and explore available books |
| Categories | Filter books by category |
| Admin | Manage bookstore inventory |
| Cart | Manage selected books and quantities |
| Checkout | Review and confirm orders |
| Contact | Submit enquiries through email |

---

## 📌 Future Improvements

- Online payment gateway integration.
- Customer registration and login.
- Order history and tracking.
- Product reviews and ratings.
- Advanced book search and filtering.
- Improved security and role-based access control.
- Responsive UI enhancements.

---

## 👨‍💻 Developer

**Honey Sadnani**

BCA Final Year Student | Aspiring Full Stack Developer

- GitHub: [@honey-035](https://github.com/honey-035)
- Repository: [Book Worm](https://github.com/honey-035/BookStore)

---

⭐ If you find this project interesting, consider giving the repository a star!

**Built with ❤️ using Node.js, Express.js and MongoDB.**
