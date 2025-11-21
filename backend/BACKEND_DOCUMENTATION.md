# Backend Documentation - I KHEAW API

## 📑 สารบัญ
1. [ภาพรวม Backend Architecture](#ภาพรวม-backend-architecture)
2. [โครงสร้างโฟลเดอร์](#โครงสร้างโฟลเดอร์)
3. [Database Models](#database-models)
4. [API Routes & Endpoints](#api-routes--endpoints)
5. [Authentication & Authorization](#authentication--authorization)
6. [Middleware](#middleware)
7. [Error Handling](#error-handling)
8. [Environment Variables](#environment-variables)
9. [การทดสอบ API](#การทดสอบ-api)
10. [Database Seeding](#database-seeding)

---

## ภาพรวม Backend Architecture

### Tech Stack
- **Runtime**: Node.js v14+
- **Framework**: Express.js v4.18.2
- **Database**: MongoDB Atlas (NoSQL)
- **ODM**: Mongoose v8.0.0
- **Authentication**: JSON Web Token (JWT)
- **Password Hashing**: bcryptjs v2.4.3
- **CORS**: cors v2.8.5
- **Environment**: dotenv v16.3.1

### Design Pattern
- **RESTful API**: ใช้ HTTP methods (GET, POST, PUT, DELETE) ตาม REST principles
- **MVC-like Pattern**: แยก Models, Routes ออกจากกัน
- **Middleware Pattern**: ใช้ middleware สำหรับ authentication และ authorization
- **Error Handling**: Centralized error handling middleware

### Port & URL
- **Development**: `http://localhost:3001`
- **API Base Path**: `/api`
- **CORS**: Enabled for all origins (*)

---

## โครงสร้างโฟลเดอร์

```
backend/
├── models/           # Database schemas
│   ├── User.js      # User model
│   └── Product.js   # Product model
│
├── routes/          # API endpoints
│   ├── auth.js      # Authentication routes
│   ├── products.js  # Product CRUD routes
│   └── users.js     # User management routes
│
├── middleware/      # Custom middleware
│   └── auth.js      # JWT authentication middleware
│
├── node_modules/    # Dependencies
├── .env            # Environment variables (gitignored)
├── .env.example    # Environment template
├── package.json    # Dependencies & scripts
├── server.js       # Main application entry point
└── seed.js         # Database seeder script
```

---

## Database Models

### 1. User Model (`models/User.js`)

#### Schema Structure
```javascript
{
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

#### Pre-Save Hook (Password Hashing)
```javascript
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
```
- **การทำงาน**: Hash password ด้วย bcrypt ก่อน save ลง database
- **Salt Rounds**: 10 (ความปลอดภัยระดับกลาง-สูง)
- **Condition**: Hash เฉพาะเมื่อ password ถูกแก้ไข

#### Instance Method (Password Comparison)
```javascript
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
```
- **การทำงาน**: เปรียบเทียบ password ที่ป้อนเข้ามากับ hashed password
- **Return**: Boolean (true/false)

#### Indexes
- `username`: unique index
- `email`: unique index

---

### 2. Product Model (`models/Product.js`)

#### Schema Structure
```javascript
{
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please enter product category'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price']
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    default: 0
  },
  description: {
    type: String,
    required: [true, 'Please enter product description']
  },
  imageUrl: {
    type: String,
    default: 'no-photo.jpg'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

#### Field Descriptions
- **name**: ชื่อสินค้า (required, trim whitespace)
- **category**: หมวดหมู่ (Drinks, Powder, 4in1)
- **price**: ราคา (required, Number)
- **stock**: จำนวนคงเหลือ (default: 0)
- **description**: รายละเอียดสินค้า
- **imageUrl**: URL รูปภาพ (default: 'no-photo.jpg')
- **createdAt**: วันที่สร้าง (auto-generated)

---

## API Routes & Endpoints

### 1. Authentication Routes (`routes/auth.js`)

#### 1.1 POST /api/auth/login
**Description**: เข้าสู่ระบบด้วย username และ password

**Request Body**:
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "เข้าสู่ระบบสำเร็จ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWZkMGRhMDI2YzU3Mjk5YTkyYTA3OCIsImlhdCI6MTcwMDU3MDQwMCwiZXhwIjoxNzAzMTYyNDAwfQ.example",
  "data": {
    "id": "691fd0da026c57299a92a078",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@ikheaw.com",
    "isAdmin": true
  }
}
```

**Error Responses**:
- **400**: Missing username or password
  ```json
  {
    "success": false,
    "message": "กรุณากรอก username และ password"
  }
  ```
- **401**: Invalid credentials
  ```json
  {
    "success": false,
    "message": "username หรือ password ไม่ถูกต้อง"
  }
  ```

**Process Flow**:
1. Validate request body (username, password)
2. Find user by username
3. Compare password using bcrypt
4. Generate JWT token (expires in 30 days)
5. Return token + user data (excluding password)

**JWT Token Structure**:
```javascript
{
  id: user._id,        // MongoDB ObjectId
  iat: 1700570400,     // Issued at timestamp
  exp: 1703162400      // Expiration timestamp (30 days)
}
```

---

#### 1.2 POST /api/auth/register
**Description**: สมัครสมาชิกใหม่

**Request Body**:
```json
{
  "username": "newuser",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "สมัครสมาชิกสำเร็จ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": "691fd0da026c57299a92a078",
    "username": "newuser",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "isAdmin": false
  }
}
```

**Error Responses**:
- **400**: Duplicate username
  ```json
  {
    "success": false,
    "message": "username นี้ถูกใช้งานแล้ว"
  }
  ```
- **400**: Duplicate email
  ```json
  {
    "success": false,
    "message": "email นี้ถูกใช้งานแล้ว"
  }
  ```
- **400**: Validation error
  ```json
  {
    "success": false,
    "message": "Validation error messages..."
  }
  ```

**Process Flow**:
1. Validate request body
2. Check for duplicate username or email
3. Create new user (password will be auto-hashed by pre-save hook)
4. Generate JWT token
5. Return token + user data

---

### 2. Product Routes (`routes/products.js`)

#### 2.1 GET /api/products
**Description**: ดึงข้อมูลสินค้าทั้งหมด (รองรับการค้นหา)

**Authentication**: Not required (Public)

**Query Parameters**:
- `name` (string, optional): ค้นหาตามชื่อ (partial match, case-insensitive)
- `category` (string, optional): ค้นหาตามหมวดหมู่ (exact match)
- `minPrice` (number, optional): ราคาต่ำสุด
- `maxPrice` (number, optional): ราคาสูงสุด

**Examples**:
```
GET /api/products
GET /api/products?name=matcha
GET /api/products?category=Drinks
GET /api/products?minPrice=50&maxPrice=100
GET /api/products?name=latte&category=Drinks&minPrice=70&maxPrice=90
```

**Success Response** (200):
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "691fd0da026c57299a92a079",
      "name": "Matcha Latte",
      "category": "Drinks",
      "price": 85,
      "stock": 50,
      "description": "เครื่องดื่มมัทฉะลาเต้ รสชาติกลมกล่อม หอมหวานจากนมสด",
      "imageUrl": "https://images.unsplash.com/photo-1536013564-89a7e0a8c1c2?w=500",
      "createdAt": "2024-11-21T02:39:38.000Z"
    },
    // ... more products
  ]
}
```

**Search Query Logic**:
```javascript
let query = {};

// 1. Search by name (regex, case-insensitive)
if (name) {
    query.name = { $regex: name, $options: 'i' };
}

// 2. Search by category (exact match)
if (category) {
    query.category = category;
}

// 3. Search by price range
if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
}
```

---

#### 2.2 GET /api/products/:id
**Description**: ดึงข้อมูลสินค้าตาม ID

**Authentication**: Not required (Public)

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId ของสินค้า

**Example**:
```
GET /api/products/691fd0da026c57299a92a079
```

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "691fd0da026c57299a92a079",
    "name": "Matcha Latte",
    "category": "Drinks",
    "price": 85,
    "stock": 50,
    "description": "เครื่องดื่มมัทฉะลาเต้ รสชาติกลมกล่อม หอมหวานจากนมสด",
    "imageUrl": "https://images.unsplash.com/photo-1536013564-89a7e0a8c1c2?w=500",
    "createdAt": "2024-11-21T02:39:38.000Z"
  }
}
```

**Error Responses**:
- **404**: Product not found
  ```json
  {
    "success": false,
    "message": "ไม่พบสินค้านี้"
  }
  ```
- **400**: Invalid ObjectId format
  ```json
  {
    "success": false,
    "message": "Resource not found"
  }
  ```

---

#### 2.3 POST /api/products
**Description**: เพิ่มสินค้าใหม่

**Authentication**: Required (Admin only)

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "New Matcha Product",
  "category": "Drinks",
  "price": 95,
  "stock": 30,
  "description": "รายละเอียดสินค้า",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "เพิ่มสินค้าสำเร็จ",
  "data": {
    "_id": "691fd0da026c57299a92a080",
    "name": "New Matcha Product",
    "category": "Drinks",
    "price": 95,
    "stock": 30,
    "description": "รายละเอียดสินค้า",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-11-21T03:00:00.000Z"
  }
}
```

**Error Responses**:
- **401**: No token or invalid token
  ```json
  {
    "success": false,
    "message": "กรุณาเข้าสู่ระบบก่อนใช้งาน"
  }
  ```
- **403**: Not admin
  ```json
  {
    "success": false,
    "message": "คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ (Admin only)"
  }
  ```
- **400**: Validation error
  ```json
  {
    "success": false,
    "message": "Please enter product name, Please enter product category"
  }
  ```

**Middleware Chain**:
```javascript
router.post('/', protect, adminOnly, async (req, res) => { ... });
```
1. `protect`: ตรวจสอบ JWT token
2. `adminOnly`: ตรวจสอบว่าเป็น admin
3. Handler: ทำงานจริง

---

#### 2.4 PUT /api/products/:id
**Description**: แก้ไขข้อมูลสินค้า

**Authentication**: Required (Admin only)

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId ของสินค้า

**Request Body** (partial update supported):
```json
{
  "price": 100,
  "stock": 45
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "แก้ไขข้อมูลสินค้าสำเร็จ",
  "data": {
    "_id": "691fd0da026c57299a92a079",
    "name": "Matcha Latte",
    "category": "Drinks",
    "price": 100,
    "stock": 45,
    "description": "เครื่องดื่มมัทฉะลาเต้ รสชาติกลมกล่อม หอมหวานจากนมสด",
    "imageUrl": "https://images.unsplash.com/photo-1536013564-89a7e0a8c1c2?w=500",
    "createdAt": "2024-11-21T02:39:38.000Z"
  }
}
```

**Update Options**:
```javascript
{
  new: true,           // Return updated document
  runValidators: true  // Run schema validators
}
```

---

#### 2.5 DELETE /api/products/:id
**Description**: ลบสินค้า

**Authentication**: Required (Admin only)

**Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**URL Parameters**:
- `id` (string, required): MongoDB ObjectId ของสินค้า

**Success Response** (200):
```json
{
  "success": true,
  "message": "ลบสินค้าสำเร็จ",
  "data": {}
}
```

**Error Responses**:
- **404**: Product not found
- **401**: Unauthorized
- **403**: Forbidden (not admin)

---

### 3. User Routes (`routes/users.js`)

**Note**: ทุก endpoint ใน users routes ต้องการ Admin authentication

#### 3.1 GET /api/users
**Description**: ดึงข้อมูลผู้ใช้ทั้งหมด (รองรับการค้นหา)

**Authentication**: Required (Admin only)

**Query Parameters**:
- `username` (string, optional): ค้นหาตาม username (partial match)
- `email` (string, optional): ค้นหาตาม email (partial match)
- `isAdmin` (string, optional): กรองตาม role ('true'/'false')

**Examples**:
```
GET /api/users
GET /api/users?username=admin
GET /api/users?email=gmail.com
GET /api/users?isAdmin=true
```

**Success Response** (200):
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "691fd0da026c57299a92a078",
      "username": "admin",
      "password": "$2a$10$...",
      "firstName": "Admin",
      "lastName": "User",
      "email": "admin@ikheaw.com",
      "isAdmin": true,
      "createdAt": "2024-11-21T02:39:38.000Z"
    },
    // ... more users
  ]
}
```

**Search Query Logic**:
```javascript
let query = {};

if (username) {
    query.username = { $regex: username, $options: 'i' };
}

if (email) {
    query.email = { $regex: email, $options: 'i' };
}

if (isAdmin !== undefined) {
    query.isAdmin = isAdmin === 'true';
}
```

---

#### 3.2 GET /api/users/:id
**Description**: ดึงข้อมูลผู้ใช้ตาม ID

**Authentication**: Required (Admin only)

**Success Response** (200):
```json
{
  "success": true,
  "data": {
    "_id": "691fd0da026c57299a92a078",
    "username": "admin",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@ikheaw.com",
    "isAdmin": true,
    "createdAt": "2024-11-21T02:39:38.000Z"
  }
}
```

---

#### 3.3 POST /api/users
**Description**: เพิ่มผู้ใช้ใหม่ (โดย Admin)

**Authentication**: Required (Admin only)

**Request Body**:
```json
{
  "username": "newuser",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "isAdmin": false
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "เพิ่มผู้ใช้งานสำเร็จ",
  "data": {
    "_id": "691fd0da026c57299a92a081",
    "username": "newuser",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "createdAt": "2024-11-21T03:00:00.000Z"
  }
}
```

---

#### 3.4 PUT /api/users/:id
**Description**: แก้ไขข้อมูลผู้ใช้

**Authentication**: Required (Admin only)

**Special Handling**: 
- ถ้ามีการแก้ password จะใช้ `save()` เพื่อให้ pre-save hook ทำงาน
- ถ้าไม่แก้ password จะใช้ `findByIdAndUpdate()`

**Request Body**:
```json
{
  "firstName": "Updated Name",
  "email": "newemail@example.com",
  "isAdmin": true
}
```

**To Update Password**:
```json
{
  "password": "newpassword123"
}
```

**Implementation Logic**:
```javascript
if (req.body.password) {
    // กรณีแก้รหัสผ่านด้วย - ใช้ save() เพื่อให้ pre-save hook ทำงาน
    Object.assign(user, req.body);
    await user.save();
} else {
    // กรณีแก้ข้อมูลทั่วไป
    user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
}
```

---

#### 3.5 DELETE /api/users/:id
**Description**: ลบผู้ใช้

**Authentication**: Required (Admin only)

**Success Response** (200):
```json
{
  "success": true,
  "message": "ลบผู้ใช้สำเร็จ",
  "data": {}
}
```

---

## Authentication & Authorization

### JWT (JSON Web Token)

#### Token Generation
```javascript
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};
```

**Token Structure**:
- **Payload**: `{ id: user._id }`
- **Secret**: จาก environment variable `JWT_SECRET`
- **Expiration**: 30 วัน (2,592,000 seconds)

#### Token Storage (Frontend)
```javascript
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(userData));
```

#### Token Usage
ส่งใน Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Middleware

### 1. Authentication Middleware (`middleware/auth.js`)

#### `protect` Middleware
**Purpose**: ตรวจสอบว่า user login แล้วหรือยัง

**Process**:
1. ดึง token จาก Authorization header
2. Verify token ด้วย JWT
3. หา user จาก token payload
4. แนบ user object เข้ากับ `req.user`

**Code**:
```javascript
exports.protect = async (req, res, next) => {
    let token;

    // ตรวจสอบ token จาก header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    // ตรวจสอบว่ามี token หรือไม่
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน'
        });
    }

    try {
        // ตรวจสอบ token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // หา user จาก token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'ไม่พบผู้ใช้งาน'
            });
        }

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Token ไม่ถูกต้องหรือหมดอายุ'
        });
    }
};
```

**Usage**:
```javascript
router.post('/', protect, async (req, res) => { ... });
```

---

#### `adminOnly` Middleware
**Purpose**: ตรวจสอบว่า user เป็น admin หรือไม่

**Code**:
```javascript
exports.adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้ (Admin only)'
        });
    }
};
```

**Usage**:
```javascript
router.post('/', protect, adminOnly, async (req, res) => { ... });
```

**Middleware Chain**:
1. `protect`: ตรวจสอบ authentication → แนบ `req.user`
2. `adminOnly`: ตรวจสอบ `req.user.isAdmin`
3. Route handler: ทำงานจริง

---

### 2. CORS Middleware
```javascript
app.use(cors());
```
**Configuration**: Allow all origins (*)
**Headers Allowed**: All
**Methods Allowed**: GET, POST, PUT, DELETE, OPTIONS

---

### 3. Body Parser Middleware
```javascript
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```
**Purpose**: Parse JSON และ URL-encoded request bodies

---

## Error Handling

### Centralized Error Handler (`server.js`)

```javascript
app.use((err, req, res, next) => {
    console.error(err);

    let error = { ...err };
    error.message = err.message;

    // ObjectId error (Cast Error)
    if (err.name === 'CastError') {
        return res.status(404).json({ 
            success: false, 
            message: 'Resource not found' 
        });
    }

    // Duplicate key error
    if (err.code === 11000) {
        return res.status(400).json({ 
            success: false, 
            message: 'Duplicate field value entered' 
        });
    }

    // Validation error
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({ 
            success: false, 
            message: messages.join(', ') 
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error'
    });
});
```

### Error Types Handled

1. **CastError**: Invalid MongoDB ObjectId
   - Status: 404
   - Example: `/api/products/invalid-id`

2. **Duplicate Key (11000)**: Unique constraint violation
   - Status: 400
   - Example: สมัครด้วย username/email ที่มีอยู่แล้ว

3. **ValidationError**: Mongoose schema validation failed
   - Status: 400
   - Example: ไม่ได้ส่งฟิลด์ required

4. **JWT Errors**: Token errors (handled in middleware)
   - Status: 401
   - Example: Token ผิด, Token หมดอายุ

5. **General Errors**: ข้อผิดพลาดอื่นๆ
   - Status: 500
   - Message: จาก error object

---

## Environment Variables

### `.env` File Structure
```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### Variables Description

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port number | 3001 | No |
| `MONGODB_URI` | MongoDB connection string | - | Yes |
| `JWT_SECRET` | Secret key for JWT signing | 'your-secret-key' | Recommended |

