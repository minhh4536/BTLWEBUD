const db = require("../common/db");

const movieModel = {
  // ==================== CREATE MOVIE ====================
  createMovie: async (
    movieData,
    genre_ids = [],
    actor_ids = [],
    director_ids = [],
  ) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Insert vào bảng Movies
      const [result] = await connection.query(
        `INSERT INTO Movies (title, description, duration, release_date, country, poster, trailer_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          movieData.title,
          movieData.description || null,
          movieData.duration,
          movieData.release_date || null,
          movieData.country || null,
          movieData.poster || null,
          movieData.trailer_url || null,
          movieData.status || "coming",
        ],
      );

      const movie_id = result.insertId;

      // 2. Insert vào bảng trung gian Movie_Genres
      if (genre_ids.length > 0) {
        const genreValues = genre_ids.map((id) => [movie_id, id]);
        await connection.query(
          "INSERT INTO Movie_Genres (movie_id, genre_id) VALUES ?",
          [genreValues],
        );
      }

      // 3. Insert vào bảng trung gian Movie_Actors
      if (actor_ids.length > 0) {
        const actorValues = actor_ids.map((id) => [movie_id, id]);
        await connection.query(
          "INSERT INTO Movie_Actors (movie_id, actor_id) VALUES ?",
          [actorValues],
        );
      }

      // 4. Insert vào bảng trung gian Movie_Directors
      if (director_ids.length > 0) {
        const directorValues = director_ids.map((id) => [movie_id, id]);
        await connection.query(
          "INSERT INTO Movie_Directors (movie_id, director_id) VALUES ?",
          [directorValues],
        );
      }

      await connection.commit();
      return { movie_id, ...movieData };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // ==================== GET ALL MOVIES ====================
  getAllMovies: async (genre_id = null, search = null) => {
    let query = `
      SELECT 
        m.*,
        GROUP_CONCAT(DISTINCT g.genre_name) AS genres,
        GROUP_CONCAT(DISTINCT a.name) AS actors,
        GROUP_CONCAT(DISTINCT d.name) AS directors
      FROM Movies m
      LEFT JOIN Movie_Genres mg ON m.movie_id = mg.movie_id
      LEFT JOIN Genres g ON mg.genre_id = g.genre_id
      LEFT JOIN Movie_Actors ma ON m.movie_id = ma.movie_id
      LEFT JOIN Actors a ON ma.actor_id = a.actor_id
      LEFT JOIN Movie_Directors md ON m.movie_id = md.movie_id
      LEFT JOIN Directors d ON md.director_id = d.director_id
    `;

    const params = [];

    if (search) {
      query += " WHERE m.title LIKE ?";
      params.push(`%${search}%`);
    }

    if (genre_id) {
      query += search ? " AND" : " WHERE";
      query += " mg.genre_id = ?";
      params.push(genre_id);
    }

    query += `
      GROUP BY m.movie_id
      ORDER BY m.created_at DESC
    `;

    const [rows] = await db.query(query, params);
    return rows;
  },

  // ==================== GET MOVIE BY ID ====================
  getMovieById: async (movie_id) => {
    const [rows] = await db.query(
      `
      SELECT 
        m.*,
        GROUP_CONCAT(DISTINCT g.genre_name) AS genres,
        GROUP_CONCAT(DISTINCT a.name) AS actors,
        GROUP_CONCAT(DISTINCT d.name) AS directors
      FROM Movies m
      LEFT JOIN Movie_Genres mg ON m.movie_id = mg.movie_id
      LEFT JOIN Genres g ON mg.genre_id = g.genre_id
      LEFT JOIN Movie_Actors ma ON m.movie_id = ma.movie_id
      LEFT JOIN Actors a ON ma.actor_id = a.actor_id
      LEFT JOIN Movie_Directors md ON m.movie_id = md.movie_id
      LEFT JOIN Directors d ON md.director_id = d.director_id
      WHERE m.movie_id = ?
      GROUP BY m.movie_id
    `,
      [movie_id],
    );

    return rows[0];
  },

  // ==================== UPDATE MOVIE ====================
  updateMovie: async (
    movie_id,
    movieData,
    genre_ids = [],
    actor_ids = [],
    director_ids = [],
  ) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Update bảng Movies
      await connection.query(
        `UPDATE Movies SET 
          title = ?, description = ?, duration = ?, release_date = ?, 
          country = ?, poster = ?, trailer_url = ?, status = ?
         WHERE movie_id = ?`,
        [
          movieData.title,
          movieData.description || null,
          movieData.duration,
          movieData.release_date || null,
          movieData.country || null,
          movieData.poster || null,
          movieData.trailer_url || null,
          movieData.status || "coming",
          movie_id,
        ],
      );

      // Xóa quan hệ cũ
      await connection.query("DELETE FROM Movie_Genres WHERE movie_id = ?", [
        movie_id,
      ]);
      await connection.query("DELETE FROM Movie_Actors WHERE movie_id = ?", [
        movie_id,
      ]);
      await connection.query("DELETE FROM Movie_Directors WHERE movie_id = ?", [
        movie_id,
      ]);

      // Thêm quan hệ mới
      if (genre_ids.length > 0) {
        const genreValues = genre_ids.map((id) => [movie_id, id]);
        await connection.query(
          "INSERT INTO Movie_Genres (movie_id, genre_id) VALUES ?",
          [genreValues],
        );
      }

      if (actor_ids.length > 0) {
        const actorValues = actor_ids.map((id) => [movie_id, id]);
        await connection.query(
          "INSERT INTO Movie_Actors (movie_id, actor_id) VALUES ?",
          [actorValues],
        );
      }

      if (director_ids.length > 0) {
        const directorValues = director_ids.map((id) => [movie_id, id]);
        await connection.query(
          "INSERT INTO Movie_Directors (movie_id, director_id) VALUES ?",
          [directorValues],
        );
      }

      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  // ==================== DELETE MOVIE ====================
  deleteMovie: async (movie_id) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // Xóa quan hệ trung gian trước
      await connection.query("DELETE FROM Movie_Genres WHERE movie_id = ?", [
        movie_id,
      ]);
      await connection.query("DELETE FROM Movie_Actors WHERE movie_id = ?", [
        movie_id,
      ]);
      await connection.query("DELETE FROM Movie_Directors WHERE movie_id = ?", [
        movie_id,
      ]);

      // Xóa phim
      const [result] = await connection.query(
        "DELETE FROM Movies WHERE movie_id = ?",
        [movie_id],
      );

      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = movieModel;
