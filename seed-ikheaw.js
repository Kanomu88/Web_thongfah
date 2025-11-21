// =====================================
// MongoDB Insert Script for I KHEAW
// =====================================

const { MongoClient, ObjectId } = require("mongodb");

// 💡 แก้ตรงนี้ให้เป็น MongoDB ของคุณ
const uri = "mongodb+srv://test:1234@cluster0.rxuzilj.mongodb.net/?appName=Cluster0"; // หรือใช้ connection string ของ Atlas
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("ikheaw");

    // ===========================
    // 1) Admin Data
    // ===========================
    const adminData = {
      _id: new ObjectId("000000000000000000000001"),
      email: "jirawat.pru@student.mahidol.edu",
      password: "1234",
      firstName: "Jirawat",
      lastName: "Pratuangtup",
      profileImage: {
        url: "/uploads/admin/profile-507f1f77bcf86cd799439001.jpg",
      },
      createdAt: new Date("2025-11-21"),
      updatedAt: new Date("2025-11-21"),
    };

    await db.collection("admin").insertOne(adminData);
    console.log("Inserted admin data");


    // ===========================
    // 2) Category Data
    // ===========================
    const categoryData = [
      {
        _id: new ObjectId("000000000000000000000101"),
        name: "Matcha Latte",
        description: "ชาเขียวสำหรับชงลาเต้ มีรสชาติหอมกลมกล่อม",
        image: "/images/categories/latte.jpg",
        createdAt: new Date("2025-01-01"),
        updatedAt: new Date("2025-01-01"),
      }
    ];

    await db.collection("categories").insertMany(categoryData);
    console.log("Inserted categories data");


    // ===========================
    // 3) Product Data
    // ===========================
    const productData = {
      _id: new ObjectId("000000000000000000000111"),
      name: "Premium Matcha",
      category: "Grade",
      description:
        "มัทฉะเกรดพรีเมียมจากอุจิ เกียวโต ญี่ปุ่น ผลิตจากใบชาอ่อนที่ได้รับการคัดสรรอย่างดี มีสีเขียวสดใส รสชาติหวานละมุน ขมน้อย เหมาะสำหรับทั้งชงดื่มและทำขนม",
      price: 850,
      grade: "Premium",
      images: [
        {
          url: "/images/products/premium-matcha-01.jpg",
          order: 1,
        },
      ],
      createdAt: new Date("2025-01-10"),
      updatedAt: new Date("2025-01-15"),
      createdBy: new ObjectId("507f1f77bcf86cd799439011"),
      updatedBy: new ObjectId("507f1f77bcf86cd799439011"),
    };

    await db.collection("products").insertOne(productData);
    console.log("Inserted product data");


    // ===========================
    // INDEXES (optional)
    // ===========================

    await db.collection("admin").createIndex({ email: 1 }, { unique: true });
    await db.collection("products").createIndex({ name: "text", description: "text" });

    console.log("Indexes created");

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
    console.log("MongoDB connection closed");
  }
}

run();
