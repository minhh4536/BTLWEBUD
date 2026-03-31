const authModel = require("../models/auth.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

const authController = {
  register: async (req, res) => {
    try {
      const {
        username,
        email,
        password,
        full_name,
        phone,
        date_of_birth,
        gender,
      } = req.body;

      // Kiểm tra username đã tồn tại
      const existingUser = await authModel.getUserByUsername(username);
      if (existingUser)
        return res.status(400).json({ message: "Username đã tồn tại" });

      // Lấy role_id mặc định "Customer"
      const role = await authModel.getRoleByName("customer");
      if (!role)
        return res.status(500).json({ message: "Role mặc định chưa tồn tại" });

      // Tạo user
      const userId = await authModel.createUser(
        username,
        email,
        password,
        role.role_id,
      );

      // Tạo profile
      await authModel.createUserProfile(
        userId,
        full_name,
        phone,
        date_of_birth,
        gender,
      );

      res.status(201).json({ message: "Đăng ký thành công", userId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await authModel.getUserByUsername(username);
      if (!user)
        return res.status(400).json({ message: "Sai username hoặc password" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch)
        return res.status(400).json({ message: "Sai username hoặc password" });

      const token = jwt.sign(
        {
          userId: user.user_id,
          role: String(user.role_name || user.role_id).toLowerCase(),
        },
        JWT_SECRET,
        {
          expiresIn: "1d",
        },
      );

      res.json({
        token,
        user: {
          user_id: user.user_id,
          username: user.username,
          email: user.email,
          role_id: user.role_id,
        },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Lỗi server" });
    }
  },
};

module.exports = authController;
