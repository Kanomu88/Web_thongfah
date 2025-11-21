# I KHEAW - Matcha & Tea E-Commerce Platform

โปรเจคเว็บแอปพลิเคชันสำหรับจำหน่ายผลิตภัณฑ์ชาเขียวและมัทฉะ พัฒนาด้วย MERN Stack (MongoDB, Express, React-like Vanilla JS, Node.js)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Default Accounts](#default-accounts)

## ✨ Features

### Frontend (User)
- 🏠 **Home Page**: แสดงข้อมูลร้านและสินค้าแนะนำ
- 🛍️ **Product Catalog**: แสดงสินค้าทั้งหมดพร้อมรูปภาพและรายละเอียด
- 🔍 **Search & Filter**: ค้นหาสินค้าตามชื่อและหมวดหมู่
- 📄 **Product Detail**: แสดงรายละเอียดสินค้าแต่ละชิ้น
- ℹ️ **About Us**: ข้อมูลเกี่ยวกับร้านและทีมงาน

### Backend (Admin)
- 👤 **User Management**: จัดการข้อมูลผู้ใช้ (CRUD)
- 📦 **Product Management**: จัดการข้อมูลสินค้า (CRUD)
- 🔐 **Authentication**: ระบบ Login/Logout พร้อม JWT
- 🔒 **Authorization**: ป้องกันหน้า Admin (Admin Only)

### Web Services
- ✅ **RESTful API**: ออกแบบตาม REST principles
- 🔍 **Search API**: รองรับการค้นหาแบบหลายเกณฑ์
- 🔐 **JWT Authentication**: ระบบ Token-based authentication
- 🌐 **CORS Enabled**: รองรับการเรียกใช้จาก Frontend


## 📁 Project Structure

```
ITDS241-Project/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema
│   │   └── Product.js       # Product schema
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── products.js      # Product routes
│   │   └── users.js         # User routes
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── server.js            # Main server file
│   ├── seed.js              # Database seeder
│   ├── package.json
│   └── .env                 # Environment variables
│
└── frontend/
    ├── views/
    │   ├── about.html         # About us
    │   ├── login.html         # Login page
    │   ├── not-found.html     # Notfound page
    │   ├── product.html       # Product Catalog page
    │   ├── productsadmin.html # Product Catalog edit for admin
    │   ├── productdetail.html # Detail Per product
    │   ├── search.html        # Search page
    │   └── usersadmin.html    # User edit for admin
    ├── index.html             # Homepage
    ├── js/
    │   └── api.js             # API service layer
    │   └── auth.js            # Admin token service layer
    ├── assets/
    │   └── images/            # Images and logos
    └── server.js              # JS for routing        
```

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (or local MongoDB)
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/Kanomu88/Web_thongfah.git
cd ITDS241-Project
```

### Step 2: Backend Setup
```bash
cd backend
npm install
```

### Step 3: Environment Variables
สร้างไฟล์ `.env` ในโฟลเดอร์ `backend/`:
```env
PORT=3001
MONGODB_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key-change-this-in-production
```

### Step 4: Seed Database (Optional)
```bash
node seed.js
```

### Step 5: Start Backend Server
```bash
npm run dev
```
Backend จะรันที่ `http://localhost:3001`


### Step1 การรัน Frontend
```bash
cd frontend
npm install
```
### Step 2: Start frontend Server
```bash
npm run dev
```

### การเข้าถึงระบบ

**Frontend (User):**
- URL: `http://localhost:3000` (หรือพอร์ตที่กำหนดใน server.js)

**Backend API:**
- URL: `http://localhost:3001/api`
- Health Check: `http://localhost:3001/api/health`

## 🔌 API Documentation

### Authentication

#### POST /api/auth/login
เข้าสู่ระบบ
```json
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "message": "เข้าสู่ระบบสำเร็จ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "...",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@ikheaw.com",
    "isAdmin": true
  }
}
```

#### POST /api/auth/register
สมัครสมาชิก
```json
Request:
{
  "username": "newuser",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

### Products

#### GET /api/products
ดึงข้อมูลสินค้าทั้งหมด (รองรับ query parameters)
```
Query Parameters:
- name: ค้นหาตามชื่อ (partial match)
- category: ค้นหาตามหมวดหมู่


#### GET /api/products/:id
ดึงข้อมูลสินค้าตาม ID

#### POST /api/products
เพิ่มสินค้าใหม่ (Admin only)
```json
Headers:
{
  "Authorization": "Bearer <token>"
}

Request:
{
  "name": "Matcha Latte",
  "category": "Drinks",
  "price": 85,
  "stock": 50,
  "description": "...",
  "imageUrl": "https://..."
}
```

#### PUT /api/products/:id
แก้ไขสินค้า (Admin only)

#### DELETE /api/products/:id
ลบสินค้า (Admin only)

### Users (Admin Only)

#### GET /api/users
ดึงข้อมูลผู้ใช้ทั้งหมด
```
Query Parameters:
- username: ค้นหาตาม username
- email: ค้นหาตาม email
- isAdmin: กรองตาม role (true/false)
```

#### POST /api/users
เพิ่มผู้ใช้ใหม่

#### PUT /api/users/:id
แก้ไขข้อมูลผู้ใช้

#### DELETE /api/users/:id
ลบผู้ใช้

## 👤 Default Accounts

### Admin Account
- **Username**: `admin`
- **Password**: `admin123`
- **Email**: `admin@ikheaw.com`

### User Account
- **Username**: `user`
- **Password**: `user123`
- **Email**: `user@ikheaw.com`

## 🔒 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Protected admin routes
- ✅ CORS enabled
- ✅ Input validation
- ✅ Error handling middleware

## 📝 Notes

### การใช้งาน JWT Token
Token จะถูกเก็บใน `localStorage` และส่งใน Authorization header:
```javascript
Authorization: Bearer <token>
```

### CORS Configuration
Backend อนุญาตให้เข้าถึงจากทุก origin (`*`) เพื่อความสะดวกในการพัฒนา
ในการใช้งานจริง ควรกำหนด origin ที่เฉพาะเจาะจง

## 🐛 Troubleshooting

### ปัญหา: Port 3001 ถูกใช้งานอยู่
```bash
# Windows
netstat -ano | findstr :3001
taskkill /F /PID <PID>

# หรือเปลี่ยน PORT ใน .env
PORT=3002
```

### ปัญหา: MongoDB Connection Error
- ตรวจสอบ `MONGODB_URI` ใน `.env`
- ตรวจสอบ Network Access ใน MongoDB Atlas
- ตรวจสอบ Database User credentials

### ปัญหา: CORS Error
- ตรวจสอบว่า Backend รันอยู่ที่ `http://localhost:3001`
- ตรวจสอบ `API_BASE_URL` ใน `frontend/js/api.js`

## 📄 License

This project is created for educational purposes (ITDS241 Course Project).

## 👥 Contributors

- **Developer**: [Your Name]
- **Course**: ITDS241
- **Institution**: [Your University]

---

**Last Updated**: November 21, 2025
