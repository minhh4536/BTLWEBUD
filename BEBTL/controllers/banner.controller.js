const bannerModel = require("../models/banner.model");

async function createBanner(req, res) {
  try {
    const { title, link, status, sort_order } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await bannerModel.createBanner(
      title,
      image,
      link,
      status,
      sort_order,
    );
    res
      .status(201)
      .json({ message: "Thêm banner thành công", bannerId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function getAllBanners(req, res) {
  try {
    const banners = await bannerModel.getAllBanners();
    res.json(banners);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function getBannerById(req, res) {
  try {
    const id = req.params.id;
    const banner = await bannerModel.getBannerById(id);
    if (!banner)
      return res.status(404).json({ message: "Banner không tồn tại" });
    res.json(banner);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function updateBanner(req, res) {
  try {
    const id = req.params.id;
    const existingBanner = await bannerModel.getBannerById(id);
    if (!existingBanner)
      return res.status(404).json({ message: "Banner không tồn tại" });

    const { title, link, status, sort_order } = req.body;
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : existingBanner.image;

    const result = await bannerModel.updateBanner(
      id,
      title,
      image,
      link,
      status,
      sort_order,
    );
    res.json({ message: "Cập nhật banner thành công", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

// delete
async function deleteBanner(req, res) {
  try {
    const id = req.params.id;
    const result = await bannerModel.deleteBanner(id);
    res.json({ message: "Xóa banner thành công", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

module.exports = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};
