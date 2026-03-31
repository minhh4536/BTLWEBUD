const dashboardModel = require("../models/dashboard.model");

const dashboardController = {
  getDashboardStats: async (req, res) => {
    try {
      const [
        totalRevenue,
        ticketsSold,
        totalUsers,
        occupancyRate,
        latestBookings,
      ] = await Promise.all([
        dashboardModel.getTotalRevenue(),
        dashboardModel.getTotalTicketsSold(),
        dashboardModel.getTotalUsers(),
        dashboardModel.getOccupancyRate(),
        dashboardModel.getLatestBookings(),
      ]);

      res.json({
        totalRevenue,
        ticketsSold,
        totalUsers,
        occupancyRate: parseFloat(Number(occupancyRate || 0).toFixed(2)),
        latestBookings,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi lấy dữ liệu dashboard" });
    }
  },
  getTopMovies: async (req, res) => {
    try {
      const data = await dashboardModel.getTopMoviesThisMonth();
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi lấy top phim" });
    }
  },
};

module.exports = dashboardController;
