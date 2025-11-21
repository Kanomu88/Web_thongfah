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
                price: 95,
                description: 'ผมใช้เวลาอยู่นานกว่าจะลงตัวกับแก้วนี้... โจทย์ของผมคือ จะทำยังไงให้คนที่ไม่กินชาเขียว หลงรักชาเขียวได้มัทฉะมีความเข้มข้นและเอกลักษณ์สูงมาก ถ้าใส่นมน้อยไปก็ขม ถ้าใส่มากไปกลิ่นชาก็หาย ผมทดลองปรับอัตราส่วนวันแล้ววันเล่า จนค้นพบจุด Sweet Spot จุดที่ความหอมของมัทฉะพุ่งขึ้นจมูกทันทีที่ยก ดื่ม แต่สัมผัสในปากกลับนุ่มละมุนเหมือนฟองนมแก้วที่คุณเห็นอยู่นี้ ไม่ใช่แค่ชาเขียวนมธรรมดา แต่มันคือผลลัพธ์ของการทดลองนับร้อยครั้ง เพื่อให้ได้รสสัมผัสที่ นุ่มลึก ที่สุดในแบบของผมครับ',
                imageUrl: 'https://drive.google.com/file/d/1eJaJc1WiRBA61Decjetev4D0XKqoB1Ab/view'
            },

            {
                name: 'Hojicha Latte',
                category: 'Drinks',
                price: 85,
                description: 'ชาเขียวลาเต้ รสชาติหอมกรุ่น ผสมนมสดเข้มข้น',
                imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500'
            },

            {
                name: 'Genmaicha Latte',
                category: 'Drinks',
                price: 105,
                description: 'ผงมัทฉะเกรดพรีเมี่ยม นำเข้าจากญี่ปุ่น คุณภาพสูง',
                imageUrl: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=500'
            },

            {
                name: 'Normal Powder',
                category: 'Powder',
                price: 250,
                description: 'ผงชาเขียวออร์แกนิค ปลอดสารเคมี เหมาะสำหรับทำเครื่องดื่ม',
                imageUrl: 'https://images.unsplash.com/photo-1563822249366-3a0b0a8e8a6e?w=500'
            },

            {
                name: 'Ceremonial Powder',
                category: 'Powder',
                price: 2500,
                description: 'มัทฉะ 4 in 1 สูตรพร้อมดื่ม ผสมนม น้ำตาล และครีมเมอร์',
                imageUrl: 'https://images.unsplash.com/photo-1571934811356-5cc061b6821f?w=500'
            },

            {
                name: 'Matcha 4 in 1',
                category: '4in1',
                price: 250,
                description: 'ชาเขียว 4 in 1 รสชาติกลมกล่อม ชงง่าย พกพาสะดวก',
                imageUrl: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500'
            },
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
