CREATE DATABASE movie_booking;
USE movie_booking;

CREATE TABLE UserRoles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255)
);

CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    role_id INT NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    status ENUM('active','inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (role_id) REFERENCES UserRoles(role_id)
);

CREATE TABLE UserProfiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(150),
    phone VARCHAR(15),
    email VARCHAR(100),
    date_of_birth DATE,
    gender ENUM('male','female','other'),
    
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE Movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    release_date DATE,
    country VARCHAR(100),
    director VARCHAR(150),
    actors TEXT,
    poster VARCHAR(255),
    trailer_url VARCHAR(255),
    genre_id INT,
    status ENUM('coming','showing','ended') DEFAULT 'coming',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id)
);

CREATE TABLE Theaters (
    theater_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(255),
    phone VARCHAR(15),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Rooms (
    room_id INT AUTO_INCREMENT PRIMARY KEY,
    theater_id INT NOT NULL,
    room_name VARCHAR(100) NOT NULL,
    total_seats INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (theater_id) REFERENCES Theaters(theater_id)
);

CREATE TABLE Seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    seat_type ENUM('normal','vip') DEFAULT 'normal',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    UNIQUE (room_id, seat_number),
    FOREIGN KEY (room_id) REFERENCES Rooms(room_id)
);

CREATE TABLE Showtimes (
    showtime_id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    room_id INT NOT NULL,
    show_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    format ENUM('2D','3D','IMAX') DEFAULT '2D',
    price DECIMAL(10,2) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id),
    FOREIGN KEY (room_id) REFERENCES Rooms(room_id)
);

CREATE TABLE Bookings (
    booking_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_code VARCHAR(20) NOT NULL UNIQUE,
    showtime_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status ENUM('pending','paid','cancelled') DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (showtime_id) REFERENCES Showtimes(showtime_id)
);

CREATE TABLE BookingDetails (
    booking_detail_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    seat_id INT NOT NULL,
	showtime_id INT NOT NULL,
    UNIQUE (booking_id, seat_id),
    UNIQUE (showtime_id, seat_id),
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id),
    FOREIGN KEY (seat_id) REFERENCES Seats(seat_id),
    FOREIGN KEY (showtime_id) REFERENCES Showtimes(showtime_id)
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_method ENUM('momo','vnpay','cash') NOT NULL,
    payment_status ENUM('pending','success','failed') DEFAULT 'pending',
    transaction_code VARCHAR(100),
    payment_date DATETIME,
    
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id)
);

# Dữ liệu mẫu 
select * from Users;
select * from UserProfiles;

INSERT INTO UserRoles (role_name, description) VALUES
('admin', 'Quản trị hệ thống, toàn quyền'),
('staff', 'Nhân viên rạp, quản lý vé và thanh toán'),
('customer', 'Khách hàng đặt vé');

INSERT INTO Users (role_id, username, password) VALUES
(1, 'admin', '123456'),
(2, 'staff01', '123456'),
(3, 'customer01', '123456');

INSERT INTO UserProfiles (user_id, full_name, phone, email, gender) VALUES
(1, 'Administrator', '0900000000', 'admin@movie.com', 'male'),
(2, 'Nguyen Van Staff', '0900000001', 'staff@movie.com', 'male'),
(3, 'Tran Thi Customer', '0900000002', 'customer@gmail.com', 'female');

INSERT INTO Genres (genre_name) VALUES
('Hành động'),
('Kinh dị'),
('Tình cảm');

INSERT INTO Movies 
(title, description, duration, release_date, country, director, actors, poster, trailer_url, genre_id, status)
VALUES
('Avengers: Endgame', 'Biệt đội siêu anh hùng cứu thế giới', 180, '2019-04-26', 'USA', 
'Anthony Russo', 'Robert Downey Jr, Chris Evans', 
'avengers.jpg', 'https://youtube.com/trailer1', 1, 'showing'),

('The Nun', 'Ác quỷ Valak quay trở lại', 120, '2023-10-10', 'USA',
'Michael Chaves', 'Taissa Farmiga', 
'nun.jpg', 'https://youtube.com/trailer2', 2, 'showing');

INSERT INTO Theaters (name, address, phone) VALUES
('CGV Vincom', 'Vincom Plaza, Hà Nội', '0241234567');

INSERT INTO Rooms (theater_id, room_name, total_seats) VALUES
(1, 'Phòng 1', 20);

INSERT INTO Seats (room_id, seat_number, seat_type) VALUES
(1,'A1','normal'),
(1,'A2','normal'),
(1,'A3','normal'),
(1,'A4','normal'),
(1,'A5','vip'),
(1,'A6','vip'),
(1,'A7','normal'),
(1,'A8','normal'),
(1,'A9','normal'),
(1,'A10','normal'),

(1,'B1','normal'),
(1,'B2','normal'),
(1,'B3','normal'),
(1,'B4','normal'),
(1,'B5','vip'),
(1,'B6','vip'),
(1,'B7','normal'),
(1,'B8','normal'),
(1,'B9','normal'),
(1,'B10','normal');

INSERT INTO Showtimes 
(movie_id, room_id, show_date, start_time, end_time, format, price)
VALUES
(1, 1, '2026-03-05', '18:00:00', '21:00:00', '2D', 100000),
(2, 1, '2026-03-05', '21:30:00', '23:30:00', '2D', 90000);





ALTER TABLE Users
ADD COLUMN email VARCHAR(100) UNIQUE AFTER username;

UPDATE Users u
JOIN UserProfiles p ON u.user_id = p.user_id
SET u.email = p.email;

ALTER TABLE Users
MODIFY email VARCHAR(100) NOT NULL UNIQUE;

ALTER TABLE Users
MODIFY email VARCHAR(100) NOT NULL UNIQUE;
