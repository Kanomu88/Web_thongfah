const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - ตรวจสอบว่า user login แล้วหรือยัง
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

// Admin only - ตรวจสอบว่าเป็น admin หรือไม่
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
