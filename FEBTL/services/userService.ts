// services/userService.ts
const BASE_URL = "http://localhost:3000/users";

export type UserDTO = {
  user_id: number;
  role_id: number;
  username: string;
  password: string;
  email: string | null;
  status: "active" | "inactive";
  created_at: string;
};

// GET ALL
export const getAllUsers = async () => {
  const res = await fetch(`${BASE_URL}/`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

// CREATE
export const createUser = async (
  username: string,
  password: string,
  email?: string,
) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email }),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

// UPDATE
export const updateUser = async (
  user_id: number,
  username: string,
  email: string | null,
  password: string,
) => {
  const res = await fetch(`${BASE_URL}/${user_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) throw new Error("Update failed");
};

// DELETE
export const deleteUser = async (user_id: number) => {
  const res = await fetch(`${BASE_URL}/${user_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};

// SEARCH
export const searchUser = async (username: string) => {
  const res = await fetch(`${BASE_URL}/search?username=${username}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};
