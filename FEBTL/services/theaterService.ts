const BASE_URL = "http://localhost:3000/theaters";

export type TheaterDTO = {
  theater_id: number;
  name: string;
  address: string;
  phone: string;
  created_at: string;
};

// GET ALL
export const getAllTheaters = async () => {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

// CREATE
export const createTheater = async (
  name: string,
  address: string,
  phone: string,
) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, address, phone }),
  });

  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

// UPDATE
export const updateTheater = async (
  id: number,
  name: string,
  address: string,
  phone: string,
) => {
  const res = await fetch(`${BASE_URL}/update/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, address, phone }),
  });

  if (!res.ok) throw new Error("Update failed");
};

// DELETE
export const deleteTheater = async (id: number) => {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Delete failed");
};

// SEARCH
export const searchTheater = async (name: string) => {
  const res = await fetch(`${BASE_URL}/search?name=${name}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};
