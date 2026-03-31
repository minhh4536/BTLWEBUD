const db = require("../common/db");

async function createBanner(title, image, link, status, sort_order) {
  const [result] = await db.execute(
    "INSERT INTO banners (title, image, link, status, sort_order) VALUES (?, ?, ?, ?, ?)",
    [title, image, link, status, sort_order],
  );
  return result;
}

async function getAllBanners() {
  const [rows] = await db.execute(
    "SELECT * FROM banners ORDER BY sort_order ASC",
  );
  return rows;
}

async function getBannerById(id) {
  const [rows] = await db.execute("SELECT * FROM banners WHERE banner_id = ?", [
    id,
  ]);
  return rows[0];
}

async function updateBanner(id, title, image, link, status, sort_order) {
  const [result] = await db.execute(
    "UPDATE banners SET title = ?, image = ?, link = ?, status = ?, sort_order = ? WHERE banner_id = ?",
    [title, image, link, status, sort_order, id],
  );
  return result;
}

async function deleteBanner(id) {
  const [result] = await db.execute("DELETE FROM banners WHERE banner_id = ?", [
    id,
  ]);
  return result;
}

module.exports = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};
