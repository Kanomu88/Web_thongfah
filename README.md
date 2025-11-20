# I KHEAW - Premium Matcha & Japanese Tea

เว็บไซต์แคตตาล็อกสินค้าชาเขียวและมัทฉะคุณภาพ สำหรับโปรเจค ITDS241

## Overview

I KHEAW เป็นเว็บไซต์แสดงข้อมูลสินค้าชาเขียวและมัทฉะ ประกอบด้วยระบบ authentication สำหรับผู้ใช้งาน

## Tech Stack

### Frontend
- Node.js + Express.js (Static Server)
- Tailwind CSS (CDN)
- Font Awesome 6
- Google Fonts (Playfair Display, Prompt)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- bcrypt.js (Password Hashing)

## โครงสร้างโปรเจค

```
ITDS241-Project/
├── frontend/
│   ├── assets/images/      # รูปภาพ
│   ├── css/                # Custom CSS
│   ├── js/                 # JavaScript (auth.js)
│   ├── views/              # HTML pages
│   ├── index.html          # หน้าหลัก
│   ├── server.js           # Express server
│   └── package.json
├── backend/
│   ├── config/             # Database config
│   ├── controllers/        # API controllers
│   ├── middleware/         # Error handling
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── server.js           # Express server
│   └── package.json
└── README.md
```

## การติดตั้ง

### Prerequisites

- Node.js (v18+)
- MongoDB (local หรือ Atlas)

### 1. Clone โปรเจค

```bash
git clone <repository-url>
cd ITDS241-Project
```

### 2. ติดตั้ง Backend

```bash
cd backend
npm install
```

สร้างไฟล์ `.env`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ikheaw
```

### 3. ติดตั้ง Frontend

```bash
cd frontend
npm install
```

## การรันโปรเจค

### Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Server รันที่ `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Server รันที่ `http://localhost:3000`

### Production Mode

```bash
# Backend
cd backend && npm start

# Frontend
cd frontend && npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | สมัครสมาชิก |
| POST | `/api/auth/login` | เข้าสู่ระบบ |

### Register Request
```json
{
  "username": "testuser",
  "password": "123456",
  "firstName": "Test",
  "lastName": "User",
  "email": "test@example.com"
}
```

### Login Request
```json
{
  "username": "testuser",
  "password": "123456"
}
```

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | หน้าหลัก |
| `/about` | เกี่ยวกับเรา |
| `/login` | เข้าสู่ระบบ |

## Design System

### Colors

| Name | Hex | Usage |
|------|-----|-------|
| matcha | `#809671` | Primary |
| matcha-dark | `#6a7d5e` | Hover/Accent |
| matcha-light | `#a8b89d` | Light BG |
| cream | `#f8f6f3` | Page BG |

### Fonts

- **Playfair Display** - หัวข้อ
- **Prompt** - เนื้อหา (Thai)

## Features

- ระบบ Login/Register
- Password hashing (bcrypt)
- Responsive design
- Scroll animations
- Mobile-friendly navbar

## Security

- Password hashing ด้วย bcrypt (salt rounds: 10)
- Input validation
- Duplicate username/email check
- Generic error messages (ไม่เปิดเผยว่า username หรือ password ผิด)

## Scripts

### Backend
```bash
npm start      # Production
npm run dev    # Development (nodemon)
```

### Frontend
```bash
npm start      # Production
npm run dev    # Development (nodemon)
```
