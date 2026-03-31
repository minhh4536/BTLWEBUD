const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");
const upload = require("../common/upload");
const movieController = require("../controllers/movie.controller");
const showtimeController = require("../controllers/showtime.controller");
const roomController = require("../controllers/room.controller");
const theaterController = require("../controllers/theater.controller");
const genreController = require("../controllers/genre.controller");
const actorController = require("../controllers/actor.controller");
const directorController = require("../controllers/director.controller");
const seatTypeController = require("../controllers/seattype.controller");
const bannerController = require("../controllers/banner.controller");
const paymentController = require("../controllers/payment.controller");
const bookingDetailController = require("../controllers/bookingdetail.controller");
const userController = require("../controllers/user.controller");
const dashboardController = require("../controllers/dashboard.controller");

router.use(verifyToken, checkRole(["admin"]));

// Dashboard
router.get("/dashboard", dashboardController.getDashboardStats);
router.get("/dashboard/top-movies", dashboardController.getTopMovies);

// User management
router.get("/users", userController.getAllUsers);
router.get("/users/search", userController.getUserByName);
router.get("/users/:id", userController.getUserById);
router.post("/users", userController.createUser);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Movie management
router.get("/movies", movieController.getAllMovies);
router.get("/movies/:id", movieController.getMovieById);
router.post(
  "/movies",
  upload.single("poster"),
  movieController.createMovie,
);
router.put(
  "/movies/:id",
  upload.single("poster"),
  movieController.updateMovie,
);
router.delete("/movies/:id", movieController.deleteMovie);

// Showtime management
router.get("/showtimes", showtimeController.getAllShowtimes);
router.get("/showtimes/:id", showtimeController.getShowtimeWithSeats);
router.post("/showtimes", showtimeController.createShowtime);
router.delete("/showtimes/:id", showtimeController.deleteShowtime);

// Theater & Room management
router.get("/theaters", theaterController.getAllTheaters);
router.get("/theaters/search", theaterController.getTheaterByName);
router.get("/theaters/:id", theaterController.getTheaterById);
router.post("/theaters", theaterController.createTheater);
router.put("/theaters/:id", theaterController.updateTheater);
router.delete("/theaters/:id", theaterController.deleteTheater);

router.get("/rooms", roomController.getAllRooms);
router.get("/rooms/:id", roomController.getRoomWithSeats);
router.post("/rooms", roomController.createRoom);
router.delete("/rooms/:id", roomController.deleteRoom);

// Genre management
router.get("/genres", genreController.getAllGenres);
router.get("/genres/:id", genreController.getGenreById);
router.post("/genres", genreController.createGenre);
router.put("/genres/:id", genreController.updateGenre);
router.delete("/genres/:id", genreController.deleteGenre);

// Actor management
router.get("/actors", actorController.getAllActors);
router.get("/actors/search", actorController.getActorByName);
router.get("/actors/:id", actorController.getActorById);
router.post("/actors", actorController.createActor);
router.put("/actors/:id", actorController.updateActor);
router.delete("/actors/:id", actorController.deleteActor);

// Director management
router.get("/directors", directorController.getAllDirectors);
router.get("/directors/search", directorController.getDirectorByName);
router.get("/directors/:id", directorController.getDirectorById);
router.post("/directors", directorController.createDirector);
router.put("/directors/:id", directorController.updateDirector);
router.delete("/directors/:id", directorController.deleteDirector);

// Seat type management
router.get("/seattypes", seatTypeController.getAllSeatTypes);
router.get("/seattypes/search", seatTypeController.getSeatTypeByName);
router.get("/seattypes/:id", seatTypeController.getSeatTypeById);
router.post("/seattypes", seatTypeController.createSeatType);
router.put("/seattypes/:id", seatTypeController.updateSeatType);
router.delete("/seattypes/:id", seatTypeController.deleteSeatType);

// Banner management
router.get("/banners", bannerController.getAllBanners);
router.get("/banners/:id", bannerController.getBannerById);
router.post(
  "/banners",
  upload.single("image"),
  bannerController.createBanner,
);
router.put(
  "/banners/:id",
  upload.single("image"),
  bannerController.updateBanner,
);
router.delete("/banners/:id", bannerController.deleteBanner);

// Payment management
router.get("/payments", paymentController.getAllPayments);
router.get("/payments/:id", paymentController.getPaymentById);
router.post("/payments", paymentController.createPayment);
router.put("/payments/:id", paymentController.updatePayment);
router.delete("/payments/:id", paymentController.deletePayment);

// Booking details management
router.get("/bookingdetails", bookingDetailController.getAllBookingDetails);
router.get(
  "/bookingdetails/:id",
  bookingDetailController.getBookingDetailById,
);
router.post("/bookingdetails", bookingDetailController.createBookingDetail);
router.delete(
  "/bookingdetails/:id",
  bookingDetailController.deleteBookingDetail,
);

module.exports = router;
