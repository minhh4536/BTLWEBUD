"use client";
import { useState } from "react";
import { login, register } from "@/services/authService";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login Form States
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register Form States
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regDateOfBirth, setRegDateOfBirth] = useState("");
  const [regGender, setRegGender] = useState<"male" | "female" | "other">(
    "other",
  );
  const [regLoading, setRegLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginUsername || !loginPassword)
      return alert("Vui lòng nhập đầy đủ thông tin");

    setLoginLoading(true);
    try {
      const data = await login(loginUsername, loginPassword);
      alert("Đăng nhập thành công!");
      console.log("Token:", data.token);
      localStorage.setItem("token", data.token);
      if (data.user.role_id === 1) {
        localStorage.setItem("role", "admin");
        window.location.href = "/dashboard";
      } else if (data.user.role_id === 3) {
        localStorage.setItem("role", "user");
        window.location.href = "/home";
      }
    } catch (err: any) {
      alert(err.message || "Đăng nhập thất bại");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regUsername || !regEmail || !regPassword) {
      return alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
    }

    setRegLoading(true);
    try {
      await register(
        regUsername,
        regEmail,
        regPassword,
        regFullName,
        regPhone,
        regDateOfBirth || undefined,
        regGender,
      );
      alert("Đăng ký thành công! Bạn có thể đăng nhập ngay bây giờ.");
      setActiveTab("login"); // Chuyển sang tab Login sau khi đăng ký thành công
      // Reset form
      setRegUsername("");
      setRegEmail("");
      setRegPassword("");
      setRegFullName("");
      setRegPhone("");
      setRegDateOfBirth("");
    } catch (err: any) {
      alert(err.message || "Đăng ký thất bại");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card border-0 shadow-sm rounded-4">
            <div className="card-body p-4">
              {/* Tabs */}
              <ul
                className="nav nav-tabs nav-fill mb-4"
                id="authTab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                    onClick={() => setActiveTab("login")}
                    type="button"
                  >
                    Đăng nhập
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === "register" ? "active" : ""}`}
                    onClick={() => setActiveTab("register")}
                    type="button"
                  >
                    Đăng ký
                  </button>
                </li>
              </ul>

              {/* Tab Login */}
              {activeTab === "login" && (
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                      type="text"
                      className="form-control border-secondary-subtle rounded-3"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control border-secondary-subtle rounded-3"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-3 py-2 fw-medium"
                    disabled={loginLoading}
                  >
                    {loginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </form>
              )}

              {/* Tab Register */}
              {activeTab === "register" && (
                <form onSubmit={handleRegister}>
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="form-label">
                        Tên đăng nhập <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control border-secondary-subtle rounded-3"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">
                        Email <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        className="form-control border-secondary-subtle rounded-3"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">
                        Mật khẩu <span className="text-danger">*</span>
                      </label>
                      <input
                        type="password"
                        className="form-control border-secondary-subtle rounded-3"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-12 mb-3">
                      <label className="form-label">Họ và tên</label>
                      <input
                        type="text"
                        className="form-control border-secondary-subtle rounded-3"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Số điện thoại</label>
                      <input
                        type="tel"
                        className="form-control border-secondary-subtle rounded-3"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">Ngày sinh</label>
                      <input
                        type="date"
                        className="form-control border-secondary-subtle rounded-3"
                        value={regDateOfBirth}
                        onChange={(e) => setRegDateOfBirth(e.target.value)}
                      />
                    </div>

                    <div className="col-12 mb-4">
                      <label className="form-label">Giới tính</label>
                      <select
                        className="form-select border-secondary-subtle rounded-3"
                        value={regGender}
                        onChange={(e) =>
                          setRegGender(
                            e.target.value as "male" | "female" | "other",
                          )
                        }
                      >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-3 py-2 fw-medium"
                    disabled={regLoading}
                  >
                    {regLoading ? "Đang đăng ký..." : "Đăng ký"}
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="text-center mt-3 text-muted small">
            Movie Booking System © 2026
          </div>
        </div>
      </div>
    </div>
  );
}
