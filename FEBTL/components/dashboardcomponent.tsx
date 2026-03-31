"use client";
import { useEffect, useState } from "react";
import {
  getDashboardStats,
  DashboardStatsDTO,
} from "@/services/dashboardService";
import { getTopMovies, TopMovieDTO } from "@/services/dashboardService";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null);
  const [topMovies, setTopMovies] = useState<TopMovieDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardData, moviesData] = await Promise.all([
          getDashboardStats(),
          getTopMovies(),
        ]);

        setStats(dashboardData);
        setTopMovies(moviesData);
      } catch (err) {
        console.error(err);
        alert("Lỗi khi tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return <p className="text-center mt-5 fs-5">Đang tải dữ liệu...</p>;

  if (!stats)
    return (
      <p className="text-center mt-5 text-muted">
        Không thể tải dữ liệu dashboard
      </p>
    );

  return (
    <div className="container-fluid p-4">
      {/* Statistics Cards */}
      <div className="row g-4 mb-5">
        <div className="col-xl-3 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-dark text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className=" mb-2 fs-6">Tổng doanh thu</p>
                  <h3 className="fw-bold mb-0">
                    {stats.totalRevenue.toLocaleString("vi-VN")} ₫
                  </h3>
                </div>
                <i className="bi bi-currency-dollar fs-1 text-secondary opacity-75"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-dark text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 fs-6">Vé đã bán</p>
                  <h3 className="fw-bold mb-0">
                    {stats.ticketsSold.toLocaleString()}
                  </h3>
                </div>
                <i className="bi bi-ticket-perforated fs-1 text-secondary opacity-75"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-dark text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className=" mb-2 fs-6">Tổng người dùng</p>
                  <h3 className="fw-bold mb-0">
                    {stats.totalUsers.toLocaleString()}
                  </h3>
                </div>
                <i className="bi bi-people fs-1 text-secondary opacity-75"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 h-100 bg-dark text-white">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-2 fs-6">Tỷ lệ lấp đầy hôm nay</p>
                  <h3 className="fw-bold mb-0">{stats.occupancyRate}%</h3>
                </div>
                <i className="bi bi-graph-up-arrow fs-1 text-secondary opacity-75"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card-header bg-light py-3">
        <h5 className="mb-0 fw-semibold">10 giao dịch gần nhất</h5>
      </div>
      <div className="card border shadow-sm rounded-4 overflow-hidden mb-5">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-secondary">
              <tr>
                <th className="ps-4">Mã Booking</th>
                <th>Phim</th>
                <th>Thời gian</th>
                <th className="text-end pe-4">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestBookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-5 text-muted">
                    Chưa có giao dịch nào
                  </td>
                </tr>
              ) : (
                stats.latestBookings.map((item, index) => (
                  <tr key={index}>
                    <td className="ps-4">
                      <strong>{item.booking_code}</strong>
                    </td>
                    <td>{item.movie_title}</td>
                    <td className="text-muted">
                      {new Date(item.booking_date).toLocaleString("vi-VN")}
                    </td>
                    <td className="text-end pe-4 fw-semibold">
                      {item.total_amount.toLocaleString("vi-VN")} ₫
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card-header bg-light py-3">
        <h5 className="mb-0 fw-semibold">Top 5 phim bán chạy tháng này</h5>
      </div>
      <div className="card border shadow-sm rounded-4 overflow-hidden">
        <div className="table-responsive">
          <table className="table table-hover mb-0 align-middle">
            <thead className="table-secondary">
              <tr>
                <th className="ps-4">Xếp hạng</th>
                <th>Tên phim</th>
                <th className="text-end pe-4">Số vé đã bán</th>
              </tr>
            </thead>
            <tbody>
              {topMovies.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-5 text-muted">
                    Chưa có dữ liệu phim tháng này
                  </td>
                </tr>
              ) : (
                topMovies.map((movie, index) => (
                  <tr key={movie.movie_id}>
                    <td className="ps-4">
                      <span className="badge bg-secondary fs-6">
                        {index + 1}
                      </span>
                    </td>
                    <td className="fw-medium">{movie.title}</td>
                    <td className="text-end pe-4 fw-semibold">
                      {movie.totalTickets.toLocaleString()} vé
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
