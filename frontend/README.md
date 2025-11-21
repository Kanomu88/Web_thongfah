# I KHEAW Frontend

Frontend สำหรับเว็บไซต์ I KHEAW - Premium Matcha & Japanese Tea

## โครงสร้างโปรเจค

```
frontend/
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

## การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
cd frontend
npm install
```

### 2. รันโปรเจค

**Development mode (auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

Server จะรันที่ `http://localhost:3000`

## Routes

| Route | Description |
|-------|-------------|
| `/`        | หน้าหลัก (Homepage) |
| `/about`   | หน้าเกี่ยวกับเรา |
| `/login`   | หน้าเข้าสู่ระบบ |
| `/product` | หน้าเเคตาล็อคสินค้า |
| `/*`       | 404 Not Found |
| `/search`  | หน้าคนหาสินค้า |

## Design System

### สี (Colors)

| Name | Hex | Usage |
|------|-----|-------|
| matcha | `#809671` | Primary color |
| matcha-dark | `#6a7d5e` | Hover states, accents |
| matcha-light | `#a8b89d` | Light backgrounds |
| cream | `#f8f6f3` | Page background |

### Fonts

- **Playfair Display** - หัวข้อและ branding
- **Prompt** - เนื้อหาทั่วไป (รองรับภาษาไทย)

### Tailwind Config

```javascript
tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        'prompt': ['Prompt', 'sans-serif'],
        'playfair': ['Playfair Display', 'serif'],
      },
      colors: {
        'matcha': '#809671',
        'matcha-dark': '#6a7d5e',
        'matcha-light': '#a8b89d',
        'cream': '#f8f6f3',
      }
    }
  }
}
```

## Authentication

### auth.js Functions

```javascript
// Login
auth.login(username, password)

// Logout
auth.logout()

// Get current user
auth.getUser()

// Check if logged in
auth.isLoggedIn()
```

### API Configuration

```javascript
const API_URL = 'http://localhost:3001/api';
```

### Login Flow

1. User submits login form
2. `auth.login()` calls `POST /api/auth/login`
3. On success, user data saved to `localStorage`
4. Redirect to homepage

### Register Flow

1. User submits register form
2. `auth.register()` calls `POST /api/auth/register`
3. On success, redirect to login page
4. User can then login with new credentials

## Features

### Animations

- **float** - Floating animation สำหรับ decorative elements
- **fadeIn** - Fade in สำหรับ content
- **animate-on-scroll** - Trigger animation เมื่อ scroll ถึง

### Components

- **Navbar** - Fixed navbar with mobile menu
- **Hero Section** - Full-height hero with gradient overlay
- **Product Cards** - Hover effects และ animations
- **CTA Section** - Call-to-action with gradient background
- **Footer** - Wave effect และ social links

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm`, `md`, `lg`
- Mobile menu สำหรับ devices ขนาดเล็ก

## Static Files

Static files ถูก serve จาก:

- `/css` → `frontend/css/`
- `/js` → `frontend/js/`
- `/assets` → `frontend/assets/`

## Development

### Scripts

```bash
npm start      # รัน production
npm run dev    # รัน development (nodemon)
```

### Dependencies

```json
{
  "express": "^4.18.2"
}
```

### Dev Dependencies

```json
{
  "nodemon": "^3.0.1"
}
```

## การเชื่อมต่อกับ Backend

Frontend เชื่อมต่อกับ Backend API ที่ `http://localhost:3001`

ต้องรัน Backend server ก่อนใช้งาน authentication:

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

---
