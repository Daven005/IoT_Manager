-- MySQL dump 10.16  Distrib 10.1.37-MariaDB, for debian-linux-gnueabihf (armv8l)
--
-- Host: localhost    Database: iot
-- ------------------------------------------------------
-- Server version	10.1.37-MariaDB-0+deb9u1
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `arealights`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `arealights`;
CREATE TABLE `arealights` (
  `TLc` varchar(50) NOT NULL,
  `Scene` varchar(50) NOT NULL,
  `Area` int(10) unsigned NOT NULL,
  `InUse` tinyint(3) unsigned DEFAULT '1',
  PRIMARY KEY (`TLc`,`Scene`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `arealights`
--

INSERT INTO `arealights` VALUES ('Hollies-3','Alcove Off',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Alcove On',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Bay Off',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Bay On',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Centre Off',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Centre On',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Hall Dim Fade',1,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Hall Dim PIR',1,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Hall Off',1,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Hall On',1,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Hall Play',1,0);
INSERT INTO `arealights` VALUES ('Hollies-3','L Background',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Living Off',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Living On',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Office Off',3,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Office On',3,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Reading',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Strips Off',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Watching TV',2,0);
INSERT INTO `arealights` VALUES ('Hollies-3','Watching TV+',2,0);
INSERT INTO `arealights` VALUES ('Hollies-4','Alcove Off',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Alcove On',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Bay Off',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Bay On',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Centre Off',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Centre On',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Hall Dim Fade',1,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Hall Dim PIR',1,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Hall Off',1,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Hall On',1,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Hall Play',1,1);
INSERT INTO `arealights` VALUES ('Hollies-4','L Background',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Living Off',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Living On',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Office Dim',3,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Office Off',3,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Office On',3,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Reading',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Strips Off',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Watching TV',2,1);
INSERT INTO `arealights` VALUES ('Hollies-4','Watching TV+',2,1);
INSERT INTO `arealights` VALUES ('Hollies-F','All Off',4,1);
INSERT INTO `arealights` VALUES ('Hollies-F','Boiler Off',5,1);
INSERT INTO `arealights` VALUES ('Hollies-F','Boiler On',5,1);
INSERT INTO `arealights` VALUES ('Hollies-F','Family Entrance',4,1);
INSERT INTO `arealights` VALUES ('Hollies-F','Family Low',4,1);
INSERT INTO `arealights` VALUES ('Hollies-F','Family Off',4,1);
INSERT INTO `arealights` VALUES ('Hollies-F','Family On',4,1);
INSERT INTO `arealights` VALUES ('Hollies-F','Toilet Off',5,1);
INSERT INTO `arealights` VALUES ('Hollies-F','Toilet On',5,1);
INSERT INTO `arealights` VALUES ('Hollies-F','Utility Off',5,1);
INSERT INTO `arealights` VALUES ('Hollies-F','Utility On',5,1);
INSERT INTO `arealights` VALUES ('Hollies-G','All OFF',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Bench OFF',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Bench ON',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Door OFF',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Door ON',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Lathe OFF',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Lathe ON',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Log Store ON >',7,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Logstore ON >',7,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Minimum',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Outside OFF',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Outside ON >',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Shelves ON',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Toilet OFF',6,1);
INSERT INTO `arealights` VALUES ('Hollies-G','Toilet ON',6,1);

--
-- Temporary table structure for view `avtemp`
--

SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `avtemp` (
  `temp` tinyint NOT NULL,
  `Day` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `daysofweek`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `daysofweek`;
CREATE TABLE `daysofweek` (
  `ID` tinyint(3) unsigned NOT NULL,
  `Name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `daysofweek`
--

INSERT INTO `daysofweek` VALUES (0,'NoDay');
INSERT INTO `daysofweek` VALUES (1,'Sunday');
INSERT INTO `daysofweek` VALUES (2,'Monday');
INSERT INTO `daysofweek` VALUES (3,'Tuesday');
INSERT INTO `daysofweek` VALUES (4,'Wednesday');
INSERT INTO `daysofweek` VALUES (5,'Thursday');
INSERT INTO `daysofweek` VALUES (6,'Friday');
INSERT INTO `daysofweek` VALUES (7,'Saturday');
INSERT INTO `daysofweek` VALUES (8,'Weekend');
INSERT INTO `daysofweek` VALUES (9,'Weekday');
INSERT INTO `daysofweek` VALUES (10,'Anyday');

--
-- Table structure for table `devices`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
  `DeviceID` varchar(50) NOT NULL,
  `Location` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL,
  `Updates` int(4) unsigned NOT NULL DEFAULT '100',
  `Inputs` int(2) unsigned NOT NULL DEFAULT '0',
  `Outputs` int(2) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`DeviceID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

INSERT INTO `devices` VALUES ('Hollies-F','Family','Hollies-F',100,0,0);
INSERT INTO `devices` VALUES ('Hollies-G','Garage','Hollies-G',100,0,0);
INSERT INTO `devices` VALUES ('Hollies-L','Lounge','Hollies-L',100,0,0);
INSERT INTO `devices` VALUES ('Hollies000000','Outside','Weather',100,0,0);
INSERT INTO `devices` VALUES ('Hollies11c554','Boiler Rm','Boiler Relays',100,0,8);
INSERT INTO `devices` VALUES ('Hollies11c785','zzzz','Temperature Monitor',100,0,0);
INSERT INTO `devices` VALUES ('Hollies11cca1','Outside','Watering Controller',100,4,0);
INSERT INTO `devices` VALUES ('Hollies139e26','Porch','eMon2',100,0,0);
INSERT INTO `devices` VALUES ('Hollies26ef96','Boiler Rm','eMon',100,0,0);
INSERT INTO `devices` VALUES ('Hollies316b0','Utility','Level Control',10,0,0);
INSERT INTO `devices` VALUES ('Hollies4185f','Unknown','Wind Speed',100,0,0);
INSERT INTO `devices` VALUES ('Hollies7215c','Unknown','Temperature Monitor',100,0,0);
INSERT INTO `devices` VALUES ('Hollies7e600a','Porch','eMon',100,0,0);
INSERT INTO `devices` VALUES ('Hollies95c701','Spare','Extension Lead',100,0,3);
INSERT INTO `devices` VALUES ('Hollies95de2a','Spare','Sonoff Relay 1',100,0,3);
INSERT INTO `devices` VALUES ('Holliesa07e57','Spare','Temperature Monitor-1',60,0,0);
INSERT INTO `devices` VALUES ('Holliesa15b9d','Family','Temperature Monitor',60,0,0);
INSERT INTO `devices` VALUES ('Holliesa15be1','Test','Moisture',100,0,0);
INSERT INTO `devices` VALUES ('Holliesa1fab6','Test','Gate Sensor',30,0,0);
INSERT INTO `devices` VALUES ('Holliesa26c59','Outside','Hot Compost',60,0,0);
INSERT INTO `devices` VALUES ('Holliesa6975b','Outside','Light String',100,0,0);
INSERT INTO `devices` VALUES ('Holliesa69ec3','Boiler Rm','Boiler Control',30,6,4);
INSERT INTO `devices` VALUES ('Holliesb748c','Test','Wind Speed',300,0,0);
INSERT INTO `devices` VALUES ('Holliesc98','Log Store','Xmas Lights',10,1,1);
INSERT INTO `devices` VALUES ('Holliesd17a53','Spare','Temperature Monitor',10,0,1);
INSERT INTO `devices` VALUES ('Holliesd17b02','Unknown','Temperature Monitor',100,0,0);
INSERT INTO `devices` VALUES ('Holliesd2eb4f','Utility','MHRV',60,0,0);
INSERT INTO `devices` VALUES ('Holliesd2ebba','Portable','Temperature Monitor',600,0,0);
INSERT INTO `devices` VALUES ('Holliesd2ed1c','Office','Radiator',30,0,5);
INSERT INTO `devices` VALUES ('Holliesd2f2a3','Boiler Rm','Solar Control',30,0,0);
INSERT INTO `devices` VALUES ('Holliesd2f35e','Bedroom','Temperature Monitor',120,0,5);
INSERT INTO `devices` VALUES ('Holliesd2f6c5','Lounge','Woodburner Monitor',100,0,0);
INSERT INTO `devices` VALUES ('Holliesd2f6f0','Spare','Temp Relay',100,0,4);
INSERT INTO `devices` VALUES ('Holliesd2f754','Spare','Relay Controller',100,0,4);
INSERT INTO `devices` VALUES ('Holliesd2fa13','Outside','Pond Relay Controller',20,0,5);
INSERT INTO `devices` VALUES ('Holliesd81de4','Guest1','Rad Controller',30,0,2);
INSERT INTO `devices` VALUES ('Holliesd81ecc','Lounge','Radiator',120,0,1);
INSERT INTO `devices` VALUES ('Holliesd82273','Dining','Temperature Monitor',60,0,1);
INSERT INTO `devices` VALUES ('Holliese673f6','Hall','Temperature Monitor',600,0,0);
INSERT INTO `devices` VALUES ('Holliesf9092d','Lounge','Temperature Monitor',20,0,0);
INSERT INTO `devices` VALUES ('Holliesf9098e','Test','LED Wall',100,0,0);
INSERT INTO `devices` VALUES ('Holliesf909a3','Office','RF433',100,0,0);

--
-- Table structure for table `errordescriptions`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `errordescriptions`;
CREATE TABLE `errordescriptions` (
  `type` tinytext NOT NULL,
  `Device` varchar(50) NOT NULL,
  `number` int(11) NOT NULL,
  `info` int(11) NOT NULL,
  `Description` varchar(100) DEFAULT NULL,
  KEY `Index 1` (`Device`,`type`(100),`number`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `errordescriptions`
--

INSERT INTO `errordescriptions` VALUES ('error','Level Control',51,-1,'Has reconnected');
INSERT INTO `errordescriptions` VALUES ('error','Level Control',1,-1,'SET_MAX_PUMP_ON_WARNING');
INSERT INTO `errordescriptions` VALUES ('alarm','Level Control',4,-1,'Manual mode ON');
INSERT INTO `errordescriptions` VALUES ('alarm','Level Control',5,-1,'Manual mode OFF');
INSERT INTO `errordescriptions` VALUES ('alarm','Level Control',3,-1,'Still Flowing when pump off for 2S');
INSERT INTO `errordescriptions` VALUES ('alarm','Level Control',1,-1,'No flow for SET_NO_FLOW_AUTO_ERROR (10S) in Auto (flow)');
INSERT INTO `errordescriptions` VALUES ('alarm','Level Control',6,-1,'No flow for SET_NO_FLOW_AUTO_ERROR (10S) in Auto (seconds)');
INSERT INTO `errordescriptions` VALUES ('alarm','Level Control',10,-1,'Tank level out of range');
INSERT INTO `errordescriptions` VALUES ('alarm','Level Control',155,66,'Test mode');
INSERT INTO `errordescriptions` VALUES ('error','Temperature Monitor',51,-1,'Has reconnected');
INSERT INTO `errordescriptions` VALUES ('error','Temperature Monitor',56,-1,'Temperature out of range');
INSERT INTO `errordescriptions` VALUES ('error','Temperature Monitor',57,-1,'DS18B20 CRC error');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',80,0,'Signal OB ON wehn emergency dump active');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',81,0,'Signal OB ON when BOTH circulations are ON');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',91,-1,'TS TOP temperature is invalid');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',99,-1,'Emergency heat dump');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',40,-1,'Invalid WB_FLOW temperature ');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',100,-1,'Critical temperature not set');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',20,-1,'DHW temperature low warning');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',20,-1,'DHW temperature low');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',21,-1,'CH temperature low warning');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',51,-1,'Has reconnected');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',92,-1,'Invalid OP ID');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',93,-1,'GPIO2 doesn\'t have same value as OP_EMERGENCY_DUMP_ON');
INSERT INTO `errordescriptions` VALUES ('alarm','Level Control',2,-1,'Running for SET_MAX_PUMP_ON_ERROR (5 Minutes) in Auto');
INSERT INTO `errordescriptions` VALUES ('alarm','Solar Control',98,-1,'Pump not flowing for 10S when ON Nornal');
INSERT INTO `errordescriptions` VALUES ('alarm','Solar Control',99,-1,'Pump not flowing for 30S when ON Override');
INSERT INTO `errordescriptions` VALUES ('alarm','Solar Control',59,-1,'Waiting too long for temperatures to be set');
INSERT INTO `errordescriptions` VALUES ('error','Solar Control',56,-1,'Temperature out of range');
INSERT INTO `errordescriptions` VALUES ('error','Solar Control',57,-1,'DS18B20 CRC error');
INSERT INTO `errordescriptions` VALUES ('error','MHRV',51,-1,'Has reconnected');
INSERT INTO `errordescriptions` VALUES ('error','MHRV',2,-1,'Invalid actionPIR in settings ');
INSERT INTO `errordescriptions` VALUES ('error','MHRV',61,-1,'Invalid result fromDHT[1]');
INSERT INTO `errordescriptions` VALUES ('error','MHRV',62,-1,'Invalid result fromDHT[2]');
INSERT INTO `errordescriptions` VALUES ('error','Radiator',57,-1,'DS18B20 CRC error');
INSERT INTO `errordescriptions` VALUES ('error','Boiler Control',57,-1,'DS18B20 CRC error');
INSERT INTO `errordescriptions` VALUES ('error','Rad Controller',57,-1,'DS18B20 CRC error');

--
-- Table structure for table `heatingoverrides`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `heatingoverrides`;
CREATE TABLE `heatingoverrides` (
  `ID` int(11) unsigned NOT NULL,
  `zoneID` int(11) unsigned NOT NULL,
  `Name` varchar(50) DEFAULT NULL,
  `day` tinyint(4) NOT NULL DEFAULT '10',
  `start` time DEFAULT NULL,
  `duration` time DEFAULT NULL,
  `temperature` tinyint(4) DEFAULT NULL,
  `dontClear` tinyint(1) NOT NULL DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `priority` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `FK_heatingoverrides_heatingzones` (`zoneID`),
  CONSTRAINT `FK_heatingoverrides_heatingzones` FOREIGN KEY (`zoneID`) REFERENCES `heatingzones` (`ID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `heatingoverrides`
--

INSERT INTO `heatingoverrides` VALUES (3,4,'Out',10,'08:24:08','04:00:00',17,0,0,2);
INSERT INTO `heatingoverrides` VALUES (5,6,'Out',10,'08:24:08','04:00:00',17,0,0,2);
INSERT INTO `heatingoverrides` VALUES (6,2,'Top Up',10,'10:00:00','18:30:00',20,0,0,8);
INSERT INTO `heatingoverrides` VALUES (7,7,'Out',10,'08:24:08','04:00:00',17,0,0,2);
INSERT INTO `heatingoverrides` VALUES (10,5,'No Guests',10,'01:00:00','22:00:00',15,1,1,4);
INSERT INTO `heatingoverrides` VALUES (11,5,'Mobile',10,'13:09:00','02:00:00',22,0,0,6);
INSERT INTO `heatingoverrides` VALUES (12,1,'Out',10,'08:24:08','04:00:00',17,0,0,2);
INSERT INTO `heatingoverrides` VALUES (13,2,'Out',10,'08:24:08','04:00:00',17,0,0,2);
INSERT INTO `heatingoverrides` VALUES (14,4,'Mobile',10,'20:35:00','01:00:00',23,0,0,6);
INSERT INTO `heatingoverrides` VALUES (15,9,'Mobile',10,'10:58:00','00:00:00',12,0,0,6);
INSERT INTO `heatingoverrides` VALUES (16,1,'Mobile',10,'19:02:00','02:00:00',20,0,0,6);
INSERT INTO `heatingoverrides` VALUES (17,6,'Mobile',10,'15:56:27','04:00:00',20,0,0,6);
INSERT INTO `heatingoverrides` VALUES (18,2,'Mobile',10,'13:42:37','00:30:00',22,0,0,6);
INSERT INTO `heatingoverrides` VALUES (19,7,'Mobile',10,'13:19:48','01:00:00',12,0,0,6);
INSERT INTO `heatingoverrides` VALUES (20,9,'No Guests',10,'01:00:00','22:00:00',12,1,1,4);
INSERT INTO `heatingoverrides` VALUES (23,5,'Emergency',10,'13:49:35','02:00:00',28,0,0,10);
INSERT INTO `heatingoverrides` VALUES (24,10,'Mobile',10,'11:07:00','00:00:00',23,0,0,6);
INSERT INTO `heatingoverrides` VALUES (26,11,'Emergency',10,'13:49:35','02:00:00',28,0,0,10);
INSERT INTO `heatingoverrides` VALUES (27,11,'Mobile',10,'11:06:00','00:00:00',20,0,0,6);
INSERT INTO `heatingoverrides` VALUES (28,2,'Alexa',10,'12:00:00','01:00:00',15,0,0,9);
INSERT INTO `heatingoverrides` VALUES (29,5,'Alexa',10,'10:15:07','01:00:00',12,0,0,9);
INSERT INTO `heatingoverrides` VALUES (30,1,'Alexa',10,'12:00:00','01:00:00',15,0,0,9);
INSERT INTO `heatingoverrides` VALUES (31,6,'Alexa',10,'19:56:18','01:00:00',15,0,0,9);
INSERT INTO `heatingoverrides` VALUES (32,11,'Alexa',10,'12:00:00','01:00:00',15,0,0,9);
INSERT INTO `heatingoverrides` VALUES (33,4,'Alexa',10,'19:31:28','01:00:00',22,0,0,9);
INSERT INTO `heatingoverrides` VALUES (34,10,'Alexa',10,'12:00:00','01:00:00',15,0,0,9);
INSERT INTO `heatingoverrides` VALUES (35,7,'Alexa',10,'10:15:07','01:00:00',20,0,0,9);
INSERT INTO `heatingoverrides` VALUES (36,9,'Alexa',10,'12:00:00','01:00:00',15,0,0,9);

--
-- Table structure for table `heatingprogrammes`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `heatingprogrammes`;
CREATE TABLE `heatingprogrammes` (
  `zoneID` int(10) unsigned NOT NULL,
  `days` tinyint(3) unsigned NOT NULL DEFAULT '10',
  `start` time NOT NULL,
  `temperature` tinyint(4) NOT NULL DEFAULT '21',
  `preset` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`zoneID`,`days`,`start`),
  KEY `FK_heatingprogrammes_daysofweek` (`days`),
  CONSTRAINT `FK_heatingprogrammes_daysofweek` FOREIGN KEY (`days`) REFERENCES `daysofweek` (`ID`),
  CONSTRAINT `FK_heatingprogrammes_heatingzones` FOREIGN KEY (`zoneID`) REFERENCES `heatingzones` (`ID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `heatingprogrammes`
--

INSERT INTO `heatingprogrammes` VALUES (1,10,'06:00:00',21,0);
INSERT INTO `heatingprogrammes` VALUES (1,10,'16:30:00',22,0);
INSERT INTO `heatingprogrammes` VALUES (1,10,'19:30:00',21,0);
INSERT INTO `heatingprogrammes` VALUES (1,10,'22:00:00',15,0);
INSERT INTO `heatingprogrammes` VALUES (2,10,'08:00:00',18,0);
INSERT INTO `heatingprogrammes` VALUES (2,10,'10:00:00',19,0);
INSERT INTO `heatingprogrammes` VALUES (2,10,'14:00:00',21,0);
INSERT INTO `heatingprogrammes` VALUES (2,10,'19:00:00',12,0);
INSERT INTO `heatingprogrammes` VALUES (4,10,'08:00:00',17,0);
INSERT INTO `heatingprogrammes` VALUES (4,10,'12:00:00',18,0);
INSERT INTO `heatingprogrammes` VALUES (4,10,'14:30:00',21,0);
INSERT INTO `heatingprogrammes` VALUES (4,10,'23:00:00',12,0);
INSERT INTO `heatingprogrammes` VALUES (5,10,'04:30:00',20,0);
INSERT INTO `heatingprogrammes` VALUES (5,10,'09:00:00',16,0);
INSERT INTO `heatingprogrammes` VALUES (5,10,'21:00:00',12,0);
INSERT INTO `heatingprogrammes` VALUES (6,10,'06:30:00',19,0);
INSERT INTO `heatingprogrammes` VALUES (6,10,'18:00:00',19,0);
INSERT INTO `heatingprogrammes` VALUES (6,10,'20:00:00',12,0);
INSERT INTO `heatingprogrammes` VALUES (7,10,'06:45:00',15,0);
INSERT INTO `heatingprogrammes` VALUES (7,10,'07:30:00',17,0);
INSERT INTO `heatingprogrammes` VALUES (7,10,'08:30:00',15,0);
INSERT INTO `heatingprogrammes` VALUES (7,10,'22:00:00',17,0);
INSERT INTO `heatingprogrammes` VALUES (7,10,'23:00:00',12,0);
INSERT INTO `heatingprogrammes` VALUES (9,10,'07:00:00',19,0);
INSERT INTO `heatingprogrammes` VALUES (9,10,'11:00:00',12,0);
INSERT INTO `heatingprogrammes` VALUES (9,10,'15:00:00',20,0);
INSERT INTO `heatingprogrammes` VALUES (9,10,'23:00:00',12,0);
INSERT INTO `heatingprogrammes` VALUES (10,10,'00:00:00',15,0);
INSERT INTO `heatingprogrammes` VALUES (11,10,'00:00:00',17,0);
INSERT INTO `heatingprogrammes` VALUES (11,10,'21:00:00',21,0);
INSERT INTO `heatingprogrammes` VALUES (11,10,'22:00:00',15,0);

--
-- Table structure for table `heatingzones`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `heatingzones`;
CREATE  TABLE `heatingzones` (
  `ID` int(10) unsigned NOT NULL,
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
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `heatingzones`
--

INSERT INTO `heatingzones` VALUES (1,'Family','Holliesa15b9d','28ff46d56c140415','Hollies11c554','20',26,12,1,0,0.022246,-0.195259,0.022888,-0.475379);
INSERT INTO `heatingzones` VALUES (2,'Lounge UFH','Holliesf9092d','28b2358e050000d8','Hollies11c554','22',24,12,2,0,0,0.03,1,0);
INSERT INTO `heatingzones` VALUES (4,'Lounge Rad','Holliesf9092d','28b2358e050000d8','Holliesd81ecc','0',24,12,8,0,0,0,3,0);
INSERT INTO `heatingzones` VALUES (5,'Dining','Holliesd82273','28ff7f1d6714025b','Hollies11c554','23',22,12,5,0,-0.011018,0.109119,0.06315,-0.708867);
INSERT INTO `heatingzones` VALUES (6,'Office','Holliesd2ed1c','28ff1fbdc1160488','Holliesd2ed1c','4',23,12,8,0,-0.054351,0.306194,-0.066007,1.64993);
INSERT INTO `heatingzones` VALUES (7,'Bedroom','Holliesd2f35e','28d8b47c050000a4','Holliesd2f35e','4',20,12,8,0,0,0,0.001,0);
INSERT INTO `heatingzones` VALUES (8,'Any Radiator','Holliesc98','286bd27d050000f8','Hollies11c554','21',22,12,8,1,0,0,0,0);
INSERT INTO `heatingzones` VALUES (9,'Guest1','Holliesd81de4','28aa3e5b050000d2','Holliesd81de4','1',23,12,8,0,0,0,0,0);
INSERT INTO `heatingzones` VALUES (10,'Toilet','Holliesd2eb4f','1','Hollies11c554','24',28,12,10,0,0,0,0,0);
INSERT INTO `heatingzones` VALUES (11,'Hall','Hollies-L','2','Hollies11c554','27',20,12,10,0,0,0,0,0);
INSERT INTO `heatingzones` VALUES (12,'Family','Hollies-F','2','Hollies11c554','25',26,12,1,0,0,0,0,0);

--
-- Temporary table structure for view `latest100values`
--

SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `latest100values` (
  `DeviceID` tinyint NOT NULL,
  `SensorID` tinyint NOT NULL,
  `Time` tinyint NOT NULL,
  `Value` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `latestgroupvalues`
--

SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `latestgroupvalues` (
  `DeviceID` tinyint NOT NULL,
  `SensorID` tinyint NOT NULL,
  `Time` tinyint NOT NULL,
  `Value` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `latestvalues`
--

SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `latestvalues` (
  `location` tinyint NOT NULL,
  `deviceName` tinyint NOT NULL,
  `sensorName` tinyint NOT NULL,
  `Type` tinyint NOT NULL,
  `Units` tinyint NOT NULL,
  `ScaleFactor` tinyint NOT NULL,
  `value` tinyint NOT NULL,
  `TIME` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `lightingareas`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `lightingareas`;
CREATE TABLE `lightingareas` (
  `ID` int(10) unsigned NOT NULL,
  `Name` varchar(20) NOT NULL,
  PRIMARY KEY (`ID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lightingareas`
--

INSERT INTO `lightingareas` VALUES (1,'Hall');
INSERT INTO `lightingareas` VALUES (2,'Lounge');
INSERT INTO `lightingareas` VALUES (3,'Office');
INSERT INTO `lightingareas` VALUES (4,'Family');
INSERT INTO `lightingareas` VALUES (5,'Utility');
INSERT INTO `lightingareas` VALUES (6,'Garage');
INSERT INTO `lightingareas` VALUES (7,'Log Store');

--
-- Temporary table structure for view `obsummary`
--

SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `obsummary` (
  `temp` tinyint NOT NULL,
  `OB1` tinyint NOT NULL,
  `OBP` tinyint NOT NULL,
  `saving` tinyint NOT NULL,
  `Month` tinyint NOT NULL,
  `Day` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `oilburneron`
--

SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `oilburneron` (
  `OBON` tinyint NOT NULL,
  `Day` tinyint NOT NULL,
  `Month` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Temporary table structure for view `oilpumpon`
--

SET @saved_cs_client     = @@character_set_client;
SET character_set_client = utf8;
/*!50001 CREATE TABLE `oilpumpon` (
  `OBPump` tinyint NOT NULL,
  `Day` tinyint NOT NULL,
  `Month` tinyint NOT NULL
) ENGINE=MyISAM */;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `output`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `output`;
CREATE TABLE `output` (
  `Temp` double DEFAULT NULL,
  `Time` datetime DEFAULT NULL
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `output`
--

INSERT INTO `output` VALUES (0,'2017-09-10 00:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 00:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 01:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 01:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 02:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 02:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 03:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 03:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 04:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 04:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 05:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 05:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 06:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 06:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 07:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 07:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 08:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 08:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 09:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 09:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 10:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 10:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 11:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 11:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 12:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 12:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 13:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 13:30:00');
INSERT INTO `output` VALUES (0.944444,'2017-09-10 14:00:00');
INSERT INTO `output` VALUES (1,'2017-09-10 14:30:00');
INSERT INTO `output` VALUES (1,'2017-09-10 15:00:00');
INSERT INTO `output` VALUES (1,'2017-09-10 15:30:00');
INSERT INTO `output` VALUES (1,'2017-09-10 16:00:00');
INSERT INTO `output` VALUES (1,'2017-09-10 16:30:00');
INSERT INTO `output` VALUES (1,'2017-09-10 17:00:00');
INSERT INTO `output` VALUES (1,'2017-09-10 17:30:00');
INSERT INTO `output` VALUES (1,'2017-09-10 18:00:00');
INSERT INTO `output` VALUES (1,'2017-09-10 18:30:00');
INSERT INTO `output` VALUES (0.055556,'2017-09-10 19:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 19:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 20:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 20:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 21:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 21:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 22:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 22:30:00');
INSERT INTO `output` VALUES (0,'2017-09-10 23:00:00');
INSERT INTO `output` VALUES (0,'2017-09-10 23:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 00:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 00:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 01:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 01:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 02:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 02:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 03:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 03:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 04:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 04:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 05:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 05:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 06:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 06:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 07:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 07:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 08:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 08:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 09:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 09:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 10:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 10:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 11:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 11:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 12:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 12:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 13:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 13:30:00');
INSERT INTO `output` VALUES (1,'2017-09-11 14:00:00');
INSERT INTO `output` VALUES (1,'2017-09-11 14:30:00');
INSERT INTO `output` VALUES (1,'2017-09-11 15:00:00');
INSERT INTO `output` VALUES (1,'2017-09-11 15:30:00');
INSERT INTO `output` VALUES (1,'2017-09-11 16:00:00');
INSERT INTO `output` VALUES (1,'2017-09-11 16:30:00');
INSERT INTO `output` VALUES (1,'2017-09-11 17:00:00');
INSERT INTO `output` VALUES (1,'2017-09-11 17:30:00');
INSERT INTO `output` VALUES (1,'2017-09-11 18:00:00');
INSERT INTO `output` VALUES (1,'2017-09-11 18:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 19:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 19:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 20:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 20:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 21:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 21:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 22:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 22:30:00');
INSERT INTO `output` VALUES (0,'2017-09-11 23:00:00');
INSERT INTO `output` VALUES (0,'2017-09-11 23:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 00:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 00:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 01:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 01:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 02:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 02:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 03:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 03:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 04:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 04:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 05:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 05:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 06:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 06:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 07:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 07:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 08:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 08:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 09:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 09:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 10:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 10:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 11:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 11:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 12:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 12:30:00');
INSERT INTO `output` VALUES (0,'2017-09-12 13:00:00');
INSERT INTO `output` VALUES (0,'2017-09-12 13:30:00');
INSERT INTO `output` VALUES (1,'2017-09-12 14:00:00');
INSERT INTO `output` VALUES (1,'2017-09-12 14:30:00');
INSERT INTO `output` VALUES (1,'2017-09-12 15:00:00');
INSERT INTO `output` VALUES (1,'2017-09-12 15:30:00');
INSERT INTO `output` VALUES (1,'2017-09-12 16:00:00');

--
-- Table structure for table `outputtable`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `outputtable`;
CREATE TABLE `outputtable` (
  `Value` double DEFAULT NULL,
  `Time` datetime DEFAULT NULL
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outputtable`
--

INSERT INTO `outputtable` VALUES (0,'2017-09-11 00:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 00:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 01:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 01:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 02:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 02:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 03:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 03:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 04:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 04:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 05:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 05:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 06:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 06:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 07:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 07:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 08:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 08:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 09:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 09:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 10:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 10:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 11:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 11:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 12:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 12:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 13:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 13:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 14:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 14:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 15:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 15:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 16:00:00');
INSERT INTO `outputtable` VALUES (1,'2017-09-11 16:30:00');
INSERT INTO `outputtable` VALUES (1,'2017-09-11 17:00:00');
INSERT INTO `outputtable` VALUES (1,'2017-09-11 17:30:00');
INSERT INTO `outputtable` VALUES (1,'2017-09-11 18:00:00');
INSERT INTO `outputtable` VALUES (1,'2017-09-11 18:30:00');
INSERT INTO `outputtable` VALUES (0.1,'2017-09-11 19:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 19:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 20:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 20:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 21:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 21:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 22:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 22:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 23:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-11 23:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 00:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 00:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 01:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 01:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 02:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 02:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 03:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 03:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 04:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 04:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 05:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 05:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 06:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 06:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 07:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 07:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 08:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 08:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 09:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 09:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 10:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 10:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 11:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 11:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 12:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 12:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 13:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 13:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 14:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 14:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 15:00:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 15:30:00');
INSERT INTO `outputtable` VALUES (0,'2017-09-12 16:00:00');
INSERT INTO `outputtable` VALUES (1,'2017-09-12 16:30:00');
INSERT INTO `outputtable` VALUES (1,'2017-09-12 17:00:00');
INSERT INTO `outputtable` VALUES (1,'2017-09-12 17:30:00');

--
-- Table structure for table `outside`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `outside`;
CREATE TABLE `outside` (
  `Temp` double DEFAULT NULL,
  `Time` datetime DEFAULT NULL
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outside`
--

INSERT INTO `outside` VALUES (20.142278,'2017-09-11 00:00:00');
INSERT INTO `outside` VALUES (20.182445,'2017-09-11 00:30:00');
INSERT INTO `outside` VALUES (20.130334,'2017-09-11 01:00:00');
INSERT INTO `outside` VALUES (20.075333,'2017-09-11 01:30:00');
INSERT INTO `outside` VALUES (20.01,'2017-09-11 02:00:00');
INSERT INTO `outside` VALUES (19.932945,'2017-09-11 02:30:00');
INSERT INTO `outside` VALUES (19.872001,'2017-09-11 03:00:00');
INSERT INTO `outside` VALUES (19.797333,'2017-09-11 03:30:00');
INSERT INTO `outside` VALUES (19.724722,'2017-09-11 04:00:00');
INSERT INTO `outside` VALUES (19.651001,'2017-09-11 04:30:00');
INSERT INTO `outside` VALUES (19.587333,'2017-09-11 05:00:00');
INSERT INTO `outside` VALUES (19.525333,'2017-09-11 05:30:00');
INSERT INTO `outside` VALUES (19.464556,'2017-09-11 06:00:00');
INSERT INTO `outside` VALUES (19.420389,'2017-09-11 06:30:00');
INSERT INTO `outside` VALUES (19.373667,'2017-09-11 07:00:00');
INSERT INTO `outside` VALUES (19.354667,'2017-09-11 07:30:00');
INSERT INTO `outside` VALUES (19.370111,'2017-09-11 08:00:00');
INSERT INTO `outside` VALUES (19.383222,'2017-09-11 08:30:00');
INSERT INTO `outside` VALUES (19.385444,'2017-09-11 09:00:00');
INSERT INTO `outside` VALUES (19.406889,'2017-09-11 09:30:00');
INSERT INTO `outside` VALUES (19.451167,'2017-09-11 10:00:00');
INSERT INTO `outside` VALUES (19.498667,'2017-09-11 10:30:00');
INSERT INTO `outside` VALUES (19.593667,'2017-09-11 11:00:00');
INSERT INTO `outside` VALUES (19.663833,'2017-09-11 11:30:00');
INSERT INTO `outside` VALUES (19.696611,'2017-09-11 12:00:00');
INSERT INTO `outside` VALUES (19.832445,'2017-09-11 12:30:00');
INSERT INTO `outside` VALUES (19.926333,'2017-09-11 13:00:00');
INSERT INTO `outside` VALUES (19.975333,'2017-09-11 13:30:00');
INSERT INTO `outside` VALUES (20.028055,'2017-09-11 14:00:00');
INSERT INTO `outside` VALUES (20.081136,'2017-09-11 14:30:00');
INSERT INTO `outside` VALUES (20.157555,'2017-09-11 15:00:00');
INSERT INTO `outside` VALUES (20.2575,'2017-09-11 15:30:00');
INSERT INTO `outside` VALUES (20.339667,'2017-09-11 16:00:00');
INSERT INTO `outside` VALUES (20.418222,'2017-09-11 16:30:00');
INSERT INTO `outside` VALUES (20.503555,'2017-09-11 17:00:00');
INSERT INTO `outside` VALUES (20.5884,'2017-09-11 17:30:00');
INSERT INTO `outside` VALUES (20.707389,'2017-09-11 18:00:00');
INSERT INTO `outside` VALUES (20.800445,'2017-09-11 18:30:00');
INSERT INTO `outside` VALUES (20.872589,'2017-09-11 19:00:00');
INSERT INTO `outside` VALUES (20.875476,'2017-09-11 19:30:00');
INSERT INTO `outside` VALUES (20.932056,'2017-09-11 20:00:00');
INSERT INTO `outside` VALUES (21.016667,'2017-09-11 20:30:00');
INSERT INTO `outside` VALUES (20.976333,'2017-09-11 21:00:00');
INSERT INTO `outside` VALUES (20.922778,'2017-09-11 21:30:00');
INSERT INTO `outside` VALUES (20.845278,'2017-09-11 22:00:00');
INSERT INTO `outside` VALUES (20.811676,'2017-09-11 22:30:00');
INSERT INTO `outside` VALUES (20.642055,'2017-09-11 23:00:00');
INSERT INTO `outside` VALUES (20.508111,'2017-09-11 23:30:00');
INSERT INTO `outside` VALUES (20.401278,'2017-09-12 00:00:00');
INSERT INTO `outside` VALUES (20.304167,'2017-09-12 00:30:00');
INSERT INTO `outside` VALUES (20.2205,'2017-09-12 01:00:00');
INSERT INTO `outside` VALUES (20.132889,'2017-09-12 01:30:00');
INSERT INTO `outside` VALUES (20.051223,'2017-09-12 02:00:00');
INSERT INTO `outside` VALUES (19.975,'2017-09-12 02:30:00');
INSERT INTO `outside` VALUES (19.899278,'2017-09-12 03:00:00');
INSERT INTO `outside` VALUES (19.811834,'2017-09-12 03:30:00');
INSERT INTO `outside` VALUES (19.740334,'2017-09-12 04:00:00');
INSERT INTO `outside` VALUES (19.663111,'2017-09-12 04:30:00');
INSERT INTO `outside` VALUES (19.594333,'2017-09-12 05:00:00');
INSERT INTO `outside` VALUES (19.525,'2017-09-12 05:30:00');
INSERT INTO `outside` VALUES (19.465056,'2017-09-12 06:00:00');
INSERT INTO `outside` VALUES (19.399,'2017-09-12 06:30:00');
INSERT INTO `outside` VALUES (19.343945,'2017-09-12 07:00:00');
INSERT INTO `outside` VALUES (19.318556,'2017-09-12 07:30:00');
INSERT INTO `outside` VALUES (19.250334,'2017-09-12 08:00:00');
INSERT INTO `outside` VALUES (19.232,'2017-09-12 08:30:00');
INSERT INTO `outside` VALUES (19.217,'2017-09-12 09:00:00');
INSERT INTO `outside` VALUES (19.228334,'2017-09-12 09:30:00');
INSERT INTO `outside` VALUES (19.256334,'2017-09-12 10:00:00');
INSERT INTO `outside` VALUES (19.309889,'2017-09-12 10:30:00');
INSERT INTO `outside` VALUES (19.419333,'2017-09-12 11:00:00');
INSERT INTO `outside` VALUES (19.544667,'2017-09-12 11:30:00');
INSERT INTO `outside` VALUES (19.604334,'2017-09-12 12:00:00');
INSERT INTO `outside` VALUES (19.696889,'2017-09-12 12:30:00');
INSERT INTO `outside` VALUES (19.749334,'2017-09-12 13:00:00');
INSERT INTO `outside` VALUES (19.747611,'2017-09-12 13:30:00');
INSERT INTO `outside` VALUES (19.818945,'2017-09-12 14:00:00');
INSERT INTO `outside` VALUES (19.860334,'2017-09-12 14:30:00');
INSERT INTO `outside` VALUES (19.900278,'2017-09-12 15:00:00');
INSERT INTO `outside` VALUES (19.984167,'2017-09-12 15:30:00');
INSERT INTO `outside` VALUES (20.102611,'2017-09-12 16:00:00');
INSERT INTO `outside` VALUES (20.1885,'2017-09-12 16:30:00');
INSERT INTO `outside` VALUES (20.253921,'2017-09-12 17:00:00');

--
-- Table structure for table `pond`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `pond`;
CREATE TABLE `pond` (
  `ID` int(10) unsigned NOT NULL,
  `startTime` time NOT NULL DEFAULT '12:00:00',
  `outputID` tinyint(3) unsigned NOT NULL,
  `active` tinyint(3) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`ID`),
  KEY `startTime` (`startTime`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pond`
--

INSERT INTO `pond` VALUES (2,'15:00:00',22,0);
INSERT INTO `pond` VALUES (3,'17:00:00',21,0);
INSERT INTO `pond` VALUES (5,'20:00:00',21,0);
INSERT INTO `pond` VALUES (6,'17:00:00',22,0);

--
-- Table structure for table `room`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room` (
  `Temp` double DEFAULT NULL,
  `Time` datetime DEFAULT NULL
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `room`
--

INSERT INTO `room` VALUES (20.142278,'2017-09-11 00:00:00');
INSERT INTO `room` VALUES (20.182445,'2017-09-11 00:30:00');
INSERT INTO `room` VALUES (20.130334,'2017-09-11 01:00:00');
INSERT INTO `room` VALUES (20.075333,'2017-09-11 01:30:00');
INSERT INTO `room` VALUES (20.01,'2017-09-11 02:00:00');
INSERT INTO `room` VALUES (19.932945,'2017-09-11 02:30:00');
INSERT INTO `room` VALUES (19.872001,'2017-09-11 03:00:00');
INSERT INTO `room` VALUES (19.797333,'2017-09-11 03:30:00');
INSERT INTO `room` VALUES (19.724722,'2017-09-11 04:00:00');
INSERT INTO `room` VALUES (19.651001,'2017-09-11 04:30:00');
INSERT INTO `room` VALUES (19.587333,'2017-09-11 05:00:00');
INSERT INTO `room` VALUES (19.525333,'2017-09-11 05:30:00');
INSERT INTO `room` VALUES (19.464556,'2017-09-11 06:00:00');
INSERT INTO `room` VALUES (19.420389,'2017-09-11 06:30:00');
INSERT INTO `room` VALUES (19.373667,'2017-09-11 07:00:00');
INSERT INTO `room` VALUES (19.354667,'2017-09-11 07:30:00');
INSERT INTO `room` VALUES (19.370111,'2017-09-11 08:00:00');
INSERT INTO `room` VALUES (19.383222,'2017-09-11 08:30:00');
INSERT INTO `room` VALUES (19.385444,'2017-09-11 09:00:00');
INSERT INTO `room` VALUES (19.406889,'2017-09-11 09:30:00');
INSERT INTO `room` VALUES (19.451167,'2017-09-11 10:00:00');
INSERT INTO `room` VALUES (19.498667,'2017-09-11 10:30:00');
INSERT INTO `room` VALUES (19.593667,'2017-09-11 11:00:00');
INSERT INTO `room` VALUES (19.663833,'2017-09-11 11:30:00');
INSERT INTO `room` VALUES (19.696611,'2017-09-11 12:00:00');
INSERT INTO `room` VALUES (19.832445,'2017-09-11 12:30:00');
INSERT INTO `room` VALUES (19.926333,'2017-09-11 13:00:00');
INSERT INTO `room` VALUES (19.975333,'2017-09-11 13:30:00');
INSERT INTO `room` VALUES (20.028055,'2017-09-11 14:00:00');
INSERT INTO `room` VALUES (20.081136,'2017-09-11 14:30:00');
INSERT INTO `room` VALUES (20.157555,'2017-09-11 15:00:00');
INSERT INTO `room` VALUES (20.2575,'2017-09-11 15:30:00');
INSERT INTO `room` VALUES (20.339667,'2017-09-11 16:00:00');
INSERT INTO `room` VALUES (20.418222,'2017-09-11 16:30:00');
INSERT INTO `room` VALUES (20.503555,'2017-09-11 17:00:00');
INSERT INTO `room` VALUES (20.5884,'2017-09-11 17:30:00');
INSERT INTO `room` VALUES (20.707389,'2017-09-11 18:00:00');
INSERT INTO `room` VALUES (20.800445,'2017-09-11 18:30:00');
INSERT INTO `room` VALUES (20.872589,'2017-09-11 19:00:00');
INSERT INTO `room` VALUES (20.875476,'2017-09-11 19:30:00');
INSERT INTO `room` VALUES (20.932056,'2017-09-11 20:00:00');
INSERT INTO `room` VALUES (21.016667,'2017-09-11 20:30:00');
INSERT INTO `room` VALUES (20.976333,'2017-09-11 21:00:00');
INSERT INTO `room` VALUES (20.922778,'2017-09-11 21:30:00');
INSERT INTO `room` VALUES (20.845278,'2017-09-11 22:00:00');
INSERT INTO `room` VALUES (20.811676,'2017-09-11 22:30:00');
INSERT INTO `room` VALUES (20.642055,'2017-09-11 23:00:00');
INSERT INTO `room` VALUES (20.508111,'2017-09-11 23:30:00');
INSERT INTO `room` VALUES (20.401278,'2017-09-12 00:00:00');
INSERT INTO `room` VALUES (20.304167,'2017-09-12 00:30:00');
INSERT INTO `room` VALUES (20.2205,'2017-09-12 01:00:00');
INSERT INTO `room` VALUES (20.132889,'2017-09-12 01:30:00');
INSERT INTO `room` VALUES (20.051223,'2017-09-12 02:00:00');
INSERT INTO `room` VALUES (19.975,'2017-09-12 02:30:00');
INSERT INTO `room` VALUES (19.899278,'2017-09-12 03:00:00');
INSERT INTO `room` VALUES (19.811834,'2017-09-12 03:30:00');
INSERT INTO `room` VALUES (19.740334,'2017-09-12 04:00:00');
INSERT INTO `room` VALUES (19.663111,'2017-09-12 04:30:00');
INSERT INTO `room` VALUES (19.594333,'2017-09-12 05:00:00');
INSERT INTO `room` VALUES (19.525,'2017-09-12 05:30:00');
INSERT INTO `room` VALUES (19.465056,'2017-09-12 06:00:00');
INSERT INTO `room` VALUES (19.399,'2017-09-12 06:30:00');
INSERT INTO `room` VALUES (19.343945,'2017-09-12 07:00:00');
INSERT INTO `room` VALUES (19.318556,'2017-09-12 07:30:00');
INSERT INTO `room` VALUES (19.250334,'2017-09-12 08:00:00');
INSERT INTO `room` VALUES (19.232,'2017-09-12 08:30:00');
INSERT INTO `room` VALUES (19.217,'2017-09-12 09:00:00');
INSERT INTO `room` VALUES (19.228334,'2017-09-12 09:30:00');
INSERT INTO `room` VALUES (19.256334,'2017-09-12 10:00:00');
INSERT INTO `room` VALUES (19.309889,'2017-09-12 10:30:00');
INSERT INTO `room` VALUES (19.419333,'2017-09-12 11:00:00');
INSERT INTO `room` VALUES (19.544667,'2017-09-12 11:30:00');
INSERT INTO `room` VALUES (19.604334,'2017-09-12 12:00:00');
INSERT INTO `room` VALUES (19.696889,'2017-09-12 12:30:00');
INSERT INTO `room` VALUES (19.749334,'2017-09-12 13:00:00');
INSERT INTO `room` VALUES (19.747611,'2017-09-12 13:30:00');
INSERT INTO `room` VALUES (19.818945,'2017-09-12 14:00:00');
INSERT INTO `room` VALUES (19.860334,'2017-09-12 14:30:00');
INSERT INTO `room` VALUES (19.900278,'2017-09-12 15:00:00');
INSERT INTO `room` VALUES (19.984167,'2017-09-12 15:30:00');
INSERT INTO `room` VALUES (20.102611,'2017-09-12 16:00:00');
INSERT INTO `room` VALUES (20.1885,'2017-09-12 16:30:00');
INSERT INTO `room` VALUES (20.254723,'2017-09-12 17:00:00');
INSERT INTO `room` VALUES (20.316667,'2017-09-12 17:30:00');

--
-- Table structure for table `sensors`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `sensors`;
CREATE TABLE `sensors` (
  `DeviceID` varchar(50) NOT NULL,
  `SensorID` varchar(50) NOT NULL,
  `Name` varchar(50) NOT NULL DEFAULT 'Not set',
  `Type` varchar(50) NOT NULL DEFAULT 'Temp',
  `Mapping` smallint(5) unsigned DEFAULT NULL,
  `deleteAfter` smallint(5) unsigned NOT NULL DEFAULT '30',
  `ScaleFactor` float NOT NULL DEFAULT '1',
  `Units` varchar(50) NOT NULL DEFAULT 'C',
  PRIMARY KEY (`DeviceID`,`SensorID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sensors`
--

INSERT INTO `sensors` VALUES ('Hollies-F','2','Family','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Hollies-G','2','Not set','Temp',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies-G','3','Not set','Temp',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies-L','2','Hall','Temp',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies-L','4','Lounge','Temp',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies000000','0','Current','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Hollies000000','Wind Average','Wind Average','Speed',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies000000','Wind Max','Wind Max','Speed',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','20','Family','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','21','Rads','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','22','Lounge','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','23','Dining','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','24','Toilet','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','25','5 spare','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','26','WB Supply','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','27','Hall','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','RSSI','RSSI','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c554','Vcc','Vcc','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c785','0','Not set','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c785','1','Not set','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c785','2','Not set','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c785','3','Not set','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c785','ConnectTime','Not set','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c785','RSSI','Not set','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11c785','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11cca1','20','LED','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11cca1','21','1','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11cca1','22','2','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11cca1','23','3','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11cca1','24','4','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11cca1','ConnectTime','Not set','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11cca1','RSSI','Not set','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies11cca1','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies139e26','0','Voltage','Voltage',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies139e26','1','1 Solar','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies139e26','2','2 Car Port','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies139e26','3','3 Lower CU','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies139e26','4','4 House','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies26ef96','0','Voltage','Voltage',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies26ef96','1','1 Skt1','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies26ef96','2','3 Skt 2','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies26ef96','3','2 MHRV','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies26ef96','4','4 Other','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies316b0','0','Pressure','Pressure',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Hollies316b0','1','Pump','Pump',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Hollies316b0','2','Flow','Flow',NULL,30,1,'l/hr');
INSERT INTO `sensors` VALUES ('Hollies316b0','3','Level','Level',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Hollies316b0','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Hollies316b0','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Hollies316b0','Vcc','Vcc','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies4185f','ConnectTime','Not set','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies4185f','RSSI','Not set','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies4185f','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies7215c','ConnectTime','Not set','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies7215c','RSSI','Not set','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies7215c','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies7e600a','0','Voltage','Voltage',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies7e600a','1','1 Garage','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies7e600a','2','2 Extn','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies7e600a','3','3 Office','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies7e600a','4','4 Kitchen','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies95c701','0','LED','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Hollies95c701','1','Socket','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Hollies95c701','2','Green LED','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Hollies95c701','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies95c701','RSSI','RSSI','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies95c701','Vcc','Vcc','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies95de2a','0','LED','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Hollies95de2a','1','Socket','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Hollies95de2a','2','Green LED','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Hollies95de2a','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies95de2a','RSSI','RSSI','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Hollies95de2a','Vcc','Vcc','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa07e57','28ff62976c140415','Room','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa07e57','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa07e57','RSSI','RSSI','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa07e57','Vcc','Vcc','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa15b9d','28ff46d56c140415','Temperature','Temp',0,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa15b9d','ConnectTime','ConnectTime','ConnectTime',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa15b9d','RSSI','RSSI','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa15b9d','Vcc','Vcc','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa15be1','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesa15be1','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesa15be1','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa1fab6','10','isOpen','Input',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa1fab6','11','opening','Input',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa1fab6','12','closing','Input',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa1fab6','ConnectTime','Not set','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa1fab6','RSSI','RSSI','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa1fab6','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa26c59','2881a0df060000ba','Temperature','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa26c59','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesa26c59','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesa26c59','Vcc','Vcc','Vcc',NULL,30,1,'V');
INSERT INTO `sensors` VALUES ('Holliesa6975b','0','Not set','Level',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa6975b','RSSI','Not set','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','10','UFH','Input',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','11','Rads','Input',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','12','WB Supply','Input',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','13','Family','Input',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','14','Lounge','Input',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','20','WB Circ','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','21','OB Pump','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','22','OB ON','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','23','Emergency','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','2801c4e00600008c','TS Cylinder','Temp',7,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','284cf18c05000083','TS Middle','Temp',1,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','285b677d05000088','WB Flow','Temp',3,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','286299df060000bd','OB Return','Temp',8,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','28740e5c05000007','TS Top','Temp',0,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','289b9c6d050000f9','TS Bottom','Temp',2,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','28b4fb6d0500002b','Heating Return','Temp',5,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','28b6b1e0060000b1','Heating Flow','Temp',6,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','28f9ef8c050000b1','OB Flow','Temp',4,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','Attempts','Attempts','Attempts',NULL,30,1,' ');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','CH setpoint','CH setpoint','Temp',10,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','DHW setpoint','DHW setpoint','Temp',11,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','Outside','Outside','Temp',12,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesa69ec3','RSSI','RSSI','RSSI',NULL,120,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesb748c','avgWind','avg Wind','Speed',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesb748c','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesb748c','cutinWind','cutin Wind','Speed',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesb748c','maxWind','max Wind','Speed',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesb748c','minWind','min Wind','Speed',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesb748c','RSSI','RSSI','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesb748c','Vcc','Vcc','Vcc',NULL,30,0.51,'C');
INSERT INTO `sensors` VALUES ('Holliesb748c','Wind Average','Average','Speed',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesb748c','Wind CutIn','CutIn','Speed',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesb748c','Wind Max','Max','Speed',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesb748c','Wind Min','Min','Speed',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesc98','0','Not Set','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesc98','1','Radiator','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesc98','2','Not set','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesc98','286bd27d050000f8','Temperature (old)','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesc98','28ff35d4b31603ed','Temperature','Temp',0,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesc98','3','Not set','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesc98','4','LED','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesc98','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesc98','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesc98','Vcc','Vcc','Vcc',NULL,30,1,'V');
INSERT INTO `sensors` VALUES ('Holliesd17a53','0','Not set','Output',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd17a53','286cf87d05000038','radiator','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd17a53','28ff2805671402bb','Temp','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd17a53','ConnectTime','Not set','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd17a53','RSSI','Not set','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd17a53','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd17b02','28ffc61c67140268','Not set','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd17b02','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesd17b02','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesd17b02','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','0','Utility Temp','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','1','Toilet Temp','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','10','Utility Light PIR On','PIR LIGHT ON',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','2','Utility Humidity','Hum',NULL,30,1,'%');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','3','Toilet Humidity','Hum',NULL,30,1,'%');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','4','Utility PIR','PIR',NULL,30,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','5','Toilet  PIR','PIR',NULL,30,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','6','Toilet Fan PIR On','PIR FAN ON',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','7','Utility Fan PIR On','PIR FAN ON',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','8','Fan','Fan',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','9','Toilet Light PIR On','PIR LIGHT ON',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesd2eb4f','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesd2ebba','0','Not set','Output',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2ebba','288ba1ca06000001','Temperature','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2ebba','ConnectTime','Not set','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2ebba','RSSI','Not set','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2ebba','Vcc','Vcc','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2ed1c','0','Not set','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Holliesd2ed1c','1','Not Set','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Holliesd2ed1c','2','Not set','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Holliesd2ed1c','28c2e207000080bc','Temperature (old)','Temp',1,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2ed1c','28ff1fbdc1160488','Temperature','Temp',0,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2ed1c','3','Not set','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Holliesd2ed1c','4','Office Radiator','Output',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2ed1c','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesd2ed1c','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesd2ed1c','Vcc','Vcc','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','10','Pump','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','280d4d26000080a4','Supply','Temp',2,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','28ff5015671402d0','Panel','Temp',0,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','28ffeb97911503f7','Return','Temp',3,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','4','Flow','Flow',NULL,30,1,'l/hr');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','5','Pressure','Pressure',NULL,30,0.004,'Bar');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','6','Energy','Energy',NULL,30,1,'kw');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','Attempts','Attempts','Attempts',NULL,5,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesd2f2a3','TS Bottom','TS Bottom','Temp',1,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f35e','0','LED','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f35e','1','Not set','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f35e','2','Not set','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f35e','2831b57c050000d6','Not set','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f35e','28d8b47c050000a4','Temperature','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f35e','3','Not set','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f35e','4','Bedroom Radiator','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f35e','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f35e','RSSI','RSSI','RSSI',NULL,10,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesd2f35e','Vcc','Vcc','Vcc',NULL,30,1,'V');
INSERT INTO `sensors` VALUES ('Holliesd2f6c5','28ffe61f67140218','Unit Temp','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f6c5','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesd2f6c5','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesd2f6f0','0','Not set','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f6f0','1','Not set','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f6f0','2','Not set','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f6f0','3','Not set','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f6f0','ConnectTime','Not set','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f6f0','RSSI','Not set','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f6f0','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2f754','0','Family','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f754','1','All Rads','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f754','2','Lounge','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f754','3','Dining','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f754','Attempts','Attempts','Attempts',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd2f754','RSSI','RSSI','RSSI',NULL,120,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesd2fa13','20','LED','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2fa13','21','Lights','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2fa13','22','Waterfall','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2fa13','23','Fountain','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2fa13','24','Spare','Output',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2fa13','ConnectTime','Connect Time','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2fa13','RSSI','Not set','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd2fa13','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd81de4','0','LED','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Holliesd81de4','1','Radiator','Output',NULL,120,1,'');
INSERT INTO `sensors` VALUES ('Holliesd81de4','28aa3e5b050000d2','Temperature','Temp',0,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd81de4','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd81de4','RSSI','RSSI','RSSI',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd81de4','Vcc','Not set','Vcc',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd81ecc','0','Lounge Radiator','Output',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd81ecc','Attempts','Attempts','Attempts',NULL,30,1,' ');
INSERT INTO `sensors` VALUES ('Holliesd81ecc','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesd82273','0','Not set','Output',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd82273','28ff7f1d6714025b','Temperature','Temp',0,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesd82273','ConnectTime','ConnectTime','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesd82273','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesd82273','Vcc','Vcc','Vcc',NULL,30,1,'V');
INSERT INTO `sensors` VALUES ('Holliese1b416','0','Not set','Voltage',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliese1b416','1','Not set','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliese1b416','2','Not set','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliese1b416','3','Not set','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliese1b416','4','Not set','Power',NULL,30,1,'C');
INSERT INTO `sensors` VALUES ('Holliese673f6','28ff839d68140304','Room','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliese673f6','Attempts','Attempts','Attempts',NULL,120,1,' ');
INSERT INTO `sensors` VALUES ('Holliese673f6','RSSI','RSSI','RSSI',NULL,120,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliese673f6','Vcc','Vcc','Vcc',NULL,120,1,'V');
INSERT INTO `sensors` VALUES ('Holliesf9092d','287a1e3f040000db','Woodburner Top','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesf9092d','28b2358e050000d8','Room Top','Temp',NULL,120,1,'C');
INSERT INTO `sensors` VALUES ('Holliesf9092d','ConnectTime','Connect Time','ConnectTime',NULL,30,1,'');
INSERT INTO `sensors` VALUES ('Holliesf9092d','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesf9092d','Vcc','Vcc','Vcc',NULL,30,1,'V');
INSERT INTO `sensors` VALUES ('Holliesf9098e','0','Not set','RSSI',NULL,10,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesf9098e','1','Not set','Message',NULL,10,1,' ');
INSERT INTO `sensors` VALUES ('Holliesf9098e','Attempts','Attempts','Attempts',NULL,30,1,' ');
INSERT INTO `sensors` VALUES ('Holliesf9098e','RSSI','RSSI','RSSI',NULL,30,1,'dBm');
INSERT INTO `sensors` VALUES ('Holliesf909a3','0','Level','Level',NULL,30,1,' ');
INSERT INTO `sensors` VALUES ('Holliesf909a3','Attempts','Attempts','Attempts',NULL,30,1,' ');
INSERT INTO `sensors` VALUES ('Holliesf909a3','RSSI','RSSI','RSSI',NULL,30,1,'dBm');

--
-- Table structure for table `setvalues`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
DROP TABLE IF EXISTS `setvalues`;
CREATE TABLE `setvalues` (
  `DeviceID` varchar(50) NOT NULL,
  `ID` smallint(6) NOT NULL DEFAULT '0',
  `Value` float NOT NULL DEFAULT '0',
  `Name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`DeviceID`,`ID`)
);
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setvalues`
--

INSERT INTO `setvalues` VALUES ('Hollies1004',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies1004',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies1004',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies1004',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies1004',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies1004',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies1004',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies1004',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies1004',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies1004',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c554',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c554',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c554',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c554',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c554',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c554',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c554',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c554',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c554',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c554',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c785',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c785',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c785',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c785',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c785',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c785',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c785',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c785',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c785',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11c785',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11cca1',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11cca1',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11cca1',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11cca1',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11cca1',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11cca1',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11cca1',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11cca1',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11cca1',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies11cca1',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies139e26',0,1,'doPublish');
INSERT INTO `setvalues` VALUES ('Hollies139e26',1,1,'doDisplay');
INSERT INTO `setvalues` VALUES ('Hollies139e26',2,580,'vCalib');
INSERT INTO `setvalues` VALUES ('Hollies139e26',3,132,'Solar');
INSERT INTO `setvalues` VALUES ('Hollies139e26',4,132,'Solar(2)');
INSERT INTO `setvalues` VALUES ('Hollies139e26',5,132,'iCalib3');
INSERT INTO `setvalues` VALUES ('Hollies139e26',6,132,'iCalib4');
INSERT INTO `setvalues` VALUES ('Hollies26ef96',0,1,'doPublish');
INSERT INTO `setvalues` VALUES ('Hollies26ef96',1,1,'doDisplay');
INSERT INTO `setvalues` VALUES ('Hollies26ef96',2,700,'vCalib');
INSERT INTO `setvalues` VALUES ('Hollies26ef96',3,60.61,'iCalib1');
INSERT INTO `setvalues` VALUES ('Hollies26ef96',4,59,'iCalib2');
INSERT INTO `setvalues` VALUES ('Hollies26ef96',5,59,'iCalib3');
INSERT INTO `setvalues` VALUES ('Hollies26ef96',6,63.61,'iCalib4');
INSERT INTO `setvalues` VALUES ('Hollies316b0',0,210,'Pump ON');
INSERT INTO `setvalues` VALUES ('Hollies316b0',1,400,'Pump Off');
INSERT INTO `setvalues` VALUES ('Hollies316b0',2,20,'Flow Time');
INSERT INTO `setvalues` VALUES ('Hollies316b0',3,450,'Flow per Litre');
INSERT INTO `setvalues` VALUES ('Hollies316b0',4,110,'Low pressure Warning');
INSERT INTO `setvalues` VALUES ('Hollies316b0',5,100,'Low Level Warning');
INSERT INTO `setvalues` VALUES ('Hollies316b0',6,4200,'Max Pump On warning');
INSERT INTO `setvalues` VALUES ('Hollies316b0',7,5400,'MAX PUMP ON error');
INSERT INTO `setvalues` VALUES ('Hollies316b0',8,30,'No Flow Auto Error');
INSERT INTO `setvalues` VALUES ('Hollies316b0',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies416a5',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies416a5',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies416a5',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies416a5',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies416a5',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies416a5',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies416a5',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies416a5',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies416a5',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies416a5',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies4185f',0,10,NULL);
INSERT INTO `setvalues` VALUES ('Hollies4185f',1,30,NULL);
INSERT INTO `setvalues` VALUES ('Hollies4185f',2,5,NULL);
INSERT INTO `setvalues` VALUES ('Hollies4185f',3,5,NULL);
INSERT INTO `setvalues` VALUES ('Hollies4185f',4,50,NULL);
INSERT INTO `setvalues` VALUES ('Hollies4185f',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies4185f',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies4185f',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies4185f',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies4185f',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7215c',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7215c',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7215c',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7215c',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7215c',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7215c',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7215c',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7215c',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7215c',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7215c',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7e600a',0,1,'null');
INSERT INTO `setvalues` VALUES ('Hollies7e600a',1,1,NULL);
INSERT INTO `setvalues` VALUES ('Hollies7e600a',2,920,'Voltage');
INSERT INTO `setvalues` VALUES ('Hollies7e600a',3,84,'Garage');
INSERT INTO `setvalues` VALUES ('Hollies7e600a',4,87,'Car Port');
INSERT INTO `setvalues` VALUES ('Hollies7e600a',5,84,'Solar(2)');
INSERT INTO `setvalues` VALUES ('Hollies7e600a',6,60.61,NULL);
INSERT INTO `setvalues` VALUES ('Hollies807053',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies807053',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies807053',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies807053',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies807053',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies807053',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies807053',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies807053',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies807053',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies807053',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95c701',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95c701',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95c701',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95c701',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95c701',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95c701',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95c701',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95c701',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95c701',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95c701',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95de2a',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95de2a',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95de2a',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95de2a',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95de2a',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95de2a',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95de2a',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95de2a',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95de2a',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies95de2a',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f0e',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies985f14',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98ba69',0,47,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98ba69',1,15,'null');
INSERT INTO `setvalues` VALUES ('Hollies98ba69',2,10,'Frame Rate');
INSERT INTO `setvalues` VALUES ('Hollies98ba69',3,20,'Wait Count');
INSERT INTO `setvalues` VALUES ('Hollies98ba69',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98ba69',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98ba69',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98ba69',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98ba69',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98ba69',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98bdf8',0,20,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98bdf8',1,20,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98bdf8',2,20,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98bdf8',3,20,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98bdf8',4,20,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98bdf8',5,20,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98bdf8',6,20,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98bdf8',7,20,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98bdf8',8,20,NULL);
INSERT INTO `setvalues` VALUES ('Hollies98bdf8',9,20,NULL);
INSERT INTO `setvalues` VALUES ('Hollies99982a',0,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies99982a',1,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies99982a',2,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies99982a',3,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies99982a',4,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies99982a',5,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies99982a',6,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies99982a',7,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies99982a',8,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies99982a',9,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ba942',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9c9cc0',0,35,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9c9cc0',1,36,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9c9cc0',2,39,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9c9cc0',3,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9c9cc0',4,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9c9cc0',5,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9c9cc0',6,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9c9cc0',7,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9c9cc0',8,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9c9cc0',9,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ca468',0,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ca468',1,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ca468',2,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ca468',3,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ca468',4,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ca468',5,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ca468',6,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ca468',7,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ca468',8,45,NULL);
INSERT INTO `setvalues` VALUES ('Hollies9ca468',9,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa065d9',0,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa065d9',1,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa065d9',2,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa065d9',3,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa065d9',4,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa065d9',5,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa065d9',6,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa065d9',7,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa065d9',8,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa065d9',9,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',0,0,'DHW_START_BOILER');
INSERT INTO `setvalues` VALUES ('Holliesa07e57',1,0,'DHW_STOP_BOILER');
INSERT INTO `setvalues` VALUES ('Holliesa07e57',2,0,'WB_IS_ON_TEMP');
INSERT INTO `setvalues` VALUES ('Holliesa07e57',3,0,'CH_START_BOILER');
INSERT INTO `setvalues` VALUES ('Holliesa07e57',4,0,'DHW_USE_ALL_HEAT');
INSERT INTO `setvalues` VALUES ('Holliesa07e57',5,0,'RADS_START_BOILER');
INSERT INTO `setvalues` VALUES ('Holliesa07e57',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',8,0,'DHW_ON_HOUR');
INSERT INTO `setvalues` VALUES ('Holliesa07e57',9,0,'DHW_OFF_HOUR');
INSERT INTO `setvalues` VALUES ('Holliesa07e57',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa07e57',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15b9d',0,0,'Pump ON');
INSERT INTO `setvalues` VALUES ('Holliesa15b9d',1,0,'Pump OFF');
INSERT INTO `setvalues` VALUES ('Holliesa15b9d',2,0,'Flow Time');
INSERT INTO `setvalues` VALUES ('Holliesa15b9d',3,0,'Flow per Litre');
INSERT INTO `setvalues` VALUES ('Holliesa15b9d',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15b9d',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15b9d',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15b9d',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15b9d',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15b9d',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15bdd',0,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15bdd',1,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15bdd',2,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15bdd',3,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15bdd',4,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15bdd',5,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15bdd',6,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15bdd',7,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15bdd',8,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15bdd',9,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15be1',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15be1',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15be1',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15be1',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15be1',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15be1',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15be1',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15be1',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15be1',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa15be1',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa1fab6',0,1,'Send RSSI');
INSERT INTO `setvalues` VALUES ('Holliesa1fab6',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa1fab6',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa1fab6',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa1fab6',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa1fab6',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa1fab6',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa1fab6',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa1fab6',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa1fab6',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26917',0,75,'Humidity Utility');
INSERT INTO `setvalues` VALUES ('Holliesa26917',1,75,'Humidity Toilet');
INSERT INTO `setvalues` VALUES ('Holliesa26917',2,25,'Temperature Utility');
INSERT INTO `setvalues` VALUES ('Holliesa26917',3,25,'Temperature Toilet');
INSERT INTO `setvalues` VALUES ('Holliesa26917',4,7,'On');
INSERT INTO `setvalues` VALUES ('Holliesa26917',5,22,'Off');
INSERT INTO `setvalues` VALUES ('Holliesa26917',6,2,'PIR1 ON time');
INSERT INTO `setvalues` VALUES ('Holliesa26917',7,20,'PIR2 ON time');
INSERT INTO `setvalues` VALUES ('Holliesa26917',8,2,'DHT1');
INSERT INTO `setvalues` VALUES ('Holliesa26917',9,2,'DHT2');
INSERT INTO `setvalues` VALUES ('Holliesa26917',10,1,'Action PIR');
INSERT INTO `setvalues` VALUES ('Holliesa26917',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26917',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26917',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26917',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26a66',0,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26a66',1,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26a66',2,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26a66',3,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26a66',4,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26a66',5,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26a66',6,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26a66',7,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26a66',8,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26a66',9,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa26c59',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa2f',0,17,'T0');
INSERT INTO `setvalues` VALUES ('Holliesa2f',1,213,'R0');
INSERT INTO `setvalues` VALUES ('Holliesa2f',2,76,'T100');
INSERT INTO `setvalues` VALUES ('Holliesa2f',3,297,'R100');
INSERT INTO `setvalues` VALUES ('Holliesa2f',4,10,'Flow Time');
INSERT INTO `setvalues` VALUES ('Holliesa2f',5,450,'Flow per Litre');
INSERT INTO `setvalues` VALUES ('Holliesa2f',6,20,'Pump setting');
INSERT INTO `setvalues` VALUES ('Holliesa2f',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa2f',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa2f',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa6919f',0,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa6919f',1,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa6919f',2,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa6919f',3,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69578',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa6975b',0,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa6975b',1,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa6975b',2,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa6975b',3,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',0,60,'DHW set point');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',1,50,'UFH set point');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',2,64,'Rads set point');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',3,4,'Set Point differential');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',4,60,'WB is ON temperature');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',5,50,'DHW Use all heat');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',6,10,'OS Temperature comp');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',7,5,'Boost timer');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',8,2,'Boost amount');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',9,82,'Emergency Dump temp');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',10,0,'OB Pump delay');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',11,7,'DHW ON hour');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',12,22,'DHW OFF hour');
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesa69ec3',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesb748c',0,10,'Pulses per Knot');
INSERT INTO `setvalues` VALUES ('Holliesb748c',1,15,'Monitor Time');
INSERT INTO `setvalues` VALUES ('Holliesb748c',2,5,'Gather Time');
INSERT INTO `setvalues` VALUES ('Holliesb748c',3,5,'Turbine cut in');
INSERT INTO `setvalues` VALUES ('Holliesb748c',4,10,'Reporting Count');
INSERT INTO `setvalues` VALUES ('Holliesb748c',5,400,'Vbat Calibration Mult');
INSERT INTO `setvalues` VALUES ('Holliesb748c',6,850,'Vbat Calibration Div');
INSERT INTO `setvalues` VALUES ('Holliesb748c',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesb748c',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesb748c',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesc98',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd1788b',0,1,'null');
INSERT INTO `setvalues` VALUES ('Holliesd1788b',1,1,'null');
INSERT INTO `setvalues` VALUES ('Holliesd1788b',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd1788b',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd1788b',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd1788b',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd1788b',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd1788b',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd1788b',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd1788b',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17a53',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17a53',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17a53',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17a53',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17a53',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17a53',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17a53',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17a53',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17a53',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17a53',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17b02',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17b02',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17b02',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17b02',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17b02',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17b02',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17b02',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17b02',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17b02',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd17b02',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd29f13',0,78,'Humidity 1');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',1,79,'Humidity 2');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',2,25,'Temperature 1');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',3,25,'Temperature 2');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',4,7,'Start');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',5,22,'Finish');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',6,1,'PIR1 ON time');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',7,1,'PIR2 ON time');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',8,2,'DHT1');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',9,1,'DHT2');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',10,1,'Action PIR');
INSERT INTO `setvalues` VALUES ('Holliesd29f13',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd29f13',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd29f13',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd29f13',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',0,70,'Toilet Humidity');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',1,60,'Utility Humidity');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',2,28,'Toilet Temperature');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',3,28,'Utility Temperature');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',4,7,'Start');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',5,22,'Finish');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',6,15,'Toilet Fan PIR Active');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',7,20,'Utility Fan PIR Active');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',8,2,'Toilet DHT type');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',9,2,'Utility DHT type');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',10,1,'Active PIR');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',11,4,'Toilet Light PIR Active');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',12,2,'Utility Light PIR Active');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',13,0,'');
INSERT INTO `setvalues` VALUES ('Holliesd2eb4f',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',11,7,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',12,22,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ebba',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2ed1c',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',0,0,'T0');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',1,190,'R0');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',2,100,'T100');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',3,320,'R100');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',4,10,'Flow Time');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',5,450,'Flow per Litre');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',6,0,'Pump delay');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',7,18,'Panel Temp Diff');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',8,0,'');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',9,0,'');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',10,0,'');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',11,0,'');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',12,0,'');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',13,0,'');
INSERT INTO `setvalues` VALUES ('Holliesd2f2a3',14,0,'');
INSERT INTO `setvalues` VALUES ('Holliesd2f35e',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f35e',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f35e',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f35e',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f35e',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f35e',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f35e',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f35e',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f35e',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f35e',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',0,100,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',1,200,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',2,10,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',3,450,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',10,1,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6c5',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6f0',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6f0',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6f0',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6f0',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6f0',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6f0',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6f0',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6f0',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6f0',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f6f0',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f754',0,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f754',1,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f754',2,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f754',3,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f754',4,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f754',5,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f754',6,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f754',7,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f754',8,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2f754',9,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2fa13',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2fa13',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2fa13',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2fa13',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2fa13',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2fa13',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2fa13',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2fa13',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2fa13',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd2fa13',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81de4',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81de4',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81de4',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81de4',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81de4',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81de4',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81de4',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81de4',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81de4',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81de4',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81e1e',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81e1e',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81e1e',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81e1e',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81e1e',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81e1e',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81e1e',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81e1e',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81e1e',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81e1e',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81ecc',0,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81ecc',1,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81ecc',2,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81ecc',3,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81ecc',4,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81ecc',5,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81ecc',6,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81ecc',7,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81ecc',8,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd81ecc',9,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82273',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82273',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82273',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82273',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82273',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82273',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82273',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82273',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82273',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82273',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82324',0,6467,'Humidity 1');
INSERT INTO `setvalues` VALUES ('Holliesd82324',1,1817,'Humidity 2');
INSERT INTO `setvalues` VALUES ('Holliesd82324',2,278,'Temperature 1');
INSERT INTO `setvalues` VALUES ('Holliesd82324',3,514,'Temperature 2');
INSERT INTO `setvalues` VALUES ('Holliesd82324',4,258,'Start');
INSERT INTO `setvalues` VALUES ('Holliesd82324',5,276,'Finish');
INSERT INTO `setvalues` VALUES ('Holliesd82324',6,258,'PIR1 ON time');
INSERT INTO `setvalues` VALUES ('Holliesd82324',7,65535,'PIR2 ON time');
INSERT INTO `setvalues` VALUES ('Holliesd82324',8,65535,'DHT1');
INSERT INTO `setvalues` VALUES ('Holliesd82324',9,65535,'DHT2');
INSERT INTO `setvalues` VALUES ('Holliesd82324',10,1,'PIR Action');
INSERT INTO `setvalues` VALUES ('Holliesd82324',11,20,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82324',12,1,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82324',13,2,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82324',14,1,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82324',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82324',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82324',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82324',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd82324',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd8237a',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd8237a',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd8237a',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd8237a',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd8237a',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd8237a',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd8237a',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd8237a',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd8237a',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesd8237a',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliese673f6',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesec9bd',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',0,0,'T0');
INSERT INTO `setvalues` VALUES ('Holliesf9084a',1,190,'R0');
INSERT INTO `setvalues` VALUES ('Holliesf9084a',2,100,'T100');
INSERT INTO `setvalues` VALUES ('Holliesf9084a',3,320,'R100');
INSERT INTO `setvalues` VALUES ('Holliesf9084a',4,10,'Flow Time');
INSERT INTO `setvalues` VALUES ('Holliesf9084a',5,450,'Flow per Litre');
INSERT INTO `setvalues` VALUES ('Holliesf9084a',6,0,'Pump setting');
INSERT INTO `setvalues` VALUES ('Holliesf9084a',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',11,7,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',12,22,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9084a',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf90868',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9092d',0,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9092d',1,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9092d',2,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9092d',3,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9092d',4,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9092d',5,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9092d',6,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9092d',7,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9092d',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9092d',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9098e',0,46,'Matrix Size');
INSERT INTO `setvalues` VALUES ('Holliesf9098e',1,12,'Shift');
INSERT INTO `setvalues` VALUES ('Holliesf9098e',2,20,'Rate');
INSERT INTO `setvalues` VALUES ('Holliesf9098e',3,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9098e',4,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9098e',5,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9098e',6,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9098e',7,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9098e',8,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf9098e',9,45,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',0,50,'Repeat A');
INSERT INTO `setvalues` VALUES ('Holliesf909a3',1,30,'Reppeat B');
INSERT INTO `setvalues` VALUES ('Holliesf909a3',2,27759,'null');
INSERT INTO `setvalues` VALUES ('Holliesf909a3',3,26988,'null');
INSERT INTO `setvalues` VALUES ('Holliesf909a3',4,29541,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',5,20992,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',6,13382,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',7,13107,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',8,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',9,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',11,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',12,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Holliesf909a3',19,0,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',0,29541,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',1,116,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',2,29541,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',3,16896,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',4,26991,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',5,25964,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',6,8306,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',7,28483,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',8,29806,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',9,28530,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',10,0,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',11,7,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',12,22,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',13,0,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',14,0,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',15,0,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',16,0,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',17,0,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',18,0,NULL);
INSERT INTO `setvalues` VALUES ('Testf9084a',19,0,NULL);

--
-- Final view structure for view `avtemp`
--

/*!50001 DROP TABLE IF EXISTS `avtemp`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`DaveN`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `avtemp` AS select 1 AS `temp`,1 AS `Day` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `latest100values`
--

/*!50001 DROP TABLE IF EXISTS `latest100values`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`DaveN`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `latest100values` AS select 1 AS `DeviceID`,1 AS `SensorID`,1 AS `Time`,1 AS `Value` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `latestgroupvalues`
--

/*!50001 DROP TABLE IF EXISTS `latestgroupvalues`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`DaveN`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `latestgroupvalues` AS select 1 AS `DeviceID`,1 AS `SensorID`,1 AS `Time`,1 AS `Value` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `latestvalues`
--

/*!50001 DROP TABLE IF EXISTS `latestvalues`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`DaveN`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `latestvalues` AS select 1 AS `location`,1 AS `deviceName`,1 AS `sensorName`,1 AS `Type`,1 AS `Units`,1 AS `ScaleFactor`,1 AS `value`,1 AS `TIME` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `obsummary`
--

/*!50001 DROP TABLE IF EXISTS `obsummary`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`DaveN`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `obsummary` AS select 1 AS `temp`,1 AS `OB1`,1 AS `OBP`,1 AS `saving`,1 AS `Month`,1 AS `Day` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `oilburneron`
--

/*!50001 DROP TABLE IF EXISTS `oilburneron`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`DaveN`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `oilburneron` AS select 1 AS `OBON`,1 AS `Day`,1 AS `Month` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `oilpumpon`
--

/*!50001 DROP TABLE IF EXISTS `oilpumpon`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`DaveN`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `oilpumpon` AS select 1 AS `OBPump`,1 AS `Day`,1 AS `Month` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-15 16:39:00
