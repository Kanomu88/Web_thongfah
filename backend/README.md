# I KHEAW Backend API

Backend API สำหรับเว็บไซต์ I KHEAW - Premium Matcha & Japanese Tea

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** bcrypt.js
- **Environment:** dotenv
- **CORS:** cors

## โครงสร้างโปรเจค

```
backend/
  ├── models/
  │   ├── User.js          # User schema
  │   └── Product.js       # Product schema
  ├── routes/
  │   ├── auth.js          # Authentication routes
  │   ├── products.js      # Product routes
  │   └── users.js         # User routes
  ├── middleware/
  │   └── auth.js          # JWT middleware
  ├── server.js            # Main server file
  ├── seed.js              # Database seeder
  ├── package.json
  └── .env                 # Environment variables
```

## การติดตั้ง

### 1. Clone โปรเจค

```bash
cd backend
```

### 2. ติดตั้ง Dependencies

```bash
npm install
```

### 3. ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ใน root folder ของ backend:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/ikheaw
```

หรือใช้ MongoDB Atlas:

```env
PORT=3001
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ikheaw
```

### 4. รันโปรเจค

**Development mode (auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server จะรันที่ `http://localhost:3001`

## API Endpoints

### Health Check

```
GET /api/health
```

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running"
}
```

---

#### Login - เข้าสู่ระบบ

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "username": "testuser",
  "password": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "เข้าสู่ระบบสำเร็จ",
  "data": {
    "id": "6571234567890abcdef12345",
    "username": "testuser",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "isAdmin": false
  }
}
```

**Error Response (400) - ไม่กรอกข้อมูล:**
```json
{
  "success": false,
  "message": "กรุณากรอก username และ password"
}
```

**Error Response (401) - ข้อมูลไม่ถูกต้อง:**
```json
{
  "success": false,
  "message": "username หรือ password ไม่ถูกต้อง"
}
```

---

## User Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| username | String | Yes | ชื่อผู้ใช้ (unique) |
| password | String | Yes | รหัสผ่าน (min 6 ตัว, hash ด้วย bcrypt) |
| firstName | String | Yes | ชื่อจริง |
| lastName | String | Yes | นามสกุล |
| email | String | Yes | อีเมล (unique, valid format) |
| isAdmin | Boolean | No | สิทธิ์ admin (default: false) |
| createdAt | Date | No | วันที่สร้าง (auto) |

---

## Error Handling

API จะ return error ในรูปแบบ:

```json
{
  "success": false,
  "message": "รายละเอียด error"
}
```

### Error Types:

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - ข้อมูลไม่ถูกต้อง/ไม่ครบ |
| 401 | Unauthorized - ไม่ได้รับอนุญาต |
| 404 | Not Found - ไม่พบข้อมูล |
| 500 | Server Error - เซิร์ฟเวอร์มีปัญหา |

---

## ทดสอบด้วย Postman


### ๅ. Login

- **Method:** POST
- **URL:** `http://localhost:3001/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "admin",
  "password": "password123"
}
```

---

## Security Features

- **Password Hashing:** รหัสผ่านถูก hash ด้วย bcrypt (salt rounds: 10)
- **Input Validation:** ตรวจสอบข้อมูลก่อนบันทึก
- **Duplicate Check:** เช็ค username และ email ซ้ำ
- **Error Messages:** ไม่เปิดเผยว่า username หรือ password ผิด

---

## Development

### Scripts

```bash
npm start      # รัน production
npm run dev    # รัน development (nodemon)
```

### Dependencies

```json
{
  "bcryptjs": "^2.4.3",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "express": "^4.18.2",
  "mongoose": "^8.0.0"
}
```

### Dev Dependencies

```json
{
  "nodemon": "^3.0.1"
}
```