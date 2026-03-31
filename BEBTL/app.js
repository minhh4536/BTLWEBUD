require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3001", // Cho phép chính xác app React của bạn
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bannerRoute = require("./routes/banner.route");
const dashboardRouter = require("./routes/dashboard.route");
const userRoute = require("./routes/user.route");
const userProfileRoute = require("./routes/userprofile.route");
const genreRoute = require("./routes/genre.route");
const movieRoute = require("./routes/movie.route");
const theaterRoute = require("./routes/theater.route");
const roomRoute = require("./routes/room.route");
const showtimeRoute = require("./routes/showtime.route");
const seatRoute = require("./routes/seat.route");
const bookingRoute = require("./routes/booking.route");
const bookingDetailRoute = require("./routes/bookingdetail.route");
const paymentRoute = require("./routes/payment.route");
const authRoute = require("./routes/auth.route");
const adminRoute = require("./routes/admin.route");
const actorRoute = require("./routes/actor.route");
const directorRoute = require("./routes/director.route");
const seatTypeRoute = require("./routes/seattype.route");
const ticketRoute = require("./routes/ticket.route");

app.use("/seattype", seatTypeRoute);
app.use("/directors", directorRoute);
app.use("/actors", actorRoute);
app.use("/auth", authRoute);
app.use("/uploads", express.static("uploads"));
app.use("/users", userRoute);
app.use("/userprofiles", userProfileRoute);
app.use("/genres", genreRoute);
app.use("/movies", movieRoute);
app.use("/dashboard", dashboardRouter);
app.use("/theaters", theaterRoute);
app.use("/rooms", roomRoute);
app.use("/showtimes", showtimeRoute);
app.use("/seats", seatRoute);
app.use("/booking", bookingRoute);
app.use("/bookingdetails", bookingDetailRoute);
app.use("/payments", paymentRoute);
app.use("/tickets", ticketRoute);
app.use("/banners", bannerRoute);
app.use("/admin", adminRoute);
app.listen(3000, () => {
  console.log("Server chạy ở port 3000");
});
