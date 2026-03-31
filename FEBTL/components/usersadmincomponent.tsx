"use client";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  searchUser,
} from "@/services/userService";

type User = {
  user_id: number;
  role_id: number;
  username: string;
  email: string | null;
  status: "active" | "inactive";
  created_at: string;
};

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const [addingUsername, setAddingUsername] = useState("");
  const [addingEmail, setAddingEmail] = useState("");
  const [addingPassword, setAddingPassword] = useState("");

  const [searchText, setSearchText] = useState("");

  // Load users
  useEffect(() => {
    getAllUsers()
      .then((usersData) => {
        setUsers(usersData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Error loading users");
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleAdd = async () => {
    if (!addingUsername || !addingPassword)
      return alert("Username and password are required");
    try {
      const data = await createUser(
        addingUsername,
        addingPassword,
        addingEmail || undefined,
      );
      setUsers((prev) => [
        ...prev,
        {
          user_id: data.result.insertId,
          role_id: 3,
          username: addingUsername,
          email: addingEmail || null,
          status: "active",
          created_at: new Date().toISOString(),
        },
      ]);
      setAddingUsername("");
      setAddingEmail("");
      setAddingPassword("");
      alert("User added successfully!");
    } catch (err) {
      alert("Error adding user");
    }
  };

  const handleSave = async () => {
    if (!editingUser || !editUsername) {
      alert("You must have a username");
      return;
    }
    if (!editUsername || editUsername.trim().length < 3) {
      alert("Usernames must have at least 3 characters!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (editEmail && !emailRegex.test(editEmail)) {
      alert("Invalid email format!");
      return;
    }

    if (editPassword !== "") {
      if (editPassword && editPassword.length < 6) {
        alert("The new password must have at least 6 characters.!");
        return;
      }
    }
    try {
      await updateUser(
        editingUser.user_id,
        editUsername,
        editEmail || "",
        editPassword,
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === editingUser.user_id
            ? {
                ...u,
                username: editUsername,
                email: editEmail || null,
              }
            : u,
        ),
      );
      alert("User updated successfully!");
    } catch (err) {
      alert("Error updating user");
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.user_id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      alert("Error deleting user");
    }
  };

  const search = async (name: string) => {
    if (!name) return;
    try {
      const data = await searchUser(name);
      setUsers(Array.isArray(data) ? data : [data].filter(Boolean));
    } catch (err) {
      alert("Error searching user");
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentUsers = users.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(users.length / recordsPerPage);

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
            data-bs-target="#addUserModal"
          >
            Add New User
          </button>

          {/* Add User Modal */}
          <div
            className="modal fade"
            id="addUserModal"
            tabIndex={-1}
            aria-labelledby="addUserLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="addUserLabel">
                    Add User
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                  ></button>
                </div>
                <div className="modal-body">
                  <h6>Username</h6>
                  <input
                    type="text"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingUsername}
                    onChange={(e) => setAddingUsername(e.target.value)}
                  />

                  <h6 className="mt-2">Email</h6>
                  <input
                    type="email"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingEmail}
                    onChange={(e) => setAddingEmail(e.target.value)}
                  />

                  <h6 className="mt-2">Password</h6>
                  <input
                    type="password"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingPassword}
                    onChange={(e) => setAddingPassword(e.target.value)}
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
          <h6 className="m-0 d-none d-lg-block">All Users</h6>
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
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.user_id}>
              <th scope="row">{user.user_id}</th>
              <td>{user.username}</td>
              <td>{user.email || "-"}</td>
              <td>{user.status}</td>
              <td>{new Date(user.created_at).toLocaleDateString()}</td>
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
                        data-bs-target="#editUserModal"
                        onClick={() => {
                          setEditingUser(user);
                          setEditUsername(user.username);
                          setEditEmail(user.email || "");
                          setEditPassword(""); // password để trống khi edit
                        }}
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => handleDelete(user.user_id)}
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
                    id="editUserModal"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5">Edit User</h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <h6>Username</h6>
                          <input
                            type="text"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                          />

                          <h6 className="mt-2">Email</h6>
                          <input
                            type="email"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editEmail}
                            onChange={(e) => setEditEmail(e.target.value)}
                          />

                          <h6 className="mt-2">Password (mới)</h6>
                          <input
                            type="password"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            placeholder="Nhập password mới nếu muốn đổi"
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
          {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, users.length)} /{" "}
          {users.length}
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
