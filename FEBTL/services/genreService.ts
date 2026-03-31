const BASE_URL = "http://localhost:3000/genres";

export type GenreDTO = {
  genre_id: number;
  genre_name: string;
};

// GET ALL
export const getAllGenres = async () => {
  const res = await fetch(`${BASE_URL}`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

// CREATE
export const createGenre = async (name: string) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

// UPDATE
export const updateGenre = async (id: number, name: string) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) throw new Error("Update failed");
};

// DELETE
export const deleteGenre = async (id: number) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Delete failed");
};

// SEARCH
export const searchGenre = async (name: string) => {
  const res = await fetch(`${BASE_URL}/search/${name}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};
