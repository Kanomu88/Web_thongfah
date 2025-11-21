const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// 1. ค้นหาและเข้าถึงข้อมูลผู้ดูแล/ผู้ใช้ (Search and View)
// รองรับการค้นหาแบบไม่มีเกณฑ์ (ทั้งหมด) และมีเกณฑ์ (Username, Email, Role)
router.get('/', protect, adminOnly, async (req, res) => {
    try {
        const { username, email, isAdmin } = req.query;
        let query = {};

        // เกณฑ์ที่ 1: ค้นหาจาก Username (บางส่วน)
        if (username) {
            query.username = { $regex: username, $options: 'i' };
        }

        // เกณฑ์ที่ 2: ค้นหาจาก Email (บางส่วน)
        if (email) {
            query.email = { $regex: email, $options: 'i' };
        }

        // เกณฑ์ที่ 3: ค้นหาจาก Role (Admin หรือ User)
        if (isAdmin !== undefined) {
            query.isAdmin = isAdmin === 'true';
        }

        const users = await User.find(query);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ดูข้อมูลรายตัว
router.get('/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้นี้' });
        }
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 2. ใส่ข้อมูลผู้ดูแล/ผู้ใช้ (Insert) - คล้าย Register แต่ Admin เป็นคนทำ
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            message: 'เพิ่มผู้ใช้งานสำเร็จ',
            data: user
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 3. ปรับข้อมูลให้ทันสมัย (Update)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้นี้' });
        }

        // ถ้ามีการแก้รหัสผ่าน ต้องให้ Model ทำการ Hash ใหม่ (ซึ่งใน Model User.js มี pre save hook อยู่แล้ว แต่ findByIdAndUpdate จะไม่ trigger save hook)
        // ดังนั้นถ้าจะแก้รหัสผ่านต้องใช้วิธี save() หรือจัดการ hash เอง
        // เพื่อความง่ายในแบบ "มนุษย์ทำ" เราจะใช้ findByIdAndUpdate ปกติ แต่ถ้าแก้รหัสผ่านอาจจะไม่ถูก hash ในท่านี้
        // *แก้ไข*: เพื่อให้ถูกต้องแต่ยังง่าย ถ้ามี password ส่งมา เราจะใช้การ save แทน

        if (req.body.password) {
            // กรณีแก้รหัสผ่านด้วย
            Object.assign(user, req.body);
            await user.save();
        } else {
            // กรณีแก้ข้อมูลทั่วไป
            user = await User.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });
        }

        res.status(200).json({
            success: true,
            message: 'แก้ไขข้อมูลผู้ใช้สำเร็จ',
            data: user
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 4. ลบข้อมูล (Delete)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'ไม่พบผู้ใช้นี้' });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'ลบผู้ใช้สำเร็จ',
            data: {}
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
