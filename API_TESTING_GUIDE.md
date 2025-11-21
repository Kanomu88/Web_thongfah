# 🧪 API Testing Guide

คู่มือการทดสอบ API สำหรับโปรเจค I KHEAW

---

## 📋 สารบัญ

1. [เครื่องมือทดสอบ API](#เครื่องมือทดสอบ-api)
2. [การทดสอบด้วย Postman](#1-postman-แนะนำ)
3. [การทดสอบด้วย Thunder Client](#2-thunder-client-vs-code)
4. [การทดสอบด้วย cURL](#3-curl-command-line)
5. [การทดสอบด้วย Browser Console](#4-browser-console)
6. [ตัวอย่าง API ทั้งหมด](#ตัวอย่าง-api-endpoints)
7. [การจัดการ Authentication](#authentication--jwt)

---

## 📡 Base URL

```
http://localhost:3001/api
```

---

## 🛠️ เครื่องมือทดสอบ API

| เครื่องมือ | ระดับความยาก | แนะนำ | หมายเหตุ |
|-----------|-------------|-------|----------|
| **Postman** | ⭐ ง่าย | ✅ | UI สวย ฟีเจอร์เยอะ |
| **Thunder Client** | ⭐ ง่าย | ✅ | อยู่ใน VS Code |
| **cURL** | ⭐⭐ ปานกลาง | ✅ | Command line |
| **Browser Console** | ⭐⭐ ปานกลาง | ⚠️ | ต้องเขียนโค้ด |

---

## 1. Postman (แนะนำ)

### 📥 ดาวน์โหลด
- เข้า https://www.postman.com/downloads/
- หรือใช้ Web Version: https://web.postman.com/

### 🚀 ขั้นตอนการใช้งาน

#### **Step 1: สร้าง Request ใหม่**
```
1. คลิก "New" → "HTTP Request"
2. เลือก Method (GET, POST, PUT, DELETE)
3. ใส่ URL
4. ตั้งค่า Headers และ Body
5. คลิก "Send"
```

#### **Step 2: ตัวอย่าง POST Request**

**Method:** `POST`  
**URL:** `http://localhost:3001/api/products`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_JWT_TOKEN
```

**Body (raw JSON):**
```json
{
    "name": "Matcha Latte",
    "category": "Drinks",
    "price": 95,
    "stock": 50,
    "description": "ชาเขียวลาเต้ รสชาติหอมกรุ่น",
    "imageUrl": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500"
}
```

**Response (200 Created):**
```json
{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "_id": "67123abc...",
        "name": "Matcha Latte",
        "category": "Drinks",
        "price": 95,
        "stock": 50,
        "description": "ชาเขียวลาเต้ รสชาติหอมกรุ่น",
        "imageUrl": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500",
        "createdAt": "2025-11-21T10:00:00.000Z"
    }
}
```

---

## 2. Thunder Client (VS Code)

### 📥 ติดตั้ง
```
1. เปิด VS Code
2. ไป Extensions (Ctrl+Shift+X)
3. ค้นหา "Thunder Client"
4. คลิก Install
```

### 🚀 ขั้นตอนการใช้งาน

#### **Step 1: เปิด Thunder Client**
```
1. คลิกไอคอนฟ้าผ่าใน Sidebar
2. คลิก "New Request"
```

#### **Step 2: ตั้งค่า Request**

**Method:** `POST`  
**URL:** `http://localhost:3001/api/auth/login`

**Body (JSON):**
```json
{
    "username": "admin",
    "password": "admin123"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "data": {
        "_id": "671234...",
        "username": "admin",
        "email": "admin@ikheaw.com",
        "isAdmin": true
    }
}
```

---

## 3. cURL (Command Line)

### 🚀 ตัวอย่างการใช้งาน

#### **GET Request**
```bash
curl http://localhost:3001/api/products
```

#### **POST Request (Login)**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

#### **POST Request (Create Product) with JWT**
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Matcha Latte",
    "category": "Drinks",
    "price": 95,
    "stock": 50,
    "description": "ชาเขียวลาเต้",
    "imageUrl": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500"
  }'
```

#### **PUT Request (Update Product)**
```bash
curl -X PUT http://localhost:3001/api/products/67123abc... \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "price": 99
  }'
```

#### **DELETE Request**
```bash
curl -X DELETE http://localhost:3001/api/products/67123abc... \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 4. Browser Console

### 🚀 ขั้นตอน

1. **เปิด Console** (F12 → Console tab)
2. **Copy โค้ดด้านล่าง** แล้ว Paste
3. **กด Enter**

#### **GET Request**
```javascript
fetch('http://localhost:3001/api/products')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
```

#### **POST Request (Login)**
```javascript
fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
    })
})
.then(res => res.json())
.then(data => {
    console.log(data);
    // Save token
    localStorage.setItem('token', data.token);
})
.catch(err => console.error(err));
```

#### **POST Request (Create Product) with JWT**
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3001/api/products', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        name: 'Matcha Latte',
        category: 'Drinks',
        price: 95,
        stock: 50,
        description: 'ชาเขียวลาเต้',
        imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'
    })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
```

---

## 📌 ตัวอย่าง API Endpoints

### 🔐 Authentication

#### **1. Register (สมัครสมาชิก)**

**Endpoint:** `POST /api/auth/register`  
**Auth Required:** ❌ No

**Request Body:**
```json
{
    "username": "newuser",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Registration successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "data": {
        "_id": "671234...",
        "username": "newuser",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "isAdmin": false
    }
}
```

---

#### **2. Login (เข้าสู่ระบบ)**

**Endpoint:** `POST /api/auth/login`  
**Auth Required:** ❌ No

**Request Body:**
```json
{
    "username": "admin",
    "password": "admin123"
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR...",
    "data": {
        "_id": "671234...",
        "username": "admin",
        "email": "admin@ikheaw.com",
        "isAdmin": true
    }
}
```

---

### 🛍️ Products

#### **3. Get All Products (ดูสินค้าทั้งหมด)**

**Endpoint:** `GET /api/products`  
**Auth Required:** ❌ No

**Query Parameters (Optional):**
```
?name=matcha          # ค้นหาจากชื่อ
&category=Drinks      # กรองตามหมวดหมู่
&minPrice=50          # ราคาต่ำสุด
&maxPrice=100         # ราคาสูงสุด
```

**Example:**
```
GET /api/products?category=Drinks&maxPrice=100
```

**Response (200):**
```json
{
    "success": true,
    "count": 6,
    "data": [
        {
            "_id": "671234...",
            "name": "Matcha Latte",
            "category": "Drinks",
            "price": 95,
            "stock": 50,
            "description": "ชาเขียวลาเต้",
            "imageUrl": "https://...",
            "createdAt": "2025-11-21T10:00:00.000Z"
        }
    ]
}
```

---

#### **4. Get Single Product (ดูสินค้าชิ้นเดียว)**

**Endpoint:** `GET /api/products/:id`  
**Auth Required:** ❌ No

**Example:**
```
GET /api/products/671234abc...
```

**Response (200):**
```json
{
    "success": true,
    "data": {
        "_id": "671234abc...",
        "name": "Matcha Latte",
        "category": "Drinks",
        "price": 95,
        "stock": 50,
        "description": "ชาเขียวลาเต้",
        "imageUrl": "https://...",
        "createdAt": "2025-11-21T10:00:00.000Z"
    }
}
```

---

#### **5. Create Product (สร้างสินค้า)**

**Endpoint:** `POST /api/products`  
**Auth Required:** ✅ Yes (Admin Only)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
    "name": "Hojicha Latte",
    "category": "Drinks",
    "price": 85,
    "stock": 30,
    "description": "ชาคั่วญี่ปุ่น",
    "imageUrl": "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500"
}
```

**Response (201):**
```json
{
    "success": true,
    "message": "Product created successfully",
    "data": {
        "_id": "671235...",
        "name": "Hojicha Latte",
        "category": "Drinks",
        "price": 85,
        "stock": 30,
        "description": "ชาคั่วญี่ปุ่น",
        "imageUrl": "https://...",
        "createdAt": "2025-11-21T10:00:00.000Z"
    }
}
```

---

#### **6. Update Product (แก้ไขสินค้า)**

**Endpoint:** `PUT /api/products/:id`  
**Auth Required:** ✅ Yes (Admin Only)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Request Body (แก้ไขบางส่วน):**
```json
{
    "price": 99,
    "stock": 100
}
```

**Response (200):**
```json
{
    "success": true,
    "message": "Product updated successfully",
    "data": {
        "_id": "671234...",
        "name": "Matcha Latte",
        "price": 99,
        "stock": 100,
        ...
    }
}
```

---

#### **7. Delete Product (ลบสินค้า)**

**Endpoint:** `DELETE /api/products/:id`  
**Auth Required:** ✅ Yes (Admin Only)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
    "success": true,
    "message": "Product deleted successfully",
    "data": {}
}
```

---

### 👥 Users (Admin Only)

#### **8. Get All Users**

**Endpoint:** `GET /api/users`  
**Auth Required:** ✅ Yes (Admin Only)

**Response (200):**
```json
{
    "success": true,
    "count": 2,
    "data": [
        {
            "_id": "671234...",
            "username": "admin",
            "firstName": "Admin",
            "lastName": "User",
            "email": "admin@ikheaw.com",
            "isAdmin": true
        },
        {
            "_id": "671235...",
            "username": "user",
            "firstName": "Regular",
            "lastName": "User",
            "email": "user@ikheaw.com",
            "isAdmin": false
        }
    ]
}
```

---

## 🔐 Authentication / JWT

### วิธีใช้ Token

#### **1. Login และเก็บ Token**
```javascript
// 1. Login
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
    })
});

