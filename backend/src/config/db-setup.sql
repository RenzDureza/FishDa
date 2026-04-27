-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 27, 2026 at 04:01 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `isdaok`
--

-- --------------------------------------------------------

--
-- Table structure for table `scans`
--

CREATE TABLE `scans` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `fish_image_path` varchar(500) NOT NULL,
  `gill_image_path` varchar(500) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `scan_results`
--

CREATE TABLE `scan_results` (
  `id` int(11) NOT NULL,
  `scan_id` int(11) NOT NULL,
  `species` varchar(100) DEFAULT NULL,
  `species_confidence` decimal(5,2) DEFAULT NULL,
  `eye_score` decimal(5,2) DEFAULT NULL,
  `gill_score` decimal(5,2) DEFAULT NULL,
  `body_score` decimal(5,2) DEFAULT NULL,
  `overall_score` decimal(5,2) DEFAULT NULL,
  `overall_score_confidence` decimal(5,2) DEFAULT NULL,
  `quality_grade` enum('LOW','MEDIUM','HIGH') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'user',
  `created_at` datetime DEFAULT current_timestamp(),
  `is_verified` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`, `created_at`, `is_verified`, `updated_at`) VALUES
(1, 'ChillGuy', 'chillguy@gmail.com', '', 'user', '2026-04-26 14:18:15', 0, '2026-04-27 01:50:23'),
(2, 'Name1', 'Gh@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(3, 'John', 'xa@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(4, 'Cind', 'hasd1@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(5, 'Cwistopher', 'jasduyg@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(6, 'Hollow', 'ggaa@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(7, 'Knight', 'asdasdn@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(9, 'Andrian', 'jjgsdg@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(10, 'Liam', 'jjaqas@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(11, 'Mikey', 'oiuqp@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(12, 'Luffy', 'agqwjytrv@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(13, 'Manderson', 'jnkaslkj@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(14, 'Law', 'yurturq@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(15, 'Lmfao', 'jhqweb@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(16, 'Wishasih', 'kkkjlfda@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(17, 'Lopunny', 'hasdg@gmail.com', '', 'user', '2026-04-26 14:31:14', 0, '2026-04-27 01:50:23'),
(31, 'ttesti', 'johnalpha220@gmail.com', '$2b$10$w/Mht8nfZS0IvMd6iMTXv.PS6WjZbkaANKjIVr6DaQyFXWPvMjHMu', 'admin', '2026-04-25 21:51:21', 1, '2026-04-27 01:50:23');

-- --------------------------------------------------------

--
-- Table structure for table `user_tokens`
--

CREATE TABLE `user_tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('verification','reset','refresh') NOT NULL,
  `token` varchar(512) NOT NULL,
  `expires_at` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `scans`
--
ALTER TABLE `scans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `scan_results`
--
ALTER TABLE `scan_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `scan_id` (`scan_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `scans`
--
ALTER TABLE `scans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `scan_results`
--
ALTER TABLE `scan_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `user_tokens`
--
ALTER TABLE `user_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `scans`
--
ALTER TABLE `scans`
  ADD CONSTRAINT `scans_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `scan_results`
--
ALTER TABLE `scan_results`
  ADD CONSTRAINT `scan_results_ibfk_1` FOREIGN KEY (`scan_id`) REFERENCES `scans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_tokens`
--
ALTER TABLE `user_tokens`
  ADD CONSTRAINT `user_tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
