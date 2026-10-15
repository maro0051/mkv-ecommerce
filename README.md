# M.K.V Luxury Collection

> **Elegance at your fingertips** — A modern, bilingual full-stack e-commerce platform for watches, sportswear, bags, and perfumes.

![M.K.V](https://img.shields.io/badge/M.K.V-Luxury%20Collection-D4AF37?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)

**🌐 Live Site:** [mkholding.group](https://mkholding.group)

---

## ✨ Features

### 🛍️ Customer Store
- **Bilingual** — Full English & French support with instant toggle
- **Dark/Light Mode** — Beautiful theme switching
- **Product Variants** — Color, size, and style selection with images
- **Advanced Search** — Real-time search with suggestions
- **Shopping Cart** — Persistent cart with variant selection
- **Product Reviews** — Star ratings and customer feedback
- **Responsive Design** — Mobile-first, works on all devices
- **PWA Support** — Installable on phones as a native app

### 💳 Checkout & Payments
- **Guest Checkout** — No account required
- **Customer Accounts** — Sign up, order history, saved details
- **Interac e-Transfer** — Canadian bank transfers
- **PayPal Integration** — Secure PayPal payments
- **PDF Invoices** — Auto-generated professional invoices
- **Order Tracking** — Real-time status updates

### 🔐 Admin Dashboard
- **Complete CRUD** — Products, categories, orders, discounts, reviews
- **Inventory Management** — Stock tracking with low-stock alerts
- **Order Processing** — Approve, process, ship, deliver workflow
- **Analytics Dashboard** — Revenue charts and top products
- **Customer Messages** — Contact form submissions
- **Store Settings** — Currency, tax, shipping, payment config
- **Bilingual Admin** — Full EN/FR translations
- **Auto Logout** — 15-minute inactivity security

### 📧 Automated Notifications (Email)
- Order placed confirmation
- Order confirmed/processing
- Order shipped with tracking
- Order delivered
- Order cancelled
- Admin new order alerts
- Contact form notifications
- Newsletter welcome emails

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router |
| **Styling** | Tailwind CSS v4 |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Payments** | Interac e-Transfer, PayPal |
| **Email** | Brevo API (300 emails/day free) |
| **PDF** | jsPDF + AutoTable |
| **Icons** | React Icons |
| **Notifications** | React Hot Toast |
| **Deployment** | Netlify |
| **PWA** | Vite PWA Plugin |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account
- Brevo account (free for emails)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mkv-ecommerce.git
cd mkv-ecommerce

# Install dependencies
npm install

# Create environment file
cp .env.example .env

mkv-ecommerce/
├── public/                    # Static assets
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── admin/             # Admin-specific components
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── ProductCard.jsx
│   │   ├── SearchModal.jsx
│   │   └── ...
│   ├── context/               # React Context
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   ├── LanguageContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── AdminLanguageContext.jsx
│   ├── pages/                 # Page components
│   │   ├── admin/             # Admin dashboard pages
│   │   ├── customer/          # Customer account pages
│   │   ├── checkout/          # Checkout flow
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   └── ...
│   ├── services/              # API services
│   │   ├── supabase.js
│   │   ├── adminService.js
│   │   ├── orderService.js
│   │   ├── emailService.js
│   │   ├── invoiceService.js
│   │   └── ...
│   ├── utils/                 # Utility functions
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/                  # Edge functions
├── .env
├── netlify.toml
├── vite.config.js
└── package.json