const loginData = await loginResponse.json();
const token = loginData.token;

// 2. เก็บ Token
localStorage.setItem('token', token);
```

#### **2. ใช้ Token ใน Request**
```javascript
const token = localStorage.getItem('token');

fetch('http://localhost:3001/api/products', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`  // ⬅️ ใส่ Token ตรงนี้
    },
    body: JSON.stringify({ ... })
});
```

---

## ❌ Error Responses

### **400 Bad Request**
```json
{
    "success": false,
    "message": "Please provide all required fields"
}
```

### **401 Unauthorized**
```json
{
    "success": false,
    "message": "Please log in to continue"
}
```

### **403 Forbidden**
```json
{
    "success": false,
    "message": "You are not authorized to access this route (Admin only)"
}
```

### **404 Not Found**
```json
{
    "success": false,
    "message": "Product not found"
}
```

### **500 Internal Server Error**
```json
{
    "success": false,
    "message": "Server error"
}
```

---

## 🎯 Quick Testing Script

สร้างไฟล์ `test-api.js`:

```javascript
const API_BASE = 'http://localhost:3001/api';
let token = null;

async function testAPI() {
    try {
        // 1. Login
        console.log('1️⃣ Testing Login...');
        const loginRes = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });
        const loginData = await loginRes.json();
        token = loginData.token;
        console.log('✅ Login Success:', loginData);

        // 2. Get All Products
        console.log('\n2️⃣ Testing Get All Products...');
        const productsRes = await fetch(`${API_BASE}/products`);
        const productsData = await productsRes.json();
        console.log('✅ Products:', productsData);

        // 3. Create Product
        console.log('\n3️⃣ Testing Create Product...');
        const createRes = await fetch(`${API_BASE}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                name: 'Test Product',
                category: 'Test',
                price: 99,
                stock: 10,
                description: 'This is a test product'
            })
        });
        const createData = await createRes.json();
        console.log('✅ Created:', createData);

        // 4. Delete Product
        if (createData.success) {
            console.log('\n4️⃣ Testing Delete Product...');
            const deleteRes = await fetch(`${API_BASE}/products/${createData.data._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const deleteData = await deleteRes.json();
            console.log('✅ Deleted:', deleteData);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testAPI();
```

รันด้วย:
```bash
node test-api.js
```

---

## 📊 Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | สมัครสมาชิก |
| POST | `/auth/login` | ❌ | เข้าสู่ระบบ |
| GET | `/products` | ❌ | ดูสินค้าทั้งหมด |
| GET | `/products/:id` | ❌ | ดูสินค้าชิ้นเดียว |
| POST | `/products` | ✅ Admin | สร้างสินค้า |
| PUT | `/products/:id` | ✅ Admin | แก้ไขสินค้า |
| DELETE | `/products/:id` | ✅ Admin | ลบสินค้า |
| GET | `/users` | ✅ Admin | ดูผู้ใช้ทั้งหมด |
| GET | `/users/:id` | ✅ Admin | ดูผู้ใช้คนเดียว |
| POST | `/users` | ✅ Admin | สร้างผู้ใช้ |
| PUT | `/users/:id` | ✅ Admin | แก้ไขผู้ใช้ |
| DELETE | `/users/:id` | ✅ Admin | ลบผู้ใช้ |

---

**Updated:** 2025-11-21  
**Backend URL:** http://localhost:3001  
**Frontend URL:** http://localhost:3000
