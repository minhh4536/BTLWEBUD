const ticketModel = require("../models/ticket.model");

const ticketController = {
  getTicketsByShowtime: async (req, res) => {
    try {
      const showtime_id = req.params.showtime_id;
      const tickets = await ticketModel.getTicketsByShowtime(showtime_id);
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  updateTicketStatus: async (req, res) => {
    try {
      const ticket_id = req.params.id;
      const { status } = req.body;
      const validStatuses = ["available", "reserved", "sold"];

      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .json({ message: "Status phải là available, reserved hoặc sold" });
      }

      const result = await ticketModel.updateTicketStatus(ticket_id, status);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      res.json({ message: "Ticket status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = ticketController;
