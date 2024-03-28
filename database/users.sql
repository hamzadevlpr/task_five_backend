-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 28, 2024 at 02:32 PM
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
-- Database: `userdata`
--

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `email` varchar(30) NOT NULL,
  `password` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `email`, `password`) VALUES
(25, 'vekasis713@shaflyn.com', 'Malik786**'),
(26, 'vekasisa713@shaflyn.com', 'vekasis713**A'),
(27, 'vekasiasds713@shaflyn.com', 'Hamza786**'),
(31, 'm.hamza@xeverse.io', 'Pakistan786**'),
(32, 'muhammadhamzamlk@gmail.com', 'Hamza786**'),
(33, 'hamzamalikllc@gmail.com', 'Xeverse786**'),
(34, 'vekasiss713@shaflyn.com', '$2b$10$ET70.5uBmCxMYYli0zhtb.K/73FVjquVNIu/steQ6j.ChtGtI0P..');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(40) NOT NULL,
  `name` varchar(30) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(12) NOT NULL,
  `dob` varchar(30) DEFAULT NULL,
  `hobby` varchar(30) NOT NULL,
  `street` varchar(30) NOT NULL,
  `country` varchar(30) NOT NULL,
  `city` varchar(30) NOT NULL,
  `state` varchar(30) NOT NULL,
  `postCode` int(10) NOT NULL,
  `userId` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `dob`, `hobby`, `street`, `country`, `city`, `state`, `postCode`, `userId`) VALUES
('70fb3206-6e65-4242-9e93-df1569769197', 'asd', 'hams@xeverse.io', '3625984712', '2008-05-26', '32asd', '23asdas23d', '323asdasd', '3asd3', 'asd23a3sd', 323232, '25'),
('8f18e75f-95f5-412d-835e-5799f0981cdf', 'asd', 'vekasis713@shaflyn.com', '3214569872', '1998-05-21', 'ads15', 'q1561s51', 'q51asd', '1521ad', '12', 123654, '25'),
('ae467496-23aa-47b7-a205-e3b45f75680d', 'asd', 'vekasis713@shaflyn.com', '3265987415', '2002-12-24', '123', '12', '21', '12', '21', 1221, '25'),
('f86db5fe-0259-4c7c-8ec3-2c984d1a91d1', 'Hamza Malik', 'hamza@gmail.com', '3215469852', '5255-03-12', '213', '213', '213', '213', '21', 123, '31'),
('d2b45f60-aa1b-42aa-af49-4fe7c8638c58', 'Ahsan', 'ahsan@xeverse.io', '3215664789', '2008-04-25', 'Hockey', 'Liyari', 'Pak', 'Karachi', 'Sindh', 74600, '31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
