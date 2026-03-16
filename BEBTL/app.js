const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors()); // bật cho tất cả domain
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require("./routes/user.route");
const userProfileRoute = require("./routes/userprofile.route");
const loginRoute = require("./routes/login.route");
const genreRoute = require("./routes/genre.route");
const movieRoute = require("./routes/movie.route");
const theaterRoute = require("./routes/theater.route");
const roomRoute = require("./routes/room.route");
const showtimeRoute = require("./routes/showtime.route");
const seatRoute = require("./routes/seat.route");
const bookingRoute = require("./routes/booking.route");
const bookingDetailRoute = require("./routes/bookingdetail.route");
const paymentRoute = require("./routes/payment.route");

app.use("/uploads", express.static("uploads"));
app.use("/users", userRoute);
app.use("/userprofiles", userProfileRoute);
app.use("/login", loginRoute);
app.use("/genres", genreRoute);
app.use("/movies", movieRoute);
app.use("/theaters", theaterRoute);
app.use("/rooms", roomRoute);
app.use("/showtimes", showtimeRoute);
app.use("/seats", seatRoute);
app.use("/bookings", bookingRoute);
app.use("/bookingdetails", bookingDetailRoute);
app.use("/payments", paymentRoute);

app.listen(3000, () => {
  console.log("Server chạy ở port 3000");
});
