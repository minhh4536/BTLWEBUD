"use client";
import { error } from "console";
import { useEffect, useState } from "react";
import {
  getAllGenres,
  createGenre,
  updateGenre,
  deleteGenre,
  searchGenre,
} from "@/services/genreService";

type Genre = {
  id: number;
  name: string;
  createdAt: string;
};

export default function GenreTable() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [editName, setEditName] = useState("");

  const [addingGenre, setAddingGenre] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getAllGenres()
      .then((data) => {
        const formatted = data.map((u: any) => ({
          id: u.genre_id,
          name: u.genre_name,
          createdAt: u.created_at,
        }));
        setGenres(formatted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERROR:", err);
        alert("Error loading genres");
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleSave = async () => {
    if (!editingGenre) return;

    try {
      await updateGenre(editingGenre.id, editName);

      setGenres((prev) =>
        prev.map((g) =>
          g.id === editingGenre.id ? { ...g, name: editName } : g,
        ),
      );
      alert("Genre updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Error updating genre");
    }
  };

  const handleAdd = async () => {
    if (!addingGenre) return;
    try {
      const data = await createGenre(addingGenre);

      setGenres((prev) => [
        ...prev,
        {
          id: data.result.insertId,
          name: addingGenre,
          createdAt: new Date().toISOString(),
        },
      ]);

      alert("Genre updated successfully!");
      setAddingGenre("");
    } catch (err) {
      alert("Error addding genre");
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    try {
      await deleteGenre(id);

      setGenres((prev) => prev.filter((g) => g.id !== id));

      alert("Genre deleted successfully!");
    } catch (err) {
      alert("Error deleting genre");
    }
  };

  const seach = async (name: string) => {
    if (!name) return;
    try {
      const data = await searchGenre(name);

      const formatted = data.map((u: any) => ({
        id: u.genre_id,
        name: u.genre_name,
        createdAt: u.created_at,
      }));

      setGenres(formatted);
    } catch (err) {
      alert("Error searching genre");
    }
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentGenres = genres.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(genres.length / recordsPerPage);

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
          >
            Add New Genre
          </button>

          <div
            className="modal fade"
            id="exampleModaladd"
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">
                    Add Genre
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <h6>Genre Name</h6>
                  <input
                    type="text"
                    className="w-100 border border-secondary-subtle rounded-2"
                    value={addingGenre}
                    onChange={(e) => setAddingGenre(e.target.value)}
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

      <div className="rounder rounder-10 mt-3">
        <div className="d-flex">
          <h6 className="m-0 d-none d-lg-block">All Genres</h6>
          <div className="input-group ms-auto" style={{ width: "400px" }}>
            <input
              type="text"
              className="form-control rounded-start-pill"
              style={{ fontSize: "10px" }}
              placeholder="Tìm kiếm..."
              suppressHydrationWarning={true}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="btn rounder-end-pill border ">
              <p className="p-0 m-0 " onClick={() => seach(searchText)}>
                Search
              </p>
            </button>
          </div>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr className="table-secondary">
            <th>Id</th>
            <th>Genre Name</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentGenres.map((genre) => (
            <tr key={genre.id}>
              <th scope="row">{genre.id}</th>
              <td>{genre.name}</td>
              <td>{new Date(genre.createdAt).toLocaleDateString()}</td>
              <td className="d-flex">
                <div className="dropdown">
                  <button
                    className="btn btn-light"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fa-solid fa-ellipsis"></i>
                  </button>

                  <ul className="dropdown-menu">
                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => {
                          setEditingGenre(genre);
                          setEditName(genre.name);
                        }}
                      >
                        Edit
                      </button>
                    </li>

                    <li>
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => handleDelete(genre.id)}
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

                  <div
                    className="modal fade"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h1 className="modal-title fs-5">Edit Genre</h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                          ></button>
                        </div>

                        <div className="modal-body">
                          <h6>Genre Name</h6>
                          <input
                            type="text"
                            className="w-100 border border-secondary-subtle rounded-2"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
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

      <div className="bottom-table d-flex align-items-center">
        <div className="me-auto d-none d-lg-block">
          {indexOfFirstRecord + 1}-{Math.min(indexOfLastRecord, genres.length)}{" "}
          / {genres.length}
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
                  className={`page-item ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
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
                className={`page-item ${
                  currentPage === totalPages ? "disabled" : ""
                }`}
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
