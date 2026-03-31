const db = require("../common/db"); // giả sử bạn đã có module db để query MySQL

const dashboardModel = {
  // Tổng doanh thu từ các booking đã thanh toán
  getTotalRevenue: async () => {
    const [rows] = await db.query(
      `SELECT IFNULL(SUM(total_amount),0) AS totalRevenue 
       FROM Bookings 
       WHERE booking_status = 'paid'`,
    );
    return rows[0].totalRevenue;
  },

  // Số lượng vé đã bán
  getTotalTicketsSold: async () => {
    const [rows] = await db.query(
      `SELECT COUNT(*) AS ticketsSold 
       FROM BookingDetails bd
       JOIN Bookings b ON bd.booking_id = b.booking_id
       WHERE b.booking_status = 'paid'`,
    );
    return rows[0].ticketsSold;
  },

  // Số lượng người dùng
  getTotalUsers: async () => {
    const [rows] = await db.query(`SELECT COUNT(*) AS totalUsers FROM Users`);
    return rows[0].totalUsers;
  },

  // Tỷ lệ lấp đầy cho các suất chiếu trong ngày
  getOccupancyRate: async () => {
    const [rows] = await db.query(
      `SELECT 
          IFNULL(SUM(bookedSeats)/SUM(totalSeats)*100,0) AS occupancyRate
       FROM (
          SELECT sh.showtime_id,
                 (SELECT COUNT(*) 
                  FROM BookingDetails bd
                  JOIN Tickets t ON bd.ticket_id = t.ticket_id
                  JOIN Bookings b ON bd.booking_id = b.booking_id
                  WHERE t.showtime_id = sh.showtime_id AND b.booking_status = 'paid') AS bookedSeats,
                 (SELECT COUNT(*) 
                  FROM Seats s 
                  WHERE s.room_id = sh.room_id) AS totalSeats
          FROM Showtimes sh
          WHERE sh.show_date = CURDATE()
       ) AS showtimeStats`,
    );
    return rows[0].occupancyRate;
  },

  // 10 giao dịch gần nhất
  getLatestBookings: async () => {
    const [rows] = await db.query(
      `SELECT b.booking_code, m.title AS movie_title, b.created_at, b.total_amount
       FROM Bookings b
       JOIN Showtimes sh ON b.showtime_id = sh.showtime_id
       JOIN Movies m ON sh.movie_id = m.movie_id
       WHERE b.booking_status = 'paid'
       ORDER BY b.created_at DESC
       LIMIT 10`,
    );
    return rows;
  },
  getTopMoviesThisMonth: async () => {
    const [rows] = await db.query(`
    SELECT 
      m.movie_id,
      m.title,
      COUNT(bd.booking_detail_id) AS totalTickets
    FROM BookingDetails bd
    JOIN Tickets t ON bd.ticket_id = t.ticket_id
    JOIN Bookings b ON bd.booking_id = b.booking_id
    JOIN Showtimes sh ON t.showtime_id = sh.showtime_id
    JOIN Movies m ON sh.movie_id = m.movie_id
    WHERE 
      b.booking_status = 'paid'
      AND MONTH(b.created_at) = MONTH(CURDATE())
      AND YEAR(b.created_at) = YEAR(CURDATE())
    GROUP BY m.movie_id, m.title
    ORDER BY totalTickets DESC
    LIMIT 5
  `);

    return rows;
  },
};

module.exports = dashboardModel;
