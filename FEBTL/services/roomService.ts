import { get } from "http";

// services/roomService.ts
const BASE_URL = "http://localhost:3000/rooms";

export type RoomDTO = {
  room_id: number;
  theater_id: number;
  room_name: string;
  total_seats: number;
  created_at: string;
};

// GET ALL
export const getAllRooms = async () => {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

// CREATE
export const createRoom = async (
  theater_id: number,
  room_name: string,
  total_seats: number,
) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theater_id, room_name, total_seats }),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

// UPDATE
export const updateRoom = async (
  room_id: number,
  theater_id: number,
  room_name: string,
  total_seats: number,
) => {
  const res = await fetch(`${BASE_URL}/update/${room_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theater_id, room_name, total_seats }),
  });
  if (!res.ok) throw new Error("Update failed");
};

// DELETE
export const deleteRoom = async (room_id: number) => {
  const res = await fetch(`${BASE_URL}/delete/${room_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};

// SEARCH
export const searchRoom = async (room_name: string) => {
  const res = await fetch(`${BASE_URL}/search?room_name=${room_name}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

export const getroombytheater = async (theater_id: number) => {
  const res = await fetch(`${BASE_URL}/bytheater/${theater_id}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Error dropdown room loaded");
  return res.json();
};

export const getcountseats = async (room_id: number) => {
  const res = await fetch(`${BASE_URL}/count/${room_id}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Error get count seats");
  return res.json();
};

export const gettotalseats = async (room_id: number) => {
  const res = await fetch(`${BASE_URL}/total/${room_id}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Error get total seats");
  return res.json();
};

export const checkseats = async (room_id: number) => {
  const countseats = await getcountseats(room_id);
  const totalseats = await gettotalseats(room_id);

  const count = countseats.countSeats;
  const total = totalseats.totalSeats;

  return count < total;
};
