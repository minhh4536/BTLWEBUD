"use client";

import LoginForm from "@/components/loginform";

export default function LoginPage() {
  // Hàm gửi dữ liệu lên backend
  const Login = async (username: string, password: string) => {
    try {
      //Res-Start
      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      //Res-End

      if (!res.ok) {
        throw new Error("Login failed");
      }

      // Chuyển hướng sau khi đăng nhập thành công
      alert("Login successful!");
      window.location.href = "/about";
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  return <LoginForm onLogin={Login} />;
}
