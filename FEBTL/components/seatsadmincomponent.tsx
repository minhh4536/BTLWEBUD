"use client";
import { useEffect, useState } from "react";
import {
  getAllSeats,
  createSeat,
  updateSeat,
  deleteSeat,
  searchSeat,
  SeatDTO,
} from "@/services/seatService";
import {
  getroombytheater,
  getAllRooms,
  checkseats,
  RoomDTO,
} from "@/services/roomService";
import { getAllTheaters, TheaterDTO } from "@/services/theaterService";

type Seat = {
  seat_id: number;
  seat_number: string;
  room_id: number;
  room_name?: string;
  theater_name?: string;
  seat_type: "normal" | "vip";
  created_at: string;
};

export default function SeatTable() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);

  const [rooms, setRooms] = useState<RoomDTO[]>([]);
  const [theaters, setTheaters] = useState<TheaterDTO[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [editingSeat, setEditingSeat] = useState<Seat | null>(null);
  const [editSeatNumber, setEditSeatNumber] = useState("");
  const [editRoomId, setEditRoomId] = useState<number | null>(null);
  const [editSeatType, setEditSeatType] = useState<"normal" | "vip">("normal");

  const [addingSeatNumber, setAddingSeatNumber] = useState("");
  const [addingRoomId, setAddingRoomId] = useState<number | null>(null);
  const [addingTheaterID, setAddingtheaterID] = useState<number | null>(null);
  const [addingSeatType, setAddingSeatType] = useState<"normal" | "vip">(
    "normal",
  );

  const [searchText, setSearchText] = useState("");

  const handleChangeTheater = async (theaterId: number) => {
    const data = await getroombytheater(theaterId);
    setRooms(data);
  };

  // Load seats & rooms
  useEffect(() => {
    Promise.all([getAllSeats(), getAllRooms(), getAllTheaters()])
      .then(([seatsData, roomsData, theaterData]) => {
        const formattedSeats = seatsData.map((s: SeatDTO) => {
          const room = roomsData.find(
            (r: { room_id: number }) => r.room_id === s.room_id,
          );
          const theater = theaterData.find(
            (t: { theater_id: number }) => t.theater_id === room.theater_id,
          );
          return {
            seat_id: s.seat_id,
            seat_number: s.seat_number,
            room_id: s.room_id,
            room_name: room?.room_name || "",
            theater_name: theater?.name || "",
            seat_type: s.seat_type,
            created_at: s.created_at,
          };
        });
        setSeats(formattedSeats);
        setRooms(roomsData);
        setTheaters(theaterData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading seats or rooms");
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleAdd = async () => {
    if (!addingSeatNumber || !addingRoomId)
      return alert("Seat number & room required");
    const available = await checkseats(addingRoomId);
    if (!available) return alert("The room is full");
    try {
      const data = await createSeat(
        addingRoomId,
        addingSeatNumber,
        addingSeatType,
      );
      const room = rooms.find((r) => r.room_id === addingRoomId);
      setSeats((prev) => [
        ...prev,
        {
          seat_id: data.result.insertId,
          seat_number: addingSeatNumber,
          room_id: addingRoomId,
          room_name: room?.room_name,
          seat_type: addingSeatType,
          created_at: new Date().toISOString(),
        },
      ]);
      setAddingSeatNumber("");
      setAddingRoomId(null);
      setAddingSeatType("normal");
      alert("Seat added successfully!");
    } catch (err) {
      alert("Error adding seat");
    }
  };

  const handleSave = async () => {
    if (!editingSeat || !editRoomId || !editSeatNumber) return;
    try {
      await updateSeat(
        editingSeat.seat_id,
        editRoomId,
        editSeatNumber,
        editSeatType,
      );
      const room = rooms.find((r) => r.room_id === editRoomId);
      setSeats((prev) =>
        prev.map((s) =>
          s.seat_id === editingSeat.seat_id
            ? {
                ...s,
                seat_number: editSeatNumber,
                room_id: editRoomId,
                room_name: room?.room_name,
                seat_type: editSeatType,
              }
            : s,
        ),
      );
      alert("Seat updated successfully!");
    } catch (err) {
      alert("Error updating seat");
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    try {
      await deleteSeat(id);
      setSeats((prev) => prev.filter((s) => s.seat_id !== id));
      alert("Seat deleted successfully!");
    } catch (err) {
      alert("Error deleting seat");
    }
  };

  const search = async (text: string) => {
    if (!text) return;
    try {
      const data = await searchSeat(text);
      const formattedSeats = data.map((s: any) => {
        const room = rooms.find((r) => r.room_id === s.room_id);
        return { ...s, room_name: room?.room_name || "" };
      });
      setSeats(formattedSeats);
    } catch (err) {
      alert("Error searching seat");
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentSeats = seats.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(seats.length / recordsPerPage);

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
            data-bs-target="#addSeatModal"
          >
            Add New Seat
          </button>

          {/* Add Seat Modal */}
          <div
            className="modal fade"
            id="addSeatModal"
            tabIndex={-1}
            aria-labelledby="addSeatLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addSeatLabel">
                    Add Seat
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <h6>Seat Number</h6>
                  <input
                    type="text"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingSeatNumber}
                    onChange={(e) => setAddingSeatNumber(e.target.value)}
                  />

                  <h6 className="mt-2">Theater</h6>
                  <select
                    className="form-select"
                    value={addingTheaterID ?? ""}
                    onChange={(e) => {
                      console.log(Number(e.target.value));
                      setAddingtheaterID(Number(e.target.value));
                      handleChangeTheater(Number(e.target.value));
                    }}
                  >
                    <option value="">Select Theater</option>
                    {theaters.map((t) => (
                      <option key={t.theater_id} value={t.theater_id}>
                        {t.name}
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

                  <h6 className="mt-2">Seat Type</h6>
                  <select
                    className="form-select"
                    value={addingSeatType}
                    onChange={(e) =>
                      setAddingSeatType(e.target.value as "normal" | "vip")
                    }
                  >
                    <option value="normal">Normal</option>
                    <option value="vip">VIP</option>
                  </select>
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
          <h6 className="m-0 d-none d-lg-block">All Seats</h6>
          <div className="input-group ms-auto" style={{ width: "400px" }}>
            <input
              type="text"
              className="form-control rounded-start-pill"
              style={{ fontSize: "10px" }}
              placeholder="Tìm kiếm..."
              suppressHydrationWarning={true}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="btn rounder-end-pill border">
              <p className="p-0 m-0" onClick={() => search(searchText)}>
                Search
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table mt-2">
        <thead>
          <tr className="table-secondary">
            <th>Id</th>
            <th>Seat Number</th>
            <th>Room</th>
            <th>Theater</th>
            <th>Type</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentSeats.map((seat) => (
            <tr key={seat.seat_id}>
              <th scope="row">{seat.seat_id}</th>
              <td>{seat.seat_number}</td>
              <td>{seat.room_name}</td>
              <td>{seat.theater_name}</td>
              <td>{seat.seat_type}</td>
              <td>{new Date(seat.created_at).toLocaleDateString()}</td>
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
                        data-bs-target="#editSeatModal"
                        onClick={() => {
                          setEditingSeat(seat);
                          setEditSeatNumber(seat.seat_number);
                          setEditRoomId(seat.room_id);
                          setEditSeatType(seat.seat_type);
                        }}
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => handleDelete(seat.seat_id)}
                      >
                        Delete
                      </button>
                    </li>
                    <li>
                      <button type="button" className="dropdown-item">
                        Cancel
                      </button>
                    </li>
                  </ul>

                  {/* Edit Modal */}
                  <div
                    className="modal fade"
                    id="editSeatModal"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5">Edit Seat</h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <h6>Seat Number</h6>
                          <input
                            type="text"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editSeatNumber}
                            onChange={(e) => setEditSeatNumber(e.target.value)}
                          />

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

                          <h6 className="mt-2">Seat Type</h6>
                          <select
                            className="form-select"
                            value={editSeatType}
                            onChange={(e) =>
                              setEditSeatType(
                                e.target.value as "normal" | "vip",
                              )
                            }
                          >
                            <option value="normal">Normal</option>
                            <option value="vip">VIP</option>
                          </select>
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

      {/* Pagination */}
      <div className="bottom-table d-flex align-items-center">
        <div className="me-auto d-none d-lg-block">
          {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, seats.length)} /{" "}
          {seats.length}
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
