-- --------------------------------------------------------
-- Host:                         192.168.1.100
-- Server version:               10.1.23-MariaDB-9+deb9u1 - Raspbian 9.0
-- Server OS:                    debian-linux-gnueabihf
-- HeidiSQL Version:             9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping database structure for iot
CREATE DATABASE IF NOT EXISTS `iot` /*!40100 DEFAULT CHARACTER SET latin1 */;
USE `iot`;


-- Dumping structure for table iot.arealights
DROP TABLE IF EXISTS `arealights`;
CREATE TABLE IF NOT EXISTS `arealights` (
  `TLc` varchar(50) NOT NULL,
  `Scene` varchar(50) NOT NULL,
  `Area` int(10) unsigned NOT NULL,
  `InUse` tinyint(3) unsigned DEFAULT '1',
  PRIMARY KEY (`TLc`,`Scene`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.arealights: ~67 rows (approximately)
/*!40000 ALTER TABLE `arealights` DISABLE KEYS */;
REPLACE INTO `arealights` (`TLc`, `Scene`, `Area`, `InUse`) VALUES
	('Hollies-3', 'Alcove Off', 2, 0),
	('Hollies-3', 'Alcove On', 2, 0),
	('Hollies-3', 'Bay Off', 2, 0),
	('Hollies-3', 'Bay On', 2, 0),
	('Hollies-3', 'Centre Off', 2, 0),
	('Hollies-3', 'Centre On', 2, 0),
	('Hollies-3', 'Hall Dim Fade', 1, 0),
	('Hollies-3', 'Hall Dim PIR', 1, 0),
	('Hollies-3', 'Hall Off', 1, 0),
	('Hollies-3', 'Hall On', 1, 0),
	('Hollies-3', 'Hall Play', 1, 0),
	('Hollies-3', 'L Background', 2, 0),
	('Hollies-3', 'Living Off', 2, 0),
	('Hollies-3', 'Living On', 2, 0),
	('Hollies-3', 'Office Off', 3, 0),
	('Hollies-3', 'Office On', 3, 0),
	('Hollies-3', 'Reading', 2, 0),
	('Hollies-3', 'Strips Off', 2, 0),
	('Hollies-3', 'Watching TV', 2, 0),
	('Hollies-3', 'Watching TV+', 2, 0),
	('Hollies-4', 'Alcove Off', 2, 1),
	('Hollies-4', 'Alcove On', 2, 1),
	('Hollies-4', 'Bay Off', 2, 1),
	('Hollies-4', 'Bay On', 2, 1),
	('Hollies-4', 'Centre Off', 2, 1),
	('Hollies-4', 'Centre On', 2, 1),
	('Hollies-4', 'Hall Dim Fade', 1, 1),
	('Hollies-4', 'Hall Dim PIR', 1, 1),
	('Hollies-4', 'Hall Off', 1, 1),
	('Hollies-4', 'Hall On', 1, 1),
	('Hollies-4', 'Hall Play', 1, 1),
	('Hollies-4', 'L Background', 2, 1),
	('Hollies-4', 'Living Off', 2, 1),
	('Hollies-4', 'Living On', 2, 1),
	('Hollies-4', 'Office Dim', 3, 1),
	('Hollies-4', 'Office Off', 3, 1),
	('Hollies-4', 'Office On', 3, 1),
	('Hollies-4', 'Reading', 2, 1),
	('Hollies-4', 'Strips Off', 2, 1),
	('Hollies-4', 'Watching TV', 2, 1),
	('Hollies-4', 'Watching TV+', 2, 1),
	('Hollies-F', 'All Off', 4, 1),
	('Hollies-F', 'Boiler Off', 5, 1),
	('Hollies-F', 'Boiler On', 5, 1),
	('Hollies-F', 'Family Entrance', 4, 1),
	('Hollies-F', 'Family Low', 4, 1),
	('Hollies-F', 'Family Off', 4, 1),
	('Hollies-F', 'Family On', 4, 1),
	('Hollies-F', 'Toilet Off', 5, 1),
	('Hollies-F', 'Toilet On', 5, 1),
	('Hollies-F', 'Utility Off', 5, 1),
	('Hollies-F', 'Utility On', 5, 1),
	('Hollies-G', 'All OFF', 6, 1),
	('Hollies-G', 'Bench OFF', 6, 1),
	('Hollies-G', 'Bench ON', 6, 1),
	('Hollies-G', 'Door OFF', 6, 1),
	('Hollies-G', 'Door ON', 6, 1),
	('Hollies-G', 'Lathe OFF', 6, 1),
	('Hollies-G', 'Lathe ON', 6, 1),
	('Hollies-G', 'Log Store ON >', 7, 1),
	('Hollies-G', 'Logstore ON >', 7, 1),
	('Hollies-G', 'Minimum', 6, 1),
	('Hollies-G', 'Outside OFF', 6, 1),
	('Hollies-G', 'Outside ON >', 6, 1),
	('Hollies-G', 'Shelves ON', 6, 1),
	('Hollies-G', 'Toilet OFF', 6, 1),
	('Hollies-G', 'Toilet ON', 6, 1);
/*!40000 ALTER TABLE `arealights` ENABLE KEYS */;


-- Dumping structure for view iot.avtemp
DROP VIEW IF EXISTS `avtemp`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `avtemp` (
	`temp` INT(1) NOT NULL,
	`Day` INT(1) NOT NULL
) ENGINE=MyISAM;


-- Dumping structure for table iot.daysofweek
DROP TABLE IF EXISTS `daysofweek`;
CREATE TABLE IF NOT EXISTS `daysofweek` (
  `ID` tinyint(3) unsigned NOT NULL,
  `Name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.daysofweek: ~11 rows (approximately)
/*!40000 ALTER TABLE `daysofweek` DISABLE KEYS */;
REPLACE INTO `daysofweek` (`ID`, `Name`) VALUES
	(0, 'NoDay'),
	(1, 'Sunday'),
	(2, 'Monday'),
	(3, 'Tuesday'),
	(4, 'Wednesday'),
	(5, 'Thursday'),
	(6, 'Friday'),
	(7, 'Saturday'),
	(8, 'Weekend'),
	(9, 'Weekday'),
	(10, 'Anyday');
/*!40000 ALTER TABLE `daysofweek` ENABLE KEYS */;


-- Dumping structure for table iot.devices
DROP TABLE IF EXISTS `devices`;
CREATE TABLE IF NOT EXISTS `devices` (
  `DeviceID` varchar(50) NOT NULL,
  `Location` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Updates` int(4) unsigned NOT NULL DEFAULT '100',
  `Inputs` int(2) unsigned NOT NULL DEFAULT '0',
  `Outputs` int(2) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`DeviceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.devices: ~40 rows (approximately)
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
REPLACE INTO `devices` (`DeviceID`, `Location`, `Name`, `Updates`, `Inputs`, `Outputs`) VALUES
	('Hollies-F', 'Family', 'Hollies-F', 100, 0, 0),
	('Hollies-G', 'Garage', 'Hollies-G', 100, 0, 0),
	('Hollies-L', 'Lounge', 'Hollies-L', 100, 0, 0),
	('Hollies000000', 'Outside', 'Weather', 100, 0, 0),
	('Hollies11c554', 'Boiler Rm', 'Boiler Relays', 100, 0, 8),
	('Hollies11c785', 'zzz', 'Temperature Monitor', 100, 0, 0),
	('Hollies11cca1', 'Outside', 'Watering Controller', 100, 4, 0),
	('Hollies139e26', 'Porch', 'eMon2', 100, 0, 0),
	('Hollies26ef96', 'Boiler Rm', 'eMon', 100, 0, 0),
	('Hollies316b0', 'Utility', 'Level Control', 10, 0, 0),
	('Hollies4185f', 'Unknown', 'Wind Speed', 100, 0, 0),
	('Hollies7215c', 'Unknown', 'Temperature Monitor', 100, 0, 0),
	('Hollies7e600a', 'Porch', 'eMon', 100, 0, 0),
	('Hollies95c701', 'Spare', 'Extension Lead', 100, 0, 3),
	('Hollies95de2a', 'Spare', 'Sonoff Relay 1', 100, 0, 3),
	('Holliesa07e57', 'Spare', 'Temperature Monitor-1', 60, 0, 0),
	('Holliesa15b9d', 'Family', 'Temperature Monitor', 60, 0, 0),
	('Holliesa15be1', 'Test', 'Moisture', 100, 0, 0),
	('Holliesa1fab6', 'Test', 'Gate Sensor', 30, 0, 0),
	('Holliesa26c59', 'Outside', 'Hot Compost', 60, 0, 0),
	('Holliesa6975b', 'Outside', 'Light String', 100, 0, 0),
	('Holliesa69ec3', 'Boiler Rm', 'Boiler Control', 30, 6, 4),
	('Holliesb748c', 'Test', 'Wind Speed', 300, 0, 0),
	('Holliesc98', 'Log Store', 'Xmas Lights', 10, 1, 1),
	('Holliesd17a53', 'Spare', 'Temperature Monitor', 10, 0, 1),
	('Holliesd17b02', 'Unknown', 'Temperature Monitor', 100, 0, 0),
	('Holliesd2eb4f', 'Utility', 'MHRV', 60, 0, 0),
	('Holliesd2ebba', 'Portable', 'Temperature Monitor', 600, 0, 0),
	('Holliesd2ed1c', 'Office', 'Radiator', 30, 0, 5),
	('Holliesd2f2a3', 'Boiler Rm', 'Solar Control', 30, 0, 0),
	('Holliesd2f35e', 'Bedroom', 'Temperature Monitor', 120, 0, 5),
	('Holliesd2f6c5', 'Lounge', 'Woodburner Monitor', 100, 0, 0),
	('Holliesd2f6f0', 'Spare', 'Temp Relay', 100, 0, 4),
	('Holliesd2f754', 'Spare', 'Relay Controller', 100, 0, 4),
	('Holliesd2fa13', 'Outside', 'Pond Relay Controller', 20, 0, 5),
	('Holliesd81de4', 'Guest1', 'Rad Controller', 30, 0, 2),
	('Holliesd81ecc', 'Lounge', 'Radiator', 120, 0, 1),
	('Holliesd82273', 'Dining', 'Temperature Monitor', 60, 0, 1),
	('Holliese673f6', 'Hall', 'Temperature Monitor', 600, 0, 0),
	('Holliesf9092d', 'Lounge', 'Temperature Monitor', 20, 0, 0),
	('Holliesf9098e', 'Test', 'LED Wall', 100, 0, 0),
	('Holliesf909a3', 'Office', 'RF433', 100, 0, 0);
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;


-- Dumping structure for table iot.errordescriptions
DROP TABLE IF EXISTS `errordescriptions`;
CREATE TABLE IF NOT EXISTS `errordescriptions` (
  `type` tinytext NOT NULL,
  `Device` varchar(50) NOT NULL,
  `number` int(11) NOT NULL,
  `info` int(11) NOT NULL,
  `Description` varchar(100) DEFAULT NULL,
  KEY `Index 1` (`Device`,`type`(100),`number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.errordescriptions: ~35 rows (approximately)
/*!40000 ALTER TABLE `errordescriptions` DISABLE KEYS */;
REPLACE INTO `errordescriptions` (`type`, `Device`, `number`, `info`, `Description`) VALUES
	('error', 'Level Control', 51, -1, 'Has reconnected'),
	('error', 'Level Control', 1, -1, 'SET_MAX_PUMP_ON_WARNING'),
	('alarm', 'Level Control', 4, -1, 'Manual mode ON'),
	('alarm', 'Level Control', 5, -1, 'Manual mode OFF'),
	('alarm', 'Level Control', 3, -1, 'Still Flowing when pump off for 2S'),
	('alarm', 'Level Control', 1, -1, 'No flow for SET_NO_FLOW_AUTO_ERROR (10S) in Auto (flow)'),
	('alarm', 'Level Control', 6, -1, 'No flow for SET_NO_FLOW_AUTO_ERROR (10S) in Auto (seconds)'),
	('alarm', 'Level Control', 10, -1, 'Tank level out of range'),
	('alarm', 'Level Control', 155, 66, 'Test mode'),
	('error', 'Temperature Monitor', 51, -1, 'Has reconnected'),
	('error', 'Temperature Monitor', 56, -1, 'Temperature out of range'),
	('error', 'Temperature Monitor', 57, -1, 'DS18B20 CRC error'),
	('error', 'Boiler Control', 80, 0, 'Signal OB ON wehn emergency dump active'),
	('error', 'Boiler Control', 81, 0, 'Signal OB ON when BOTH circulations are ON'),
	('error', 'Boiler Control', 91, -1, 'TS TOP temperature is invalid'),
	('error', 'Boiler Control', 99, -1, 'Emergency heat dump'),
	('error', 'Boiler Control', 40, -1, 'Invalid WB_FLOW temperature '),
	('error', 'Boiler Control', 100, -1, 'Critical temperature not set'),
	('error', 'Boiler Control', 20, -1, 'DHW temperature low warning'),
	('error', 'Boiler Control', 20, -1, 'DHW temperature low'),
	('error', 'Boiler Control', 21, -1, 'CH temperature low warning'),
	('error', 'Boiler Control', 51, -1, 'Has reconnected'),
	('error', 'Boiler Control', 92, -1, 'Invalid OP ID'),
	('error', 'Boiler Control', 93, -1, 'GPIO2 doesn\'t have same value as OP_EMERGENCY_DUMP_ON'),
	('alarm', 'Level Control', 2, -1, 'Running for SET_MAX_PUMP_ON_ERROR (5 Minutes) in Auto'),
	('alarm', 'Solar Control', 98, -1, 'Pump not flowing for 10S when ON Nornal'),
	('alarm', 'Solar Control', 99, -1, 'Pump not flowing for 30S when ON Override'),
	('alarm', 'Solar Control', 59, -1, 'Waiting too long for temperatures to be set'),
	('error', 'Solar Control', 56, -1, 'Temperature out of range'),
	('error', 'Solar Control', 57, -1, 'DS18B20 CRC error'),
	('error', 'MHRV', 51, -1, 'Has reconnected'),
	('error', 'MHRV', 2, -1, 'Invalid actionPIR in settings '),
	('error', 'MHRV', 61, -1, 'Invalid result fromDHT[1]'),
	('error', 'MHRV', 62, -1, 'Invalid result fromDHT[2]'),
	('error', 'Radiator', 57, -1, 'DS18B20 CRC error'),
	('error', 'Boiler Control', 57, -1, 'DS18B20 CRC error'),
	('error', 'Rad Controller', 57, -1, 'DS18B20 CRC error');
/*!40000 ALTER TABLE `errordescriptions` ENABLE KEYS */;


-- Dumping structure for table iot.heatingoverrides
DROP TABLE IF EXISTS `heatingoverrides`;
CREATE TABLE IF NOT EXISTS `heatingoverrides` (
  `ID` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `zoneID` int(11) unsigned NOT NULL,
  `Name` varchar(50) DEFAULT NULL,
  `day` tinyint(4) NOT NULL DEFAULT '10',
  `start` time DEFAULT NULL,
  `duration` time DEFAULT NULL,
  `temperature` tinyint(4) DEFAULT NULL,
  `dontClear` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `FK_heatingoverrides_heatingzones` (`zoneID`),
  CONSTRAINT `FK_heatingoverrides_heatingzones` FOREIGN KEY (`zoneID`) REFERENCES `heatingzones` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

-- Dumping data for table iot.heatingoverrides: ~19 rows (approximately)
/*!40000 ALTER TABLE `heatingoverrides` DISABLE KEYS */;
REPLACE INTO `heatingoverrides` (`ID`, `zoneID`, `Name`, `day`, `start`, `duration`, `temperature`, `dontClear`, `active`) VALUES
	(3, 4, 'Out', 10, '11:00:00', '07:00:00', 17, 0, 0),
	(5, 6, 'Out', 10, '11:00:00', '07:00:00', 17, 0, 0),
	(6, 2, 'Top Up', 10, '10:00:00', '18:30:00', 20, 0, 0),
	(7, 7, 'Out', 10, '11:00:00', '07:00:00', 17, 0, 0),
	(10, 5, 'Guests', 10, '01:00:00', '22:00:00', 12, 1, 1),
	(11, 5, 'Mobile', 10, '11:08:00', '00:00:00', 21, 0, 0),
	(12, 1, 'Out', 10, '11:00:00', '07:00:00', 17, 0, 0),
	(13, 2, 'Out', 10, '11:00:00', '07:00:00', 17, 0, 0),
	(14, 4, 'Mobile', 10, '20:35:00', '01:00:00', 23, 0, 0),
	(15, 9, 'Mobile', 10, '10:58:00', '00:00:00', 12, 0, 0),
	(16, 1, 'Mobile', 10, '18:29:20', '02:30:00', 20, 0, 0),
	(17, 6, 'Mobile', 10, '15:56:27', '04:00:00', 20, 0, 0),
	(18, 2, 'Mobile', 10, '10:43:55', '01:30:00', 17, 0, 0),
	(19, 7, 'Mobile', 10, '11:14:00', '04:00:00', 18, 0, 0),
	(20, 9, 'Guests', 10, '01:00:00', '22:00:00', 10, 1, 1),
	(23, 5, 'Emergency', 10, '22:30:54', '02:00:00', 28, 0, 0),
	(24, 10, 'Mobile', 10, '12:30:00', '02:00:00', 21, 0, 0),
	(26, 11, 'Emergency', 10, '22:30:54', '02:00:00', 28, 0, 0),
	(27, 11, 'Mobile', 10, '11:06:00', '00:00:00', 20, 0, 0);
/*!40000 ALTER TABLE `heatingoverrides` ENABLE KEYS */;


-- Dumping structure for table iot.heatingprogrammes
DROP TABLE IF EXISTS `heatingprogrammes`;
CREATE TABLE IF NOT EXISTS `heatingprogrammes` (
  `zoneID` int(10) unsigned NOT NULL,
  `days` tinyint(3) unsigned NOT NULL DEFAULT '10',
  `start` time NOT NULL,
  `temperature` tinyint(4) NOT NULL DEFAULT '21',
  `preset` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`zoneID`,`days`,`start`),
  KEY `FK_heatingprogrammes_daysofweek` (`days`),
  CONSTRAINT `FK_heatingprogrammes_daysofweek` FOREIGN KEY (`days`) REFERENCES `daysofweek` (`ID`),
  CONSTRAINT `FK_heatingprogrammes_heatingzones` FOREIGN KEY (`zoneID`) REFERENCES `heatingzones` (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.heatingprogrammes: ~30 rows (approximately)
/*!40000 ALTER TABLE `heatingprogrammes` DISABLE KEYS */;
REPLACE INTO `heatingprogrammes` (`zoneID`, `days`, `start`, `temperature`, `preset`) VALUES
	(1, 10, '06:00:00', 21, 0),
	(1, 10, '16:30:00', 22, 0),
	(1, 10, '19:30:00', 21, 0),
	(1, 10, '22:00:00', 15, 0),
	(2, 10, '08:00:00', 17, 0),
	(2, 10, '10:00:00', 19, 0),
	(2, 10, '14:00:00', 21, 0),
	(2, 10, '19:00:00', 12, 0),
	(4, 10, '08:00:00', 17, 0),
	(4, 10, '12:00:00', 18, 0),
	(4, 10, '14:30:00', 21, 0),
	(4, 10, '23:00:00', 12, 0),
	(5, 10, '04:30:00', 20, 0),
	(5, 10, '09:00:00', 16, 0),
	(5, 10, '21:00:00', 12, 0),
	(6, 10, '06:30:00', 19, 0),
	(6, 10, '18:00:00', 19, 0),
	(6, 10, '20:00:00', 12, 0),
	(7, 10, '06:45:00', 15, 0),
	(7, 10, '07:30:00', 17, 0),
	(7, 10, '08:30:00', 15, 0),
	(7, 10, '22:00:00', 17, 0),
	(7, 10, '23:00:00', 12, 0),
	(9, 10, '07:00:00', 19, 0),
	(9, 10, '11:00:00', 12, 0),
	(9, 10, '15:00:00', 20, 0),
	(9, 10, '23:00:00', 12, 0),
	(10, 10, '00:05:00', 15, 0),
	(10, 10, '23:55:00', 15, 0),
	(11, 10, '00:00:00', 15, 0),
	(11, 10, '22:00:00', 15, 0);
/*!40000 ALTER TABLE `heatingprogrammes` ENABLE KEYS */;


-- Dumping structure for table iot.heatingzones
DROP TABLE IF EXISTS `heatingzones`;
CREATE TABLE IF NOT EXISTS `heatingzones` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) NOT NULL,
  `TemperatureDeviceID` varchar(50) NOT NULL,
  `TemperatureSensorID` varchar(50) NOT NULL,
  `ControlDeviceID` varchar(50) NOT NULL,
  `ControlSensorID` varchar(50) NOT NULL,
  `TemperatureMax` int(11) NOT NULL DEFAULT '40',
  `TemperatureMin` int(11) NOT NULL DEFAULT '5',
  `MasterZone` int(11) DEFAULT NULL,
  `IsMaster` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `HeatLossRate` float NOT NULL DEFAULT '0',
  `HeatLossConstant` float NOT NULL DEFAULT '0',
  `HeatGainRate` float NOT NULL DEFAULT '0',
  `HeatGainConstant` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `FK_heatingzones_sensors_temperature` (`TemperatureDeviceID`,`TemperatureSensorID`),
  KEY `FK_heatingzones_sensors_control` (`ControlDeviceID`,`ControlSensorID`),
  CONSTRAINT `FK_heatingzones_sensors_control` FOREIGN KEY (`ControlDeviceID`, `ControlSensorID`) REFERENCES `sensors` (`DeviceID`, `SensorID`) ON UPDATE CASCADE,
  CONSTRAINT `FK_heatingzones_sensors_temperature` FOREIGN KEY (`TemperatureDeviceID`, `TemperatureSensorID`) REFERENCES `sensors` (`DeviceID`, `SensorID`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COMMENT='Heat Gain/Loss Rate = deg K change in temperature per hour per deg K differnce in zone temperature to outside (from forecast)';

-- Dumping data for table iot.heatingzones: ~11 rows (approximately)
/*!40000 ALTER TABLE `heatingzones` DISABLE KEYS */;
REPLACE INTO `heatingzones` (`ID`, `Name`, `TemperatureDeviceID`, `TemperatureSensorID`, `ControlDeviceID`, `ControlSensorID`, `TemperatureMax`, `TemperatureMin`, `MasterZone`, `IsMaster`, `HeatLossRate`, `HeatLossConstant`, `HeatGainRate`, `HeatGainConstant`) VALUES
	(1, 'Family', 'Holliesa15b9d', '28ff46d56c140415', 'Hollies11c554', '20', 26, 12, 1, 0, 0.022246, -0.195259, 0.022888, -0.475379),
	(2, 'Lounge UFH', 'Holliesf9092d', '28b2358e050000d8', 'Hollies11c554', '22', 24, 12, 2, 0, 0, 0.03, 1, 0),
	(4, 'Lounge Rad', 'Holliesf9092d', '28b2358e050000d8', 'Holliesd81ecc', '0', 24, 12, 8, 0, 0, 0, 3, 0),
	(5, 'Dining', 'Holliesd82273', '28ff7f1d6714025b', 'Hollies11c554', '23', 22, 12, 5, 0, -0.011018, 0.109119, 0.06315, -0.708867),
	(6, 'Office', 'Holliesd2ed1c', '28ff1fbdc1160488', 'Holliesd2ed1c', '4', 23, 12, 8, 0, -0.054351, 0.306194, -0.066007, 1.64993),
	(7, 'Bedroom', 'Holliesd2f35e', '28d8b47c050000a4', 'Holliesd2f35e', '4', 20, 12, 8, 0, 0, 0, 0.001, 0),
	(8, 'Any Radiator', 'Holliesc98', '286bd27d050000f8', 'Hollies11c554', '21', 22, 12, 8, 1, 0, 0, 0, 0),
	(9, 'Guest1', 'Holliesd81de4', '28aa3e5b050000d2', 'Holliesd81de4', '1', 23, 12, 8, 0, 0, 0, 0, 0),
	(10, 'Toilet', 'Holliesd2eb4f', '1', 'Hollies11c554', '24', 28, 12, 10, 0, 0, 0, 0, 0),
	(11, 'Hall', 'Hollies-L', '2', 'Hollies11c554', '27', 20, 12, 10, 0, 0, 0, 0, 0),
	(12, 'Family', 'Hollies-F', '2', 'Hollies11c554', '25', 26, 12, 1, 0, 0, 0, 0, 0);
/*!40000 ALTER TABLE `heatingzones` ENABLE KEYS */;


-- Dumping structure for view iot.latest100values
DROP VIEW IF EXISTS `latest100values`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `latest100values` (
	`DeviceID` INT(1) NOT NULL,
	`SensorID` INT(1) NOT NULL,
	`Time` INT(1) NOT NULL,
	`Value` INT(1) NOT NULL
) ENGINE=MyISAM;


-- Dumping structure for view iot.latestgroupvalues
DROP VIEW IF EXISTS `latestgroupvalues`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `latestgroupvalues` (
	`DeviceID` INT(1) NOT NULL,
	`SensorID` INT(1) NOT NULL,
	`Time` INT(1) NOT NULL,
	`Value` INT(1) NOT NULL
) ENGINE=MyISAM;


-- Dumping structure for view iot.latestvalues
DROP VIEW IF EXISTS `latestvalues`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `latestvalues` (
	`location` INT(1) NOT NULL,
	`deviceName` INT(1) NOT NULL,
	`sensorName` INT(1) NOT NULL,
	`Type` INT(1) NOT NULL,
	`Units` INT(1) NOT NULL,
	`ScaleFactor` INT(1) NOT NULL,
	`value` INT(1) NOT NULL,
	`TIME` INT(1) NOT NULL
) ENGINE=MyISAM;


-- Dumping structure for table iot.lightingareas
DROP TABLE IF EXISTS `lightingareas`;
CREATE TABLE IF NOT EXISTS `lightingareas` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Dumping data for table iot.lightingareas: ~7 rows (approximately)
/*!40000 ALTER TABLE `lightingareas` DISABLE KEYS */;
REPLACE INTO `lightingareas` (`ID`, `Name`) VALUES
	(1, 'Hall'),
	(2, 'Lounge'),
	(3, 'Office'),
	(4, 'Family'),
	(5, 'Utility'),
	(6, 'Garage'),
	(7, 'Log Store');
/*!40000 ALTER TABLE `lightingareas` ENABLE KEYS */;


-- Dumping structure for view iot.obsummary
DROP VIEW IF EXISTS `obsummary`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `obsummary` (
	`temp` INT(1) NOT NULL,
	`OB1` INT(1) NOT NULL,
	`OBP` INT(1) NOT NULL,
	`saving` INT(1) NOT NULL,
	`Month` INT(1) NOT NULL,
	`Day` INT(1) NOT NULL
) ENGINE=MyISAM;


-- Dumping structure for view iot.oilburneron
DROP VIEW IF EXISTS `oilburneron`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `oilburneron` (
	`OBON` INT(1) NOT NULL,
	`Day` INT(1) NOT NULL,
	`Month` INT(1) NOT NULL
) ENGINE=MyISAM;


-- Dumping structure for view iot.oilpumpon
DROP VIEW IF EXISTS `oilpumpon`;
-- Creating temporary table to overcome VIEW dependency errors
CREATE TABLE `oilpumpon` (
	`OBPump` INT(1) NOT NULL,
	`Day` INT(1) NOT NULL,
	`Month` INT(1) NOT NULL
) ENGINE=MyISAM;


-- Dumping structure for table iot.output
DROP TABLE IF EXISTS `output`;
CREATE TABLE IF NOT EXISTS `output` (
  `Temp` double DEFAULT NULL,
  `Time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.output: ~129 rows (approximately)
/*!40000 ALTER TABLE `output` DISABLE KEYS */;
REPLACE INTO `output` (`Temp`, `Time`) VALUES
	(0, '2017-09-10 00:00:00'),
	(0, '2017-09-10 00:30:00'),
	(0, '2017-09-10 01:00:00'),
	(0, '2017-09-10 01:30:00'),
	(0, '2017-09-10 02:00:00'),
	(0, '2017-09-10 02:30:00'),
	(0, '2017-09-10 03:00:00'),
	(0, '2017-09-10 03:30:00'),
	(0, '2017-09-10 04:00:00'),
	(0, '2017-09-10 04:30:00'),
	(0, '2017-09-10 05:00:00'),
	(0, '2017-09-10 05:30:00'),
	(0, '2017-09-10 06:00:00'),
	(0, '2017-09-10 06:30:00'),
	(0, '2017-09-10 07:00:00'),
	(0, '2017-09-10 07:30:00'),
	(0, '2017-09-10 08:00:00'),
	(0, '2017-09-10 08:30:00'),
	(0, '2017-09-10 09:00:00'),
	(0, '2017-09-10 09:30:00'),
	(0, '2017-09-10 10:00:00'),
	(0, '2017-09-10 10:30:00'),
	(0, '2017-09-10 11:00:00'),
	(0, '2017-09-10 11:30:00'),
	(0, '2017-09-10 12:00:00'),
	(0, '2017-09-10 12:30:00'),
	(0, '2017-09-10 13:00:00'),
	(0, '2017-09-10 13:30:00'),
	(0.944444, '2017-09-10 14:00:00'),
	(1, '2017-09-10 14:30:00'),
	(1, '2017-09-10 15:00:00'),
	(1, '2017-09-10 15:30:00'),
	(1, '2017-09-10 16:00:00'),
	(1, '2017-09-10 16:30:00'),
	(1, '2017-09-10 17:00:00'),
	(1, '2017-09-10 17:30:00'),
	(1, '2017-09-10 18:00:00'),
	(1, '2017-09-10 18:30:00'),
	(0.055556, '2017-09-10 19:00:00'),
	(0, '2017-09-10 19:30:00'),
	(0, '2017-09-10 20:00:00'),
	(0, '2017-09-10 20:30:00'),
	(0, '2017-09-10 21:00:00'),
	(0, '2017-09-10 21:30:00'),
	(0, '2017-09-10 22:00:00'),
	(0, '2017-09-10 22:30:00'),
	(0, '2017-09-10 23:00:00'),
	(0, '2017-09-10 23:30:00'),
	(0, '2017-09-11 00:00:00'),
	(0, '2017-09-11 00:30:00'),
	(0, '2017-09-11 01:00:00'),
	(0, '2017-09-11 01:30:00'),
	(0, '2017-09-11 02:00:00'),
	(0, '2017-09-11 02:30:00'),
	(0, '2017-09-11 03:00:00'),
	(0, '2017-09-11 03:30:00'),
	(0, '2017-09-11 04:00:00'),
	(0, '2017-09-11 04:30:00'),
	(0, '2017-09-11 05:00:00'),
	(0, '2017-09-11 05:30:00'),
	(0, '2017-09-11 06:00:00'),
	(0, '2017-09-11 06:30:00'),
	(0, '2017-09-11 07:00:00'),
	(0, '2017-09-11 07:30:00'),
	(0, '2017-09-11 08:00:00'),
	(0, '2017-09-11 08:30:00'),
	(0, '2017-09-11 09:00:00'),
	(0, '2017-09-11 09:30:00'),
	(0, '2017-09-11 10:00:00'),
	(0, '2017-09-11 10:30:00'),
	(0, '2017-09-11 11:00:00'),
	(0, '2017-09-11 11:30:00'),
	(0, '2017-09-11 12:00:00'),
	(0, '2017-09-11 12:30:00'),
	(0, '2017-09-11 13:00:00'),
	(0, '2017-09-11 13:30:00'),
	(1, '2017-09-11 14:00:00'),
	(1, '2017-09-11 14:30:00'),
	(1, '2017-09-11 15:00:00'),
	(1, '2017-09-11 15:30:00'),
	(1, '2017-09-11 16:00:00'),
	(1, '2017-09-11 16:30:00'),
	(1, '2017-09-11 17:00:00'),
	(1, '2017-09-11 17:30:00'),
	(1, '2017-09-11 18:00:00'),
	(1, '2017-09-11 18:30:00'),
	(0, '2017-09-11 19:00:00'),
	(0, '2017-09-11 19:30:00'),
	(0, '2017-09-11 20:00:00'),
	(0, '2017-09-11 20:30:00'),
	(0, '2017-09-11 21:00:00'),
	(0, '2017-09-11 21:30:00'),
	(0, '2017-09-11 22:00:00'),
	(0, '2017-09-11 22:30:00'),
	(0, '2017-09-11 23:00:00'),
	(0, '2017-09-11 23:30:00'),
	(0, '2017-09-12 00:00:00'),
	(0, '2017-09-12 00:30:00'),
	(0, '2017-09-12 01:00:00'),
	(0, '2017-09-12 01:30:00'),
	(0, '2017-09-12 02:00:00'),
	(0, '2017-09-12 02:30:00'),
	(0, '2017-09-12 03:00:00'),
	(0, '2017-09-12 03:30:00'),
	(0, '2017-09-12 04:00:00'),
	(0, '2017-09-12 04:30:00'),
	(0, '2017-09-12 05:00:00'),
	(0, '2017-09-12 05:30:00'),
	(0, '2017-09-12 06:00:00'),
	(0, '2017-09-12 06:30:00'),
	(0, '2017-09-12 07:00:00'),
	(0, '2017-09-12 07:30:00'),
	(0, '2017-09-12 08:00:00'),
	(0, '2017-09-12 08:30:00'),
	(0, '2017-09-12 09:00:00'),
	(0, '2017-09-12 09:30:00'),
	(0, '2017-09-12 10:00:00'),
	(0, '2017-09-12 10:30:00'),
	(0, '2017-09-12 11:00:00'),
	(0, '2017-09-12 11:30:00'),
	(0, '2017-09-12 12:00:00'),
	(0, '2017-09-12 12:30:00'),
	(0, '2017-09-12 13:00:00'),
	(0, '2017-09-12 13:30:00'),
	(1, '2017-09-12 14:00:00'),
	(1, '2017-09-12 14:30:00'),
	(1, '2017-09-12 15:00:00'),
	(1, '2017-09-12 15:30:00'),
	(1, '2017-09-12 16:00:00');
/*!40000 ALTER TABLE `output` ENABLE KEYS */;


-- Dumping structure for procedure iot.outputOn
DROP PROCEDURE IF EXISTS `outputOn`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `outputOn`(
	IN `location` CHAR(50),
	IN `device` CHAR(50),
	IN `sensor` CHAR(50),
	IN `st` DATE,
	IN `fn` DATE,
	IN `period` INT





)
BEGIN
   DROP TABLE outputTable;
	CREATE TABLE outputTable AS 
   (select avg(T.value) as Value, FROM_UNIXTIME( TRUNCATE(UNIX_TIMESTAMP(T.Time) / period,0)*period) as Time
	from devices as D
	inner join sensors as S on S.DeviceID = D.DeviceID
	inner join temperaturelog as T on T.DeviceID = D.DeviceID and T.SensorID = S.SensorID
	where D.location = location and D.name = device and s.name = sensor and S.`Type` = 'output'
	AND T.Time between st and fn
	GROUP BY UNIX_TIMESTAMP(T.Time) DIV period);
END//
DELIMITER ;


-- Dumping structure for table iot.outputtable
DROP TABLE IF EXISTS `outputtable`;
CREATE TABLE IF NOT EXISTS `outputtable` (
  `Value` double DEFAULT NULL,
  `Time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.outputtable: ~84 rows (approximately)
/*!40000 ALTER TABLE `outputtable` DISABLE KEYS */;
REPLACE INTO `outputtable` (`Value`, `Time`) VALUES
	(0, '2017-09-11 00:00:00'),
	(0, '2017-09-11 00:30:00'),
	(0, '2017-09-11 01:00:00'),
	(0, '2017-09-11 01:30:00'),
	(0, '2017-09-11 02:00:00'),
	(0, '2017-09-11 02:30:00'),
	(0, '2017-09-11 03:00:00'),
	(0, '2017-09-11 03:30:00'),
	(0, '2017-09-11 04:00:00'),
	(0, '2017-09-11 04:30:00'),
	(0, '2017-09-11 05:00:00'),
	(0, '2017-09-11 05:30:00'),
	(0, '2017-09-11 06:00:00'),
	(0, '2017-09-11 06:30:00'),
	(0, '2017-09-11 07:00:00'),
	(0, '2017-09-11 07:30:00'),
	(0, '2017-09-11 08:00:00'),
	(0, '2017-09-11 08:30:00'),
	(0, '2017-09-11 09:00:00'),
	(0, '2017-09-11 09:30:00'),
	(0, '2017-09-11 10:00:00'),
	(0, '2017-09-11 10:30:00'),
	(0, '2017-09-11 11:00:00'),
	(0, '2017-09-11 11:30:00'),
	(0, '2017-09-11 12:00:00'),
	(0, '2017-09-11 12:30:00'),
	(0, '2017-09-11 13:00:00'),
	(0, '2017-09-11 13:30:00'),
	(0, '2017-09-11 14:00:00'),
	(0, '2017-09-11 14:30:00'),
	(0, '2017-09-11 15:00:00'),
	(0, '2017-09-11 15:30:00'),
	(0, '2017-09-11 16:00:00'),
	(1, '2017-09-11 16:30:00'),
	(1, '2017-09-11 17:00:00'),
	(1, '2017-09-11 17:30:00'),
	(1, '2017-09-11 18:00:00'),
	(1, '2017-09-11 18:30:00'),
	(0.1, '2017-09-11 19:00:00'),
	(0, '2017-09-11 19:30:00'),
	(0, '2017-09-11 20:00:00'),
	(0, '2017-09-11 20:30:00'),
	(0, '2017-09-11 21:00:00'),
	(0, '2017-09-11 21:30:00'),
	(0, '2017-09-11 22:00:00'),
	(0, '2017-09-11 22:30:00'),
	(0, '2017-09-11 23:00:00'),
	(0, '2017-09-11 23:30:00'),
	(0, '2017-09-12 00:00:00'),
	(0, '2017-09-12 00:30:00'),
	(0, '2017-09-12 01:00:00'),
	(0, '2017-09-12 01:30:00'),
	(0, '2017-09-12 02:00:00'),
	(0, '2017-09-12 02:30:00'),
	(0, '2017-09-12 03:00:00'),
	(0, '2017-09-12 03:30:00'),
	(0, '2017-09-12 04:00:00'),
	(0, '2017-09-12 04:30:00'),
	(0, '2017-09-12 05:00:00'),
	(0, '2017-09-12 05:30:00'),
	(0, '2017-09-12 06:00:00'),
	(0, '2017-09-12 06:30:00'),
	(0, '2017-09-12 07:00:00'),
	(0, '2017-09-12 07:30:00'),
	(0, '2017-09-12 08:00:00'),
	(0, '2017-09-12 08:30:00'),
	(0, '2017-09-12 09:00:00'),
	(0, '2017-09-12 09:30:00'),
	(0, '2017-09-12 10:00:00'),
	(0, '2017-09-12 10:30:00'),
	(0, '2017-09-12 11:00:00'),
	(0, '2017-09-12 11:30:00'),
	(0, '2017-09-12 12:00:00'),
	(0, '2017-09-12 12:30:00'),
	(0, '2017-09-12 13:00:00'),
	(0, '2017-09-12 13:30:00'),
	(0, '2017-09-12 14:00:00'),
	(0, '2017-09-12 14:30:00'),
	(0, '2017-09-12 15:00:00'),
	(0, '2017-09-12 15:30:00'),
	(0, '2017-09-12 16:00:00'),
	(1, '2017-09-12 16:30:00'),
	(1, '2017-09-12 17:00:00'),
	(1, '2017-09-12 17:30:00');
/*!40000 ALTER TABLE `outputtable` ENABLE KEYS */;


-- Dumping structure for table iot.outside
DROP TABLE IF EXISTS `outside`;
CREATE TABLE IF NOT EXISTS `outside` (
  `Temp` double DEFAULT NULL,
  `Time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.outside: ~83 rows (approximately)
/*!40000 ALTER TABLE `outside` DISABLE KEYS */;
REPLACE INTO `outside` (`Temp`, `Time`) VALUES
	(20.142278, '2017-09-11 00:00:00'),
	(20.182445, '2017-09-11 00:30:00'),
	(20.130334, '2017-09-11 01:00:00'),
	(20.075333, '2017-09-11 01:30:00'),
	(20.01, '2017-09-11 02:00:00'),
	(19.932945, '2017-09-11 02:30:00'),
	(19.872001, '2017-09-11 03:00:00'),
	(19.797333, '2017-09-11 03:30:00'),
	(19.724722, '2017-09-11 04:00:00'),
	(19.651001, '2017-09-11 04:30:00'),
	(19.587333, '2017-09-11 05:00:00'),
	(19.525333, '2017-09-11 05:30:00'),
	(19.464556, '2017-09-11 06:00:00'),
	(19.420389, '2017-09-11 06:30:00'),
	(19.373667, '2017-09-11 07:00:00'),
	(19.354667, '2017-09-11 07:30:00'),
	(19.370111, '2017-09-11 08:00:00'),
	(19.383222, '2017-09-11 08:30:00'),
	(19.385444, '2017-09-11 09:00:00'),
	(19.406889, '2017-09-11 09:30:00'),
	(19.451167, '2017-09-11 10:00:00'),
	(19.498667, '2017-09-11 10:30:00'),
	(19.593667, '2017-09-11 11:00:00'),
	(19.663833, '2017-09-11 11:30:00'),
	(19.696611, '2017-09-11 12:00:00'),
	(19.832445, '2017-09-11 12:30:00'),
	(19.926333, '2017-09-11 13:00:00'),
	(19.975333, '2017-09-11 13:30:00'),
	(20.028055, '2017-09-11 14:00:00'),
	(20.081136, '2017-09-11 14:30:00'),
	(20.157555, '2017-09-11 15:00:00'),
	(20.2575, '2017-09-11 15:30:00'),
	(20.339667, '2017-09-11 16:00:00'),
	(20.418222, '2017-09-11 16:30:00'),
	(20.503555, '2017-09-11 17:00:00'),
	(20.5884, '2017-09-11 17:30:00'),
	(20.707389, '2017-09-11 18:00:00'),
	(20.800445, '2017-09-11 18:30:00'),
	(20.872589, '2017-09-11 19:00:00'),
	(20.875476, '2017-09-11 19:30:00'),
	(20.932056, '2017-09-11 20:00:00'),
	(21.016667, '2017-09-11 20:30:00'),
	(20.976333, '2017-09-11 21:00:00'),
	(20.922778, '2017-09-11 21:30:00'),
	(20.845278, '2017-09-11 22:00:00'),
	(20.811676, '2017-09-11 22:30:00'),
	(20.642055, '2017-09-11 23:00:00'),
	(20.508111, '2017-09-11 23:30:00'),
	(20.401278, '2017-09-12 00:00:00'),
	(20.304167, '2017-09-12 00:30:00'),
	(20.2205, '2017-09-12 01:00:00'),
	(20.132889, '2017-09-12 01:30:00'),
	(20.051223, '2017-09-12 02:00:00'),
	(19.975, '2017-09-12 02:30:00'),
	(19.899278, '2017-09-12 03:00:00'),
	(19.811834, '2017-09-12 03:30:00'),
	(19.740334, '2017-09-12 04:00:00'),
	(19.663111, '2017-09-12 04:30:00'),
	(19.594333, '2017-09-12 05:00:00'),
	(19.525, '2017-09-12 05:30:00'),
	(19.465056, '2017-09-12 06:00:00'),
	(19.399, '2017-09-12 06:30:00'),
	(19.343945, '2017-09-12 07:00:00'),
	(19.318556, '2017-09-12 07:30:00'),
	(19.250334, '2017-09-12 08:00:00'),
	(19.232, '2017-09-12 08:30:00'),
	(19.217, '2017-09-12 09:00:00'),
	(19.228334, '2017-09-12 09:30:00'),
	(19.256334, '2017-09-12 10:00:00'),
	(19.309889, '2017-09-12 10:30:00'),
	(19.419333, '2017-09-12 11:00:00'),
	(19.544667, '2017-09-12 11:30:00'),
	(19.604334, '2017-09-12 12:00:00'),
	(19.696889, '2017-09-12 12:30:00'),
	(19.749334, '2017-09-12 13:00:00'),
	(19.747611, '2017-09-12 13:30:00'),
	(19.818945, '2017-09-12 14:00:00'),
	(19.860334, '2017-09-12 14:30:00'),
	(19.900278, '2017-09-12 15:00:00'),
	(19.984167, '2017-09-12 15:30:00'),
	(20.102611, '2017-09-12 16:00:00'),
	(20.1885, '2017-09-12 16:30:00'),
	(20.253921, '2017-09-12 17:00:00');
/*!40000 ALTER TABLE `outside` ENABLE KEYS */;


-- Dumping structure for table iot.pond
DROP TABLE IF EXISTS `pond`;
CREATE TABLE IF NOT EXISTS `pond` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `startTime` time NOT NULL DEFAULT '12:00:00',
  `outputID` tinyint(3) unsigned NOT NULL,
  `active` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `startTime` (`startTime`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Dumping data for table iot.pond: ~4 rows (approximately)
/*!40000 ALTER TABLE `pond` DISABLE KEYS */;
REPLACE INTO `pond` (`ID`, `startTime`, `outputID`, `active`) VALUES
	(2, '15:00:00', 22, 0),
	(3, '17:00:00', 21, 0),
	(5, '20:00:00', 21, 0),
	(6, '17:00:00', 22, 0);
/*!40000 ALTER TABLE `pond` ENABLE KEYS */;


-- Dumping structure for table iot.room
DROP TABLE IF EXISTS `room`;
CREATE TABLE IF NOT EXISTS `room` (
  `Temp` double DEFAULT NULL,
  `Time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.room: ~84 rows (approximately)
/*!40000 ALTER TABLE `room` DISABLE KEYS */;
REPLACE INTO `room` (`Temp`, `Time`) VALUES
	(20.142278, '2017-09-11 00:00:00'),
	(20.182445, '2017-09-11 00:30:00'),
	(20.130334, '2017-09-11 01:00:00'),
	(20.075333, '2017-09-11 01:30:00'),
	(20.01, '2017-09-11 02:00:00'),
	(19.932945, '2017-09-11 02:30:00'),
	(19.872001, '2017-09-11 03:00:00'),
	(19.797333, '2017-09-11 03:30:00'),
	(19.724722, '2017-09-11 04:00:00'),
	(19.651001, '2017-09-11 04:30:00'),
	(19.587333, '2017-09-11 05:00:00'),
	(19.525333, '2017-09-11 05:30:00'),
	(19.464556, '2017-09-11 06:00:00'),
	(19.420389, '2017-09-11 06:30:00'),
	(19.373667, '2017-09-11 07:00:00'),
	(19.354667, '2017-09-11 07:30:00'),
	(19.370111, '2017-09-11 08:00:00'),
	(19.383222, '2017-09-11 08:30:00'),
	(19.385444, '2017-09-11 09:00:00'),
	(19.406889, '2017-09-11 09:30:00'),
	(19.451167, '2017-09-11 10:00:00'),
	(19.498667, '2017-09-11 10:30:00'),
	(19.593667, '2017-09-11 11:00:00'),
	(19.663833, '2017-09-11 11:30:00'),
	(19.696611, '2017-09-11 12:00:00'),
	(19.832445, '2017-09-11 12:30:00'),
	(19.926333, '2017-09-11 13:00:00'),
	(19.975333, '2017-09-11 13:30:00'),
	(20.028055, '2017-09-11 14:00:00'),
	(20.081136, '2017-09-11 14:30:00'),
	(20.157555, '2017-09-11 15:00:00'),
	(20.2575, '2017-09-11 15:30:00'),
	(20.339667, '2017-09-11 16:00:00'),
	(20.418222, '2017-09-11 16:30:00'),
	(20.503555, '2017-09-11 17:00:00'),
	(20.5884, '2017-09-11 17:30:00'),
	(20.707389, '2017-09-11 18:00:00'),
	(20.800445, '2017-09-11 18:30:00'),
	(20.872589, '2017-09-11 19:00:00'),
	(20.875476, '2017-09-11 19:30:00'),
	(20.932056, '2017-09-11 20:00:00'),
	(21.016667, '2017-09-11 20:30:00'),
	(20.976333, '2017-09-11 21:00:00'),
	(20.922778, '2017-09-11 21:30:00'),
	(20.845278, '2017-09-11 22:00:00'),
	(20.811676, '2017-09-11 22:30:00'),
	(20.642055, '2017-09-11 23:00:00'),
	(20.508111, '2017-09-11 23:30:00'),
	(20.401278, '2017-09-12 00:00:00'),
	(20.304167, '2017-09-12 00:30:00'),
	(20.2205, '2017-09-12 01:00:00'),
	(20.132889, '2017-09-12 01:30:00'),
	(20.051223, '2017-09-12 02:00:00'),
	(19.975, '2017-09-12 02:30:00'),
	(19.899278, '2017-09-12 03:00:00'),
	(19.811834, '2017-09-12 03:30:00'),
	(19.740334, '2017-09-12 04:00:00'),
	(19.663111, '2017-09-12 04:30:00'),
	(19.594333, '2017-09-12 05:00:00'),
	(19.525, '2017-09-12 05:30:00'),
	(19.465056, '2017-09-12 06:00:00'),
	(19.399, '2017-09-12 06:30:00'),
	(19.343945, '2017-09-12 07:00:00'),
	(19.318556, '2017-09-12 07:30:00'),
	(19.250334, '2017-09-12 08:00:00'),
	(19.232, '2017-09-12 08:30:00'),
	(19.217, '2017-09-12 09:00:00'),
	(19.228334, '2017-09-12 09:30:00'),
	(19.256334, '2017-09-12 10:00:00'),
	(19.309889, '2017-09-12 10:30:00'),
	(19.419333, '2017-09-12 11:00:00'),
	(19.544667, '2017-09-12 11:30:00'),
	(19.604334, '2017-09-12 12:00:00'),
	(19.696889, '2017-09-12 12:30:00'),
	(19.749334, '2017-09-12 13:00:00'),
	(19.747611, '2017-09-12 13:30:00'),
	(19.818945, '2017-09-12 14:00:00'),
	(19.860334, '2017-09-12 14:30:00'),
	(19.900278, '2017-09-12 15:00:00'),
	(19.984167, '2017-09-12 15:30:00'),
	(20.102611, '2017-09-12 16:00:00'),
	(20.1885, '2017-09-12 16:30:00'),
	(20.254723, '2017-09-12 17:00:00'),
	(20.316667, '2017-09-12 17:30:00');
/*!40000 ALTER TABLE `room` ENABLE KEYS */;


-- Dumping structure for procedure iot.roomOutsideTemp
DROP PROCEDURE IF EXISTS `roomOutsideTemp`;
DELIMITER //
CREATE DEFINER=`DaveN`@`%` PROCEDURE `roomOutsideTemp`(
	IN `room` CHAR(50),
	IN `st` DATE,
	IN `fn` DATE,
	IN `period` INT
    

)
BEGIN
call roomTemp('outside', 'temp', st, fn, period);
drop table if exists Outside;
rename table Room to Outside;
call roomTemp(room, 'temp', st, fn, period);
call outputOn('lounge', 'Radiator', 'Lounge Radiator', st, fn, period);
SELECT outside.temp as outsideTemp, room.temp as roomTemp, 
	OT.Value as Rad, outside.time 
FROM Room
INNER JOIN outside ON room.Time = outside.Time
INNER JOIN outputTable AS OT ON OT.Time = outside.Time;
END//
DELIMITER ;


-- Dumping structure for procedure iot.RoomTemp
DROP PROCEDURE IF EXISTS `RoomTemp`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `RoomTemp`(
	IN `room` CHAR(50),
    IN `param` CHAR(53),
	IN `st` DATE,
	IN `fn` DATE,
    IN `period` INT
)
    READS SQL DATA
BEGIN
    CREATE TABLE IF NOT EXISTS room AS 
    (select avg(T.value) as Temp, FROM_UNIXTIME( TRUNCATE(UNIX_TIMESTAMP(T.Time) / period,0)*period) as Time
	from devices as D
	inner join sensors as S on S.DeviceID = D.DeviceID
	inner join temperaturelog as T on T.DeviceID = D.DeviceID and T.SensorID = S.SensorID
	where D.location = room and S.`Type` = param
	AND T.Time between st and fn
	GROUP BY UNIX_TIMESTAMP(T.Time) DIV period);
END//
DELIMITER ;


-- Dumping structure for table iot.sensors
DROP TABLE IF EXISTS `sensors`;
CREATE TABLE IF NOT EXISTS `sensors` (
  `DeviceID` varchar(50) NOT NULL,
  `SensorID` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL DEFAULT 'Not set',
  `Type` varchar(50) NOT NULL DEFAULT 'Temp',
  `Mapping` smallint(5) unsigned DEFAULT NULL,
  `deleteAfter` smallint(5) unsigned NOT NULL DEFAULT '30',
  `ScaleFactor` float NOT NULL DEFAULT '1',
  `Units` varchar(50) NOT NULL DEFAULT 'C',
  PRIMARY KEY (`DeviceID`,`SensorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.sensors: ~244 rows (approximately)
/*!40000 ALTER TABLE `sensors` DISABLE KEYS */;
REPLACE INTO `sensors` (`DeviceID`, `SensorID`, `Name`, `Type`, `Mapping`, `deleteAfter`, `ScaleFactor`, `Units`) VALUES
	('Hollies-F', '2', 'Family', 'Temp', NULL, 120, 1, 'C'),
	('Hollies-G', '2', 'Not set', 'Temp', NULL, 30, 1, 'C'),
	('Hollies-G', '3', 'Not set', 'Temp', NULL, 30, 1, 'C'),
	('Hollies-L', '2', 'Hall', 'Temp', NULL, 30, 1, 'C'),
	('Hollies-L', '4', 'Lounge', 'Temp', NULL, 30, 1, 'C'),
	('Hollies000000', '0', 'Current', 'Temp', NULL, 120, 1, 'C'),
	('Hollies000000', 'Wind Average', 'Wind Average', 'Speed', NULL, 30, 1, 'C'),
	('Hollies000000', 'Wind Max', 'Wind Max', 'Speed', NULL, 30, 1, 'C'),
	('Hollies11c554', '20', 'Family', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c554', '21', 'Rads', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c554', '22', 'Lounge', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c554', '23', 'Dining', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c554', '24', 'Toilet', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c554', '25', '5 spare', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c554', '26', 'WB Supply', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c554', '27', 'Hall', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c554', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, 'C'),
	('Hollies11c554', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'C'),
	('Hollies11c554', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'C'),
	('Hollies11c785', '0', 'Not set', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c785', '1', 'Not set', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c785', '2', 'Not set', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c785', '3', 'Not set', 'Output', NULL, 30, 1, 'C'),
	('Hollies11c785', 'ConnectTime', 'Not set', 'ConnectTime', NULL, 30, 1, 'C'),
	('Hollies11c785', 'RSSI', 'Not set', 'RSSI', NULL, 30, 1, 'C'),
	('Hollies11c785', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Hollies11cca1', '20', 'LED', 'Output', NULL, 30, 1, 'C'),
	('Hollies11cca1', '21', '1', 'Output', NULL, 30, 1, 'C'),
	('Hollies11cca1', '22', '2', 'Output', NULL, 30, 1, 'C'),
	('Hollies11cca1', '23', '3', 'Output', NULL, 30, 1, 'C'),
	('Hollies11cca1', '24', '4', 'Output', NULL, 30, 1, 'C'),
	('Hollies11cca1', 'ConnectTime', 'Not set', 'ConnectTime', NULL, 30, 1, 'C'),
	('Hollies11cca1', 'RSSI', 'Not set', 'RSSI', NULL, 30, 1, 'C'),
	('Hollies11cca1', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Hollies139e26', '0', 'Voltage', 'Voltage', NULL, 30, 1, 'C'),
	('Hollies139e26', '1', '1 Solar', 'Power', NULL, 30, 1, 'C'),
	('Hollies139e26', '2', '2 Car Port', 'Power', NULL, 30, 1, 'C'),
	('Hollies139e26', '3', '3 Lower CU', 'Power', NULL, 30, 1, 'C'),
	('Hollies139e26', '4', '4 House', 'Power', NULL, 30, 1, 'C'),
	('Hollies26ef96', '0', 'Voltage', 'Voltage', NULL, 30, 1, 'C'),
	('Hollies26ef96', '1', '1 Skt1', 'Power', NULL, 30, 1, 'C'),
	('Hollies26ef96', '2', '3 Skt 2', 'Power', NULL, 30, 1, 'C'),
	('Hollies26ef96', '3', '2 MHRV', 'Power', NULL, 30, 1, 'C'),
	('Hollies26ef96', '4', '4 Other', 'Power', NULL, 30, 1, 'C'),
	('Hollies316b0', '0', 'Pressure', 'Pressure', NULL, 30, 1, ''),
	('Hollies316b0', '1', 'Pump', 'Pump', NULL, 30, 1, ''),
	('Hollies316b0', '2', 'Flow', 'Flow', NULL, 30, 1, 'l/hr'),
	('Hollies316b0', '3', 'Level', 'Level', NULL, 30, 1, ''),
	('Hollies316b0', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Hollies316b0', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Hollies316b0', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'C'),
	('Hollies4185f', 'ConnectTime', 'Not set', 'ConnectTime', NULL, 30, 1, 'C'),
	('Hollies4185f', 'RSSI', 'Not set', 'RSSI', NULL, 30, 1, 'C'),
	('Hollies4185f', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Hollies7215c', 'ConnectTime', 'Not set', 'ConnectTime', NULL, 30, 1, 'C'),
	('Hollies7215c', 'RSSI', 'Not set', 'RSSI', NULL, 30, 1, 'C'),
	('Hollies7215c', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Hollies7e600a', '0', 'Voltage', 'Voltage', NULL, 30, 1, 'C'),
	('Hollies7e600a', '1', '1 Garage', 'Power', NULL, 30, 1, 'C'),
	('Hollies7e600a', '2', '2 Extn', 'Power', NULL, 30, 1, 'C'),
	('Hollies7e600a', '3', '3 Office', 'Power', NULL, 30, 1, 'C'),
	('Hollies7e600a', '4', '4 Kitchen', 'Power', NULL, 30, 1, 'C'),
	('Hollies95c701', '0', 'LED', 'Output', NULL, 120, 1, ''),
	('Hollies95c701', '1', 'Socket', 'Output', NULL, 120, 1, ''),
	('Hollies95c701', '2', 'Green LED', 'Output', NULL, 120, 1, ''),
	('Hollies95c701', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, 'C'),
	('Hollies95c701', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'C'),
	('Hollies95c701', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'C'),
	('Hollies95de2a', '0', 'LED', 'Output', NULL, 120, 1, ''),
	('Hollies95de2a', '1', 'Socket', 'Output', NULL, 120, 1, ''),
	('Hollies95de2a', '2', 'Green LED', 'Output', NULL, 120, 1, ''),
	('Hollies95de2a', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, 'C'),
	('Hollies95de2a', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'C'),
	('Hollies95de2a', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesa07e57', '28ff62976c140415', 'Room', 'Temp', NULL, 120, 1, 'C'),
	('Holliesa07e57', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, 'C'),
	('Holliesa07e57', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'C'),
	('Holliesa07e57', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesa15b9d', '28ff46d56c140415', 'Temperature', 'Temp', 0, 120, 1, 'C'),
	('Holliesa15b9d', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 120, 1, 'C'),
	('Holliesa15b9d', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'C'),
	('Holliesa15b9d', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesa15be1', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesa15be1', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesa15be1', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesa1fab6', '10', 'isOpen', 'Input', NULL, 30, 1, 'C'),
	('Holliesa1fab6', '11', 'opening', 'Input', NULL, 30, 1, 'C'),
	('Holliesa1fab6', '12', 'closing', 'Input', NULL, 30, 1, 'C'),
	('Holliesa1fab6', 'ConnectTime', 'Not set', 'ConnectTime', NULL, 30, 1, 'C'),
	('Holliesa1fab6', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'C'),
	('Holliesa1fab6', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesa26c59', '2881a0df060000ba', 'Temperature', 'Temp', NULL, 120, 1, 'C'),
	('Holliesa26c59', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesa26c59', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesa26c59', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'V'),
	('Holliesa6975b', '0', 'Not set', 'Level', NULL, 30, 1, 'C'),
	('Holliesa6975b', 'RSSI', 'Not set', 'RSSI', NULL, 30, 1, 'C'),
	('Holliesa69ec3', '10', 'UFH', 'Input', NULL, 120, 1, ' '),
	('Holliesa69ec3', '11', 'Rads', 'Input', NULL, 120, 1, ' '),
	('Holliesa69ec3', '12', 'WB Supply', 'Input', NULL, 120, 1, ' '),
	('Holliesa69ec3', '13', 'Family', 'Input', NULL, 120, 1, ' '),
	('Holliesa69ec3', '14', 'Lounge', 'Input', NULL, 120, 1, ' '),
	('Holliesa69ec3', '20', 'WB Circ', 'Output', NULL, 120, 1, ' '),
	('Holliesa69ec3', '21', 'OB Pump', 'Output', NULL, 120, 1, ' '),
	('Holliesa69ec3', '22', 'OB ON', 'Output', NULL, 120, 1, ' '),
	('Holliesa69ec3', '23', 'Emergency', 'Output', NULL, 120, 1, ' '),
	('Holliesa69ec3', '2801c4e00600008c', 'TS Cylinder', 'Temp', 7, 120, 1, 'C'),
	('Holliesa69ec3', '284cf18c05000083', 'TS Middle', 'Temp', 1, 120, 1, 'C'),
	('Holliesa69ec3', '285b677d05000088', 'WB Flow', 'Temp', 3, 120, 1, 'C'),
	('Holliesa69ec3', '286299df060000bd', 'OB Return', 'Temp', 8, 120, 1, 'C'),
	('Holliesa69ec3', '28740e5c05000007', 'TS Top', 'Temp', 0, 120, 1, 'C'),
	('Holliesa69ec3', '289b9c6d050000f9', 'TS Bottom', 'Temp', 2, 120, 1, 'C'),
	('Holliesa69ec3', '28b4fb6d0500002b', 'Heating Return', 'Temp', 5, 120, 1, 'C'),
	('Holliesa69ec3', '28b6b1e0060000b1', 'Heating Flow', 'Temp', 6, 120, 1, 'C'),
	('Holliesa69ec3', '28f9ef8c050000b1', 'OB Flow', 'Temp', 4, 120, 1, 'C'),
	('Holliesa69ec3', 'Attempts', 'Attempts', 'Attempts', NULL, 30, 1, ' '),
	('Holliesa69ec3', 'CH setpoint', 'CH setpoint', 'Temp', 10, 120, 1, 'C'),
	('Holliesa69ec3', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesa69ec3', 'DHW setpoint', 'DHW setpoint', 'Temp', 11, 120, 1, 'C'),
	('Holliesa69ec3', 'Outside', 'Outside', 'Temp', 12, 120, 1, 'C'),
	('Holliesa69ec3', 'RSSI', 'RSSI', 'RSSI', NULL, 120, 1, 'dBm'),
	('Holliesb748c', 'avgWind', 'avg Wind', 'Speed', NULL, 30, 1, 'C'),
	('Holliesb748c', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, 'C'),
	('Holliesb748c', 'cutinWind', 'cutin Wind', 'Speed', NULL, 30, 1, 'C'),
	('Holliesb748c', 'maxWind', 'max Wind', 'Speed', NULL, 30, 1, 'C'),
	('Holliesb748c', 'minWind', 'min Wind', 'Speed', NULL, 30, 1, 'C'),
	('Holliesb748c', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'C'),
	('Holliesb748c', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 0.51, 'C'),
	('Holliesb748c', 'Wind Average', 'Average', 'Speed', NULL, 30, 1, 'C'),
	('Holliesb748c', 'Wind CutIn', 'CutIn', 'Speed', NULL, 30, 1, 'C'),
	('Holliesb748c', 'Wind Max', 'Max', 'Speed', NULL, 30, 1, 'C'),
	('Holliesb748c', 'Wind Min', 'Min', 'Speed', NULL, 30, 1, 'C'),
	('Holliesc98', '0', 'Not Set', 'Output', NULL, 120, 1, ' '),
	('Holliesc98', '1', 'Radiator', 'Output', NULL, 120, 1, ' '),
	('Holliesc98', '2', 'Not set', 'Output', NULL, 120, 1, ' '),
	('Holliesc98', '286bd27d050000f8', 'Temperature (old)', 'Temp', NULL, 120, 1, 'C'),
	('Holliesc98', '28ff35d4b31603ed', 'Temperature', 'Temp', 0, 120, 1, 'C'),
	('Holliesc98', '3', 'Not set', 'Output', NULL, 120, 1, ' '),
	('Holliesc98', '4', 'LED', 'Output', NULL, 120, 1, ' '),
	('Holliesc98', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesc98', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesc98', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'V'),
	('Holliesd17a53', '0', 'Not set', 'Output', NULL, 120, 1, 'C'),
	('Holliesd17a53', '286cf87d05000038', 'radiator', 'Temp', NULL, 120, 1, 'C'),
	('Holliesd17a53', '28ff2805671402bb', 'Temp', 'Temp', NULL, 120, 1, 'C'),
	('Holliesd17a53', 'ConnectTime', 'Not set', 'ConnectTime', NULL, 30, 1, 'C'),
	('Holliesd17a53', 'RSSI', 'Not set', 'RSSI', NULL, 30, 1, 'C'),
	('Holliesd17a53', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesd17b02', '28ffc61c67140268', 'Not set', 'Temp', NULL, 120, 1, 'C'),
	('Holliesd17b02', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesd17b02', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesd17b02', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesd2eb4f', '0', 'Utility Temp', 'Temp', NULL, 120, 1, 'C'),
	('Holliesd2eb4f', '1', 'Toilet Temp', 'Temp', NULL, 120, 1, 'C'),
	('Holliesd2eb4f', '10', 'Utility Light PIR On', 'PIR LIGHT ON', NULL, 30, 1, ''),
	('Holliesd2eb4f', '2', 'Utility Humidity', 'Hum', NULL, 30, 1, '%'),
	('Holliesd2eb4f', '3', 'Toilet Humidity', 'Hum', NULL, 30, 1, '%'),
	('Holliesd2eb4f', '4', 'Utility PIR', 'PIR', NULL, 30, 1, ' '),
	('Holliesd2eb4f', '5', 'Toilet  PIR', 'PIR', NULL, 30, 1, ' '),
	('Holliesd2eb4f', '6', 'Toilet Fan PIR On', 'PIR FAN ON', NULL, 30, 1, 'C'),
	('Holliesd2eb4f', '7', 'Utility Fan PIR On', 'PIR FAN ON', NULL, 30, 1, 'C'),
	('Holliesd2eb4f', '8', 'Fan', 'Fan', NULL, 30, 1, 'C'),
	('Holliesd2eb4f', '9', 'Toilet Light PIR On', 'PIR LIGHT ON', NULL, 30, 1, 'C'),
	('Holliesd2eb4f', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesd2eb4f', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesd2ebba', '0', 'Not set', 'Output', NULL, 120, 1, 'C'),
	('Holliesd2ebba', '288ba1ca06000001', 'Temperature', 'Temp', NULL, 120, 1, 'C'),
	('Holliesd2ebba', 'ConnectTime', 'Not set', 'ConnectTime', NULL, 30, 1, 'C'),
	('Holliesd2ebba', 'RSSI', 'Not set', 'RSSI', NULL, 30, 1, 'C'),
	('Holliesd2ebba', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesd2ed1c', '0', 'Not set', 'Output', NULL, 120, 1, ''),
	('Holliesd2ed1c', '1', 'Not Set', 'Output', NULL, 120, 1, ''),
	('Holliesd2ed1c', '2', 'Not set', 'Output', NULL, 120, 1, ''),
	('Holliesd2ed1c', '28c2e207000080bc', 'Temperature (old)', 'Temp', 1, 120, 1, 'C'),
	('Holliesd2ed1c', '28ff1fbdc1160488', 'Temperature', 'Temp', 0, 120, 1, 'C'),
	('Holliesd2ed1c', '3', 'Not set', 'Output', NULL, 120, 1, ''),
	('Holliesd2ed1c', '4', 'Office Radiator', 'Output', NULL, 120, 1, 'C'),
	('Holliesd2ed1c', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesd2ed1c', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesd2ed1c', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesd2f2a3', '10', 'Pump', 'Output', NULL, 120, 1, ' '),
	('Holliesd2f2a3', '280d4d26000080a4', 'Supply', 'Temp', 2, 120, 1, 'C'),
	('Holliesd2f2a3', '28ff5015671402d0', 'Panel', 'Temp', 0, 120, 1, 'C'),
	('Holliesd2f2a3', '28ffeb97911503f7', 'Return', 'Temp', 3, 120, 1, 'C'),
	('Holliesd2f2a3', '4', 'Flow', 'Flow', NULL, 30, 1, 'l/hr'),
	('Holliesd2f2a3', '5', 'Pressure', 'Pressure', NULL, 30, 0.004, 'Bar'),
	('Holliesd2f2a3', '6', 'Energy', 'Energy', NULL, 30, 1, 'kw'),
	('Holliesd2f2a3', 'Attempts', 'Attempts', 'Attempts', NULL, 5, 1, ' '),
	('Holliesd2f2a3', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesd2f2a3', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesd2f2a3', 'TS Bottom', 'TS Bottom', 'Temp', 1, 120, 1, 'C'),
	('Holliesd2f35e', '0', 'LED', 'Output', NULL, 120, 1, ' '),
	('Holliesd2f35e', '1', 'Not set', 'Output', NULL, 120, 1, ' '),
	('Holliesd2f35e', '2', 'Not set', 'Output', NULL, 120, 1, ' '),
	('Holliesd2f35e', '2831b57c050000d6', 'Not set', 'Temp', NULL, 120, 1, 'C'),
	('Holliesd2f35e', '28d8b47c050000a4', 'Temperature', 'Temp', NULL, 120, 1, 'C'),
	('Holliesd2f35e', '3', 'Not set', 'Output', NULL, 120, 1, ' '),
	('Holliesd2f35e', '4', 'Bedroom Radiator', 'Output', NULL, 120, 1, ' '),
	('Holliesd2f35e', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, 'C'),
	('Holliesd2f35e', 'RSSI', 'RSSI', 'RSSI', NULL, 10, 1, 'dBm'),
	('Holliesd2f35e', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'V'),
	('Holliesd2f6c5', '28ffe61f67140218', 'Unit Temp', 'Temp', NULL, 120, 1, 'C'),
	('Holliesd2f6c5', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesd2f6c5', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesd2f6f0', '0', 'Not set', 'Output', NULL, 30, 1, 'C'),
	('Holliesd2f6f0', '1', 'Not set', 'Output', NULL, 30, 1, 'C'),
	('Holliesd2f6f0', '2', 'Not set', 'Output', NULL, 30, 1, 'C'),
	('Holliesd2f6f0', '3', 'Not set', 'Output', NULL, 30, 1, 'C'),
	('Holliesd2f6f0', 'ConnectTime', 'Not set', 'ConnectTime', NULL, 30, 1, 'C'),
	('Holliesd2f6f0', 'RSSI', 'Not set', 'RSSI', NULL, 30, 1, 'C'),
	('Holliesd2f6f0', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesd2f754', '0', 'Family', 'Output', NULL, 120, 1, ' '),
	('Holliesd2f754', '1', 'All Rads', 'Output', NULL, 120, 1, ' '),
	('Holliesd2f754', '2', 'Lounge', 'Output', NULL, 120, 1, ' '),
	('Holliesd2f754', '3', 'Dining', 'Output', NULL, 120, 1, ' '),
	('Holliesd2f754', 'Attempts', 'Attempts', 'Attempts', NULL, 120, 1, ' '),
	('Holliesd2f754', 'RSSI', 'RSSI', 'RSSI', NULL, 120, 1, 'dBm'),
	('Holliesd2fa13', '20', 'LED', 'Output', NULL, 30, 1, 'C'),
	('Holliesd2fa13', '21', 'Lights', 'Output', NULL, 30, 1, 'C'),
	('Holliesd2fa13', '22', 'Waterfall', 'Output', NULL, 30, 1, 'C'),
	('Holliesd2fa13', '23', 'Fountain', 'Output', NULL, 30, 1, 'C'),
	('Holliesd2fa13', '24', 'Spare', 'Output', NULL, 30, 1, 'C'),
	('Holliesd2fa13', 'ConnectTime', 'Connect Time', 'ConnectTime', NULL, 30, 1, 'C'),
	('Holliesd2fa13', 'RSSI', 'Not set', 'RSSI', NULL, 30, 1, 'C'),
	('Holliesd2fa13', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesd81de4', '0', 'LED', 'Output', NULL, 120, 1, ''),
	('Holliesd81de4', '1', 'Radiator', 'Output', NULL, 120, 1, ''),
	('Holliesd81de4', '28aa3e5b050000d2', 'Temperature', 'Temp', 0, 120, 1, 'C'),
	('Holliesd81de4', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, 'C'),
	('Holliesd81de4', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'C'),
	('Holliesd81de4', 'Vcc', 'Not set', 'Vcc', NULL, 30, 1, 'C'),
	('Holliesd81ecc', '0', 'Lounge Radiator', 'Output', NULL, 120, 1, ' '),
	('Holliesd81ecc', 'Attempts', 'Attempts', 'Attempts', NULL, 30, 1, ' '),
	('Holliesd81ecc', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesd82273', '0', 'Not set', 'Output', NULL, 120, 1, 'C'),
	('Holliesd82273', '28ff7f1d6714025b', 'Temperature', 'Temp', 0, 120, 1, 'C'),
	('Holliesd82273', 'ConnectTime', 'ConnectTime', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesd82273', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesd82273', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'V'),
	('Holliese1b416', '0', 'Not set', 'Voltage', NULL, 30, 1, 'C'),
	('Holliese1b416', '1', 'Not set', 'Power', NULL, 30, 1, 'C'),
	('Holliese1b416', '2', 'Not set', 'Power', NULL, 30, 1, 'C'),
	('Holliese1b416', '3', 'Not set', 'Power', NULL, 30, 1, 'C'),
	('Holliese1b416', '4', 'Not set', 'Power', NULL, 30, 1, 'C'),
	('Holliese673f6', '28ff839d68140304', 'Room', 'Temp', NULL, 120, 1, 'C'),
	('Holliese673f6', 'Attempts', 'Attempts', 'Attempts', NULL, 120, 1, ' '),
	('Holliese673f6', 'RSSI', 'RSSI', 'RSSI', NULL, 120, 1, 'dBm'),
	('Holliese673f6', 'Vcc', 'Vcc', 'Vcc', NULL, 120, 1, 'V'),
	('Holliesf9092d', '287a1e3f040000db', 'Woodburner Top', 'Temp', NULL, 120, 1, 'C'),
	('Holliesf9092d', '28b2358e050000d8', 'Room Top', 'Temp', NULL, 120, 1, 'C'),
	('Holliesf9092d', 'ConnectTime', 'Connect Time', 'ConnectTime', NULL, 30, 1, ''),
	('Holliesf9092d', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesf9092d', 'Vcc', 'Vcc', 'Vcc', NULL, 30, 1, 'V'),
	('Holliesf9098e', '0', 'Not set', 'RSSI', NULL, 10, 1, 'dBm'),
	('Holliesf9098e', '1', 'Not set', 'Message', NULL, 10, 1, ' '),
	('Holliesf9098e', 'Attempts', 'Attempts', 'Attempts', NULL, 30, 1, ' '),
	('Holliesf9098e', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm'),
	('Holliesf909a3', '0', 'Level', 'Level', NULL, 30, 1, ' '),
	('Holliesf909a3', 'Attempts', 'Attempts', 'Attempts', NULL, 30, 1, ' '),
	('Holliesf909a3', 'RSSI', 'RSSI', 'RSSI', NULL, 30, 1, 'dBm');
/*!40000 ALTER TABLE `sensors` ENABLE KEYS */;


-- Dumping structure for table iot.sessions
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(255) CHARACTER SET utf8 NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- Dumping data for table iot.sessions: ~4 rows (approximately)
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
REPLACE INTO `sessions` (`session_id`, `expires`, `data`) VALUES
	('1cedsztgHNkKT24HEx_JQugvSJvL46mc', 1550398145, '{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"lastRequest":"/"}'),
	('8u5j0FiMtTWP30IeBXvl0YG2FEYtpqyl', 1550342337, '{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"lastRequest":"/vtigercrm/vtigerservice.php"}'),
	('CFBh-drz1jxI7Enl0pHTNLQtGPa4VCI7', 1550340264, '{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"lastRequest":"/recordings/"}'),
	('cV93B9jU1b8AYKwIdxOTNQQTX_2NP5c3', 1550402253, '{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"lastRequest":"/Heating/zones?_=1549967721551"}'),
	('puhkBJzZ4nuuOW1d4FgCPFguFdrLRJ13', 1550369038, '{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"lastRequest":"/"}'),
	('YlkltnY25P4nLkZ17DuC-fOPZKJz3-2O', 1550338225, '{"cookie":{"originalMaxAge":null,"expires":null,"secure":false,"httpOnly":true,"path":"/"},"lastRequest":"/a2billing/customer/templates/default/footer.tpl"}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;


-- Dumping structure for table iot.setvalues
DROP TABLE IF EXISTS `setvalues`;
CREATE TABLE IF NOT EXISTS `setvalues` (
  `DeviceID` varchar(50) NOT NULL,
  `ID` smallint(6) NOT NULL DEFAULT '0',
  `Value` float NOT NULL DEFAULT '0',
  `Name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`DeviceID`,`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Dumping data for table iot.setvalues: ~814 rows (approximately)
/*!40000 ALTER TABLE `setvalues` DISABLE KEYS */;
REPLACE INTO `setvalues` (`DeviceID`, `ID`, `Value`, `Name`) VALUES
	('Hollies1004', 0, 0, NULL),
	('Hollies1004', 1, 0, NULL),
	('Hollies1004', 2, 0, NULL),
	('Hollies1004', 3, 0, NULL),
	('Hollies1004', 4, 0, NULL),
	('Hollies1004', 5, 0, NULL),
	('Hollies1004', 6, 0, NULL),
	('Hollies1004', 7, 0, NULL),
	('Hollies1004', 8, 0, NULL),
	('Hollies1004', 9, 0, NULL),
	('Hollies11c554', 0, 0, NULL),
	('Hollies11c554', 1, 0, NULL),
	('Hollies11c554', 2, 0, NULL),
	('Hollies11c554', 3, 0, NULL),
	('Hollies11c554', 4, 0, NULL),
	('Hollies11c554', 5, 0, NULL),
	('Hollies11c554', 6, 0, NULL),
	('Hollies11c554', 7, 0, NULL),
	('Hollies11c554', 8, 0, NULL),
	('Hollies11c554', 9, 0, NULL),
	('Hollies11c785', 0, 0, NULL),
	('Hollies11c785', 1, 0, NULL),
	('Hollies11c785', 2, 0, NULL),
	('Hollies11c785', 3, 0, NULL),
	('Hollies11c785', 4, 0, NULL),
	('Hollies11c785', 5, 0, NULL),
	('Hollies11c785', 6, 0, NULL),
	('Hollies11c785', 7, 0, NULL),
	('Hollies11c785', 8, 0, NULL),
	('Hollies11c785', 9, 0, NULL),
	('Hollies11cca1', 0, 0, NULL),
	('Hollies11cca1', 1, 0, NULL),
	('Hollies11cca1', 2, 0, NULL),
	('Hollies11cca1', 3, 0, NULL),
	('Hollies11cca1', 4, 0, NULL),
	('Hollies11cca1', 5, 0, NULL),
	('Hollies11cca1', 6, 0, NULL),
	('Hollies11cca1', 7, 0, NULL),
	('Hollies11cca1', 8, 0, NULL),
	('Hollies11cca1', 9, 0, NULL),
	('Hollies139e26', 0, 1, 'doPublish'),
	('Hollies139e26', 1, 1, 'doDisplay'),
	('Hollies139e26', 2, 580, 'vCalib'),
	('Hollies139e26', 3, 132, 'Solar'),
	('Hollies139e26', 4, 132, 'Solar(2)'),
	('Hollies139e26', 5, 132, 'iCalib3'),
	('Hollies139e26', 6, 132, 'iCalib4'),
	('Hollies26ef96', 0, 1, 'doPublish'),
	('Hollies26ef96', 1, 1, 'doDisplay'),
	('Hollies26ef96', 2, 700, 'vCalib'),
	('Hollies26ef96', 3, 60.61, 'iCalib1'),
	('Hollies26ef96', 4, 59, 'iCalib2'),
	('Hollies26ef96', 5, 59, 'iCalib3'),
	('Hollies26ef96', 6, 63.61, 'iCalib4'),
	('Hollies316b0', 0, 210, 'Pump ON'),
	('Hollies316b0', 1, 400, 'Pump Off'),
	('Hollies316b0', 2, 20, 'Flow Time'),
	('Hollies316b0', 3, 450, 'Flow per Litre'),
	('Hollies316b0', 4, 110, 'Low pressure Warning'),
	('Hollies316b0', 5, 100, 'Low Level Warning'),
	('Hollies316b0', 6, 4200, 'Max Pump On warning'),
	('Hollies316b0', 7, 5400, 'MAX PUMP ON error'),
	('Hollies316b0', 8, 30, 'No Flow Auto Error'),
	('Hollies316b0', 9, 0, NULL),
	('Hollies416a5', 0, 0, NULL),
	('Hollies416a5', 1, 0, NULL),
	('Hollies416a5', 2, 0, NULL),
	('Hollies416a5', 3, 0, NULL),
	('Hollies416a5', 4, 0, NULL),
	('Hollies416a5', 5, 0, NULL),
	('Hollies416a5', 6, 0, NULL),
	('Hollies416a5', 7, 0, NULL),
	('Hollies416a5', 8, 0, NULL),
	('Hollies416a5', 9, 0, NULL),
	('Hollies4185f', 0, 10, NULL),
	('Hollies4185f', 1, 30, NULL),
	('Hollies4185f', 2, 5, NULL),
	('Hollies4185f', 3, 5, NULL),
	('Hollies4185f', 4, 50, NULL),
	('Hollies4185f', 5, 0, NULL),
	('Hollies4185f', 6, 0, NULL),
	('Hollies4185f', 7, 0, NULL),
	('Hollies4185f', 8, 0, NULL),
	('Hollies4185f', 9, 0, NULL),
	('Hollies7215c', 0, 0, NULL),
	('Hollies7215c', 1, 0, NULL),
	('Hollies7215c', 2, 0, NULL),
	('Hollies7215c', 3, 0, NULL),
	('Hollies7215c', 4, 0, NULL),
	('Hollies7215c', 5, 0, NULL),
	('Hollies7215c', 6, 0, NULL),
	('Hollies7215c', 7, 0, NULL),
	('Hollies7215c', 8, 0, NULL),
	('Hollies7215c', 9, 0, NULL),
	('Hollies7e600a', 0, 1, 'null'),
	('Hollies7e600a', 1, 1, NULL),
	('Hollies7e600a', 2, 920, 'Voltage'),
	('Hollies7e600a', 3, 84, 'Garage'),
	('Hollies7e600a', 4, 87, 'Car Port'),
	('Hollies7e600a', 5, 84, 'Solar(2)'),
	('Hollies7e600a', 6, 60.61, NULL),
	('Hollies807053', 0, 0, NULL),
	('Hollies807053', 1, 0, NULL),
	('Hollies807053', 2, 0, NULL),
	('Hollies807053', 3, 0, NULL),
	('Hollies807053', 4, 0, NULL),
	('Hollies807053', 5, 0, NULL),
	('Hollies807053', 6, 0, NULL),
	('Hollies807053', 7, 0, NULL),
	('Hollies807053', 8, 0, NULL),
	('Hollies807053', 9, 0, NULL),
	('Hollies95c701', 0, 0, NULL),
	('Hollies95c701', 1, 0, NULL),
	('Hollies95c701', 2, 0, NULL),
	('Hollies95c701', 3, 0, NULL),
	('Hollies95c701', 4, 0, NULL),
	('Hollies95c701', 5, 0, NULL),
	('Hollies95c701', 6, 0, NULL),
	('Hollies95c701', 7, 0, NULL),
	('Hollies95c701', 8, 0, NULL),
	('Hollies95c701', 9, 0, NULL),
	('Hollies95de2a', 0, 0, NULL),
	('Hollies95de2a', 1, 0, NULL),
	('Hollies95de2a', 2, 0, NULL),
	('Hollies95de2a', 3, 0, NULL),
	('Hollies95de2a', 4, 0, NULL),
	('Hollies95de2a', 5, 0, NULL),
	('Hollies95de2a', 6, 0, NULL),
	('Hollies95de2a', 7, 0, NULL),
	('Hollies95de2a', 8, 0, NULL),
	('Hollies95de2a', 9, 0, NULL),
	('Hollies985f0e', 0, 0, NULL),
	('Hollies985f0e', 1, 0, NULL),
	('Hollies985f0e', 2, 0, NULL),
	('Hollies985f0e', 3, 0, NULL),
	('Hollies985f0e', 4, 0, NULL),
	('Hollies985f0e', 5, 0, NULL),
	('Hollies985f0e', 6, 0, NULL),
	('Hollies985f0e', 7, 0, NULL),
	('Hollies985f0e', 8, 0, NULL),
	('Hollies985f0e', 9, 0, NULL),
	('Hollies985f0e', 10, 0, NULL),
	('Hollies985f0e', 11, 0, NULL),
	('Hollies985f0e', 12, 0, NULL),
	('Hollies985f0e', 13, 0, NULL),
	('Hollies985f0e', 14, 0, NULL),
	('Hollies985f0e', 15, 0, NULL),
	('Hollies985f0e', 16, 0, NULL),
	('Hollies985f0e', 17, 0, NULL),
	('Hollies985f0e', 18, 0, NULL),
	('Hollies985f0e', 19, 0, NULL),
	('Hollies985f14', 0, 0, NULL),
	('Hollies985f14', 1, 0, NULL),
	('Hollies985f14', 2, 0, NULL),
	('Hollies985f14', 3, 0, NULL),
	('Hollies985f14', 4, 0, NULL),
	('Hollies985f14', 5, 0, NULL),
	('Hollies985f14', 6, 0, NULL),
	('Hollies985f14', 7, 0, NULL),
	('Hollies985f14', 8, 0, NULL),
	('Hollies985f14', 9, 0, NULL),
	('Hollies985f14', 10, 0, NULL),
	('Hollies985f14', 11, 0, NULL),
	('Hollies985f14', 12, 0, NULL),
	('Hollies985f14', 13, 0, NULL),
	('Hollies985f14', 14, 0, NULL),
	('Hollies985f14', 15, 0, NULL),
	('Hollies985f14', 16, 0, NULL),
	('Hollies985f14', 17, 0, NULL),
	('Hollies985f14', 18, 0, NULL),
	('Hollies985f14', 19, 0, NULL),
	('Hollies98ba69', 0, 47, NULL),
	('Hollies98ba69', 1, 15, 'null'),
	('Hollies98ba69', 2, 10, 'Frame Rate'),
	('Hollies98ba69', 3, 20, 'Wait Count'),
	('Hollies98ba69', 4, 0, NULL),
	('Hollies98ba69', 5, 0, NULL),
	('Hollies98ba69', 6, 0, NULL),
	('Hollies98ba69', 7, 0, NULL),
	('Hollies98ba69', 8, 0, NULL),
	('Hollies98ba69', 9, 0, NULL),
	('Hollies98bdf8', 0, 20, NULL),
	('Hollies98bdf8', 1, 20, NULL),
	('Hollies98bdf8', 2, 20, NULL),
	('Hollies98bdf8', 3, 20, NULL),
	('Hollies98bdf8', 4, 20, NULL),
	('Hollies98bdf8', 5, 20, NULL),
	('Hollies98bdf8', 6, 20, NULL),
	('Hollies98bdf8', 7, 20, NULL),
	('Hollies98bdf8', 8, 20, NULL),
	('Hollies98bdf8', 9, 20, NULL),
	('Hollies99982a', 0, 45, NULL),
	('Hollies99982a', 1, 45, NULL),
	('Hollies99982a', 2, 45, NULL),
	('Hollies99982a', 3, 45, NULL),
	('Hollies99982a', 4, 45, NULL),
	('Hollies99982a', 5, 45, NULL),
	('Hollies99982a', 6, 45, NULL),
	('Hollies99982a', 7, 45, NULL),
	('Hollies99982a', 8, 45, NULL),
	('Hollies99982a', 9, 45, NULL),
	('Hollies9ba942', 0, 0, NULL),
	('Hollies9ba942', 1, 0, NULL),
	('Hollies9ba942', 2, 0, NULL),
	('Hollies9ba942', 3, 0, NULL),
	('Hollies9ba942', 4, 0, NULL),
	('Hollies9ba942', 5, 0, NULL),
	('Hollies9ba942', 6, 0, NULL),
	('Hollies9ba942', 7, 0, NULL),
	('Hollies9ba942', 8, 0, NULL),
	('Hollies9ba942', 9, 0, NULL),
	('Hollies9ba942', 10, 0, NULL),
	('Hollies9ba942', 11, 0, NULL),
	('Hollies9ba942', 12, 0, NULL),
	('Hollies9ba942', 13, 0, NULL),
	('Hollies9ba942', 14, 0, NULL),
	('Hollies9ba942', 15, 0, NULL),
	('Hollies9ba942', 16, 0, NULL),
	('Hollies9ba942', 17, 0, NULL),
	('Hollies9ba942', 18, 0, NULL),
	('Hollies9ba942', 19, 0, NULL),
	('Hollies9c9cc0', 0, 35, NULL),
	('Hollies9c9cc0', 1, 36, NULL),
	('Hollies9c9cc0', 2, 39, NULL),
	('Hollies9c9cc0', 3, 45, NULL),
	('Hollies9c9cc0', 4, 45, NULL),
	('Hollies9c9cc0', 5, 45, NULL),
	('Hollies9c9cc0', 6, 45, NULL),
	('Hollies9c9cc0', 7, 45, NULL),
	('Hollies9c9cc0', 8, 45, NULL),
	('Hollies9c9cc0', 9, 45, NULL),
	('Hollies9ca468', 0, 45, NULL),
	('Hollies9ca468', 1, 45, NULL),
	('Hollies9ca468', 2, 45, NULL),
	('Hollies9ca468', 3, 45, NULL),
	('Hollies9ca468', 4, 45, NULL),
	('Hollies9ca468', 5, 45, NULL),
	('Hollies9ca468', 6, 45, NULL),
	('Hollies9ca468', 7, 45, NULL),
	('Hollies9ca468', 8, 45, NULL),
	('Hollies9ca468', 9, 45, NULL),
	('Holliesa065d9', 0, 45, NULL),
	('Holliesa065d9', 1, 45, NULL),
	('Holliesa065d9', 2, 45, NULL),
	('Holliesa065d9', 3, 45, NULL),
	('Holliesa065d9', 4, 45, NULL),
	('Holliesa065d9', 5, 45, NULL),
	('Holliesa065d9', 6, 45, NULL),
	('Holliesa065d9', 7, 45, NULL),
	('Holliesa065d9', 8, 45, NULL),
	('Holliesa065d9', 9, 45, NULL),
	('Holliesa07e57', 0, 0, 'DHW_START_BOILER'),
	('Holliesa07e57', 1, 0, 'DHW_STOP_BOILER'),
	('Holliesa07e57', 2, 0, 'WB_IS_ON_TEMP'),
	('Holliesa07e57', 3, 0, 'CH_START_BOILER'),
	('Holliesa07e57', 4, 0, 'DHW_USE_ALL_HEAT'),
	('Holliesa07e57', 5, 0, 'RADS_START_BOILER'),
	('Holliesa07e57', 6, 0, NULL),
	('Holliesa07e57', 7, 0, NULL),
	('Holliesa07e57', 8, 0, 'DHW_ON_HOUR'),
	('Holliesa07e57', 9, 0, 'DHW_OFF_HOUR'),
	('Holliesa07e57', 10, 0, NULL),
	('Holliesa07e57', 11, 0, NULL),
	('Holliesa07e57', 12, 0, NULL),
	('Holliesa07e57', 13, 0, NULL),
	('Holliesa07e57', 14, 0, NULL),
	('Holliesa07e57', 15, 0, NULL),
	('Holliesa07e57', 16, 0, NULL),
	('Holliesa07e57', 17, 0, NULL),
	('Holliesa07e57', 18, 0, NULL),
	('Holliesa07e57', 19, 0, NULL),
	('Holliesa15b9d', 0, 0, 'Pump ON'),
	('Holliesa15b9d', 1, 0, 'Pump OFF'),
	('Holliesa15b9d', 2, 0, 'Flow Time'),
	('Holliesa15b9d', 3, 0, 'Flow per Litre'),
	('Holliesa15b9d', 4, 0, NULL),
	('Holliesa15b9d', 5, 0, NULL),
	('Holliesa15b9d', 6, 0, NULL),
	('Holliesa15b9d', 7, 0, NULL),
	('Holliesa15b9d', 8, 0, NULL),
	('Holliesa15b9d', 9, 0, NULL),
	('Holliesa15bdd', 0, 20, NULL),
	('Holliesa15bdd', 1, 20, NULL),
	('Holliesa15bdd', 2, 20, NULL),
	('Holliesa15bdd', 3, 20, NULL),
	('Holliesa15bdd', 4, 20, NULL),
	('Holliesa15bdd', 5, 20, NULL),
	('Holliesa15bdd', 6, 20, NULL),
	('Holliesa15bdd', 7, 20, NULL),
	('Holliesa15bdd', 8, 20, NULL),
	('Holliesa15bdd', 9, 20, NULL),
	('Holliesa15be1', 0, 0, NULL),
	('Holliesa15be1', 1, 0, NULL),
	('Holliesa15be1', 2, 0, NULL),
	('Holliesa15be1', 3, 0, NULL),
	('Holliesa15be1', 4, 0, NULL),
	('Holliesa15be1', 5, 0, NULL),
	('Holliesa15be1', 6, 0, NULL),
	('Holliesa15be1', 7, 0, NULL),
	('Holliesa15be1', 8, 0, NULL),
	('Holliesa15be1', 9, 0, NULL),
	('Holliesa1fab6', 0, 1, 'Send RSSI'),
	('Holliesa1fab6', 1, 0, NULL),
	('Holliesa1fab6', 2, 0, NULL),
	('Holliesa1fab6', 3, 0, NULL),
	('Holliesa1fab6', 4, 0, NULL),
	('Holliesa1fab6', 5, 0, NULL),
	('Holliesa1fab6', 6, 0, NULL),
	('Holliesa1fab6', 7, 0, NULL),
	('Holliesa1fab6', 8, 0, NULL),
	('Holliesa1fab6', 9, 0, NULL),
	('Holliesa26917', 0, 75, 'Humidity Utility'),
	('Holliesa26917', 1, 75, 'Humidity Toilet'),
	('Holliesa26917', 2, 25, 'Temperature Utility'),
	('Holliesa26917', 3, 25, 'Temperature Toilet'),
	('Holliesa26917', 4, 7, 'On'),
	('Holliesa26917', 5, 22, 'Off'),
	('Holliesa26917', 6, 2, 'PIR1 ON time'),
	('Holliesa26917', 7, 20, 'PIR2 ON time'),
	('Holliesa26917', 8, 2, 'DHT1'),
	('Holliesa26917', 9, 2, 'DHT2'),
	('Holliesa26917', 10, 1, 'Action PIR'),
	('Holliesa26917', 11, 0, NULL),
	('Holliesa26917', 12, 0, NULL),
	('Holliesa26917', 13, 0, NULL),
	('Holliesa26917', 14, 0, NULL),
	('Holliesa26a66', 0, 45, NULL),
	('Holliesa26a66', 1, 45, NULL),
	('Holliesa26a66', 2, 45, NULL),
	('Holliesa26a66', 3, 45, NULL),
	('Holliesa26a66', 4, 45, NULL),
	('Holliesa26a66', 5, 45, NULL),
	('Holliesa26a66', 6, 45, NULL),
	('Holliesa26a66', 7, 45, NULL),
	('Holliesa26a66', 8, 45, NULL),
	('Holliesa26a66', 9, 45, NULL),
	('Holliesa26c59', 0, 0, NULL),
	('Holliesa26c59', 1, 0, NULL),
	('Holliesa26c59', 2, 0, NULL),
	('Holliesa26c59', 3, 0, NULL),
	('Holliesa26c59', 4, 0, NULL),
	('Holliesa26c59', 5, 0, NULL),
	('Holliesa26c59', 6, 0, NULL),
	('Holliesa26c59', 7, 0, NULL),
	('Holliesa26c59', 8, 0, NULL),
	('Holliesa26c59', 9, 0, NULL),
	('Holliesa26c59', 10, 0, NULL),
	('Holliesa26c59', 11, 0, NULL),
	('Holliesa26c59', 12, 0, NULL),
	('Holliesa26c59', 13, 0, NULL),
	('Holliesa26c59', 14, 0, NULL),
	('Holliesa26c59', 15, 0, NULL),
	('Holliesa26c59', 16, 0, NULL),
	('Holliesa26c59', 17, 0, NULL),
	('Holliesa26c59', 18, 0, NULL),
	('Holliesa26c59', 19, 0, NULL),
	('Holliesa2f', 0, 17, 'T0'),
	('Holliesa2f', 1, 213, 'R0'),
	('Holliesa2f', 2, 76, 'T100'),
	('Holliesa2f', 3, 297, 'R100'),
	('Holliesa2f', 4, 10, 'Flow Time'),
	('Holliesa2f', 5, 450, 'Flow per Litre'),
	('Holliesa2f', 6, 20, 'Pump setting'),
	('Holliesa2f', 7, 0, NULL),
	('Holliesa2f', 8, 0, NULL),
	('Holliesa2f', 9, 0, NULL),
	('Holliesa6919f', 0, 20, NULL),
	('Holliesa6919f', 1, 20, NULL),
	('Holliesa6919f', 2, 20, NULL),
	('Holliesa6919f', 3, 20, NULL),
	('Holliesa69578', 0, 0, NULL),
	('Holliesa69578', 1, 0, NULL),
	('Holliesa69578', 2, 0, NULL),
	('Holliesa69578', 3, 0, NULL),
	('Holliesa69578', 4, 0, NULL),
	('Holliesa69578', 5, 0, NULL),
	('Holliesa69578', 6, 0, NULL),
	('Holliesa69578', 7, 0, NULL),
	('Holliesa69578', 8, 0, NULL),
	('Holliesa69578', 9, 0, NULL),
	('Holliesa69578', 10, 0, NULL),
	('Holliesa69578', 11, 0, NULL),
	('Holliesa69578', 12, 0, NULL),
	('Holliesa69578', 13, 0, NULL),
	('Holliesa69578', 14, 0, NULL),
	('Holliesa69578', 15, 0, NULL),
	('Holliesa69578', 16, 0, NULL),
	('Holliesa69578', 17, 0, NULL),
	('Holliesa69578', 18, 0, NULL),
	('Holliesa69578', 19, 0, NULL),
	('Holliesa6975b', 0, 20, NULL),
	('Holliesa6975b', 1, 20, NULL),
	('Holliesa6975b', 2, 20, NULL),
	('Holliesa6975b', 3, 20, NULL),
	('Holliesa69ec3', 0, 60, 'DHW set point'),
	('Holliesa69ec3', 1, 50, 'UFH set point'),
	('Holliesa69ec3', 2, 64, 'Rads set point'),
	('Holliesa69ec3', 3, 4, 'Set Point differential'),
	('Holliesa69ec3', 4, 60, 'WB is ON temperature'),
	('Holliesa69ec3', 5, 50, 'DHW Use all heat'),
	('Holliesa69ec3', 6, 10, 'OS Temperature comp'),
	('Holliesa69ec3', 7, 5, 'Boost timer'),
	('Holliesa69ec3', 8, 2, 'Boost amount'),
	('Holliesa69ec3', 9, 82, 'Emergency Dump temp'),
	('Holliesa69ec3', 10, 0, 'OB Pump delay'),
	('Holliesa69ec3', 11, 7, 'DHW ON hour'),
	('Holliesa69ec3', 12, 22, 'DHW OFF hour'),
	('Holliesa69ec3', 13, 0, NULL),
	('Holliesa69ec3', 14, 0, NULL),
	('Holliesa69ec3', 15, 0, NULL),
	('Holliesa69ec3', 16, 0, NULL),
	('Holliesa69ec3', 17, 0, NULL),
	('Holliesa69ec3', 18, 0, NULL),
	('Holliesa69ec3', 19, 0, NULL),
	('Holliesb748c', 0, 10, 'Pulses per Knot'),
	('Holliesb748c', 1, 15, 'Monitor Time'),
	('Holliesb748c', 2, 5, 'Gather Time'),
	('Holliesb748c', 3, 5, 'Turbine cut in'),
	('Holliesb748c', 4, 10, 'Reporting Count'),
	('Holliesb748c', 5, 400, 'Vbat Calibration Mult'),
	('Holliesb748c', 6, 850, 'Vbat Calibration Div'),
	('Holliesb748c', 7, 0, NULL),
	('Holliesb748c', 8, 0, NULL),
	('Holliesb748c', 9, 0, NULL),
	('Holliesc98', 0, 0, NULL),
	('Holliesc98', 1, 0, NULL),
	('Holliesc98', 2, 0, NULL),
	('Holliesc98', 3, 0, NULL),
	('Holliesc98', 4, 0, NULL),
	('Holliesc98', 5, 0, NULL),
	('Holliesc98', 6, 0, NULL),
	('Holliesc98', 7, 0, NULL),
	('Holliesc98', 8, 0, NULL),
	('Holliesc98', 9, 0, NULL),
	('Holliesc98', 10, 0, NULL),
	('Holliesc98', 11, 0, NULL),
	('Holliesc98', 12, 0, NULL),
	('Holliesc98', 13, 0, NULL),
	('Holliesc98', 14, 0, NULL),
	('Holliesc98', 15, 0, NULL),
	('Holliesc98', 16, 0, NULL),
	('Holliesc98', 17, 0, NULL),
	('Holliesc98', 18, 0, NULL),
	('Holliesc98', 19, 0, NULL),
	('Holliesd1788b', 0, 1, 'null'),
	('Holliesd1788b', 1, 1, 'null'),
	('Holliesd1788b', 2, 0, NULL),
	('Holliesd1788b', 3, 0, NULL),
	('Holliesd1788b', 4, 0, NULL),
	('Holliesd1788b', 5, 0, NULL),
	('Holliesd1788b', 6, 0, NULL),
	('Holliesd1788b', 7, 0, NULL),
	('Holliesd1788b', 8, 0, NULL),
	('Holliesd1788b', 9, 0, NULL),
	('Holliesd17a53', 0, 0, NULL),
	('Holliesd17a53', 1, 0, NULL),
	('Holliesd17a53', 2, 0, NULL),
	('Holliesd17a53', 3, 0, NULL),
	('Holliesd17a53', 4, 0, NULL),
	('Holliesd17a53', 5, 0, NULL),
	('Holliesd17a53', 6, 0, NULL),
	('Holliesd17a53', 7, 0, NULL),
	('Holliesd17a53', 8, 0, NULL),
	('Holliesd17a53', 9, 0, NULL),
	('Holliesd17b02', 0, 0, NULL),
	('Holliesd17b02', 1, 0, NULL),
	('Holliesd17b02', 2, 0, NULL),
	('Holliesd17b02', 3, 0, NULL),
	('Holliesd17b02', 4, 0, NULL),
	('Holliesd17b02', 5, 0, NULL),
	('Holliesd17b02', 6, 0, NULL),
	('Holliesd17b02', 7, 0, NULL),
	('Holliesd17b02', 8, 0, NULL),
	('Holliesd17b02', 9, 0, NULL),
	('Holliesd29f13', 0, 78, 'Humidity 1'),
	('Holliesd29f13', 1, 79, 'Humidity 2'),
	('Holliesd29f13', 2, 25, 'Temperature 1'),
	('Holliesd29f13', 3, 25, 'Temperature 2'),
	('Holliesd29f13', 4, 7, 'Start'),
	('Holliesd29f13', 5, 22, 'Finish'),
	('Holliesd29f13', 6, 1, 'PIR1 ON time'),
	('Holliesd29f13', 7, 1, 'PIR2 ON time'),
	('Holliesd29f13', 8, 2, 'DHT1'),
	('Holliesd29f13', 9, 1, 'DHT2'),
	('Holliesd29f13', 10, 1, 'Action PIR'),
	('Holliesd29f13', 11, 0, NULL),
	('Holliesd29f13', 12, 0, NULL),
	('Holliesd29f13', 13, 0, NULL),
	('Holliesd29f13', 14, 0, NULL),
	('Holliesd2eb4f', 0, 70, 'Toilet Humidity'),
	('Holliesd2eb4f', 1, 60, 'Utility Humidity'),
	('Holliesd2eb4f', 2, 28, 'Toilet Temperature'),
	('Holliesd2eb4f', 3, 28, 'Utility Temperature'),
	('Holliesd2eb4f', 4, 7, 'Start'),
	('Holliesd2eb4f', 5, 22, 'Finish'),
	('Holliesd2eb4f', 6, 15, 'Toilet Fan PIR Active'),
	('Holliesd2eb4f', 7, 20, 'Utility Fan PIR Active'),
	('Holliesd2eb4f', 8, 2, 'Toilet DHT type'),
	('Holliesd2eb4f', 9, 2, 'Utility DHT type'),
	('Holliesd2eb4f', 10, 1, 'Active PIR'),
	('Holliesd2eb4f', 11, 4, 'Toilet Light PIR Active'),
	('Holliesd2eb4f', 12, 2, 'Utility Light PIR Active'),
	('Holliesd2eb4f', 13, 0, ''),
	('Holliesd2eb4f', 14, 0, NULL),
	('Holliesd2ebba', 0, 0, NULL),
	('Holliesd2ebba', 1, 0, NULL),
	('Holliesd2ebba', 2, 0, NULL),
	('Holliesd2ebba', 3, 0, NULL),
	('Holliesd2ebba', 4, 0, NULL),
	('Holliesd2ebba', 5, 0, NULL),
	('Holliesd2ebba', 6, 0, NULL),
	('Holliesd2ebba', 7, 0, NULL),
	('Holliesd2ebba', 8, 0, NULL),
	('Holliesd2ebba', 9, 0, NULL),
	('Holliesd2ebba', 10, 0, NULL),
	('Holliesd2ebba', 11, 7, NULL),
	('Holliesd2ebba', 12, 22, NULL),
	('Holliesd2ebba', 13, 0, NULL),
	('Holliesd2ebba', 14, 0, NULL),
	('Holliesd2ebba', 15, 0, NULL),
	('Holliesd2ebba', 16, 0, NULL),
	('Holliesd2ebba', 17, 0, NULL),
	('Holliesd2ebba', 18, 0, NULL),
	('Holliesd2ebba', 19, 0, NULL),
	('Holliesd2ed1c', 0, 0, NULL),
	('Holliesd2ed1c', 1, 0, NULL),
	('Holliesd2ed1c', 2, 0, NULL),
	('Holliesd2ed1c', 3, 0, NULL),
	('Holliesd2ed1c', 4, 0, NULL),
	('Holliesd2ed1c', 5, 0, NULL),
	('Holliesd2ed1c', 6, 0, NULL),
	('Holliesd2ed1c', 7, 0, NULL),
	('Holliesd2ed1c', 8, 0, NULL),
	('Holliesd2ed1c', 9, 0, NULL),
	('Holliesd2ed1c', 10, 0, NULL),
	('Holliesd2ed1c', 11, 0, NULL),
	('Holliesd2ed1c', 12, 0, NULL),
	('Holliesd2ed1c', 13, 0, NULL),
	('Holliesd2ed1c', 14, 0, NULL),
	('Holliesd2ed1c', 15, 0, NULL),
	('Holliesd2ed1c', 16, 0, NULL),
	('Holliesd2ed1c', 17, 0, NULL),
	('Holliesd2ed1c', 18, 0, NULL),
	('Holliesd2ed1c', 19, 0, NULL),
	('Holliesd2f2a3', 0, 0, 'T0'),
	('Holliesd2f2a3', 1, 190, 'R0'),
	('Holliesd2f2a3', 2, 100, 'T100'),
	('Holliesd2f2a3', 3, 320, 'R100'),
	('Holliesd2f2a3', 4, 10, 'Flow Time'),
	('Holliesd2f2a3', 5, 450, 'Flow per Litre'),
	('Holliesd2f2a3', 6, 0, 'Pump delay'),
	('Holliesd2f2a3', 7, 18, 'Panel Temp Diff'),
	('Holliesd2f2a3', 8, 0, ''),
	('Holliesd2f2a3', 9, 0, ''),
	('Holliesd2f2a3', 10, 0, ''),
	('Holliesd2f2a3', 11, 0, ''),
	('Holliesd2f2a3', 12, 0, ''),
	('Holliesd2f2a3', 13, 0, ''),
	('Holliesd2f2a3', 14, 0, ''),
	('Holliesd2f35e', 0, 0, NULL),
	('Holliesd2f35e', 1, 0, NULL),
	('Holliesd2f35e', 2, 0, NULL),
	('Holliesd2f35e', 3, 0, NULL),
	('Holliesd2f35e', 4, 0, NULL),
	('Holliesd2f35e', 5, 0, NULL),
	('Holliesd2f35e', 6, 0, NULL),
	('Holliesd2f35e', 7, 0, NULL),
	('Holliesd2f35e', 8, 0, NULL),
	('Holliesd2f35e', 9, 0, NULL),
	('Holliesd2f6c5', 0, 100, NULL),
	('Holliesd2f6c5', 1, 200, NULL),
	('Holliesd2f6c5', 2, 10, NULL),
	('Holliesd2f6c5', 3, 450, NULL),
	('Holliesd2f6c5', 4, 0, NULL),
	('Holliesd2f6c5', 5, 0, NULL),
	('Holliesd2f6c5', 6, 0, NULL),
	('Holliesd2f6c5', 7, 0, NULL),
	('Holliesd2f6c5', 8, 0, NULL),
	('Holliesd2f6c5', 9, 0, NULL),
	('Holliesd2f6c5', 10, 1, NULL),
	('Holliesd2f6c5', 11, 0, NULL),
	('Holliesd2f6c5', 12, 0, NULL),
	('Holliesd2f6c5', 13, 0, NULL),
	('Holliesd2f6c5', 14, 0, NULL),
	('Holliesd2f6f0', 0, 0, NULL),
	('Holliesd2f6f0', 1, 0, NULL),
	('Holliesd2f6f0', 2, 0, NULL),
	('Holliesd2f6f0', 3, 0, NULL),
	('Holliesd2f6f0', 4, 0, NULL),
	('Holliesd2f6f0', 5, 0, NULL),
	('Holliesd2f6f0', 6, 0, NULL),
	('Holliesd2f6f0', 7, 0, NULL),
	('Holliesd2f6f0', 8, 0, NULL),
	('Holliesd2f6f0', 9, 0, NULL),
	('Holliesd2f754', 0, 20, NULL),
	('Holliesd2f754', 1, 20, NULL),
	('Holliesd2f754', 2, 20, NULL),
	('Holliesd2f754', 3, 20, NULL),
	('Holliesd2f754', 4, 20, NULL),
	('Holliesd2f754', 5, 20, NULL),
	('Holliesd2f754', 6, 20, NULL),
	('Holliesd2f754', 7, 20, NULL),
	('Holliesd2f754', 8, 20, NULL),
	('Holliesd2f754', 9, 20, NULL),
	('Holliesd2fa13', 0, 0, NULL),
	('Holliesd2fa13', 1, 0, NULL),
	('Holliesd2fa13', 2, 0, NULL),
	('Holliesd2fa13', 3, 0, NULL),
	('Holliesd2fa13', 4, 0, NULL),
	('Holliesd2fa13', 5, 0, NULL),
	('Holliesd2fa13', 6, 0, NULL),
	('Holliesd2fa13', 7, 0, NULL),
	('Holliesd2fa13', 8, 0, NULL),
	('Holliesd2fa13', 9, 0, NULL),
	('Holliesd81de4', 0, 0, NULL),
	('Holliesd81de4', 1, 0, NULL),
	('Holliesd81de4', 2, 0, NULL),
	('Holliesd81de4', 3, 0, NULL),
	('Holliesd81de4', 4, 0, NULL),
	('Holliesd81de4', 5, 0, NULL),
	('Holliesd81de4', 6, 0, NULL),
	('Holliesd81de4', 7, 0, NULL),
	('Holliesd81de4', 8, 0, NULL),
	('Holliesd81de4', 9, 0, NULL),
	('Holliesd81e1e', 0, 0, NULL),
	('Holliesd81e1e', 1, 0, NULL),
	('Holliesd81e1e', 2, 0, NULL),
	('Holliesd81e1e', 3, 0, NULL),
	('Holliesd81e1e', 4, 0, NULL),
	('Holliesd81e1e', 5, 0, NULL),
	('Holliesd81e1e', 6, 0, NULL),
	('Holliesd81e1e', 7, 0, NULL),
	('Holliesd81e1e', 8, 0, NULL),
	('Holliesd81e1e', 9, 0, NULL),
	('Holliesd81ecc', 0, 20, NULL),
	('Holliesd81ecc', 1, 20, NULL),
	('Holliesd81ecc', 2, 20, NULL),
	('Holliesd81ecc', 3, 20, NULL),
	('Holliesd81ecc', 4, 20, NULL),
	('Holliesd81ecc', 5, 20, NULL),
	('Holliesd81ecc', 6, 20, NULL),
	('Holliesd81ecc', 7, 20, NULL),
	('Holliesd81ecc', 8, 20, NULL),
	('Holliesd81ecc', 9, 20, NULL),
	('Holliesd82273', 0, 0, NULL),
	('Holliesd82273', 1, 0, NULL),
	('Holliesd82273', 2, 0, NULL),
	('Holliesd82273', 3, 0, NULL),
	('Holliesd82273', 4, 0, NULL),
	('Holliesd82273', 5, 0, NULL),
	('Holliesd82273', 6, 0, NULL),
	('Holliesd82273', 7, 0, NULL),
	('Holliesd82273', 8, 0, NULL),
	('Holliesd82273', 9, 0, NULL),
	('Holliesd82324', 0, 6467, 'Humidity 1'),
	('Holliesd82324', 1, 1817, 'Humidity 2'),
	('Holliesd82324', 2, 278, 'Temperature 1'),
	('Holliesd82324', 3, 514, 'Temperature 2'),
	('Holliesd82324', 4, 258, 'Start'),
	('Holliesd82324', 5, 276, 'Finish'),
	('Holliesd82324', 6, 258, 'PIR1 ON time'),
	('Holliesd82324', 7, 65535, 'PIR2 ON time'),
	('Holliesd82324', 8, 65535, 'DHT1'),
	('Holliesd82324', 9, 65535, 'DHT2'),
	('Holliesd82324', 10, 1, 'PIR Action'),
	('Holliesd82324', 11, 20, NULL),
	('Holliesd82324', 12, 1, NULL),
	('Holliesd82324', 13, 2, NULL),
	('Holliesd82324', 14, 1, NULL),
	('Holliesd82324', 15, 0, NULL),
	('Holliesd82324', 16, 0, NULL),
	('Holliesd82324', 17, 0, NULL),
	('Holliesd82324', 18, 0, NULL),
	('Holliesd82324', 19, 0, NULL),
	('Holliesd8237a', 0, 0, NULL),
	('Holliesd8237a', 1, 0, NULL),
	('Holliesd8237a', 2, 0, NULL),
	('Holliesd8237a', 3, 0, NULL),
	('Holliesd8237a', 4, 0, NULL),
	('Holliesd8237a', 5, 0, NULL),
	('Holliesd8237a', 6, 0, NULL),
	('Holliesd8237a', 7, 0, NULL),
	('Holliesd8237a', 8, 0, NULL),
	('Holliesd8237a', 9, 0, NULL),
	('Holliese673f6', 0, 0, NULL),
	('Holliese673f6', 1, 0, NULL),
	('Holliese673f6', 2, 0, NULL),
	('Holliese673f6', 3, 0, NULL),
	('Holliese673f6', 4, 0, NULL),
	('Holliese673f6', 5, 0, NULL),
	('Holliese673f6', 6, 0, NULL),
	('Holliese673f6', 7, 0, NULL),
	('Holliese673f6', 8, 0, NULL),
	('Holliese673f6', 9, 0, NULL),
	('Holliese673f6', 10, 0, NULL),
	('Holliese673f6', 11, 0, NULL),
	('Holliese673f6', 12, 0, NULL),
	('Holliese673f6', 13, 0, NULL),
	('Holliese673f6', 14, 0, NULL),
	('Holliese673f6', 15, 0, NULL),
	('Holliese673f6', 16, 0, NULL),
	('Holliese673f6', 17, 0, NULL),
	('Holliese673f6', 18, 0, NULL),
	('Holliese673f6', 19, 0, NULL),
	('Holliesec9bd', 0, 0, NULL),
	('Holliesec9bd', 1, 0, NULL),
	('Holliesec9bd', 2, 0, NULL),
	('Holliesec9bd', 3, 0, NULL),
	('Holliesec9bd', 4, 0, NULL),
	('Holliesec9bd', 5, 0, NULL),
	('Holliesec9bd', 6, 0, NULL),
	('Holliesec9bd', 7, 0, NULL),
	('Holliesec9bd', 8, 0, NULL),
	('Holliesec9bd', 9, 0, NULL),
	('Holliesec9bd', 10, 0, NULL),
	('Holliesec9bd', 11, 0, NULL),
	('Holliesec9bd', 12, 0, NULL),
	('Holliesec9bd', 13, 0, NULL),
	('Holliesec9bd', 14, 0, NULL),
	('Holliesec9bd', 15, 0, NULL),
	('Holliesec9bd', 16, 0, NULL),
	('Holliesec9bd', 17, 0, NULL),
	('Holliesec9bd', 18, 0, NULL),
	('Holliesec9bd', 19, 0, NULL),
	('Holliesf9084a', 0, 0, 'T0'),
	('Holliesf9084a', 1, 190, 'R0'),
	('Holliesf9084a', 2, 100, 'T100'),
	('Holliesf9084a', 3, 320, 'R100'),
	('Holliesf9084a', 4, 10, 'Flow Time'),
	('Holliesf9084a', 5, 450, 'Flow per Litre'),
	('Holliesf9084a', 6, 0, 'Pump setting'),
	('Holliesf9084a', 7, 0, NULL),
	('Holliesf9084a', 8, 0, NULL),
	('Holliesf9084a', 9, 0, NULL),
	('Holliesf9084a', 10, 0, NULL),
	('Holliesf9084a', 11, 7, NULL),
	('Holliesf9084a', 12, 22, NULL),
	('Holliesf9084a', 13, 0, NULL),
	('Holliesf9084a', 14, 0, NULL),
	('Holliesf9084a', 15, 0, NULL),
	('Holliesf9084a', 16, 0, NULL),
	('Holliesf9084a', 17, 0, NULL),
	('Holliesf9084a', 18, 0, NULL),
	('Holliesf9084a', 19, 0, NULL),
	('Holliesf90868', 0, 0, NULL),
	('Holliesf90868', 1, 0, NULL),
	('Holliesf90868', 2, 0, NULL),
	('Holliesf90868', 3, 0, NULL),
	('Holliesf90868', 4, 0, NULL),
	('Holliesf90868', 5, 0, NULL),
	('Holliesf90868', 6, 0, NULL),
	('Holliesf90868', 7, 0, NULL),
	('Holliesf90868', 8, 0, NULL),
	('Holliesf90868', 9, 0, NULL),
	('Holliesf90868', 10, 0, NULL),
	('Holliesf90868', 11, 0, NULL),
	('Holliesf90868', 12, 0, NULL),
	('Holliesf90868', 13, 0, NULL),
	('Holliesf90868', 14, 0, NULL),
	('Holliesf90868', 15, 0, NULL),
	('Holliesf90868', 16, 0, NULL),
	('Holliesf90868', 17, 0, NULL),
	('Holliesf90868', 18, 0, NULL),
	('Holliesf90868', 19, 0, NULL),
	('Holliesf9092d', 0, 0, NULL),
	('Holliesf9092d', 1, 0, NULL),
	('Holliesf9092d', 2, 0, NULL),
	('Holliesf9092d', 3, 0, NULL),
	('Holliesf9092d', 4, 0, NULL),
	('Holliesf9092d', 5, 0, NULL),
	('Holliesf9092d', 6, 0, NULL),
	('Holliesf9092d', 7, 0, NULL),
	('Holliesf9092d', 8, 0, NULL),
	('Holliesf9092d', 9, 0, NULL),
	('Holliesf9098e', 0, 46, 'Matrix Size'),
	('Holliesf9098e', 1, 12, 'Shift'),
	('Holliesf9098e', 2, 20, 'Rate'),
	('Holliesf9098e', 3, 45, NULL),
	('Holliesf9098e', 4, 45, NULL),
	('Holliesf9098e', 5, 45, NULL),
	('Holliesf9098e', 6, 45, NULL),
	('Holliesf9098e', 7, 45, NULL),
	('Holliesf9098e', 8, 45, NULL),
	('Holliesf9098e', 9, 45, NULL),
	('Holliesf909a3', 0, 50, 'Repeat A'),
	('Holliesf909a3', 1, 30, 'Reppeat B'),
	('Holliesf909a3', 2, 27759, 'null'),
	('Holliesf909a3', 3, 26988, 'null'),
	('Holliesf909a3', 4, 29541, NULL),
	('Holliesf909a3', 5, 20992, NULL),
	('Holliesf909a3', 6, 13382, NULL),
	('Holliesf909a3', 7, 13107, NULL),
	('Holliesf909a3', 8, 0, NULL),
	('Holliesf909a3', 9, 0, NULL),
	('Holliesf909a3', 10, 0, NULL),
	('Holliesf909a3', 11, 0, NULL),
	('Holliesf909a3', 12, 0, NULL),
	('Holliesf909a3', 13, 0, NULL),
	('Holliesf909a3', 14, 0, NULL),
	('Holliesf909a3', 15, 0, NULL),
	('Holliesf909a3', 16, 0, NULL),
	('Holliesf909a3', 17, 0, NULL),
	('Holliesf909a3', 18, 0, NULL),
	('Holliesf909a3', 19, 0, NULL),
	('Testf9084a', 0, 29541, NULL),
	('Testf9084a', 1, 116, NULL),
	('Testf9084a', 2, 29541, NULL),
	('Testf9084a', 3, 16896, NULL),
	('Testf9084a', 4, 26991, NULL),
	('Testf9084a', 5, 25964, NULL),
	('Testf9084a', 6, 8306, NULL),
	('Testf9084a', 7, 28483, NULL),
	('Testf9084a', 8, 29806, NULL),
	('Testf9084a', 9, 28530, NULL),
	('Testf9084a', 10, 0, NULL),
	('Testf9084a', 11, 7, NULL),
	('Testf9084a', 12, 22, NULL),
	('Testf9084a', 13, 0, NULL),
	('Testf9084a', 14, 0, NULL),
	('Testf9084a', 15, 0, NULL),
	('Testf9084a', 16, 0, NULL),
	('Testf9084a', 17, 0, NULL),
	('Testf9084a', 18, 0, NULL),
	('Testf9084a', 19, 0, NULL);
/*!40000 ALTER TABLE `setvalues` ENABLE KEYS */;


-- Dumping structure for procedure iot.TempAverage
DROP PROCEDURE IF EXISTS `TempAverage`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `TempAverage`(
	IN `date` DATE

)
BEGIN
select hour(time) as 'hour', AVG(value) as 'avgOutside' from temperaturelog 
inner join sensors on temperaturelog.DeviceID = sensors.DeviceID and temperaturelog.SensorID = sensors.SensorID
inner join devices on devices.DeviceID = sensors.DeviceID 
where devices.Location = 'Outside' and devices.Name = 'Weather' 
and type = 'Temp' and sensors.Name = 'current' 
and time between date and date_add(date, interval 1 day)
group by hour(time)
order by hour;
END//
DELIMITER ;


-- Dumping structure for procedure iot.TempDelta
DROP PROCEDURE IF EXISTS `TempDelta`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `TempDelta`(
	IN `Date` DATE,
	IN `HourStart` INT

,
	IN `HourFinish` INT,
	IN `deviceLocation` CHAR(50),
	IN `deviceName` CHAR(50),
	IN `sensorName` CHAR(50)

)
BEGIN
drop table if exists tmp1;

create table tmp1 as
select TIMESTAMPDIFF(MINUTE,date, time) as t, value from temperaturelog 
inner join sensors on temperaturelog.DeviceID = sensors.DeviceID and temperaturelog.SensorID = sensors.SensorID
inner join devices on devices.DeviceID = sensors.DeviceID 
where devices.Location = devicelocation and devices.Name = deviceName 
and type = 'Temp' and sensors.Name = sensorName and time between date and date_add(date, interval 1 day) and hour(time) between HourStart and HourFinish;

SELECT
@n := COUNT(value) AS N,
@meanY := AVG(value) as "Y mean",
@meanX := AVG(t) AS "X mean",
@sumX := SUM(t) AS "X sum",
@sumXX := SUM(t*t) "X sum of squares",
@meanY := AVG(value) AS "Y mean",
@sumY := SUM(value) AS "Y sum",
@sumYY := SUM(value*value) "Y sum of square",
@sumXY := SUM(t*value) AS "X*Y sum"
FROM tmp1;

SET @a = (@sumY*@sumXX - @sumX*@sumXY) / (@n*@sumXX - @sumx*@sumX);
SET @b = (@n*@sumXY - @sumX*@sumY)/(@n*@sumXX - @sumX*@sumX) * 60;
select @a, @b;
drop table tmp1;

END//
DELIMITER ;


-- Dumping structure for procedure iot.TempOutput
DROP PROCEDURE IF EXISTS `TempOutput`;
DELIMITER //
CREATE DEFINER=`root`@`localhost` PROCEDURE `TempOutput`(
	IN `Date` CHAR(50),
	IN `deviceLocation` CHAR(50),
	IN `DeviceName` CHAR(50),
	IN `SensorName` CHAR(50)


)
BEGIN
select hour(time) as 'hour', AVG(value) as 'avgOutput' from temperaturelog 
inner join sensors on temperaturelog.DeviceID = sensors.DeviceID and temperaturelog.SensorID = sensors.SensorID
inner join devices on devices.DeviceID = sensors.DeviceID 
where devices.Location = deviceLocation and devices.Name = deviceName 
and type = 'Output' and sensors.Name = sensorName 
and time between date and date_add(date, interval 1 day)
group by hour(time)
order by hour;

END//
DELIMITER ;


-- Dumping structure for view iot.avtemp
DROP VIEW IF EXISTS `avtemp`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `avtemp`;
CREATE ALGORITHM=UNDEFINED DEFINER=`DaveN`@`%` SQL SECURITY DEFINER VIEW `avtemp` AS select 1 AS `temp`,1 AS `Day`;


-- Dumping structure for view iot.latest100values
DROP VIEW IF EXISTS `latest100values`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `latest100values`;
CREATE ALGORITHM=UNDEFINED DEFINER=`DaveN`@`%` SQL SECURITY DEFINER VIEW `latest100values` AS select 1 AS `DeviceID`,1 AS `SensorID`,1 AS `Time`,1 AS `Value`;


-- Dumping structure for view iot.latestgroupvalues
DROP VIEW IF EXISTS `latestgroupvalues`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `latestgroupvalues`;
CREATE ALGORITHM=UNDEFINED DEFINER=`DaveN`@`%` SQL SECURITY DEFINER VIEW `latestgroupvalues` AS select 1 AS `DeviceID`,1 AS `SensorID`,1 AS `Time`,1 AS `Value`;


-- Dumping structure for view iot.latestvalues
DROP VIEW IF EXISTS `latestvalues`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `latestvalues`;
CREATE ALGORITHM=UNDEFINED DEFINER=`DaveN`@`%` SQL SECURITY DEFINER VIEW `latestvalues` AS select 1 AS `location`,1 AS `deviceName`,1 AS `sensorName`,1 AS `Type`,1 AS `Units`,1 AS `ScaleFactor`,1 AS `value`,1 AS `TIME`;


-- Dumping structure for view iot.obsummary
DROP VIEW IF EXISTS `obsummary`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `obsummary`;
CREATE ALGORITHM=UNDEFINED DEFINER=`DaveN`@`%` SQL SECURITY DEFINER VIEW `obsummary` AS select 1 AS `temp`,1 AS `OB1`,1 AS `OBP`,1 AS `saving`,1 AS `Month`,1 AS `Day`;


-- Dumping structure for view iot.oilburneron
DROP VIEW IF EXISTS `oilburneron`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `oilburneron`;
CREATE ALGORITHM=UNDEFINED DEFINER=`DaveN`@`%` SQL SECURITY DEFINER VIEW `oilburneron` AS select 1 AS `OBON`,1 AS `Day`,1 AS `Month`;


-- Dumping structure for view iot.oilpumpon
DROP VIEW IF EXISTS `oilpumpon`;
-- Removing temporary table and create final VIEW structure
DROP TABLE IF EXISTS `oilpumpon`;
CREATE ALGORITHM=UNDEFINED DEFINER=`DaveN`@`%` SQL SECURITY DEFINER VIEW `oilpumpon` AS select 1 AS `OBPump`,1 AS `Day`,1 AS `Month`;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
