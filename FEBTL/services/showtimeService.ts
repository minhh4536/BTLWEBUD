const BASE_URL = "http://localhost:3000/showtimes";

export type ShowtimeDTO = {
  showtime_id: number;
  movie_id: number;
  room_id: number;
  show_date: string;
  start_time: string;
  end_time: string;
  format: "2D" | "3D" | "IMAX";
  price: number;
  created_at: string;
};

// GET ALL
export const getAllShowtimes = async () => {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

// CREATE
export const createShowtime = async (
  movie_id: number,
  room_id: number,
  show_date: string,
  start_time: string,
  end_time: string,
  format: "2D" | "3D" | "IMAX",
  price: number,
) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      movie_id,
      room_id,
      show_date,
      start_time,
      end_time,
      format,
      price,
    }),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

// UPDATE
export const updateShowtime = async (
  showtime_id: number,
  movie_id: number,
  room_id: number,
  show_date: string,
  start_time: string,
  end_time: string,
  format: "2D" | "3D" | "IMAX",
  price: number,
) => {
  const res = await fetch(`${BASE_URL}/update/${showtime_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      movie_id,
      room_id,
      show_date,
      start_time,
      end_time,
      format,
      price,
    }),
  });
  if (!res.ok) throw new Error("Update failed");
};

// DELETE
export const deleteShowtime = async (showtime_id: number) => {
  const res = await fetch(`${BASE_URL}/delete/${showtime_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};

// SEARCH (theo show_date và movie_id)
export const searchShowtime = async (show_date: string, movie_id: number) => {
  const res = await fetch(
    `${BASE_URL}/search?show_date=${show_date}&movie_id=${movie_id}`,
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

export const getshowtimeavailable = async () => {
  const res = await fetch(`${BASE_URL}/available`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Error get showtime available");
  return res.json();
};
