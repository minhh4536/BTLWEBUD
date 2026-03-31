"use client";
import { useEffect, useState } from "react";
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  searchRoom,
} from "@/services/roomService";
import { getAllTheaters, TheaterDTO } from "@/services/theaterService";

type Room = {
  room_id: number;
  room_name: string;
  theater_id: number;
  theater_name?: string;
  total_seats: number;
  created_at: string;
};

export default function RoomTable() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const [theaters, setTheaters] = useState<TheaterDTO[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [editName, setEditName] = useState("");
  const [editTheaterId, setEditTheaterId] = useState<number | null>(null);
  const [editSeats, setEditSeats] = useState<number>(0);

  const [addingName, setAddingName] = useState("");
  const [addingTheaterId, setAddingTheaterId] = useState<number | null>(null);
  const [addingSeats, setAddingSeats] = useState<number>(0);

  const [searchText, setSearchText] = useState("");

  // Load rooms & theaters
  useEffect(() => {
    Promise.all([getAllRooms(), getAllTheaters()])
      .then(([roomsData, theatersData]) => {
        const formattedRooms = roomsData.map((r: any) => {
          const theater = theatersData.find(
            (t: { theater_id: number }) => t.theater_id === r.theater_id,
          );
          return {
            room_id: r.room_id,
            room_name: r.room_name,
            theater_id: r.theater_id,
            theater_name: theater?.name || "",
            total_seats: r.total_seats,
            created_at: r.created_at,
          };
        });
        setRooms(formattedRooms);
        setTheaters(theatersData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading rooms or theaters");
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleAdd = async () => {
    if (!addingName || !addingTheaterId)
      return alert("Room name & theater required");
    try {
      const data = await createRoom(addingTheaterId, addingName, addingSeats);
      const theater = theaters.find((t) => t.theater_id === addingTheaterId);
      setRooms((prev) => [
        ...prev,
        {
          room_id: data.result.insertId,
          room_name: addingName,
          theater_id: addingTheaterId,
          theater_name: theater?.name,
          total_seats: addingSeats,
          created_at: new Date().toISOString(),
        },
      ]);
      setAddingName("");
      setAddingTheaterId(null);
      setAddingSeats(0);
      alert("Room added successfully!");
    } catch (err) {
      alert("Error adding room");
    }
  };

  const handleSave = async () => {
    if (!editingRoom || !editTheaterId || !editName) return;
    try {
      await updateRoom(editingRoom.room_id, editTheaterId, editName, editSeats);
      const theater = theaters.find((t) => t.theater_id === editTheaterId);
      setRooms((prev) =>
        prev.map((r) =>
          r.room_id === editingRoom.room_id
            ? {
                ...r,
                room_name: editName,
                theater_id: editTheaterId,
                theater_name: theater?.name,
                total_seats: editSeats,
              }
            : r,
        ),
      );
      alert("Room updated successfully!");
    } catch (err) {
      alert("Error updating room");
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r.room_id !== id));
      alert("Room deleted successfully!");
    } catch (err) {
      alert("Error deleting room");
    }
  };

  const search = async (name: string) => {
    if (!name) return;
    try {
      const data = await searchRoom(name);
      const formattedRooms = data.map((r: any) => {
        const theater = theaters.find((t) => t.theater_id === r.theater_id);
        return { ...r, theater_name: theater?.name || "" };
      });
      setRooms(formattedRooms);
    } catch (err) {
      alert("Error searching room");
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRooms = rooms.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(rooms.length / recordsPerPage);

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
            data-bs-target="#addRoomModal"
          >
            Add New Room
          </button>

          {/* Add Room Modal */}
          <div
            className="modal fade"
            id="addRoomModal"
            tabIndex={-1}
            aria-labelledby="addRoomLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addRoomLabel">
                    Add Room
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <h6>Room Name</h6>
                  <input
                    type="text"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingName}
                    onChange={(e) => setAddingName(e.target.value)}
                  />

                  <h6 className="mt-2">Theater</h6>
                  <select
                    className="form-select"
                    value={addingTheaterId ?? ""}
                    onChange={(e) => setAddingTheaterId(Number(e.target.value))}
                  >
                    <option value="">Select Theater</option>
                    {theaters.map((t) => (
                      <option key={t.theater_id} value={t.theater_id}>
                        {t.name}
                      </option>
                    ))}
                  </select>

                  <h6 className="mt-2">Total Seats</h6>
                  <input
                    type="number"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingSeats}
                    onChange={(e) => setAddingSeats(Number(e.target.value))}
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
          <h6 className="m-0 d-none d-lg-block">All Rooms</h6>
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
            <th>Room Name</th>
            <th>Theater</th>
            <th>Total Seats</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentRooms.map((room) => (
            <tr key={room.room_id}>
              <th scope="row">{room.room_id}</th>
              <td>{room.room_name}</td>
              <td>{room.theater_name}</td>
              <td>{room.total_seats}</td>
              <td>{new Date(room.created_at).toLocaleDateString()}</td>
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
                        data-bs-target="#editRoomModal"
                        onClick={() => {
                          setEditingRoom(room);
                          setEditName(room.room_name);
                          setEditTheaterId(room.theater_id);
                          setEditSeats(room.total_seats);
                        }}
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => handleDelete(room.room_id)}
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
                    id="editRoomModal"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5">Edit Room</h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <h6>Room Name</h6>
                          <input
                            type="text"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                          />

                          <h6 className="mt-2">Theater</h6>
                          <select
                            className="form-select"
                            value={editTheaterId ?? ""}
                            onChange={(e) =>
                              setEditTheaterId(Number(e.target.value))
                            }
                          >
                            <option value="">Select Theater</option>
                            {theaters.map((t) => (
                              <option key={t.theater_id} value={t.theater_id}>
                                {t.name}
                              </option>
                            ))}
                          </select>

                          <h6 className="mt-2">Total Seats</h6>
                          <input
                            type="number"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editSeats}
                            onChange={(e) =>
                              setEditSeats(Number(e.target.value))
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

      {/* Pagination */}
      <div className="bottom-table d-flex align-items-center">
        <div className="me-auto d-none d-lg-block">
          {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, rooms.length)} /{" "}
          {rooms.length}
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
