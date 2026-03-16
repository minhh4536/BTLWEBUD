const movieModel = require("../models/movie.model");

async function getAllMovies(req, res) {
  try {
    const movies = await movieModel.getAllMovies();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMovieById(req, res) {
  try {
    const id = req.params.id;
    const movie = await movieModel.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMoviesByGenre(req, res) {
  try {
    const genre_id = req.params.genre_id;
    const movies = await movieModel.getMoviesByGenre(genre_id);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMoviesByDirector(req, res) {
  try {
    const director = req.params.director;
    const movies = await movieModel.getMoviesByDirector(director);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMoviesByActor(req, res) {
  try {
    const actor = req.params.actor;
    const movies = await movieModel.getMoviesByActor(actor);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function getMoviesByTitle(req, res) {
  try {
    const title = req.query.title;
    const movies = await movieModel.getMoviesByName(title);
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function createMovie(req, res) {
  try {
    const {
      title,
      description,
      duration,
      release_date,
      country,
      director,
      actors,
      trailerURL,
      genre_id,
    } = req.body;
    // Lấy đường dẫn file
    const poster = req.file ? `/uploads/${req.file.filename}` : null;
    const result = await movieModel.createMovie(
      title,
      description,
      duration,
      release_date,
      country,
      director,
      actors,
      poster,
      trailerURL,
      genre_id,
    );

    res.status(201).json({
      message: "Thêm phim thành công",
      movieId: result.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function updateMovie(req, res) {
  try {
    const id = req.params.id;
    const {
      title,
      description,
      duration,
      release_date,
      country,
      director,
      actors,
      trailerURL,
      genre_id,
    } = req.body;

    const poster = req.file ? req.file.filename : null;

    const result = await movieModel.updateMovie(
      id,
      title,
      description,
      duration,
      release_date,
      country,
      director,
      actors,
      poster,
      trailerURL,
      genre_id,
    );

    res.json({ message: "Cập nhật phim thành công", movie: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

async function deleteMovie(req, res) {
  try {
    const id = req.params.id;
    const result = await movieModel.deleteMovie(id);
    res.json({ message: "Xóa phim thành công", result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
}

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  getMoviesByTitle,
  updateMovie,
  deleteMovie,
  getMoviesByGenre,
  getMoviesByDirector,
  getMoviesByActor,
};
