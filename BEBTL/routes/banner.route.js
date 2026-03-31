const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");
const upload = require("../common/upload");
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");

// Tạo banner có upload ảnh
router.post(
  "/create",
  verifyToken,
  checkRole(["admin"]),
  upload.single("image"),
  bannerController.createBanner,
);

// Lấy tất cả banner
router.get("/all", bannerController.getAllBanners);

// Lấy theo ID
router.get("/:id", bannerController.getBannerById);

// Cập nhật banner (có thể thay ảnh)
router.put(
  "/update/:id",
  verifyToken,
  checkRole(["admin"]),
  upload.single("image"),
  bannerController.updateBanner,
);

// Xóa banner
router.delete(
  "/delete/:id",
  verifyToken,
  checkRole(["admin"]),
  bannerController.deleteBanner,
);

module.exports = router;
