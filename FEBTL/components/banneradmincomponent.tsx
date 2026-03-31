"use client";
import { useEffect, useState } from "react";
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  BannerDTO,
} from "@/services/bannerService"; // giả sử bạn đã có bannerService
import banner from "@/app/(admin)/banner/page";

export default function BannerTable() {
  const [banners, setBanners] = useState<any[]>([]);

  const [editingBanner, setEditingBanner] = useState<BannerDTO | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string | undefined>(
    undefined,
  );
  const [editvt, setEditvt] = useState(0);

  const [editLink, setEditLink] = useState("");
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");

  const [addingTitle, setAddingTitle] = useState("");
  const [addingImage, setAddingImage] = useState<File | null>(null);
  const [addingLink, setAddingLink] = useState("");
  const [addingStatus, setAddingStatus] = useState<"active" | "inactive">(
    "active",
  );
  const [addingvt, setAddingvt] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await getAllBanners();
        setBanners(data);
      } catch (err) {
        console.error(err);
        alert("Error loading banners");
      }
    };
    fetchBanners();
  }, []);

  const handleAdd = async () => {
    if (!addingTitle || !addingImage) return alert("Title & Image required");

    const formData = new FormData();
    formData.append("title", addingTitle);
    formData.append("image", addingImage);
    formData.append("link", addingLink);
    formData.append("status", addingStatus);
    formData.append("sort_order", addingvt.toString());
    try {
      console.log("Adding banner with data:", {
        title: addingTitle,
        image: addingImage,
        link: addingLink,
        status: addingStatus,
        sort_order: addingvt,
      });
      await createBanner(formData);

      alert("Banner added successfully!");
      const data = await getAllBanners();
      setBanners(data);
      // Reset form
      setAddingTitle("");
      setAddingImage(null);
      setAddingLink("");
      setAddingStatus("active");
      setAddingvt(0);
    } catch (err) {
      alert("Error adding banner");
    }
  };

  const handleSave = async () => {
    if (!editingBanner || !editTitle) return;

    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("link", editLink);
    formData.append("status", editStatus);
    formData.append("sort_order", editvt.toString());

    if (editImage instanceof File) {
      formData.append("image", editImage);
    } else {
      formData.append("keepImage", "true");
    }

    try {
      await updateBanner(editingBanner.banner_id, formData);
      const data = await getAllBanners();
      setBanners(data);
      alert("Banner updated successfully!");
    } catch (err) {
      alert("Error updating banner");
    }
  };

  const handleDelete = async (id: number) => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      await deleteBanner(id);
      setBanners((prev) => prev.filter((b) => b.banner_id !== id));
      alert("Banner deleted successfully!");
    } catch (err) {
      alert("Error deleting banner");
    }
  };

  return (
    <>
      <div className="d-flex mb-3">
        <h4>Manage Banners</h4>
        <button
          type="button"
          className="btn btn-secondary ms-auto"
          data-bs-toggle="modal"
          data-bs-target="#addBannerModal"
        >
          Add Banner
        </button>
      </div>

      <div
        className="modal fade"
        id="addBannerModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Banner</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <h6>Title</h6>
              <input
                type="text"
                className="w-100 border rounded-2"
                value={addingTitle}
                onChange={(e) => setAddingTitle(e.target.value)}
              />

              <h6 className="mt-2">Image</h6>
              <input
                type="file"
                accept="image/*"
                className="w-100 border rounded-2"
                onChange={(e) => setAddingImage(e.target.files?.[0] || null)}
              />

              <h6 className="mt-2">Link</h6>
              <input
                type="text"
                className="w-100 border rounded-2"
                value={addingLink}
                onChange={(e) => setAddingLink(e.target.value)}
              />

              <h6 className="mt-2">Status</h6>
              <select
                className="form-select"
                value={addingStatus}
                onChange={(e) =>
                  setAddingStatus(e.target.value as "active" | "inactive")
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <input
                type="number"
                className="w-100 border rounded-2"
                value={addingvt}
                onChange={(e) => setAddingvt(parseInt(e.target.value) || 0)}
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

      {/* Banner Table */}
      <table className="table mt-3">
        <thead className="table-secondary">
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Link</th>
            <th>Status</th>
            <th>Created At</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => (
            <tr key={banner.banner_id}>
              <td>{banner.banner_id}</td>
              <td>
                {banner.image && (
                  <img
                    src={banner.image}
                    alt={banner.title ?? "banner"}
                    style={{
                      width: "150px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                  />
                )}
              </td>
              <td>{banner.title}</td>
              <td>{banner.link || "-"}</td>
              <td>{banner.status}</td>
              <td>
                {banner.created_at
                  ? new Date(banner.created_at).toLocaleDateString()
                  : "-"}
              </td>
              <td>
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
                        data-bs-target="#editBannerModal"
                        onClick={() => {
                          setEditingBanner(banner);
                          setEditTitle(banner.title ?? "");
                          setEditLink(banner.link || "");
                          setEditStatus(
                            (banner.status as unknown as
                              | "active"
                              | "inactive") || "active",
                          );
                          setEditImage(null);
                          setEditImageUrl(banner.image ?? undefined);
                          setEditvt(banner.sort_order || 0);
                        }}
                      >
                        Edit
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleDelete(banner.banner_id)}
                      >
                        Delete
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Banner Modal */}
      <div
        className="modal fade"
        id="editBannerModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Banner</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <h6>Title</h6>
              <input
                type="text"
                className="w-100 border rounded-2"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />

              <h6 className="mt-2">Image</h6>
              {editImageUrl && !editImage && (
                <img
                  src={editImageUrl}
                  alt="banner"
                  style={{
                    width: "150px",
                    height: "70px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
              )}
              {editImage && (
                <img
                  src={URL.createObjectURL(editImage)}
                  alt="banner"
                  style={{
                    width: "150px",
                    height: "70px",
                    objectFit: "cover",
                    marginBottom: "10px",
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                className="w-100 border rounded-2"
                onChange={(e) => setEditImage(e.target.files?.[0] || null)}
              />

              <h6 className="mt-2">Link</h6>
              <input
                type="text"
                className="w-100 border rounded-2"
                value={editLink}
                onChange={(e) => setEditLink(e.target.value)}
              />

              <h6 className="mt-2">Status</h6>
              <select
                className="form-select"
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(e.target.value as "active" | "inactive")
                }
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <h6 className="mt-2">Sort Order</h6>
              <input
                type="number"
                className="w-100 border rounded-2"
                value={editvt}
                onChange={(e) => setEditvt(parseInt(e.target.value) || 0)}
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
    </>
  );
}