### Security Best Practices
1. **Never commit `.env`** to git (already in `.gitignore`)
2. **Use strong JWT_SECRET** (minimum 32 characters)
3. **Use Environment Variables** for production (not `.env` file)
4. **Rotate JWT_SECRET** periodically

---

## การทดสอบ API

### 1. Using cURL

#### Health Check
```bash
curl http://localhost:3001/api/health
```

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

#### Get Products
```bash
curl http://localhost:3001/api/products
```

#### Get Products with Search
```bash
curl "http://localhost:3001/api/products?category=Drinks&minPrice=50&maxPrice=100"
```

#### Create Product (with JWT)
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name":"Test Product",
    "category":"Drinks",
    "price":99,
    "stock":20,
    "description":"Test description",
    "imageUrl":"https://example.com/image.jpg"
  }'
```

---

### 2. Using Postman

#### Environment Variables
```
base_url = http://localhost:3001/api
token = (will be set after login)
```

#### Login Request
```
POST {{base_url}}/auth/login
Body (JSON):
{
  "username": "admin",
  "password": "admin123"
}

Tests Script:
pm.environment.set("token", pm.response.json().token);
```

#### Protected Request
```
POST {{base_url}}/products
Headers:
  Authorization: Bearer {{token}}
Body (JSON):
{
  "name": "New Product",
  "category": "Drinks",
  "price": 85,
  "stock": 50,
  "description": "Description"
}
```

---

### 3. Using Thunder Client (VS Code)

#### Collection Structure
```
I KHEAW API/
├── Auth/
│   ├── Login
│   └── Register
├── Products/
│   ├── Get All Products
│   ├── Get Product by ID
│   ├── Create Product
│   ├── Update Product
│   └── Delete Product
└── Users/
    ├── Get All Users
    ├── Create User
    ├── Update User
    └── Delete User
