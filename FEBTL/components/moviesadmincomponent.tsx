"use client";
import { useEffect, useState } from "react";
import {
  getAllMovies,
  createMovie,
  updateMovie,
  deleteMovie,
  searchMovie,
} from "@/services/movieService";
import { getAllGenres, GenreDTO } from "@/services/genreService"; // giả sử bạn đã có genreService

type Movie = {
  movie_id: number;
  title: string;
  description?: string;
  duration: number;
  release_date?: string;
  country?: string;
  director?: string;
  actors?: string;
  poster?: string;
  trailer_url?: string;
  genre_id?: number;
  genre_name?: string;
  status: "coming" | "showing" | "ended";
  created_at: string;
};

export default function MovieTable() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  const [genres, setGenres] = useState<GenreDTO[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDuration, setEditDuration] = useState(0);
  const [editReleaseDate, setEditReleaseDate] = useState("");
  const [editCountry, setEditCountry] = useState("");
  const [editDirector, setEditDirector] = useState("");
  const [editActors, setEditActors] = useState("");
  const [editPoster, setEditPoster] = useState<File | null>(null);
  const [editPosterUrl, setEditPosterUrl] = useState<string | undefined>(
    undefined,
  );
  const [editTrailerUrl, setEditTrailerUrl] = useState("");
  const [editGenreId, setEditGenreId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<"coming" | "showing" | "ended">(
    "coming",
  );

  const [addingTitle, setAddingTitle] = useState("");
  const [addingDescription, setAddingDescription] = useState("");
  const [addingDuration, setAddingDuration] = useState(0);
  const [addingReleaseDate, setAddingReleaseDate] = useState("");
  const [addingCountry, setAddingCountry] = useState("");
  const [addingDirector, setAddingDirector] = useState("");
  const [addingActors, setAddingActors] = useState("");
  const [addingPoster, setAddingPoster] = useState<File | null>(null);
  const [addingTrailerUrl, setAddingTrailerUrl] = useState("");
  const [addingGenreId, setAddingGenreId] = useState<number | null>(null);
  const [addingStatus, setAddingStatus] = useState<
    "coming" | "showing" | "ended"
  >("coming");

  const [searchText, setSearchText] = useState("");

  // Load movies & genres
  useEffect(() => {
    Promise.all([getAllMovies(), getAllGenres()])
      .then(([moviesData, genresData]) => {
        const formattedMovies = moviesData.map((m: any) => {
          const genre = genresData.find(
            (g: { genre_id: number }) => g.genre_id === m.genre_id,
          );
          return {
            movie_id: m.movie_id,
            title: m.title,
            description: m.description,
            duration: m.duration,
            release_date: m.release_date,
            country: m.country,
            director: m.director,
            actors: m.actors,
            poster: m.poster,
            trailer_url: m.trailer_url,
            genre_id: m.genre_id,
            genre_name: genre?.genre_name || "",
            status: m.status,
            created_at: m.created_at,
          };
        });
        setMovies(formattedMovies);
        setGenres(genresData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading movies or genres");
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleAdd = async () => {
    if (!addingTitle || !addingGenreId) return alert("Title & Genre required");

    const formData = new FormData();
    formData.append("title", addingTitle);
    formData.append("description", addingDescription);
    formData.append("duration", addingDuration.toString());
    formData.append("release_date", addingReleaseDate);
    formData.append("country", addingCountry);
    formData.append("director", addingDirector);
    formData.append("actors", addingActors);
    if (addingPoster) formData.append("poster", addingPoster);
    formData.append("trailerURL", addingTrailerUrl);
    formData.append("genre_id", addingGenreId.toString());
    formData.append("status", addingStatus);

    try {
      const data = await createMovie(formData);
      // Reload
      const moviesData = await getAllMovies();
      const formattedMovies = moviesData.map((m: any) => {
        const genre = genres.find((g) => g.genre_id === m.genre_id);
        return { ...m, genre_name: genre?.genre_name || "" };
      });
      setMovies(formattedMovies);
      // reset form
      setAddingTitle("");
      setAddingDescription("");
      setAddingDuration(0);
      setAddingReleaseDate("");
      setAddingCountry("");
      setAddingDirector("");
      setAddingActors("");
      setAddingPoster(null);
      setAddingTrailerUrl("");
      setAddingGenreId(null);
      setAddingStatus("coming");
      alert("Movie added successfully!");
    } catch (err) {
      alert("Error adding movie");
    }
  };

  const handleSave = async () => {
    if (!editingMovie || !editTitle || !editGenreId) return;

    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("description", editDescription);
    formData.append("duration", editDuration.toString());
    formData.append("release_date", editReleaseDate);
    formData.append("country", editCountry);
    formData.append("director", editDirector);
    formData.append("actors", editActors);
    // Chỉ append nếu chọn file mới
    if (editPoster instanceof File) {
      formData.append("poster", editPoster);
    } else {
      formData.append("keepPoster", "true");
    }
    formData.append("trailerURL", editTrailerUrl);
    formData.append("genre_id", editGenreId.toString());
    formData.append("status", editStatus);

    try {
      await updateMovie(editingMovie.movie_id, formData);

      // Reload toàn bộ movies để poster chính xác
      const moviesData = await getAllMovies();
      const formattedMovies = moviesData.map((m: any) => {
        const genre = genres.find((g) => g.genre_id === m.genre_id);
        return { ...m, genre_name: genre?.genre_name || "" };
      });
      setMovies(formattedMovies);
      alert("Movie updated successfully!");
    } catch (err) {
      alert("Error updating movie");
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;

    try {
      await deleteMovie(id);

      setMovies((prev) =>
        prev.map((m) => (m.movie_id === id ? { ...m, status: "ended" } : m)),
      );

      alert("Đã ngừng chiếu phim thành công");
    } catch (err) {
      alert("Error updating movie status");
    }
  };

  const search = async (title: string) => {
    if (!title) return;
    try {
      const data = await searchMovie(title);
      const formattedMovies = data.map((m: any) => {
        const genre = genres.find((g) => g.genre_id === m.genre_id);
        return { ...m, genre_name: genre?.genre_name || "" };
      });
      setMovies(formattedMovies);
    } catch (err) {
      alert("Error searching movie");
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentMovies = movies.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(movies.length / recordsPerPage);

  return (
    <>
      <div className="d-flex">
        <div className="ms-auto">
          <button className="btn rounded-pill border-black me-2 pt-1 pb-1">
            <i className="bi bi-funnel-fill"></i> <span>Filter</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary rounded-pill"
            data-bs-toggle="modal"
            data-bs-target="#addMovieModal"
          >
            Add New Movie
          </button>

          {/* Add Movie Modal */}
          <div
            className="modal fade"
            id="addMovieModal"
            tabIndex={-1}
            aria-labelledby="addMovieLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addMovieLabel">
                    Add Movie
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <h6>Title</h6>
                  <input
                    type="text"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingTitle}
                    onChange={(e) => setAddingTitle(e.target.value)}
                  />

                  <h6 className="mt-2">Description</h6>
                  <textarea
                    className="w-100 border border-secondary-subtle rounded-2"
                    rows={3}
                    value={addingDescription}
                    onChange={(e) => setAddingDescription(e.target.value)}
                  />

                  <h6 className="mt-2">Duration (minutes)</h6>
                  <input
                    type="number"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingDuration}
                    onChange={(e) => setAddingDuration(Number(e.target.value))}
                  />

                  <h6 className="mt-2">Release Date</h6>
                  <input
                    type="date"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingReleaseDate}
                    onChange={(e) => setAddingReleaseDate(e.target.value)}
                  />

                  <h6 className="mt-2">Country</h6>
                  <input
                    type="text"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingCountry}
                    onChange={(e) => setAddingCountry(e.target.value)}
                  />

                  <h6 className="mt-2">Director</h6>
                  <input
                    type="text"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingDirector}
                    onChange={(e) => setAddingDirector(e.target.value)}
                  />

                  <h6 className="mt-2">Actors</h6>
                  <input
                    type="text"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingActors}
                    onChange={(e) => setAddingActors(e.target.value)}
                  />

                  <h6 className="mt-2">Poster</h6>
                  <input
                    type="file"
                    className="w-100 border border-secondary-subtle rounded-2"
                    accept="image/*"
                    onChange={(e) =>
                      setAddingPoster(e.target.files?.[0] || null)
                    }
                  />

                  <h6 className="mt-2">Trailer URL</h6>
                  <input
                    type="text"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingTrailerUrl}
                    onChange={(e) => setAddingTrailerUrl(e.target.value)}
                  />

                  <h6 className="mt-2">Genre</h6>
                  <select
                    className="form-select"
                    value={addingGenreId ?? ""}
                    onChange={(e) => setAddingGenreId(Number(e.target.value))}
                  >
                    <option value="">Select Genre</option>
                    {genres.map((g) => (
                      <option key={g.genre_id} value={g.genre_id}>
                        {g.genre_name}
                      </option>
                    ))}
                  </select>

                  <h6 className="mt-2">Status</h6>
                  <select
                    className="form-select"
                    value={addingStatus}
                    onChange={(e) =>
                      setAddingStatus(
                        e.target.value as "coming" | "showing" | "ended",
                      )
                    }
                  >
                    <option value="coming">Coming</option>
                    <option value="showing">Showing</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAdd}
                    data-bs-dismiss="modal"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="rounder rounder-10 mt-3">
        <div className="d-flex">
          <h6 className="m-0 d-none d-lg-block">All Movies</h6>
          <div className="input-group ms-auto" style={{ width: "400px" }}>
            <input
              type="text"
              className="form-control rounded-start-pill"
              style={{ fontSize: "10px" }}
              placeholder="Tìm kiếm theo tên phim..."
              suppressHydrationWarning={true}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="btn rounder-end-pill border">
              <p className="p-0 m-0" onClick={() => search(searchText)}>
                Search
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table mt-2">
        <thead>
          <tr className="table-secondary">
            <th>Id</th>
            <th>Poster</th>
            <th>Title</th>
            <th>Genre</th>
            <th>Duration</th>
            <th>Release Date</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentMovies.map((movie) => (
            <tr key={movie.movie_id}>
              <th scope="row">{movie.movie_id}</th>
              <td>
                <img
                  src={movie.poster}
                  alt={movie.title}
                  style={{
                    width: "100px",
                    height: "150px",
                    objectFit: "cover",
                  }}
                />
              </td>
              <td>{movie.title}</td>
              <td>{movie.genre_name}</td>
              <td>{movie.duration} min</td>
              <td>
                {movie.release_date
                  ? new Date(movie.release_date).toLocaleDateString()
                  : "-"}
              </td>
              <td>{movie.status}</td>
              <td>{new Date(movie.created_at).toLocaleDateString()}</td>
              <td>
                <div className="dropdown">
                  <button
                    className="btn btn-light"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="fa-solid fa-ellipsis"></i>
                  </button>
                  <ul className="dropdown-menu">
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#editMovieModal"
                        onClick={() => {
                          setEditingMovie(movie);
                          setEditTitle(movie.title);
                          setEditDescription(movie.description || "");
                          setEditDuration(movie.duration);
                          setEditReleaseDate(
                            movie.release_date?.split("T")[0] || "",
                          );
                          setEditCountry(movie.country || "");
                          setEditDirector(movie.director || "");
                          setEditActors(movie.actors || "");
                          setEditTrailerUrl(movie.trailer_url || "");
                          setEditGenreId(movie.genre_id || null);
                          setEditStatus(movie.status);
                          setEditPoster(null); // chưa chọn file mới
                          setEditPosterUrl(movie.poster); // giữ URL hiện tại để hiển thị
                        }}
                      >
                        Edit Movie
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => handleDelete(movie.movie_id)}
                      >
                        End Movie
                      </button>
                    </li>
                    <li>
                      <button type="button" className="dropdown-item">
                        Cancel
                      </button>
                    </li>
                  </ul>

                  <div
                    className="modal fade"
                    id="editMovieModal"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5">Edit Movie</h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <h6>Title</h6>
                          <input
                            type="text"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />

                          <h6 className="mt-2">Description</h6>
                          <textarea
                            className="w-100 border border-secondary-subtle rounded-2"
                            rows={3}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          />

                          <h6 className="mt-2">Duration (minutes)</h6>
                          <input
                            type="number"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editDuration}
                            onChange={(e) =>
                              setEditDuration(Number(e.target.value))
                            }
                          />

                          <h6 className="mt-2">Release Date</h6>
                          <input
                            type="date"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editReleaseDate}
                            onChange={(e) => setEditReleaseDate(e.target.value)}
                          />

                          <h6 className="mt-2">Country</h6>
                          <input
                            type="text"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editCountry}
                            onChange={(e) => setEditCountry(e.target.value)}
                          />

                          <h6 className="mt-2">Director</h6>
                          <input
                            type="text"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editDirector}
                            onChange={(e) => setEditDirector(e.target.value)}
                          />

                          <h6 className="mt-2">Actors</h6>
                          <input
                            type="text"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editActors}
                            onChange={(e) => setEditActors(e.target.value)}
                          />

                          <h6 className="mt-2">Poster</h6>
                          {/* Preview ảnh */}
                          {editPosterUrl && !editPoster && (
                            <img
                              src={editPosterUrl}
                              alt="poster"
                              style={{
                                width: "100px",
                                height: "150px",
                                objectFit: "cover",
                                marginBottom: "10px",
                              }}
                            />
                          )}
                          {/* Nếu chọn file mới, hiện preview file mới */}
                          {editPoster && (
                            <img
                              src={URL.createObjectURL(editPoster)}
                              alt="poster"
                              style={{
                                width: "100px",
                                height: "150px",
                                objectFit: "cover",
                                marginBottom: "10px",
                              }}
                            />
                          )}

                          <input
                            type="file"
                            className="w-100 border border-secondary-subtle rounded-2"
                            accept="image/*"
                            onChange={(e) =>
                              setEditPoster(e.target.files?.[0] || null)
                            }
                          />

                          <h6 className="mt-2">Trailer URL</h6>
                          <input
                            type="text"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editTrailerUrl}
                            onChange={(e) => setEditTrailerUrl(e.target.value)}
                          />

                          <h6 className="mt-2">Genre</h6>
                          <select
                            className="form-select"
                            value={editGenreId ?? ""}
                            onChange={(e) =>
                              setEditGenreId(Number(e.target.value))
                            }
                          >
                            <option value="">Select Genre</option>
                            {genres.map((g) => (
                              <option key={g.genre_id} value={g.genre_id}>
                                {g.genre_name}
                              </option>
                            ))}
                          </select>

                          <h6 className="mt-2">Status</h6>
                          <select
                            className="form-select"
                            value={editStatus}
                            onChange={(e) =>
                              setEditStatus(
                                e.target.value as
                                  | "coming"
                                  | "showing"
                                  | "ended",
                              )
                            }
                          >
                            <option value="coming">Coming</option>
                            <option value="showing">Showing</option>
                            <option value="ended">Ended</option>
                          </select>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => {
                              handleSave();
                              setEditPoster(null);
                            }}
                            data-bs-dismiss="modal"
                          >
                            Save changes
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination - giống hệt mẫu Room */}
      <div className="bottom-table d-flex align-items-center">
        <div className="me-auto d-none d-lg-block">
          {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, movies.length)}{" "}
          / {movies.length}
        </div>

        <div className="d-flex mx-auto d-none d-lg-flex align-items-center">
          <span>Records per page:</span>
          <div className="dropdown ms-2">
            <button
              className="btn dropdown-toggle rounded-pill border border-black"
              type="button"
              data-bs-toggle="dropdown"
            >
              {recordsPerPage}
            </button>
            <ul className="dropdown-menu">
              {[5, 10, 20, 50].map((num) => (
                <li key={num}>
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setRecordsPerPage(num);
                      setCurrentPage(1);
                    }}
                  >
                    {num}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="ms-auto">
          <nav>
            <ul className="pagination mb-0">
              <li
                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
              >
                <button
                  className="page-link rounded-start-pill"
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                >
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button
                    className="btn btn-secondary page-link"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link rounded-end-pill"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                >
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
