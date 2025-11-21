const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d'
    });
};


router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'กรุณากรอก username และ password'
            });
        }

        //ค้นหาผู้ใช้
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'username หรือ password ไม่ถูกต้อง'
            });
        }

        //ตรวจสอบรหัสผ่าน
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'username หรือ password ไม่ถูกต้อง'
            });
        }

        res.status(200).json({
            success: true,
            message: 'เข้าสู่ระบบสำเร็จ',
            token: generateToken(user._id),
            data: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
    try {
        const { username, password, firstName, lastName, email } = req.body;

        // ตรวจสอบว่ามี username หรือ email ซ้ำหรือไม่
        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message:
                    existingUser.username === username
                        ? 'username นี้ถูกใช้งานแล้ว'
                        : 'email นี้ถูกใช้งานแล้ว'
            });
        }

        //สร้างผู้ใช้ใหม่
        const user = await User.create({
            username,
            password,
            firstName,
            lastName,
            email
        });

        res.status(201).json({
            success: true,
            message: 'สมัครสมาชิกสำเร็จ',
            token: generateToken(user._id),
            data: {
                id: user._id,
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email
            }
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
