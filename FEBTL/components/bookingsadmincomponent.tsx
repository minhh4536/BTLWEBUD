"use client";
import { useEffect, useState } from "react";
import {
  getallbookings,
  addbooking,
  updatebooking,
  deletebooking,
  bookingDTO,
  bookingstatus,
} from "@/services/bookingService";
import { getshowtimeavailable } from "@/services/showtimeService";
import { getseatavailable, SeatDTO } from "@/services/seatService";

type BookingDetail = {
  booking_detail_id: number;
  seat_id: number;
  seat_number?: string;
  showtime_id: number;
};

export default function BookingTable() {
  const [bookings, setBookings] = useState<bookingDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [showtimeavailable, setshowtimeavailable] = useState<any[]>([]);
  const [seatavailable, setseatavailable] = useState<SeatDTO[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);
  const [searchText, setSearchText] = useState("");

  // Add States
  const [useradd, setuseraddbooking] = useState<number | null>(null);
  const [showtimeadd, setshowtimeadd] = useState<number | null>(null);
  const [seatAdd, setSeatAdd] = useState<number[]>([]);

  // Edit States
  const [editingBooking, setEditingBooking] = useState<bookingDTO | null>(null);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editShowtimeId, setEditShowtimeId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<bookingstatus>(
    bookingstatus.PENDING,
  );

  // View Detail
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetail[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    getallbookings()
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading bookings");
      });
  }, []);

  async function loadShowtimeAvailable() {
    getshowtimeavailable()
      .then((data) => setshowtimeavailable(data))
      .catch((err) => alert("Không có showtime nào khả dụng"));
  }

  async function loadSeatAvailable(showtime_id: number) {
    getseatavailable(showtime_id)
      .then((data) => setseatavailable(data))
      .catch((err) => alert("Không có ghế nào khả dụng"));
  }

  if (loading) return <p>Loading...</p>;

  const handleAdd = async () => {
    if (!useradd || !showtimeadd || seatAdd.length === 0) {
      return alert("Vui lòng chọn User, Showtime và ít nhất 1 ghế");
    }
    try {
      await addbooking(useradd, showtimeadd, seatAdd);
      alert("Booking created successfully!");

      const refreshed = await getallbookings();
      setBookings(refreshed);

      setuseraddbooking(null);
      setshowtimeadd(null);
      setSeatAdd([]);
    } catch (err) {
      alert("Error creating booking");
    }
  };

  const handleEditClick = (booking: bookingDTO) => {
    setEditingBooking(booking);
    setEditUserId(booking.user_id);
    setEditShowtimeId(booking.showtime_id);
    setEditStatus(booking.booking_status as bookingstatus);
  };

  const handleSaveEdit = async () => {
    if (!editingBooking || !editUserId || !editShowtimeId) return;

    try {
      await updatebooking(
        editingBooking.booking_id,
        editUserId,
        editShowtimeId,
        editStatus,
      );
      alert("Booking updated successfully!");
      const refreshed = await getallbookings();
      setBookings(refreshed);
      setEditingBooking(null);
    } catch (err) {
      alert("Error updating booking");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn hủy booking này?")) return;

    try {
      await deletebooking(id);
      const refreshed = await getallbookings();
      setBookings(refreshed);
      alert("Booking đã được hủy thành công!");
    } catch (err) {
      alert("Error deleting booking");
    }
  };

  const handleViewDetail = async (booking: bookingDTO) => {
    setSelectedBooking(booking);
    setDetailLoading(true);
    setDetailLoading(false);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setBookingDetails([]);
  };

  const filteredBookings = bookings.filter((b) =>
    b.booking_code.toLowerCase().includes(searchText.toLowerCase()),
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const totalPages = Math.ceil(filteredBookings.length / recordsPerPage);

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
            data-bs-target="#exampleModaladd"
            onClick={loadShowtimeAvailable}
          >
            Add New Booking
          </button>
        </div>
      </div>

      <div className="rounder rounder-10 mt-3">
        <div className="d-flex">
          <h6 className="m-0 d-none d-lg-block">All Bookings</h6>
          <div className="input-group ms-auto" style={{ width: "400px" }}>
            <input
              type="text"
              className="form-control rounded-start-pill"
              style={{ fontSize: "10px" }}
              placeholder="Tìm theo mã booking..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="btn rounder-end-pill border">
              <p className="p-0 m-0">Search</p>
            </button>
          </div>
        </div>
      </div>

      <table className="table mt-2">
        <thead>
          <tr className="table-secondary">
            <th>Id</th>
            <th>Booking Code</th>
            <th>User Id</th>
            <th>Showtime Id</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentBookings.map((booking) => (
            <tr key={booking.booking_id}>
              <th scope="row">{booking.booking_id}</th>
              <td>{booking.booking_code}</td>
              <td>{booking.user_id}</td>
              <td>{booking.showtime_id}</td>
              <td>{booking.total_amount}</td>
              <td>{booking.booking_status}</td>
              <td>{new Date(booking.created_at).toLocaleDateString()}</td>
              <td className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-light"
                  onClick={() => handleViewDetail(booking)}
                  title="Xem chi tiết"
                >
                  <i className="fa-solid fa-eye"></i>
                </button>

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
                        data-bs-target="#editBookingModal"
                        onClick={() => handleEditClick(booking)}
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => handleDelete(booking.booking_id)}
                      >
                        Cancel Booking
                      </button>
                    </li>
                    <li>
                      <button type="button" className="dropdown-item">
                        Cancel
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bottom-table d-flex align-items-center">
        <div className="me-auto d-none d-lg-block">
          {indexOfFirstRecord + 1}-
          {Math.min(indexOfLastRecord, filteredBookings.length)} /{" "}
          {filteredBookings.length}
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

      {/* ====================== MODAL ADD ====================== */}
      <div
        className="modal fade"
        id="exampleModaladd"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Add Booking
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <h6>User</h6>
              <input
                type="number"
                className="w-100 border border-secondary-subtle rounded-2"
                value={useradd ?? ""}
                onChange={(e) => setuseraddbooking(Number(e.target.value))}
              />
              <h6 className="mt-2">Showtime</h6>
              <select
                className="form-select"
                value={showtimeadd ?? ""}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setshowtimeadd(val);
                  loadSeatAvailable(val);
                }}
              >
                <option value="">Select a showtime</option>
                {showtimeavailable.map((s) => (
                  <option key={s.showtime_id} value={s.showtime_id}>
                    {s.showtime_id} - {s.title}
                  </option>
                ))}
              </select>
              <h6 className="mt-2">Seat</h6>
              <div className="d-flex flex-wrap" style={{ maxWidth: "510px" }}>
                {seatavailable.map((seat) => {
                  const isSelected = seatAdd.includes(seat.seat_id);
                  return (
                    <button
                      key={seat.seat_id}
                      className={`btn m-1 ${isSelected ? "btn-primary" : "btn-outline-primary"}`}
                      style={{ width: "58px", height: "58px" }}
                      onClick={() => {
                        if (isSelected) {
                          setSeatAdd(
                            seatAdd.filter((id) => id !== seat.seat_id),
                          );
                        } else {
                          setSeatAdd([...seatAdd, seat.seat_id]);
                        }
                      }}
                    >
                      {seat.seat_number}
                    </button>
                  );
                })}
              </div>
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

      {/* ====================== MODAL EDIT (GIỐNG HỆT ADD) ====================== */}
      <div
        className="modal fade"
        id="editBookingModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Sửa Booking</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <h6>User</h6>
              <input
                type="number"
                className="w-100 border border-secondary-subtle rounded-2"
                value={editUserId ?? ""}
                onChange={(e) => setEditUserId(Number(e.target.value))}
              />

              <h6 className="mt-2">Showtime</h6>
              <input
                type="number"
                className="w-100 border border-secondary-subtle rounded-2"
                value={editShowtimeId ?? ""}
                onChange={(e) => setEditShowtimeId(Number(e.target.value))}
              />

              <h6 className="mt-2">Status</h6>
              <select
                className="form-select"
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as bookingstatus)}
              >
                <option value={bookingstatus.PENDING}>Pending</option>
                <option value={bookingstatus.PAID}>Paid</option>
                <option value={bookingstatus.CANCELLED}>Cancelled</option>
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
                onClick={handleSaveEdit}
                data-bs-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal View Detail */}
      {selectedBooking && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex={-1}
        >
          {/* Bạn có thể bổ sung nội dung modal xem chi tiết sau */}
        </div>
      )}
    </>
  );
}
