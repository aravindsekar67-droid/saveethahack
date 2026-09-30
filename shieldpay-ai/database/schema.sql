-- =======================================================
-- ShieldPay AI - Database Schema Definition (MySQL 8.0+)
-- Challenge VH-S02: Detecting Digital Payment Scams Before Money Is Sent
-- =======================================================

CREATE DATABASE IF NOT EXISTS shieldpay CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE shieldpay;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL DEFAULT 'USER',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. Scans Table
CREATE TABLE IF NOT EXISTS scans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NULL,
    message TEXT NULL,
    amount DECIMAL(12, 2) NULL,
    payment_method VARCHAR(50) NULL,
    sender VARCHAR(150) NULL,
    sender_type VARCHAR(50) NULL,
    url VARCHAR(500) NULL,
    reason TEXT NULL,
    risk_score INT NOT NULL,
    risk_level VARCHAR(20) NOT NULL,
    scam_category VARCHAR(100) NULL,
    confidence VARCHAR(20) DEFAULT 'HIGH',
    explanation TEXT NULL,
    recommendation TEXT NULL,
    privacy_mode BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_scans_user FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_scans_risk_level ON scans(risk_level);
CREATE INDEX idx_scans_category ON scans(scam_category);
CREATE INDEX idx_scans_created_at ON scans(created_at);

-- 3. Risk Signals Table
CREATE TABLE IF NOT EXISTS risk_signals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scan_id BIGINT NOT NULL,
    signal_name VARCHAR(100) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    score INT NOT NULL,
    description TEXT NULL,
    CONSTRAINT fk_signals_scan FOREIGN KEY (scan_id) REFERENCES scans (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_signals_scan_id ON risk_signals(scan_id);
CREATE INDEX idx_signals_name ON risk_signals(signal_name);

-- 4. Scam Patterns Table
CREATE TABLE IF NOT EXISTS scam_patterns (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    keyword VARCHAR(200) NOT NULL,
    weight INT NOT NULL DEFAULT 10,
    enabled BOOLEAN NOT NULL DEFAULT TRUE
) ENGINE=InnoDB;

-- 5. Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    scan_id BIGINT NOT NULL,
    useful BOOLEAN NOT NULL,
    actual_status VARCHAR(20) NULL,
    comments TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_feedback_scan FOREIGN KEY (scan_id) REFERENCES scans (id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_feedback_scan_id ON feedback(scan_id);

-- 6. Admin Events Table
CREATE TABLE IF NOT EXISTS admin_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
