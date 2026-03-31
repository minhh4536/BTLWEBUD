const BASE_URL = "http://localhost:3000/booking";

export enum bookingstatus {
  PENDING = "pending",
  PAID = "paid",
  CANCELLED = "cancelled",
}
export type bookingDTO = {
  booking_id: number;
  user_id: number;
  booking_code: string;
  showtime_id: number;
  total_amount: number;
  booking_status: bookingstatus;
  created_at: string;
};

export const getallbookings = async () => {
  const res = await fetch(`${BASE_URL}/`, {
    method: "GET",
  });
  if (!res.ok) throw new Error("Get all failed");
  return await res.json();
};

export const addbooking = async (
  user_id: number,
  showtime_id: number,
  seat_ids: number[],
) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user_id,
      showtimeId: showtime_id,
      seatIds: seat_ids,
      paymentMethod: "momo",
    }),
  });
  if (!res.ok) throw new Error("Create failed");
  return await res.json();
};

export const updatebooking = async (
  booking_id: number,
  user_id: number,
  showtime_id: number,
  booking_status: bookingstatus,
) => {
  const res = await fetch(`${BASE_URL}/${booking_id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user_id,
      showtimeId: showtime_id,
      bookingStatus: booking_status,
    }),
  });
  if (!res.ok) throw new Error("Update failed");
};

export const deletebooking = async (booking_id: number) => {
  const res = await fetch(`${BASE_URL}/${booking_id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};