```

---

## Database Seeding

### Seed Script (`seed.js`)

**Purpose**: สร้างข้อมูลตัวอย่างในฐานข้อมูล

#### Running Seeder
```bash
cd backend
node seed.js
```

#### What It Does
1. **Clear existing data**: ลบ users และ products ทั้งหมด
2. **Create admin user**: username=admin, password=admin123
3. **Create regular user**: username=user, password=user123
4. **Create 8 sample products**: Matcha Latte, Green Tea, etc.

#### Sample Products Created
```javascript
[
  {
    name: 'Matcha Latte',
    category: 'Drinks',
    price: 85,
    stock: 50
  },
  {
    name: 'Green Tea Latte',
    category: 'Drinks',
    price: 75,
    stock: 45
  },
  {
    name: 'Matcha Powder Premium',
    category: 'Powder',
    price: 350,
    stock: 30
  },
  // ... 5 more products
]
```

#### Default Accounts Created

**Admin Account**:
- Username: `admin`
- Password: `admin123`
- Email: `admin@ikheaw.com`
- isAdmin: `true`

**User Account**:
- Username: `user`
- Password: `user123`
- Email: `user@ikheaw.com`
- isAdmin: `false`

---

## Server Configuration (`server.js`)

### Application Flow

```javascript
// 1. Load dependencies
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// 2. Load environment variables
dotenv.config();

