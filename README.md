# 🧩 JobBridge – Freelance Marketplace Connecting PYMEs with Young Professionals

## 📋 Overview
JobBridge is a full-stack freelance marketplace web application that connects small and medium businesses (PYMEs) with freelance professionals. Built as a final project for the Web Application Development course at ULACIT, Costa Rica.

The platform enables PYMEs to discover, evaluate, and hire freelance services across 15 professional categories, while freelancers can publish offerings, manage contracts, and build their reputation through a bidirectional rating system.

---

## 👥 Team
- **Kelvin Feng Wu**
- **Heillyn Madriz Madrigal**
- **Javier Núñez Sánchez**

📚 **Professor:** Ing. Warner Carrillo Ramírez
🏫 **Course:** Desarrollo de Aplicaciones y Servicios Web — I Cuatrimestre 2026

---

## 🎯 Project Goals
JobBridge aims to deliver:

- 🔐 A **role-based web application** with two user types: **Freelancer** and **PYME (Client)**
- 🛒 A structured flow for **service discovery, cart management, and contracting** (payments are simulated)
- 💬 **Real-time messaging** between freelancers and PYMEs tied to contracts
- ⭐ A **bidirectional rating system** with reviews visible on profiles and services
- 📊 **Sales dashboards** with statistics and performance tracking for freelancers
- 🗄️ A **MongoDB document model** supporting traceability, pricing, and contract lifecycle management

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| 🖥️ Frontend | React 19 + Vite |
| ⚙️ Backend | Node.js + Express 5 |
| 🗄️ Database | MongoDB Atlas (Mongoose ODM) |
| 🔐 Auth | JWT (JSON Web Tokens) + bcryptjs |
| 📁 Uploads | Multer (profile pictures & service images) |

---

## 👤 Users and Role-Based Workflows

### 🧑‍💻 Freelancer
Freelancers use JobBridge to:
- 📝 Create, edit, and manage service offerings with images
- 📥 Receive and respond to contract requests
- 💬 Communicate with clients through contract-based messaging
- 📊 Track earnings, completion rate, and average ratings on their dashboard
- ⭐ Rate PYMEs after contract completion

### 🏢 PYME (Client)
PYMEs use JobBridge to:
- 🔍 Browse and search the service catalog with advanced filters
- 🛒 Add services to cart and checkout multiple at once
- 📄 Create contracts with simulated payment
- 💬 Message freelancers directly within each contract
- ⭐ Rate freelancers after service delivery
- 👤 View freelancer public profiles with skills and ratings

---

## ✨ Core Features

### 🔐 Authentication & User Management
- Registration with role selection (PYME or Freelancer)
- JWT-based authentication with 24h token expiration
- Password validation (8+ chars, uppercase, lowercase, number, special character)
- Profile management with picture upload
- Public profiles viewable by other users
- Password recovery page (simulated for academic scope)

### 🛍️ Service Marketplace
- 15 service categories: Diseño, Programación, Marketing, Redacción, Video, Fotografía, Traducción, Consultoría, Contabilidad, Legal, Educación, Música y Audio, Arquitectura, Soporte TI, Redes Sociales
- Full CRUD for freelancer services
- Image upload (up to 5 images per service, 5MB each)
- Advanced filtering: category, min/max price, max delivery days
- Sorting: newest, price (asc/desc), fastest delivery, best rated

### 🛒 Shopping Cart
- Add/remove services from cart
- Multi-service checkout with total calculation
- Platform fee (5%) applied automatically
- Batch contract creation from cart

### 📄 Contract Management
- Contract lifecycle: `Requested → Accepted → In Progress → Completed / Cancelled`
- Role-based status transitions (PYMEs can cancel; Freelancers can accept, start, complete)
- Simulated payment checkout with card validation (numeric only, expiration date validation)
- Deadline warnings when requested delivery is faster than estimated
- Milestone tracking support

### 💬 Messaging System
- Real-time messaging between PYMEs and Freelancers (HTTP polling every 5s)
- Conversations organized by contract
- Unread message indicators
- Profile pictures shown in conversation list

### ⭐ Ratings & Reviews
- Bidirectional rating system (PYMEs rate Freelancers and vice versa)
- Star rating (1-5) with comments
- Service ratings show only PYME→Freelancer reviews
- PYME ratings visible only on PYME public profile
- Average ratings displayed on profiles, services, and dashboards

### 📊 Dashboards
- **PYME Dashboard:** Contract overview, recent activity table, quick actions, background image
- **Freelancer Dashboard:** Service stats, sales report (total earnings, avg contract value, completion rate, avg rating), recent contracts table, background image

### 🖥️ UI & UX
- Splash/loading screen with auto-redirect and branding
- Responsive sidebar with sticky logout button
- Profile pictures visible across all pages (sidebar, services, contracts, chat)
- Clickable service images (open full size in new tab)
- Public profiles accessible from service detail, contract detail, and chat

---

## 📁 Project Structure

