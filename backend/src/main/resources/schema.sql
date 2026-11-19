-- PostgreSQL Table Schema for Invitation System (Niên Khóa 2022 – 2026)

-- 1. Bảng lưu trữ thiệp mời tùy biến theo từng liên kết khác nhau (code)
CREATE TABLE IF NOT EXISTS invitations (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) UNIQUE NOT NULL,
    recipient_name VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255) DEFAULT 'Hà Lê Tín',
    guest_group VARCHAR(50) DEFAULT 'friends',
    custom_message TEXT,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(50),
    event_title VARCHAR(255) DEFAULT 'LỄ TỐT NGHIỆP ĐẠI HỌC',
    event_date VARCHAR(100) DEFAULT 'Thứ Bảy, 28 Tháng 11, 2026',
    event_time VARCHAR(100) DEFAULT '09:30 – 13:30',
    event_venue VARCHAR(255) DEFAULT 'Hội trường A5, Trường Đại học Bách Khoa TP. Hồ Chí Minh',
    event_address VARCHAR(255) DEFAULT '268 Lý Thường Kiệt, Phường Diên Hồng, TP. Hồ Chí Minh',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invitations_code ON invitations(code);

-- 2. Bảng lưu trữ phản hồi của khách mời (RSVP)
CREATE TABLE IF NOT EXISTS attendees (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    attending BOOLEAN NOT NULL DEFAULT TRUE,
    guests_count INT DEFAULT 1,
    guests_count_desc VARCHAR(100),
    guest_group VARCHAR(50),
    photo_slot VARCHAR(255),
    grad_name VARCHAR(255) DEFAULT 'Hà Lê Tín',
    notes TEXT,
    confirmation_code VARCHAR(100) UNIQUE,
    email_sent BOOLEAN DEFAULT FALSE,
    invitation_code VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attendees_email ON attendees(email);
CREATE INDEX IF NOT EXISTS idx_attendees_conf_code ON attendees(confirmation_code);
