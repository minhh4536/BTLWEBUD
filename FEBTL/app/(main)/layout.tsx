"use client";
import { useEffect, useState } from "react";
import { getAllGenres } from "@/services/genreService";
import "bootstrap/dist/css/bootstrap.min.css";
import BootstrapClient from "@/components/BootstrapClient";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../globals.css";

type Genre = {
  genre_id: number;
  genre_name: string;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [genres, setGenres] = useState<Genre[]>([]);
  useEffect(() => {
    try {
      getAllGenres().then((data) => {
        setGenres(data);
      });
    } catch (err) {
      console.error("Failed to fetch genres:", err);
    }
  }, []);
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
        <header>
          <nav className="navbar navbar-expand-lg bg-body-tertiary">
            <div className="container-fluid">
              <a className="navbar-brand" href="/home">
                <img src="cgvlogo.png" alt="Logo" />
              </a>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Movies
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="/comingsoon">
                          Movies coming soon
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/showingnow">
                          Movie is showing
                        </a>
                      </li>
                    </ul>
                  </li>

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Genres
                    </a>
                    <ul className="dropdown-menu">
                      {genres.map((genre) => (
                        <li key={genre.genre_id}>
                          <a
                            className="dropdown-item"
                            href={`/genres/${genre.genre_id}`}
                          >
                            {genre.genre_name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Theaters
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="/Alltheaters">
                          All theaters
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/Specialtheaters">
                          Special theaters
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/3Dtheaters">
                          3D theaters
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Member
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          CGV Account
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          CGV Membership
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      Cultureplex
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="/theaterrental">
                          Theater rental / group tickets
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="/rules">
                          CGV Rules
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <form className="d-flex" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search movies..."
                    aria-label="Search"
                  />
                  <button className="btn btn-outline-danger " type="submit">
                    Search
                  </button>
                </form>
              </div>
            </div>
          </nav>
        </header>

        <main>{children}</main>

        <footer>
          <div className="container">
            <div className="row">
              <div className="col-md-3 col-sm-12 p-4 text-dark">
                <h5>Contact Us</h5>
                <p>
                  Address: 123 CGV Street, City, Country
                  <br />
                  Phone: +1 234 567 890
                  <br />
                  Email: info@cgv.vn
                </p>
              </div>
              <div className="col-md-3 col-sm-12 p-4">
                <h5>Terms of use</h5>
                <a href="#" className="me-3 text-decoration-none text-dark">
                  General Terms
                </a>
                <br />
                <a href="#" className="me-3 text-decoration-none text-dark ">
                  Transaction Terms
                </a>
                <br />
                <a href="#" className="me-3 text-decoration-none text-dark">
                  Payment Policy
                </a>
                <br />
                <a href="#" className="me-3 text-decoration-none text-dark">
                  Chính Sách Bảo Mật
                </a>
                <br />
                <a href="/rules" className="text-decoration-none text-dark">
                  CGV Rules
                </a>
              </div>
              <div className="col-md-3 col-sm-12 p-4">
                <h5>Follow Us</h5>
                <a href="#" className="me-3">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="me-3">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="me-3">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="me-3">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <img
                  src="/bocongthuong.png"
                  alt="Bộ Công Thương"
                  className="img-fluid"
                />
              </div>
              <div className="col-md-3 col-sm-12 p-4">
                <h5 className="text-dark">Customer care</h5>
                <p className="text-dark">
                  Hotline: 1900 6017 <br />
                </p>
                <p className="text-dark">Working Hours: 8:00 - 22:00</p>
                <p className="text-dark">Support Email: hoidap@cgv.vn</p>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
