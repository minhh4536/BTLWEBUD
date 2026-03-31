const BASE_URL = "http://localhost:3000/auth";

export type UserDTO = {
  user_id: number;
  username: string;
  email: string;
  role_id: number;
};

export type LoginResponseDTO = {
  token: string;
  user: UserDTO;
};

export const register = async (
  username: string,
  email: string,
  password: string,
  full_name?: string,
  phone?: string,
  date_of_birth?: string,
  gender?: "male" | "female" | "other",
) => {
  const res = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username,
      email,
      password,
      full_name,
      phone,
      date_of_birth,
      gender,
    }),
  });
  if (!res.ok) throw new Error("Register failed");
  return await res.json();
};

export const login = async (
  username: string,
  password: string,
): Promise<LoginResponseDTO> => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  let text = await res.text();
  console.log("Login response body:", text);

  let data: any;
  try {
    data = JSON.parse(text);
  } catch (err) {
    data = {};
    console.warn("Không parse được JSON từ server, có thể HTML");
  }

  if (!res.ok) {
    const message = data?.message || `Server trả lỗi ${res.status}`;
    throw new Error(message);
  }

  return data;
};