```
JOBBRIDGE FULL CODE/
├── 📄 .env.example             # Template for environment variables
├── 📄 .gitignore
├── 📄 README.md
│
├── 📂 client/                  # React Frontend (Vite)
│   ├── 📂 public/              # Static assets (logo, backgrounds)
│   ├── 📂 src/
│   │   ├── 📂 components/      # Layout.jsx, Sidebar.jsx
│   │   ├── 📂 context/         # AuthContext.jsx, CartContext.jsx
│   │   ├── 📂 pages/           # 19 page components
│   │   ├── 📂 services/        # api.js (axios), authService.js
│   │   ├── 📄 App.jsx          # Route definitions
│   │   ├── 📄 main.jsx         # App entry point
│   │   └── 📄 index.css        # All styles
│   └── 📄 package.json
│
├── 📂 server/                  # Node.js/Express Backend
│   ├── 📂 config/              # db.js (MongoDB connection)
│   ├── 📂 controllers/         # Business logic (6 controllers)
│   ├── 📂 middleware/           # auth.js, role.js, upload.js
│   ├── 📂 models/              # Mongoose schemas (5 models)
│   ├── 📂 routes/              # API route definitions (6 route files)
│   ├── 📂 uploads/             # Uploaded images (not in repo)
│   ├── 📄 server.js            # Express app entry point
│   └── 📄 package.json
```

---

## 🔌 API Endpoints

### 🔐 Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new user | ❌ |
| `POST` | `/api/auth/login` | Login | ❌ |

### 👤 Users
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/users/me` | Get my profile | ✅ |
| `PUT` | `/api/users/me` | Update my profile | ✅ |
| `POST` | `/api/users/me/picture` | Upload profile picture | ✅ |
| `GET` | `/api/users/:id` | Get public profile | ✅ |

### 🛍️ Services
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/api/services` | List all services | ❌ |
| `GET` | `/api/services/:id` | Get service detail | ❌ |
| `POST` | `/api/services` | Create service | 🧑‍💻 Freelancer |
| `PUT` | `/api/services/:id` | Update service | 🧑‍💻 Freelancer |
| `DELETE` | `/api/services/:id` | Delete service | 🧑‍💻 Freelancer |
| `POST` | `/api/services/:id/images` | Upload service images | 🧑‍💻 Freelancer |

### 📄 Contracts
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/contracts` | Create contract | 🏢 PYME |
| `GET` | `/api/contracts` | List my contracts | ✅ |
| `GET` | `/api/contracts/:id` | Get contract detail | ✅ |
| `PUT` | `/api/contracts/:id/status` | Update status | ✅ |
| `PUT` | `/api/contracts/:id/milestones` | Update milestones | 🧑‍💻 Freelancer |

### ⭐ Ratings
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/ratings` | Create rating | ✅ |
| `GET` | `/api/ratings/user/:userId` | Get user ratings | ❌ |
| `GET` | `/api/ratings/service/:serviceId` | Get service ratings | ❌ |

### 💬 Messages
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/messages` | Send message | ✅ |
| `GET` | `/api/messages/conversations` | List conversations | ✅ |
| `GET` | `/api/messages/:contractId` | Get messages | ✅ |

---

## 🚀 Installation & Setup

### 📋 Prerequisites
- 📦 Node.js v18+
- 🗄️ MongoDB Atlas account (or local MongoDB)
- 🔧 Git

### 1️⃣ Clone the repository

```bash
git clone https://github.com/aleNu93/JobBridge.git
cd JobBridge
```

### 2️⃣ Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values:

```
PORT=5000
JWT_SECRET=your-secret-key-here
MONGO_URI=your-mongodb-connection-string-here
```

### 3️⃣ Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 4️⃣ Create uploads directory

```bash
mkdir -p server/uploads
```

### 5️⃣ Run the application

Open two terminals:

```bash
# Terminal 1 — Backend
cd server
npm run dev
```

```bash
# Terminal 2 — Frontend
cd client
npm run dev
```

The application will be available at:
- 🖥️ **Frontend:** http://localhost:5173
- ⚙️ **Backend API:** http://localhost:5000

---

## 🗄️ Data Model

### 👤 User
Unified document for both Freelancers and PYMEs, differentiated by `role` field. Includes personal info, company data (PYMEs), skills (Freelancers), and profile picture.

### 🛍️ Service
Services offered by freelancers with category, pricing, delivery time, revisions, images, and status.

### 📄 Contract
Represents a hiring agreement between a PYME and a Freelancer, tracking the full lifecycle from request to completion with pricing snapshot.

### ⭐ Rating
Bidirectional ratings tied to completed contracts, with scores (1-5) and comments.

### 💬 Message
Chat messages between users, organized by contract, with read/unread status.

---

## 🔒 Security

- 🔑 Passwords hashed with bcryptjs (salt rounds: 10)
- 🎫 JWT tokens with 24h expiration
- 🛡️ Role-based access control on all protected routes
- ✅ Field whitelisting on profile and service updates
- 📁 File upload validation (image types only, 5MB limit)
- 🔐 Authorization checks on all mutations (only owners can edit/delete)

---

## 📝 Academic Scope Notes

This is an academic implementation, therefore:
- 💳 Payments are **simulated** (no real transactions)
- 📧 Password recovery is **simulated** (no email service integrated)
- 💬 Messaging uses **HTTP polling** instead of WebSocket for simplicity
- 🔒 Security measures are implemented but not production-hardened
- ✅ The approval process for new services is simplified (services default to active)

---

## 📄 License

This project was developed for academic purposes at **ULACIT — Universidad Latinoamericana de Ciencia y Tecnología**, Costa Rica.
