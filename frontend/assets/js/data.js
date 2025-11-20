const products = [
    {
        id: 1,
        name: 'Premium Matcha Powder',
        category: 'Powder',
        grade: 'Ceremonial',
        origin: 'Uji, Japan',
        price: 590,
        image: '/assets/images/powder.jpg',
        description: 'สัมผัสประสบการณ์ชาเขียวมัทฉะเกรดพิธีชงชาแท้จากเมืองอูจิ ประเทศญี่ปุ่น ผงมัทฉะสีเขียวมรกต กลิ่นหอมละมุน รสชาติอูมามิเข้มข้น เหมาะสำหรับการชงในพิธีชงชาหรือดื่มแบบดั้งเดิม',
        citation: 'Image source: Unsplash - Authentic Japanese Matcha'
    },
    {
        id: 2,
        name: 'Matcha Latte Set',
        category: 'Drinks',
        grade: 'Culinary',
        origin: 'Nishio, Japan',
        price: 120,
        image: '/assets/images/spe.jpg',
        description: 'ชุดชงชาเขียวลาเต้พร้อมดื่ม ที่คัดสรรใบชาเกรดคัลลินารีจากนิชิโอะ ให้รสชาติที่เข้มข้นแต่นุ่มนวล เหมาะสำหรับทำเครื่องดื่มผสมนมหรือเบเกอรี่',
        citation: 'Image source: Pexels - Matcha Latte Art'
    },
    {
        id: 3,
        name: 'Bamboo Whisk (Chasen)',
        category: 'Accessories',
        grade: 'N/A',
        origin: 'Japan',
        price: 450,
        image: '/assets/images/promo.jpg',
        description: 'แปรงชงชาไม้ไผ่ (Chasen) ทำมือจากไม้ไผ่คุณภาพดี ช่วยตีผงมัทฉะให้แตกตัวละเอียดและเกิดฟองเนียนนุ่ม เป็นอุปกรณ์สำคัญในการชงชาแบบญี่ปุ่น',
        citation: 'Image source: Freepik - Traditional Tea Utensils'
    },
    {
        id: 4,
        name: 'Matcha 4-in-1',
        category: 'Powder',
        grade: 'Instant',
        origin: 'Thailand',
        price: 250,
        image: '/assets/images/4in1.jpg',
        description: 'ความอร่อยที่ลงตัวในซองเดียว มัทฉะ 4-in-1 สูตรเข้มข้น ผสมครีมเทียมและน้ำตาลในปริมาณที่พอเหมาะ ชงง่าย ละลายไว อร่อยได้ทุกที่ทุกเวลา',
        citation: 'Image source: Internal Product Photography'
    },
    {
        id: 5,
        name: 'Ceremonial Grade Set',
        category: 'Powder',
        grade: 'Ceremonial',
        origin: 'Uji, Japan',
        price: 1290,
        image: '/assets/images/powder.jpg',
        description: 'ชุดของขวัญชาเขียวเกรดพิธีชงชา มาพร้อมกับอุปกรณ์ชงชาครบชุด เหมาะสำหรับมอบเป็นของขวัญหรือผู้ที่ต้องการเริ่มต้นวิถีแห่งชา',
        citation: 'Image source: Unsplash - Tea Ceremony Set'
    },
    {
        id: 6,
        name: 'Matcha Bowl (Chawan)',
        category: 'Accessories',
        grade: 'N/A',
        origin: 'Japan',
        price: 890,
        image: '/assets/images/promo.jpg',
        description: 'ถ้วยชงชา (Chawan) ดีไซน์เรียบง่ายแต่แฝงด้วยความประณีต ทำจากเซรามิกคุณภาพดี เก็บความร้อนได้ดี ช่วยให้การดื่มชาของคุณสุนทรีย์ยิ่งขึ้น',
        citation: 'Image source: Freepik - Ceramic Tea Bowl'
    },
];

// Export for usage if using modules, but for simple script tags we just define it globally.
if (typeof module !== 'undefined' && module.exports) {
    module.exports = products;
}
