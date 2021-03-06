-- MySQL dump 10.13  Distrib 5.5.32, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: tegf
-- ------------------------------------------------------
-- Server version 5.5.32-0ubuntu0.12.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `action_type`
--

DROP TABLE IF EXISTS `action_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `action_type` (
  `action_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `type` enum('TO_SCENE','TO_ACTIVITY','DIALOG','PICK_UP','ANIMATION') NOT NULL,
  PRIMARY KEY (`action_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action_type`
--

LOCK TABLES `action_type` WRITE;
/*!40000 ALTER TABLE `action_type` DISABLE KEYS */;
INSERT INTO `action_type` VALUES (1,'TO_SCENE'),(2,'TO_ACTIVITY'),(3,'DIALOG'),(4,'PICK_UP'),(5,'ANIMATION');
/*!40000 ALTER TABLE `action_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity` (
  `activity_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_type` enum('LANGUAGE','MATH','QUIZ') NOT NULL,
  `reward_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`activity_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES (3,'MATH',NULL);
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_language`
--

DROP TABLE IF EXISTS `activity_language`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_language` (
  `activity_language_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) NOT NULL,
  PRIMARY KEY (`activity_language_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_language`
--

LOCK TABLES `activity_language` WRITE;
/*!40000 ALTER TABLE `activity_language` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_language` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_math`
--

DROP TABLE IF EXISTS `activity_math`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_math` (
  `activity_math_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) NOT NULL,
  `numbers_range_from` double NOT NULL,
  `numbers_range_to` double NOT NULL,
  `n_operands` int(11) NOT NULL,
  PRIMARY KEY (`activity_math_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_math`
--

LOCK TABLES `activity_math` WRITE;
/*!40000 ALTER TABLE `activity_math` DISABLE KEYS */;
INSERT INTO `activity_math` VALUES (2,3,1,5,2);
/*!40000 ALTER TABLE `activity_math` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_math_to_math_operator_rel`
--

DROP TABLE IF EXISTS `activity_math_to_math_operator_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_math_to_math_operator_rel` (
  `activity_math_id` int(11) NOT NULL,
  `math_operator_id` int(11) NOT NULL,
  PRIMARY KEY (`activity_math_id`,`math_operator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_math_to_math_operator_rel`
--

LOCK TABLES `activity_math_to_math_operator_rel` WRITE;
/*!40000 ALTER TABLE `activity_math_to_math_operator_rel` DISABLE KEYS */;
INSERT INTO `activity_math_to_math_operator_rel` VALUES (2,-1),(2,1);
/*!40000 ALTER TABLE `activity_math_to_math_operator_rel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_quiz`
--

DROP TABLE IF EXISTS `activity_quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activity_quiz` (
  `activity_quiz_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_id` int(11) NOT NULL,
  PRIMARY KEY (`activity_quiz_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_quiz`
--

LOCK TABLES `activity_quiz` WRITE;
/*!40000 ALTER TABLE `activity_quiz` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `avatar`
--

DROP TABLE IF EXISTS `avatar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `avatar` (
  `avatar_id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(50) NOT NULL,
  PRIMARY KEY (`avatar_id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avatar`
--

LOCK TABLES `avatar` WRITE;
/*!40000 ALTER TABLE `avatar` DISABLE KEYS */;
INSERT INTO `avatar` VALUES (1,'/gfx/bg1.svg'),(2,'/gfx/bg2.jpg'),(3,'/gfx/bg3.jpg'),(4,'/gfx/bg4.jpg'),(5,'/gfx/bg5.jpg'),(6,'/gfx/bg6.jpg'),(7,'/gfx/Penguins.jpg'),(8,'/gfx/Koala.jpg'),(9,'/gfx/our/chicken_element.svg'),(10,'/gfx/our/cow_element.svg'),(11,'/gfx/demoPictures/cake.png'),(12,'/gfx/demoPictures/cake2.png'),(13,'/gfx/demoPictures/chicken2.png'),(14,'/gfx/demoPictures/chicken.png'),(15,'/gfx/demoPictures/cow.png'),(16,'/gfx/demoPictures/grandma.png'),(17,'/gfx/demoPictures/hen_house.png'),(18,'/gfx/demoPictures/little girl.png'),(19,'/gfx/demoPictures/livingroom.png'),(20,'/gfx/demoPictures/ground.png');
/*!40000 ALTER TABLE `avatar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `element`
--

DROP TABLE IF EXISTS `element`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `element` (
  `element_id` int(11) NOT NULL AUTO_INCREMENT,
  `element_type_id` int(11) NOT NULL,
  `frame_x` double NOT NULL,
  `frame_y` double NOT NULL,
  `frame_width` double NOT NULL,
  `frame_height` double NOT NULL,
  PRIMARY KEY (`element_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `element`
--

LOCK TABLES `element` WRITE;
/*!40000 ALTER TABLE `element` DISABLE KEYS */;
INSERT INTO `element` VALUES (2,10,1495,654,100,202),(6,7,380,728,100,121),(8,7,427,588,100,121),(9,7,249,755,100,121),(10,9,162,243,100,71),(11,8,317,616,100,124),(12,8,317,614,100,124),(13,9,305,343,100,71),(14,7,963,470,100,121),(15,6,874,616,100,119),(16,8,878,442,100,124),(17,12,568,474,100,135),(18,7,960,455,100,121),(19,9,0,0,100,71),(20,12,581,453,100,135),(21,8,873,448,100,124),(22,12,461,403,100,135),(23,10,810,342,100,202),(24,10,826,347,100,202),(26,10,582,354,100,202),(27,12,464,408,100,135),(28,12,235,103,100,135),(29,5,678,463,100,98),(30,6,783,443,100,119),(31,6,484,439,100,119),(32,5,400,462,100,98);
/*!40000 ALTER TABLE `element` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `element_to_action_type_rel`
--

DROP TABLE IF EXISTS `element_to_action_type_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `element_to_action_type_rel` (
  `element_id` int(11) NOT NULL,
  `action_type_id` int(11) NOT NULL,
  `data` blob NOT NULL,
  PRIMARY KEY (`element_id`,`action_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `element_to_action_type_rel`
--

LOCK TABLES `element_to_action_type_rel` WRITE;
/*!40000 ALTER TABLE `element_to_action_type_rel` DISABLE KEYS */;
INSERT INTO `element_to_action_type_rel` VALUES (2,3,'domsksalksdlsakn lk sald osa dindindind ding ding dongdds'),(6,5,'1'),(8,5,'4'),(9,5,'10'),(10,5,'1'),(13,3,'mooooooo'),(14,5,'1'),(15,5,'7'),(16,5,'1'),(17,1,'4'),(17,3,'Bestemor har bursdag i dag, men jeg har ikke rukket å bake en kake. Vil du hjelpe meg?'),(18,5,'1'),(19,1,'7'),(20,3,'Vi trenger egg og melk!'),(21,2,'3'),(22,1,'6'),(22,3,'Der er bestemor!'),(24,3,'Hei sann!'),(26,3,'Diabetes er min venn.'),(28,3,'Se så glad bestemor ble.');
/*!40000 ALTER TABLE `element_to_action_type_rel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `element_type`
--

DROP TABLE IF EXISTS `element_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `element_type` (
  `element_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `avatar_id` int(11) NOT NULL,
  `sound_id` int(11) NOT NULL,
  `world_id` int(11) NOT NULL,
  PRIMARY KEY (`element_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `element_type`
--

LOCK TABLES `element_type` WRITE;
/*!40000 ALTER TABLE `element_type` DISABLE KEYS */;
INSERT INTO `element_type` VALUES (1,7,1,1),(2,8,1,1),(3,9,1,1),(4,10,1,1),(5,11,1,1),(6,12,1,1),(7,13,1,1),(8,14,1,1),(9,15,1,1),(10,16,1,1),(12,18,1,1);
/*!40000 ALTER TABLE `element_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `element_type_to_action_type_rel`
--

DROP TABLE IF EXISTS `element_type_to_action_type_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `element_type_to_action_type_rel` (
  `element_type_id` int(11) NOT NULL,
  `action_type_id` int(11) NOT NULL,
  PRIMARY KEY (`element_type_id`,`action_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `element_type_to_action_type_rel`
--

LOCK TABLES `element_type_to_action_type_rel` WRITE;
/*!40000 ALTER TABLE `element_type_to_action_type_rel` DISABLE KEYS */;
INSERT INTO `element_type_to_action_type_rel` VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(2,1),(2,2),(2,3),(2,4),(2,5),(3,1),(3,2),(3,3),(3,4),(3,5),(4,1),(4,2),(4,3),(4,4),(4,5);
/*!40000 ALTER TABLE `element_type_to_action_type_rel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game`
--

DROP TABLE IF EXISTS `game`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `game` (
  `game_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `initial_scene_id` int(11) DEFAULT NULL,
  `goal_id` int(11) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`game_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game`
--

LOCK TABLES `game` WRITE;
/*!40000 ALTER TABLE `game` DISABLE KEYS */;
INSERT INTO `game` VALUES (1,1,'Spill',1,NULL,'2013-11-20 11:36:25',NULL),(2,22,'nytt spill',2,NULL,'2013-11-20 11:37:14',NULL),(3,23,'Age of Empires 2',3,NULL,'2013-11-20 11:37:22',NULL),(4,24,'Age of Empires 3!',5,NULL,'2013-11-20 11:48:30',NULL);
/*!40000 ALTER TABLE `game` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goal`
--

DROP TABLE IF EXISTS `goal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goal` (
  `goal_id` int(11) NOT NULL AUTO_INCREMENT,
  `n_rewards` int(11) NOT NULL,
  PRIMARY KEY (`goal_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goal`
--

LOCK TABLES `goal` WRITE;
/*!40000 ALTER TABLE `goal` DISABLE KEYS */;
INSERT INTO `goal` VALUES (1,1);
/*!40000 ALTER TABLE `goal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language_question`
--

DROP TABLE IF EXISTS `language_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `language_question` (
  `language_question_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_language_id` int(11) NOT NULL,
  `language_question_type` enum('PICTURE_RECOGNIZE','SOUND_RECOGNIZE') NOT NULL,
  `correct_alternative` int(11) NOT NULL,
  `data_id` int(11) NOT NULL,
  PRIMARY KEY (`language_question_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language_question`
--

LOCK TABLES `language_question` WRITE;
/*!40000 ALTER TABLE `language_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `language_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `language_question_alternative`
--

DROP TABLE IF EXISTS `language_question_alternative`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `language_question_alternative` (
  `language_question_alternative_id` int(11) NOT NULL AUTO_INCREMENT,
  `language_question_id` int(11) NOT NULL,
  `alternative` text NOT NULL,
  PRIMARY KEY (`language_question_alternative_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `language_question_alternative`
--

LOCK TABLES `language_question_alternative` WRITE;
/*!40000 ALTER TABLE `language_question_alternative` DISABLE KEYS */;
/*!40000 ALTER TABLE `language_question_alternative` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `math_operator`
--

DROP TABLE IF EXISTS `math_operator`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `math_operator` (
  `math_operator_id` int(11) NOT NULL AUTO_INCREMENT,
  `operator` enum('+','-','*','/') NOT NULL,
  PRIMARY KEY (`math_operator_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `math_operator`
--

LOCK TABLES `math_operator` WRITE;
/*!40000 ALTER TABLE `math_operator` DISABLE KEYS */;
INSERT INTO `math_operator` VALUES (1,'+'),(2,'-'),(3,'*'),(4,'/');
/*!40000 ALTER TABLE `math_operator` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_question`
--

DROP TABLE IF EXISTS `quiz_question`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz_question` (
  `quiz_question_id` int(11) NOT NULL AUTO_INCREMENT,
  `activity_quiz_id` int(11) NOT NULL,
  `question` text NOT NULL,
  `time_limit` double DEFAULT NULL,
  `subject_type_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`quiz_question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_question`
--

LOCK TABLES `quiz_question` WRITE;
/*!40000 ALTER TABLE `quiz_question` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_question` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_question_alternative`
--

DROP TABLE IF EXISTS `quiz_question_alternative`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz_question_alternative` (
  `quiz_question_alternative_id` int(11) NOT NULL AUTO_INCREMENT,
  `quiz_question_id` int(11) NOT NULL,
  `alternative` varchar(255) NOT NULL,
  PRIMARY KEY (`quiz_question_alternative_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_question_alternative`
--

LOCK TABLES `quiz_question_alternative` WRITE;
/*!40000 ALTER TABLE `quiz_question_alternative` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_question_alternative` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz_question_correct`
--

DROP TABLE IF EXISTS `quiz_question_correct`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `quiz_question_correct` (
  `quiz_question_id` int(11) NOT NULL,
  `quiz_question_alternative_id` int(11) NOT NULL,
  PRIMARY KEY (`quiz_question_id`,`quiz_question_alternative_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz_question_correct`
--

LOCK TABLES `quiz_question_correct` WRITE;
/*!40000 ALTER TABLE `quiz_question_correct` DISABLE KEYS */;
/*!40000 ALTER TABLE `quiz_question_correct` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward`
--

DROP TABLE IF EXISTS `reward`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reward` (
  `reward_id` int(11) NOT NULL AUTO_INCREMENT,
  `element_id` int(11) NOT NULL,
  PRIMARY KEY (`reward_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward`
--

LOCK TABLES `reward` WRITE;
/*!40000 ALTER TABLE `reward` DISABLE KEYS */;
INSERT INTO `reward` VALUES (1,1);
/*!40000 ALTER TABLE `reward` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene`
--

DROP TABLE IF EXISTS `scene`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scene` (
  `scene_id` int(11) NOT NULL AUTO_INCREMENT,
  `scenetype_id` int(11) NOT NULL,
  `game_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`scene_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene`
--

LOCK TABLES `scene` WRITE;
/*!40000 ALTER TABLE `scene` DISABLE KEYS */;
INSERT INTO `scene` VALUES (1,8,1),(2,7,2),(3,7,3),(4,7,3),(5,8,4),(6,8,4),(7,8,3);
/*!40000 ALTER TABLE `scene` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scene_to_element_rel`
--

DROP TABLE IF EXISTS `scene_to_element_rel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scene_to_element_rel` (
  `scene_id` int(11) NOT NULL,
  `element_id` int(11) NOT NULL,
  PRIMARY KEY (`scene_id`,`element_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scene_to_element_rel`
--

LOCK TABLES `scene_to_element_rel` WRITE;
/*!40000 ALTER TABLE `scene_to_element_rel` DISABLE KEYS */;
INSERT INTO `scene_to_element_rel` VALUES (2,2),(2,6),(2,8),(2,9),(2,11),(2,12),(2,13),(2,15),(3,10),(3,14),(3,16),(3,17),(4,18),(4,19),(4,20),(4,21),(5,22),(5,23),(6,24),(6,27),(7,26),(7,28),(7,29),(7,30),(7,31),(7,32);
/*!40000 ALTER TABLE `scene_to_element_rel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `scenetype`
--

DROP TABLE IF EXISTS `scenetype`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `scenetype` (
  `scenetype_id` int(11) NOT NULL AUTO_INCREMENT,
  `background_avatar_id` int(11) NOT NULL,
  `world_id` int(11) NOT NULL,
  PRIMARY KEY (`scenetype_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `scenetype`
--

LOCK TABLES `scenetype` WRITE;
/*!40000 ALTER TABLE `scenetype` DISABLE KEYS */;
INSERT INTO `scenetype` VALUES (1,1,1),(2,2,2),(3,3,3),(4,4,4),(5,5,5),(6,6,6),(7,17,1),(8,19,1),(9,20,1);
/*!40000 ALTER TABLE `scenetype` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sound`
--

DROP TABLE IF EXISTS `sound`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sound` (
  `sound_id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) NOT NULL,
  PRIMARY KEY (`sound_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sound`
--

LOCK TABLES `sound` WRITE;
/*!40000 ALTER TABLE `sound` DISABLE KEYS */;
INSERT INTO `sound` VALUES (1,'/lyd1.wav'),(2,'/lyd2.wav');
/*!40000 ALTER TABLE `sound` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subject_type`
--

DROP TABLE IF EXISTS `subject_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subject_type` (
  `subject_type_id` int(11) NOT NULL AUTO_INCREMENT,
  `subject` enum('SCIENCE','NORWEGIAN','HISTORY') NOT NULL,
  PRIMARY KEY (`subject_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_type`
--

LOCK TABLES `subject_type` WRITE;
/*!40000 ALTER TABLE `subject_type` DISABLE KEYS */;
INSERT INTO `subject_type` VALUES (1,'SCIENCE'),(2,'NORWEGIAN'),(3,'HISTORY');
/*!40000 ALTER TABLE `subject_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` text NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `unique username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'peter','852fbd08c187f4c237c4243bf3de494b','2013-10-07 11:27:36',NULL),(21,'asdlkj','e0a081c8a7485ad01d0cf0da6b8a34c0','2013-10-21 18:28:52',NULL),(22,'nitharshaan','1c59179c0489e34d4433136468a44c3f','2013-11-20 11:36:40',NULL),(23,'Andreas','e10adc3949ba59abbe56e057f20f883e','2013-11-20 11:36:59',NULL),(24,'Eivind','1e795a929e56bd8aca3347350bdb5bc0','2013-11-20 11:48:16',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `world`
--

DROP TABLE IF EXISTS `world`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `world` (
  `world_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  PRIMARY KEY (`world_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `world`
--

LOCK TABLES `world` WRITE;
/*!40000 ALTER TABLE `world` DISABLE KEYS */;
INSERT INTO `world` VALUES (1,'Bondegrd'),(2,'Verdensrommet'),(3,'Skolegrden'),(4,'Hjemme'),(5,'Snvvvvvvvverden'),(6,'Kjkkkkkkkkkenet');
/*!40000 ALTER TABLE `world` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2013-11-20 12:01:19