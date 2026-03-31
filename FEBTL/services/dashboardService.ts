const BASE_URL = "http://localhost:3000/dashboard";

export type LatestBookingDTO = {
  booking_code: string;
  movie_title: string;
  booking_date: string;
  total_amount: number;
};

export type DashboardStatsDTO = {
  totalRevenue: number;
  ticketsSold: number;
  totalUsers: number;
  occupancyRate: number;
  latestBookings: LatestBookingDTO[];
};

export type TopMovieDTO = {
  movie_id: number;
  title: string;
  totalTickets: number;
};

export const getDashboardStats = async (): Promise<DashboardStatsDTO> => {
  const res = await fetch(`${BASE_URL}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to fetch dashboard stats");
  return await res.json();
};

export const getTopMovies = async (): Promise<TopMovieDTO[]> => {
  const res = await fetch(`${BASE_URL}/top-movies`, {
    method: "GET",
  });

  if (!res.ok) throw new Error("Get top movies failed");
  return await res.json();
};
