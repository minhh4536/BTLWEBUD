const BASE_URL = "http://localhost:3000/banners";
const URL = "http://localhost:3000";

export type BannerDTO = {
  banner_id: number;
  title: string | null;
  image: string | null;
  link: string | null;
  status: number; // DB là số
  sort_order: number;
  created_at: string;
};

// GET ALL
export const getAllBanners = async (): Promise<any[]> => {
  const res = await fetch(`${BASE_URL}/all`);

  if (!res.ok) {
    const text = await res.text();
    console.error("Fetch error:", text);
    throw new Error("Fetch failed");
  }

  const banners: BannerDTO[] = await res.json();

  return banners.map((b) => ({
    ...b,
    title: b.title ?? "",
    image: b.image ? `${URL}${b.image}` : "",
    link: b.link ?? "",
    status: b.status === 1 ? "active" : "inactive", // convert tại đây
  }));
};

// CREATE
export const createBanner = async (formData: FormData) => {
  // convert status trước khi gửi
  const status = formData.get("status") === "active" ? "1" : "0";
  formData.set("status", status);

  const res = await fetch(`${BASE_URL}/create`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Create failed");
  return res.json();
};

// UPDATE
export const updateBanner = async (id: number, formData: FormData) => {
  const status = formData.get("status") === "active" ? "1" : "0";
  formData.set("status", status);

  const res = await fetch(`${BASE_URL}/update/${id}`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) throw new Error("Update failed");
};

// DELETE
export const deleteBanner = async (id: number) => {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Delete failed");
};
