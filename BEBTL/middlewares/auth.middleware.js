const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

// 1. Middleware xác thực Token (Authentication)
const verifyToken = (req, res, next) => {
  // Lấy token từ header "Authorization"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Thường là "Bearer TOKEN_CHUOI"

  if (!token) {
    return res
      .status(401)
      .json({ message: "Bạn cần đăng nhập để thực hiện hành động này!" });
  }

  try {
    // Giải mã token bằng Secret Key của bạn
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Lưu thông tin user (id, role) vào request để dùng ở các bước sau
    next(); // Cho phép đi tiếp
  } catch (error) {
    return res.status(403).json({
      message: error.message || "Token không hợp lệ hoặc đã hết hạn!",
    });
  }
};

// 2. Middleware kiểm tra quyền (Authorization)
const checkRole = (roles) => {
  return (req, res, next) => {
    // req.user được lấy từ middleware verifyToken chạy trước đó
    const userRole =
      req.user && req.user.role ? String(req.user.role).toLowerCase() : null;
    const allowedRoles = roles.map((role) => String(role).toLowerCase());

    if (!req.user || !allowedRoles.includes(userRole)) {
      return res
        .status(403)
        .json({ message: "Bạn không có quyền truy cập vào chức năng này!" });
    }
    next();
  };
};

module.exports = { verifyToken, checkRole };
