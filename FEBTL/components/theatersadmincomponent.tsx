"use client";
import { useEffect, useState } from "react";
import {
  getAllTheaters,
  createTheater,
  updateTheater,
  deleteTheater,
  searchTheater,
} from "@/services/theaterService";

type Theater = {
  theater_id: number;
  name: string;
  address: string;
  phone: string;
  created_at: string;
};

export default function TheaterTable() {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");

  const [addingName, setAddingName] = useState("");
  const [addingAddress, setAddingAddress] = useState("");
  const [addingPhone, setAddingPhone] = useState("");

  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getAllTheaters()
      .then((data) => {
        setTheaters(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERROR:", err);
        alert("Error loading theaters");
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleSave = async () => {
    if (!editingTheater) return;

    try {
      await updateTheater(
        editingTheater.theater_id,
        editName,
        editAddress,
        editPhone,
      );

      setTheaters((prev) =>
        prev.map((t) =>
          t.theater_id === editingTheater.theater_id
            ? { ...t, name: editName, address: editAddress, phone: editPhone }
            : t,
        ),
      );
      alert("Theater updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating theater");
    }
  };

  const handleAdd = async () => {
    if (!addingName || !addingAddress || !addingPhone) return;
    try {
      const data = await createTheater(addingName, addingAddress, addingPhone);

      setTheaters((prev) => [
        ...prev,
        {
          theater_id: data.result.insertId,
          name: addingName,
          address: addingAddress,
          phone: addingPhone,
          created_at: new Date().toISOString(),
        },
      ]);

      alert("Theater added successfully!");
      setAddingName("");
      setAddingAddress("");
      setAddingPhone("");
    } catch (err) {
      alert("Error adding theater");
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    try {
      await deleteTheater(id);
      setTheaters((prev) => prev.filter((t) => t.theater_id !== id));
      alert("Theater deleted successfully!");
    } catch (err) {
      alert("Error deleting theater");
    }
  };

  const search = async (name: string) => {
    if (!name) return;
    try {
      const data = await searchTheater(name);
      setTheaters(data);
    } catch (err) {
      alert("Error searching theater");
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentTheaters = theaters.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(theaters.length / recordsPerPage);

  return (
    <>
      {/* Header Buttons */}
      <div className="d-flex">
        <div className="ms-auto">
          <button className="btn rounded-pill border-black me-2 pt-1 pb-1">
            <i className="bi bi-funnel-fill"></i> <span>Filter</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary rounded-pill"
            data-bs-toggle="modal"
            data-bs-target="#modalAdd"
          >
            Add New Theater
          </button>

          {/* Add Modal */}
          <div
            className="modal fade"
            id="modalAdd"
            tabIndex={-1}
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5">Add Theater</h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <input
                    type="text"
                    placeholder="Name"
                    className="form-control mb-2"
                    value={addingName}
                    onChange={(e) => setAddingName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    className="form-control mb-2"
                    value={addingAddress}
                    onChange={(e) => setAddingAddress(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Phone"
                    className="form-control"
                    value={addingPhone}
                    onChange={(e) => setAddingPhone(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" data-bs-dismiss="modal">
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
        </div>
      </div>

      {/* Search & Title */}
      <div className="rounder rounder-10 mt-3">
        <div className="d-flex">
          <h6 className="m-0 d-none d-lg-block">All Theaters</h6>
          <div className="input-group ms-auto" style={{ width: "400px" }}>
            <input
              type="text"
              className="form-control rounded-start-pill"
              placeholder="Tìm kiếm..."
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button
              className="btn rounder-end-pill border"
              onClick={() => search(searchText)}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="table">
        <thead>
          <tr className="table-secondary">
            <th>ID</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentTheaters.map((t) => (
            <tr key={t.theater_id}>
              <td>{t.theater_id}</td>
              <td>{t.name}</td>
              <td>{t.address}</td>
              <td>{t.phone}</td>
              <td>{new Date(t.created_at).toLocaleDateString()}</td>
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
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#modalEdit"
                        onClick={() => {
                          setEditingTheater(t);
                          setEditName(t.name);
                          setEditAddress(t.address);
                          setEditPhone(t.phone);
                        }}
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleDelete(t.theater_id)}
                      >
                        Delete
                      </button>
                    </li>
                    <li>
                      <button className="dropdown-item">Cancel</button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      <div className="modal fade" id="modalEdit" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Edit Theater</h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                placeholder="Name"
                className="form-control mb-2"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Address"
                className="form-control mb-2"
                value={editAddress}
                onChange={(e) => setEditAddress(e.target.value)}
              />
              <input
                type="text"
                placeholder="Phone"
                className="form-control"
                value={editPhone}
                onChange={(e) => setEditPhone(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button
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

      {/* Pagination & Records per page */}
      <div className="bottom-table d-flex align-items-center">
        <div className="me-auto d-none d-lg-block">
          {indexOfFirstRecord + 1}-
          {Math.min(indexOfLastRecord, theaters.length)} / {theaters.length}
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
