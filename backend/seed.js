const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
};

const seedData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        console.log('Cleared existing data');

        // Create admin user
        const admin = await User.create({
            username: 'admin',
            password: 'admin123',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@ikheaw.com',
            isAdmin: true
        });
        console.log('Admin user created:', admin.username);

        // Create regular user
        const user = await User.create({
            username: 'user',
            password: 'user123',
            firstName: 'Regular',
            lastName: 'User',
            email: 'user@ikheaw.com',
            isAdmin: false
        });
        console.log('Regular user created:', user.username);

        // Create products
        const products = [
            {
                name: 'Matcha Latte',
                category: 'Drinks',
                price: 85,
                stock: 50,
                description: 'เครื่องดื่มมัทฉะลาเต้ รสชาติกลมกล่อม หอมหวานจากนมสด',
                imageUrl: 'https://images.unsplash.com/photo-1536013564-89a7e0a8c1c2?w=500'
            },
            {
                name: 'Green Tea Latte',
                category: 'Drinks',
                price: 75,
                stock: 45,
                description: 'ชาเขียวลาเต้ รสชาติหอมกรุ่น ผสมนมสดเข้มข้น',
                imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'
            },
            {
                name: 'Matcha Powder Premium',
                category: 'Powder',
                price: 350,
                stock: 30,
                description: 'ผงมัทฉะเกรดพรีเมี่ยม นำเข้าจากญี่ปุ่น คุณภาพสูง',
                imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500'
            },
            {
                name: 'Organic Green Tea Powder',
                category: 'Powder',
                price: 280,
                stock: 25,
                description: 'ผงชาเขียวออร์แกนิค ปลอดสารเคมี เหมาะสำหรับทำเครื่องดื่ม',
                imageUrl: 'https://images.unsplash.com/photo-1563822249366-3a0b0a8e8a6e?w=500'
            },
            {
                name: 'Matcha 4 in 1',
                category: '4in1',
                price: 120,
                stock: 60,
                description: 'มัทฉะ 4 in 1 สูตรพร้อมดื่ม ผสมนม น้ำตาล และครีมเมอร์',
                imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500'
            },
            {
                name: 'Green Tea 4 in 1',
                category: '4in1',
                price: 100,
                stock: 55,
                description: 'ชาเขียว 4 in 1 รสชาติกลมกล่อม ชงง่าย พกพาสะดวก',
                imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500'
            },
            {
                name: 'Iced Matcha',
                category: 'Drinks',
                price: 90,
                stock: 40,
                description: 'มัทฉะเย็น สดชื่น เหมาะสำหรับวันร้อนๆ',
                imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500'
            },
            {
                name: 'Matcha Frappe',
                category: 'Drinks',
                price: 110,
                stock: 35,
                description: 'มัทฉะปั่น เย็นฉ่ำ หอมหวาน เข้มข้น',
                imageUrl: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500'
            }
        ];

        const createdProducts = await Product.insertMany(products);
        console.log(`Created ${createdProducts.length} products`);

        console.log('\n=== Seed Data Summary ===');
        console.log('Users:');
        console.log('  - Admin: username=admin, password=admin123');
        console.log('  - User: username=user, password=user123');
        console.log(`Products: ${createdProducts.length} items created`);
        console.log('========================\n');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

connectDB().then(() => seedData());
