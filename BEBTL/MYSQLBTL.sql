DROP DATABASE IF EXISTS movie_booking;
CREATE DATABASE movie_booking;
USE movie_booking;

-- ==========================================
-- 1. QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN
-- ==========================================
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
    email VARCHAR(100),
    status ENUM('active','inactive') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES UserRoles(role_id)
);

CREATE TABLE UserProfiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    full_name VARCHAR(150),
    phone VARCHAR(15),
    date_of_birth DATE,
    gender ENUM('male','female','other'),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

-- ==========================================
-- 2. QUẢN LÝ PHIM & THÔNG TIN LIÊN QUAN
-- ==========================================
CREATE TABLE Genres (
    genre_id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(100) NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Actors (
    actor_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    avatar VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Directors (
    director_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    release_date DATE,
    country VARCHAR(100),
    poster VARCHAR(255),
    trailer_url VARCHAR(255),
    status ENUM('coming','showing','ended') DEFAULT 'coming',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Movie_Genres (
    movie_id INT,
    genre_id INT,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES Genres(genre_id) ON DELETE CASCADE
);

CREATE TABLE Movie_Actors (
    movie_id INT,
    actor_id INT,
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES Actors(actor_id) ON DELETE CASCADE
);

CREATE TABLE Movie_Directors (
    movie_id INT,
    director_id INT,
    PRIMARY KEY (movie_id, director_id),
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (director_id) REFERENCES Directors(director_id) ON DELETE CASCADE
);

-- ==========================================
-- 3. QUẢN LÝ RẠP, PHÒNG & GHẾ
-- ==========================================
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
    FOREIGN KEY (theater_id) REFERENCES Theaters(theater_id) ON DELETE CASCADE
);

CREATE TABLE SeatTypes (
    seat_type_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE, -- Thêm UNIQUE để tránh trùng loại ghế
    surcharge DECIMAL(10,2) DEFAULT 0
);

CREATE TABLE Seats (
    seat_id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    seat_number VARCHAR(10) NOT NULL,
    seat_type_id INT,
    status ENUM('active', 'maintenance', 'hidden') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES Rooms(room_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_type_id) REFERENCES SeatTypes(seat_type_id),
    CONSTRAINT unique_seat_room UNIQUE (room_id, seat_number) -- Ràng buộc UNIQUE cho ghế
);

-- ==========================================
-- 4. SUẤT CHIẾU & VÉ (TỐI ƯU CASCADE)
-- ==========================================
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
    FOREIGN KEY (movie_id) REFERENCES Movies(movie_id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES Rooms(room_id) ON DELETE CASCADE
);

CREATE TABLE Tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    showtime_id INT NOT NULL,
    seat_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL, -- Giá vé thực tế
    status ENUM('available','reserved','sold') DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tickets_showtimes FOREIGN KEY (showtime_id) REFERENCES Showtimes(showtime_id) ON DELETE CASCADE,
    FOREIGN KEY (seat_id) REFERENCES Seats(seat_id) ON DELETE CASCADE
);

-- ==========================================
-- 5. ĐẶT VÉ & THANH TOÁN (TỐI ƯU CỘT)
-- ==========================================
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
    ticket_id INT NOT NULL,
    price DECIMAL(10,2), -- Chỉ giữ lại ticket_id, seat/showtime lấy qua ticket
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id)
);

CREATE TABLE Payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    payment_method ENUM('momo','vnpay','cash') NOT NULL,
    payment_status ENUM('pending','success','failed') DEFAULT 'pending',
    transaction_code VARCHAR(100),
    payment_date DATETIME,
    FOREIGN KEY (booking_id) REFERENCES Bookings(booking_id) ON DELETE CASCADE
);

CREATE TABLE Banners (
    banner_id INT AUTO_INCREMENT PRIMARY KEY, 
    image VARCHAR(500),
    link VARCHAR(500),
    status TINYINT(1),
    sort_order INT, 
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP 
);

-- ==========================================
-- 6. STORED PROCEDURE (SỬA LỖI LOGIC)
-- ==========================================
DELIMITER $$

CREATE PROCEDURE GenerateTickets(IN p_showtime_id INT)
BEGIN
    DECLARE v_room_id INT;
    DECLARE v_base_price DECIMAL(10,2);
    
    -- Lấy thông tin phòng và giá gốc từ suất chiếu
    SELECT room_id, price INTO v_room_id, v_base_price 
    FROM Showtimes 
    WHERE showtime_id = p_showtime_id;

    -- Tự động tạo vé cho tất cả ghế active trong phòng đó
    INSERT INTO Tickets (showtime_id, seat_id, price, status)
    SELECT 
        p_showtime_id, 
        s.seat_id, 
        (v_base_price + st.surcharge), 
        'available'
    FROM Seats s
    JOIN SeatTypes st ON s.seat_type_id = st.seat_type_id
    WHERE s.room_id = v_room_id 
      AND s.status = 'active';
      
END $$

DELIMITER ;

select * from Seattypes

