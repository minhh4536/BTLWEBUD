"use client";
import { useEffect, useState } from "react";
import {
  getAllShowtimes,
  createShowtime,
  updateShowtime,
  searchShowtime,
} from "@/services/showtimeService";
import { getAllMovies, MovieDTO } from "@/services/movieService";
import { getAllRooms, RoomDTO } from "@/services/roomService";

type Showtime = {
  showtime_id: number;
  movie_id: number;
  movie_title?: string;
  room_id: number;
  room_name?: string;
  show_date: string;
  start_time: string;
  end_time: string;
  format: "2D" | "3D" | "IMAX";
  price: number;
  created_at: string;
};

export default function ShowtimeTable() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [loading, setLoading] = useState(true);

  const [movies, setMovies] = useState<MovieDTO[]>([]);
  const [rooms, setRooms] = useState<RoomDTO[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [editingShowtime, setEditingShowtime] = useState<Showtime | null>(null);
  const [editMovieId, setEditMovieId] = useState<number | null>(null);
  const [editRoomId, setEditRoomId] = useState<number | null>(null);
  const [editShowDate, setEditShowDate] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editFormat, setEditFormat] = useState<"2D" | "3D" | "IMAX">("2D");
  const [editPrice, setEditPrice] = useState(0);

  const [addingMovieId, setAddingMovieId] = useState<number | null>(null);
  const [addingRoomId, setAddingRoomId] = useState<number | null>(null);
  const [addingShowDate, setAddingShowDate] = useState("");
  const [addingStartTime, setAddingStartTime] = useState("");
  const [addingEndTime, setAddingEndTime] = useState("");
  const [addingFormat, setAddingFormat] = useState<"2D" | "3D" | "IMAX">("2D");
  const [addingPrice, setAddingPrice] = useState(0);

  const [searchText, setSearchText] = useState("");
  const [searchMovieId, setSearchMovieId] = useState<number | null>(null);

  // Load showtimes, movies, rooms
  useEffect(() => {
    Promise.all([getAllShowtimes(), getAllMovies(), getAllRooms()])
      .then(([showtimesData, moviesData, roomsData]) => {
        const formattedShowtimes = showtimesData.map((s: any) => {
          const movie = moviesData.find(
            (m: { movie_id: number }) => m.movie_id === s.movie_id,
          );
          const room = roomsData.find(
            (r: { room_id: number }) => r.room_id === s.room_id,
          );
          const date = new Date(s.show_date).toLocaleDateString("en-CA");
          return {
            showtime_id: s.showtime_id,
            movie_id: s.movie_id,
            movie_title: movie?.title || "",
            room_id: s.room_id,
            room_name: room?.room_name || "",
            show_date: date,
            start_time: s.start_time,
            end_time: s.end_time,
            format: s.format,
            price: s.price,
            created_at: s.created_at,
          };
        });
        setShowtimes(formattedShowtimes);
        setMovies(moviesData);
        setRooms(roomsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading showtimes, movies or rooms");
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleAdd = async () => {
    if (
      !addingMovieId ||
      !addingRoomId ||
      !addingShowDate ||
      !addingStartTime ||
      !addingEndTime
    )
      return alert("All fields are required");

    try {
      const data = await createShowtime(
        addingMovieId,
        addingRoomId,
        addingShowDate,
        addingStartTime,
        addingEndTime,
        addingFormat,
        addingPrice,
      );

      const movie = movies.find((m) => m.movie_id === addingMovieId);
      const room = rooms.find((r) => r.room_id === addingRoomId);

      setShowtimes((prev) => [
        ...prev,
        {
          showtime_id: data.result.insertId,
          movie_id: addingMovieId,
          movie_title: movie?.title,
          room_id: addingRoomId,
          room_name: room?.room_name,
          show_date: addingShowDate,
          start_time: addingStartTime,
          end_time: addingEndTime,
          format: addingFormat,
          price: addingPrice,
          created_at: new Date().toISOString(),
        },
      ]);

      // reset form
      setAddingMovieId(null);
      setAddingRoomId(null);
      setAddingShowDate("");
      setAddingStartTime("");
      setAddingEndTime("");
      setAddingFormat("2D");
      setAddingPrice(0);

      alert("Showtime added successfully!");
    } catch (err: any) {
      alert(err.message || "Error adding showtime");
    }
  };

  const handleSave = async () => {
    if (
      !editingShowtime ||
      !editMovieId ||
      !editRoomId ||
      !editShowDate ||
      !editStartTime ||
      !editEndTime
    )
      return;

    try {
      await updateShowtime(
        editingShowtime.showtime_id,
        editMovieId,
        editRoomId,
        editShowDate,
        editStartTime,
        editEndTime,
        editFormat,
        editPrice,
      );

      const movie = movies.find((m) => m.movie_id === editMovieId);
      const room = rooms.find((r) => r.room_id === editRoomId);

      setShowtimes((prev) =>
        prev.map((s) =>
          s.showtime_id === editingShowtime.showtime_id
            ? {
                ...s,
                movie_id: editMovieId,
                movie_title: movie?.title,
                room_id: editRoomId,
                room_name: room?.room_name,
                show_date: editShowDate,
                start_time: editStartTime,
                end_time: editEndTime,
                format: editFormat,
                price: editPrice,
              }
            : s,
        ),
      );

      alert("Showtime updated successfully!");
    } catch (err: any) {
      alert(err.message || "Error updating showtime");
    }
  };

  const search = async () => {
    if (!searchMovieId || !searchText) return;
    try {
      const data = await searchShowtime(searchText, searchMovieId);
      const formatted = data.map((s: any) => {
        const movie = movies.find((m) => m.movie_id === s.movie_id);
        const room = rooms.find((r) => r.room_id === s.room_id);
        return {
          ...s,
          movie_title: movie?.title || "",
          room_name: room?.room_name || "",
        };
      });
      setShowtimes(formatted);
    } catch (err) {
      alert("Error searching showtime");
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentShowtimes = showtimes.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(showtimes.length / recordsPerPage);

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
            data-bs-target="#addShowtimeModal"
          >
            Add New Showtime
          </button>

          {/* Add Showtime Modal */}
          <div
            className="modal fade"
            id="addShowtimeModal"
            tabIndex={-1}
            aria-labelledby="addShowtimeLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addShowtimeLabel">
                    Add Showtime
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <h6>Movie</h6>
                  <select
                    className="form-select"
                    value={addingMovieId ?? ""}
                    onChange={(e) => setAddingMovieId(Number(e.target.value))}
                  >
                    <option value="">Select Movie</option>
                    {movies.map((m) => (
                      <option key={m.movie_id} value={m.movie_id}>
                        {m.title}
                      </option>
                    ))}
                  </select>

                  <h6 className="mt-2">Room</h6>
                  <select
                    className="form-select"
                    value={addingRoomId ?? ""}
                    onChange={(e) => setAddingRoomId(Number(e.target.value))}
                  >
                    <option value="">Select Room</option>
                    {rooms.map((r) => (
                      <option key={r.room_id} value={r.room_id}>
                        {r.room_name}
                      </option>
                    ))}
                  </select>

                  <h6 className="mt-2">Show Date</h6>
                  <input
                    type="date"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingShowDate}
                    onChange={(e) => setAddingShowDate(e.target.value)}
                  />

                  <h6 className="mt-2">Start Time</h6>
                  <input
                    type="time"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingStartTime}
                    onChange={(e) => setAddingStartTime(e.target.value)}
                  />

                  <h6 className="mt-2">End Time</h6>
                  <input
                    type="time"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingEndTime}
                    onChange={(e) => setAddingEndTime(e.target.value)}
                  />

                  <h6 className="mt-2">Format</h6>
                  <select
                    className="form-select"
                    value={addingFormat}
                    onChange={(e) =>
                      setAddingFormat(e.target.value as "2D" | "3D" | "IMAX")
                    }
                  >
                    <option value="2D">2D</option>
                    <option value="3D">3D</option>
                    <option value="IMAX">IMAX</option>
                  </select>

                  <h6 className="mt-2">Price</h6>
                  <input
                    type="number"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingPrice}
                    onChange={(e) => setAddingPrice(Number(e.target.value))}
                  />
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
          <h6 className="m-0 d-none d-lg-block">All Showtimes</h6>
          <div className="input-group ms-auto" style={{ width: "400px" }}>
            <input
              type="date"
              className="form-control rounded-start-pill"
              style={{ fontSize: "10px" }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <select
              className="form-select"
              style={{ maxWidth: "180px" }}
              value={searchMovieId ?? ""}
              onChange={(e) => setSearchMovieId(Number(e.target.value) || null)}
            >
              <option value="">All Movies</option>
              {movies.map((m) => (
                <option key={m.movie_id} value={m.movie_id}>
                  {m.title}
                </option>
              ))}
            </select>
            <button className="btn rounder-end-pill border" onClick={search}>
              <p className="p-0 m-0">Search</p>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table mt-2">
        <thead>
          <tr className="table-secondary">
            <th>Id</th>
            <th>Movie</th>
            <th>Room</th>
            <th>Show Date</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Format</th>
            <th>Price</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentShowtimes.map((showtime) => (
            <tr key={showtime.showtime_id}>
              <th scope="row">{showtime.showtime_id}</th>
              <td>{showtime.movie_title}</td>
              <td>{showtime.room_name}</td>
              <td>{showtime.show_date}</td>
              <td>{showtime.start_time}</td>
              <td>{showtime.end_time}</td>
              <td>{showtime.format}</td>
              <td>{showtime.price}đ</td>
              <td>{new Date(showtime.created_at).toLocaleDateString()}</td>
              <td className="d-flex">
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
                        data-bs-target="#editShowtimeModal"
                        onClick={() => {
                          setEditingShowtime(showtime);
                          setEditMovieId(showtime.movie_id);
                          setEditRoomId(showtime.room_id);
                          setEditShowDate(showtime.show_date);
                          setEditStartTime(showtime.start_time);
                          setEditEndTime(showtime.end_time);
                          setEditFormat(showtime.format);
                          setEditPrice(showtime.price);
                        }}
                      >
                        Edit
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
                    id="editShowtimeModal"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5">Edit Showtime</h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                          ></button>
                        </div>
                        <div className="modal-body">
                          {/* Copy nội dung từ modal add */}
                          {/* Movie */}
                          <h6>Movie</h6>
                          <select
                            className="form-select"
                            value={editMovieId ?? ""}
                            onChange={(e) =>
                              setEditMovieId(Number(e.target.value))
                            }
                          >
                            <option value="">Select Movie</option>
                            {movies.map((m) => (
                              <option key={m.movie_id} value={m.movie_id}>
                                {m.title}
                              </option>
                            ))}
                          </select>

                          {/* Room */}
                          <h6 className="mt-2">Room</h6>
                          <select
                            className="form-select"
                            value={editRoomId ?? ""}
                            onChange={(e) =>
                              setEditRoomId(Number(e.target.value))
                            }
                          >
                            <option value="">Select Room</option>
                            {rooms.map((r) => (
                              <option key={r.room_id} value={r.room_id}>
                                {r.room_name}
                              </option>
                            ))}
                          </select>

                          {/* Show Date */}
                          <h6 className="mt-2">Show Date</h6>
                          <input
                            type="date"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editShowDate}
                            onChange={(e) => setEditShowDate(e.target.value)}
                          />

                          {/* Start Time */}
                          <h6 className="mt-2">Start Time</h6>
                          <input
                            type="time"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editStartTime}
                            onChange={(e) => setEditStartTime(e.target.value)}
                          />

                          {/* End Time */}
                          <h6 className="mt-2">End Time</h6>
                          <input
                            type="time"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editEndTime}
                            onChange={(e) => setEditEndTime(e.target.value)}
                          />

                          {/* Format */}
                          <h6 className="mt-2">Format</h6>
                          <select
                            className="form-select"
                            value={editFormat}
                            onChange={(e) =>
                              setEditFormat(
                                e.target.value as "2D" | "3D" | "IMAX",
                              )
                            }
                          >
                            <option value="2D">2D</option>
                            <option value="3D">3D</option>
                            <option value="IMAX">IMAX</option>
                          </select>

                          {/* Price */}
                          <h6 className="mt-2">Price</h6>
                          <input
                            type="number"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editPrice}
                            onChange={(e) =>
                              setEditPrice(Number(e.target.value))
                            }
                          />
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
                            onClick={handleSave}
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
          {indexOfFirstRecord + 1}-
          {Math.min(indexOfLastRecord, showtimes.length)} / {showtimes.length}
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
