-- WSC2024 TP08 Module A (P.M.) - "My France" backend schema + seed data
-- Run with: mysql -u root -p < sql/schema.sql

CREATE DATABASE IF NOT EXISTS wsc_mobile_app
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE wsc_mobile_app;

DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS auth_tokens;
DROP TABLE IF EXISTS diaries;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id            VARCHAR(36) PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE auth_tokens (
  token      VARCHAR(64) PRIMARY KEY,
  user_id    VARCHAR(36) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE diaries (
  diary_id              VARCHAR(36) PRIMARY KEY,
  diary_title            VARCHAR(255) NOT NULL,
  diary_main_text        VARCHAR(255) NOT NULL, -- relative resource path, e.g. resources/Musee d Orsay/d1.json
  diary_upload_datetime   DATETIME NOT NULL,
  diary_image             VARCHAR(255) NOT NULL, -- relative resource path
  diary_upload_username   VARCHAR(255) NOT NULL
);

CREATE TABLE favorites (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  user_id           VARCHAR(36) NOT NULL,
  diary_id          VARCHAR(36) NOT NULL,
  favorite_datetime DATETIME NOT NULL,
  UNIQUE KEY unique_user_diary (user_id, diary_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (diary_id) REFERENCES diaries(diary_id) ON DELETE CASCADE
);

-- Seed diaries. The first two IDs/titles match the examples given in the
-- official test project PDF so responses line up with the spec exactly.
INSERT INTO diaries (diary_id, diary_title, diary_main_text, diary_upload_datetime, diary_image, diary_upload_username) VALUES
('BA23617D-42DA-8C4A-F569-C1915B9B55B1', 'Brushstrokes of Time',
  'resources/Musee d Orsay/d1.json', '2023-03-01 12:30:30',
  'resources/Musee d Orsay/1.jpg', 'Zachary Butler'),

('17B9C94E-F829-6088-FA92-9A07EEA00A8E', 'Journey Through the Splendor of French Art',
  'resources/Musee d Orsay/d2.json', '2023-04-25 09:50:30',
  'resources/Musee d Orsay/3.jpg', 'Jake Clarke'),

('2F1A7C3B-5E2D-4B1A-9F3C-1D2E3F4A5B6C', 'Nice Trip in Paris',
  'resources/Efil/d3.json', '2024-08-24 00:05:00',
  'resources/Efil/1.jpg', 'Amelie Laurent'),

('9C8B7A6D-1122-4F3E-8899-AABBCCDDEEFF', 'An Afternoon at the Louvre',
  'resources/Louvre/d4.json', '2024-06-10 15:20:00',
  'resources/Louvre/1.jpg', 'Marc Dubois');