// 3. Connect to database
const connectDB = async () => { ... };
connectDB();

// 4. Initialize Express app
const app = express();

// 5. Apply middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 6. Mount routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));

// 7. Health check endpoint
app.get('/api/health', (req, res) => { ... });

// 8. Error handling middleware
app.use((err, req, res, next) => { ... });

// 9. Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => { ... });
```

---

## API Summary Table

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/products` | Get all products |
| GET | `/api/products/:id` | Get product by ID |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/products` | ✅ | Admin | Create product |
| PUT | `/api/products/:id` | ✅ | Admin | Update product |
| DELETE | `/api/products/:id` | ✅ | Admin | Delete product |
| GET | `/api/users` | ✅ | Admin | Get all users |
| GET | `/api/users/:id` | ✅ | Admin | Get user by ID |
| POST | `/api/users` | ✅ | Admin | Create user |
| PUT | `/api/users/:id` | ✅ | Admin | Update user |
| DELETE | `/api/users/:id` | ✅ | Admin | Delete user |

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution (Windows)**:
```bash
netstat -ano | findstr :3001
taskkill /F /PID <PID>
```

**Solution (Mac/Linux)**:
```bash
lsof -i :3001
kill -9 <PID>
```

---

#### 2. MongoDB Connection Error
```
Error: connect ECONNREFUSED
```

**Solutions**:
1. ตรวจสอบ `MONGODB_URI` ใน `.env`
2. ตรวจสอบ Network Access ใน MongoDB Atlas
3. ตรวจสอบ Database User credentials
4. ตรวจสอบ internet connection

---

#### 3. JWT Token Invalid
```
{
  "success": false,
  "message": "Token ไม่ถูกต้องหรือหมดอายุ"
}
```

**Solutions**:
1. Login ใหม่เพื่อได้ token ใหม่
2. ตรวจสอบว่า `JWT_SECRET` ตรงกันระหว่าง การสร้างและการ verify
3. ตรวจสอบว่า token ยังไม่หมดอายุ (30 วัน)

---

#### 4. Validation Error
```
{
  "success": false,
  "message": "Please enter product name, Please enter product price"
}
```

**Solution**: ส่งข้อมูลครบตาม schema ที่กำหนด

---

## Performance Considerations

### Database Indexes
- `User.username`: Unique index (auto-created)
- `User.email`: Unique index (auto-created)
- Consider adding index on `Product.category` for faster filtering

### Optimization Tips
1. **Use select()** เพื่อดึงเฉพาะฟิลด์ที่ต้องการ
2. **Use lean()** สำหรับ read-only queries
3. **Implement pagination** สำหรับ large datasets
4. **Add Redis caching** สำหรับ frequently accessed data

---

## Security Checklist

- ✅ Password hashing (bcryptjs)
- ✅ JWT token authentication
- ✅ Input validation (Mongoose schema)
- ✅ CORS enabled
- ✅ Environment variables for secrets
- ✅ Admin authorization middleware
- ⚠️ Rate limiting (not implemented)
- ⚠️ Request size limiting (not implemented)
- ⚠️ Helmet.js for security headers (not implemented)

---

## Future Enhancements

1. **Pagination**: Add page and limit parameters
2. **File Upload**: Image upload for products
3. **Rate Limiting**: Prevent API abuse
4. **Logging**: Winston or Morgan for request logging
5. **Validation**: Express-validator for request validation
6. **Testing**: Jest/Mocha for unit tests
7. **API Documentation**: Swagger/OpenAPI
8. **Email Service**: Password reset, notifications
9. **Payment Integration**: Stripe, PayPal
10. **Real-time**: Socket.io for real-time updates

---

**Document Version**: 1.0  
**Last Updated**: November 21, 2025  
**Author**: I KHEAW Development Team
