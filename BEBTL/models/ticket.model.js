const db = require("../common/db");

const ticketModel = {
  getTicketsByShowtime: async (showtime_id) => {
    const [rows] = await db.query(
      `
      SELECT 
        t.*, 
        s.seat_number,
        s.status AS seat_status,
        st.name AS seat_type_name,
        st.surcharge
      FROM Tickets t
      JOIN Seats s ON t.seat_id = s.seat_id
      LEFT JOIN SeatTypes st ON s.seat_type_id = st.seat_type_id
      WHERE t.showtime_id = ?
      ORDER BY s.seat_number
      `,
      [showtime_id],
    );
    return rows;
  },

  updateTicketStatus: async (ticket_id, status) => {
    const [result] = await db.query(
      "UPDATE Tickets SET status = ? WHERE ticket_id = ?",
      [status, ticket_id],
    );
    return result;
  },
};

module.exports = ticketModel;
