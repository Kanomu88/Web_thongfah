const User = require('../../models/model.user');


// register - POST /api/auth/register
exports.register = async (req, res, next) => {
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

    // สร้างผู้ใช้ใหม่
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
};