const BASE_URL = "http://localhost:3000/seats";

export type SeatDTO = {
  seat_id: number;
  room_id: number;
  seat_number: string;
  seat_type: "normal" | "vip";
  created_at: string;
};

export const getAllSeats = async () => {
  const res = await fetch(`${BASE_URL}/all`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

export const createSeat = async (
  room_id: number,
  seat_number: string,
  seat_type: "normal" | "vip",
) => {
  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room_id, seat_number, seat_type }),
  });
  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

export const updateSeat = async (
  seat_id: number,
  room_id: number,
  seat_number: string,
  seat_type: "normal" | "vip",
) => {
  const res = await fetch(`${BASE_URL}/update/${seat_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ room_id, seat_number, seat_type }),
  });
  if (!res.ok) throw new Error("Update failed");
};

export const deleteSeat = async (seat_id: number) => {
  const res = await fetch(`${BASE_URL}/delete/${seat_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};

export const searchSeat = async (seat_number: string) => {
  const res = await fetch(`${BASE_URL}/search?seat_number=${seat_number}`);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
};

export const getSeatsByRoom = async (room_id: number) => {
  const res = await fetch(`${BASE_URL}/room/${room_id}`);
  if (!res.ok) throw new Error("Fetch failed");
  return res.json();
};

export const getseatavailable = async (id: number) => {
  const res = await fetch(`${BASE_URL}/available/${id}`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Error get seat available");
  return res.json();
};
