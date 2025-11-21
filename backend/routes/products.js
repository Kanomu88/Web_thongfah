const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// 1. ค้นหาและเข้าถึงข้อมูล (Search and View)
// รองรับการค้นหาแบบไม่มีเกณฑ์ (ทั้งหมด) และมีเกณฑ์ (ชื่อ, หมวดหมู่, ราคา)
router.get('/', async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        let query = {};

        // เกณฑ์ที่ 1: ค้นหาจากชื่อ (บางส่วน)
        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        // เกณฑ์ที่ 2: ค้นหาจากหมวดหมู่
        if (category) {
            query.category = category;
        }

        // เกณฑ์ที่ 3: ค้นหาจากราคา (ช่วงราคา)
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const products = await Product.find(query);

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ดูข้อมูลรายตัว
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'ไม่พบสินค้านี้' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 2. ใส่ข้อมูล (Insert)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            message: 'เพิ่มสินค้าสำเร็จ',
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 3. ปรับข้อมูลให้ทันสมัย (Update)
router.put('/:id', protect, adminOnly, async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'ไม่พบสินค้านี้' });
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            message: 'แก้ไขข้อมูลสินค้าสำเร็จ',
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// 4. ลบข้อมูล (Delete)
router.delete('/:id', protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ success: false, message: 'ไม่พบสินค้านี้' });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            message: 'ลบสินค้าสำเร็จ',
            data: {}
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

module.exports = router;
