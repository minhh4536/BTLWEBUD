"use client";

import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import BootstrapClient from "@/components/BootstrapClient";
import "../globals.css";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <BootstrapClient />
        <div className="container-fluid">
          <div className="row">
            <div className="d-md-none p-2">
              <button
                className="btn btn-dark"
                data-bs-toggle="offcanvas"
                data-bs-target="#sidebar"
              >
                ☰ Menu
              </button>
            </div>

            {/* Sidebar desktop */}
            <div
              className="col-md-2 bg-dark
             text-white min-vh-100 d-none d-md-block w-30"
            >
              <h4 className="p-3 fs-1 text-center">Admin</h4>

              <ul className="nav flex-column  p-2 fs-4">
                <li className="nav-item admin-btnmenu ">
                  <a className="nav-link text-white" href="/dashboard">
                    <i className="fa-solid fa-chart-line"></i> Dashboard
                  </a>
                </li>
                <li className="nav-item admin-btnmenu ">
                  <a className="nav-link text-white" href="/banner">
                    <i className="fa-solid fa-image"></i> Banners
                  </a>
                </li>
                <li className="nav-item admin-btnmenu ">
                  <a className="nav-link text-white" href="/bookings">
                    <i className="fa-solid fa-ticket"></i> Bookings
                  </a>
                </li>
                <li className="nav-item admin-btnmenu ">
                  <a className="nav-link text-white" href="/showtimes">
                    <i className="fa-solid fa-calendar"></i> Showtimes
                  </a>
                </li>
                <li className="nav-item admin-btnmenu ">
                  <a className="nav-link text-white" href="/movies">
                    <i className="fa-solid fa-clapperboard"></i> Movies
                  </a>
                </li>
                <li className="nav-item admin-btnmenu ">
                  <a className="nav-link text-white" href="/genres">
                    <i className="fa-solid fa-layer-group"></i> Genres
                  </a>
                </li>

                <li className="nav-item admin-btnmenu ">
                  <a className="nav-link text-white" href="/theaters">
                    <i className="fa-solid fa-video"></i> Theaters
                  </a>
                </li>
                <li className="nav-item admin-btnmenu ">
                  <a className="nav-link text-white" href="/rooms">
                    <i className="fas fa-door-open"></i> Rooms
                  </a>
                </li>
                <li className="nav-item admin-btnmenu ">
                  <a className="nav-link text-white" href="/seats">
                    <i className="fa-solid fa-couch"></i> Seats
                  </a>
                </li>
                <li className="nav-item admin-btnmenu ">
                  <a className="nav-link text-white" href="/users">
                    <i className="fa-solid fa-user"></i> Users
                  </a>
                </li>
              </ul>
            </div>

            {/* Offcanvas mobile */}
            <div
              className="offcanvas offcanvas-start"
              tabIndex={-1}
              id="sidebar"
            >
              <div className="offcanvas-header">
                <h5 className="offcanvas-title">Admin Menu</h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="offcanvas"
                ></button>
              </div>

              <div className="offcanvas-body">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link" href="/admin">
                      Dashboard
                    </a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="/admin/products">
                      Món ăn
                    </a>
                  </li>

                  <li className="nav-item">
                    <a className="nav-link" href="/admin/orders">
                      Hóa đơn
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Nội dung */}
            <div className="col-md-10 p-4">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
