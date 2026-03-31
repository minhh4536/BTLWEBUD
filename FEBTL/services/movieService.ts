const BASE_URL = "http://localhost:3000/movies";
const URL = "http://localhost:3000";
export type MovieDTO = {
  movie_id: number;
  title: string;
  description: string | null;
  duration: number;
  release_date: string | null;
  country: string | null;
  director: string | null;
  actors: string | null;
  poster: string | null;
  trailer_url: string | null;
  genre_id: number | null;
  status: "coming" | "showing" | "ended";
  created_at: string;
};

// GET ALL
export const getAllMovies = async () => {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) throw new Error("Fetch failed");
  const movies: MovieDTO[] = await res.json();
  // map poster thành URL đầy đủ
  return movies.map((movie) => ({
    ...movie,
    poster: movie.poster ? `${URL}${movie.poster}` : null,
  }));
};

// CREATE
export const createMovie = async (formData: FormData) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

// UPDATE
export const updateMovie = async (movie_id: number, formData: FormData) => {
  const res = await fetch(`${BASE_URL}/update/${movie_id}`, {
    method: "PUT",
    body: formData,
  });
  if (!res.ok) throw new Error("Update failed");
};

// DELETE
export const deleteMovie = async (movie_id: number) => {
  const res = await fetch(`${BASE_URL}/delete/${movie_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};

// SEARCH (theo title)
export const searchMovie = async (title: string) => {
  const res = await fetch(`${BASE_URL}/title/${title}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};
