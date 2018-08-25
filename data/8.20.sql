/*
SQLyog Ultimate v12.5.0 (64 bit)
MySQL - 8.0.11 : Database - collect_money
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`collect_money` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `collect_money`;

/*Table structure for table `admin_user` */

DROP TABLE IF EXISTS `admin_user`;

CREATE TABLE `admin_user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
  `username` varchar(12) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '密码',
  `login_count` int(11) NOT NULL DEFAULT '0' COMMENT '登陆次数',
  `phone` varchar(12) DEFAULT NULL COMMENT '电话号码',
  `permissions` varchar(2) NOT NULL DEFAULT '1' COMMENT '管理员权限',
  `uid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '用户账号',
  `last_login` datetime DEFAULT NULL COMMENT '最后一次登录',
  `head_img` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '头像地址（废弃）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

/*Data for the table `admin_user` */

insert  into `admin_user`(`id`,`username`,`password`,`login_count`,`phone`,`permissions`,`uid`,`last_login`,`head_img`) values 
(1,'admin','533f9a1b359547ba2ca9f3d175238b9e',53,'18216811014','0','53c671f09df611e8b8cae1a20c3db036','2018-08-19 17:35:49',NULL),
(16,'oldWang','440dd5b5809a68d92f301cc6df849fb8',0,'123','1','c31483f0a0b011e888a631f8ca49293d',NULL,NULL);

/*Table structure for table `admin_user_files` */

DROP TABLE IF EXISTS `admin_user_files`;

CREATE TABLE `admin_user_files` (
  `path` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `thumbnail` varchar(2000) DEFAULT NULL COMMENT '缩略图',
  `uid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '用户id',
  `mobile_url` varchar(1000) DEFAULT NULL COMMENT '备用',
  `id` int(11) NOT NULL DEFAULT '0' COMMENT '外键',
  KEY `id` (`id`),
  CONSTRAINT `admin_user_files_ibfk_1` FOREIGN KEY (`id`) REFERENCES `admin_user` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `admin_user_files` */

insert  into `admin_user_files`(`path`,`thumbnail`,`uid`,`mobile_url`,`id`) values 
('https://images.pexels.com/photos/1138171/pexels-photo-1138171.jpeg?auto=compress&cs=tinysrgb&h=350',NULL,'53c671f09df611e8b8cae1a20c3db036',NULL,1),
('https://images.pexels.com/photos/936102/pexels-photo-936102.jpeg?auto=compress&cs=tinysrgb&h=350',NULL,'c31483f0a0b011e888a631f8ca49293d',NULL,16);

/*Table structure for table `classify` */

DROP TABLE IF EXISTS `classify`;

CREATE TABLE `classify` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classify_id` varchar(32) NOT NULL,
  `classify_name` varchar(100) NOT NULL COMMENT '分类名字',
  `show` tinyint(1) DEFAULT '1' COMMENT '是否显示/备用',
  `del` tinyint(1) DEFAULT NULL COMMENT '是否删除/备用',
  `sort` int(12) DEFAULT NULL COMMENT '排序/备用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `classify` */

insert  into `classify`(`id`,`classify_id`,`classify_name`,`show`,`del`,`sort`,`create_time`) values 
(5,'4e3f4580a15d11e8b13db99fe1c17d7a','川菜',1,NULL,1,'2018-08-16 22:04:35'),
(6,'53c8f730a15d11e8b13db99fe1c17d7a','凉菜',1,NULL,2,'2018-08-16 22:04:44'),
(7,'581b1340a15d11e8b13db99fe1c17d7a','麻辣',1,NULL,3,'2018-08-16 22:04:51'),
(8,'c9df0880a36d11e8b33c5f20a9ff6179','热菜',1,NULL,100,'2018-08-19 13:07:36');

/*Table structure for table `menu` */

DROP TABLE IF EXISTS `menu`;

CREATE TABLE `menu` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键iD',
  `menu_id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '菜id',
  `name` varchar(100) NOT NULL COMMENT '菜名',
  `sold_out` int(10) NOT NULL DEFAULT '0' COMMENT '已售份数',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `discount_price` decimal(10,2) DEFAULT NULL COMMENT '折扣价(备用)',
  `classify` varchar(100) DEFAULT NULL COMMENT '分类（备用）',
  `recommend` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否属于推荐菜品（备用）',
  `today_recommend` tinyint(1) DEFAULT '0' COMMENT '是否属于今日推荐菜品（备用）',
  `feature` tinyint(1) DEFAULT '0' COMMENT '是否是特色菜（备用）',
  `sort` int(11) NOT NULL DEFAULT '1000' COMMENT '排序',
  `create_user` varchar(20) DEFAULT NULL COMMENT '创建者',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `show` varchar(1) DEFAULT '1' COMMENT '是否显示',
  `del` tinyint(1) DEFAULT '0' COMMENT '是否已删除',
  PRIMARY KEY (`id`,`menu_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

/*Data for the table `menu` */

insert  into `menu`(`id`,`menu_id`,`name`,`sold_out`,`price`,`discount_price`,`classify`,`recommend`,`today_recommend`,`feature`,`sort`,`create_user`,`create_time`,`show`,`del`) values 
(1,'a900ff20a15f11e89fb27f17ee66edc8','宫爆鸡丁',10,100.99,NULL,'4e3f4580a15d11e8b13db99fe1c17d7a',0,0,0,2,NULL,'2018-08-16 22:21:26','1',0),
(2,'92898ae0a16011e8940e5b060f821048','川味辣子鸡',10,100.99,NULL,'4e3f4580a15d11e8b13db99fe1c17d7a',0,0,0,2,'admin','2018-08-16 22:27:58','1',0),
(3,'c4dd9b30a16011e8a6ad1becd39fe6a7','串串',10,11.00,NULL,'581b1340a15d11e8b13db99fe1c17d7a',0,0,0,2,'admin','2018-08-16 22:29:22','0',0),
(4,'d69f8130a16011e8a6ad1becd39fe6a7','大盘鸡',111,12.00,NULL,'4e3f4580a15d11e8b13db99fe1c17d7a',0,0,0,2,'admin','2018-08-16 22:29:52','1',0),
(5,'eda0f080a16011e8a6ad1becd39fe6a7','迷你盘鸡',3,12.00,NULL,'4e3f4580a15d11e8b13db99fe1c17d7a',0,0,0,2,'admin','2018-08-16 22:30:31','0',0),
(16,'73fd82c0a2be11e8812009f7c4761da8','小炒肥肠',0,100.11,NULL,'0',0,0,0,100,'admin','2018-08-18 16:12:30','0',0),
(18,'763b5940a2c811e8b5b8cbd165ad3ac5','川菜',0,12.00,NULL,'111',0,0,0,100,'admin','2018-08-18 17:24:09','0',0),
(20,'5fe1d0d0a31711e8b5c20f7655f3f142','火烧鸡',0,100.99,NULL,'4e3f4580a15d11e8b13db99fe1c17d7a',0,0,0,2,'admin','2018-08-19 02:49:02','1',0),
(21,'9ea64a90a36611e8ad17c724120fe2a8','青椒皮蛋',0,18.00,NULL,'53c8f730a15d11e8b13db99fe1c17d7a',0,0,0,0,'admin','2018-08-19 12:16:17','0',0),
(22,'e0345d80a36611e8a9e16592d904ec6b','三思',0,18.00,NULL,'53c8f730a15d11e8b13db99fe1c17d7a',0,0,0,1000,'admin','2018-08-19 12:18:07','0',0),
(23,'ce81dfd0a37111e89fc465a3ea8504ea','测试',0,111.00,NULL,'581b1340a15d11e8b13db99fe1c17d7a',0,0,0,1000,'admin','2018-08-19 13:36:22','0',0);

/*Table structure for table `menu_files` */

DROP TABLE IF EXISTS `menu_files`;

CREATE TABLE `menu_files` (
  `path` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `thumbnail` varchar(2000) DEFAULT NULL COMMENT '缩略图',
  `mobile_url` varchar(1000) DEFAULT NULL COMMENT '备用',
  `id` int(11) NOT NULL DEFAULT '0' COMMENT '外键',
  `menu_id` varchar(32) NOT NULL,
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `menu_files` */

insert  into `menu_files`(`path`,`thumbnail`,`mobile_url`,`id`,`menu_id`) values 
('images/menu/1534646563448_food-salad-healthy-lunch.jpg',NULL,NULL,0,'92898ae0a16011e8940e5b060f821048'),
('images/menu/1534649029815_meat-vegetables-gemuesepiess-mushrooms-111131.jpg',NULL,NULL,0,'c4dd9b30a16011e8a6ad1becd39fe6a7'),
('images/menu/1534649156649_pexels-photo-76093.jpg',NULL,NULL,0,'d69f8130a16011e8a6ad1becd39fe6a7'),
('images/menu/1534649180477_pexels-photo-842545.jpg',NULL,NULL,0,'eda0f080a16011e8a6ad1becd39fe6a7'),
('images/menu/1534649202590_pexels-photo-247685.png',NULL,NULL,0,'763b5940a2c811e8b5b8cbd165ad3ac5'),
('images/menu/1534649220981_pexels-photo-262959.jpg',NULL,NULL,0,'73fd82c0a2be11e8812009f7c4761da8'),
('images/menu/1534649239337_pexels-photo-954677.jpg',NULL,NULL,0,'5fe1d0d0a31711e8b5c20f7655f3f142'),
('images/menu/1534648786272_food-dinner-pasta-spaghetti-8500.jpg',NULL,NULL,0,'a900ff20a15f11e89fb27f17ee66edc8'),
('images/menu/1534648792865_pexels-photo-132694.jpg',NULL,NULL,0,'a900ff20a15f11e89fb27f17ee66edc8'),
('images/menu/1534652286765_pexels-photo-839347.jpg',NULL,NULL,0,'e0345d80a36611e8a9e16592d904ec6b'),
('images/menu/1534651934296_pexels-photo-842545.jpg',NULL,NULL,0,'9ea64a90a36611e8ad17c724120fe2a8'),
('images/menu/1534656965941_pexels-photo-132694.jpg',NULL,NULL,0,'ce81dfd0a37111e89fc465a3ea8504ea');

/*Table structure for table `order` */

DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` varchar(32) NOT NULL COMMENT '订单id',
  `menu_id` varchar(10000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '菜id',
  `uid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '用户id',
  `order_price` decimal(10,2) NOT NULL COMMENT '订单价格',
  `price` decimal(10,2) NOT NULL COMMENT '实付价格',
  `discounts_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '优惠价格',
  `order_create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `order_create_user` char(20) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '订单创建者',
  `order_pay_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '支付时间',
  `order_over_time` datetime DEFAULT NULL COMMENT '订单结束时间',
  `order_status` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '订单状态  0等待支付 1成功 2失败',
  `wait_pay` tinyint(1) DEFAULT '1' COMMENT '等待支付',
  `pay_method` varchar(1) DEFAULT '0' COMMENT '支付方式 0刷脸 1现金',
  PRIMARY KEY (`id`,`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Data for the table `order` */

insert  into `order`(`id`,`order_id`,`menu_id`,`uid`,`order_price`,`price`,`discounts_price`,`order_create_time`,`order_create_user`,`order_pay_time`,`order_over_time`,`order_status`,`wait_pay`,`pay_method`) values 
(1,'837ac280a3c711e89db02fef83d89e0f','9ea64a90a36611e8ad17c724120fe2a8-a900ff20a15f11e89fb27f17ee66edc8,a900ff20a15f11e89fb27f17ee66edc8',NULL,219.98,219.98,0.00,'2018-08-19 23:49:53','admin','2018-08-19 23:49:53',NULL,'0',1,'0'),
(2,'b8c82ac0a3c911e880ad49376f5a4a4c','9ea64a90a36611e8ad17c724120fe2a8-a900ff20a15f11e89fb27f17ee66edc8',NULL,118.99,118.99,0.00,'2018-08-20 00:05:41','admin','2018-08-20 00:05:41',NULL,'0',1,'0'),
(3,'d02f39b0a3c911e880ad49376f5a4a4c','9ea64a90a36611e8ad17c724120fe2a8-a900ff20a15f11e89fb27f17ee66edc8',NULL,118.99,118.99,0.00,'2018-08-20 00:06:21','admin','2018-08-20 00:06:21',NULL,'0',1,'0'),
(4,'40261900a3ca11e88886c19475347acb','a900ff20a15f11e89fb27f17ee66edc8-92898ae0a16011e8940e5b060f821048',NULL,201.98,201.98,0.00,'2018-08-20 00:09:28','admin','2018-08-20 00:09:28',NULL,'0',1,'0'),
(5,'745af740a3ca11e8b4139f47e4ab6405','92898ae0a16011e8940e5b060f821048-a900ff20a15f11e89fb27f17ee66edc8',NULL,201.98,201.98,0.00,'2018-08-20 00:10:56','admin','2018-08-20 00:10:56',NULL,'0',1,'0'),
(10,'2243aff0a3cb11e88872e545619f7732','9ea64a90a36611e8ad17c724120fe2a8-92898ae0a16011e8940e5b060f821048','',118.99,118.99,0.00,'2018-08-20 00:15:48','admin','2018-08-20 00:17:33','2018-08-20 00:17:33','2',0,'0'),
(11,'667f0890a3cb11e8b33b912db0d3f4fa','9ea64a90a36611e8ad17c724120fe2a8-92898ae0a16011e8940e5b060f821048-a900ff20a15f11e89fb27f17ee66edc8,a900ff20a15f11e89fb27f17ee66edc8,a900ff20a15f11e89fb27f17ee66edc8,a900ff20a15f11e89fb27f17ee66edc8,a900ff20a15f11e89fb27f17ee66edc8','',623.94,623.94,0.00,'2018-08-20 00:17:42','admin','2018-08-20 00:17:45','2018-08-20 00:17:45','2',0,'0'),
(12,'cb52f610a47911e89d4aed6780347f7f','9ea64a90a36611e8ad17c724120fe2a8-a900ff20a15f11e89fb27f17ee66edc8','',118.99,118.99,0.00,'2018-08-20 21:06:04','admin','2018-08-20 21:08:43','2018-08-20 21:08:43','2',0,'1');

/*Table structure for table `recharge` */

DROP TABLE IF EXISTS `recharge`;

CREATE TABLE `recharge` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '充值记录表主键id',
  `uid` varchar(32) NOT NULL COMMENT '用户id',
  `order_id` varchar(32) NOT NULL COMMENT '订单id',
  `money` decimal(10,2) NOT NULL COMMENT '充值金额',
  `recharge_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '充值时间',
  `create_user` varchar(20) DEFAULT NULL COMMENT '创建者',
  PRIMARY KEY (`id`,`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `recharge` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(32) NOT NULL COMMENT '用户id',
  `register_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `name` varchar(20) NOT NULL COMMENT '用户名',
  `age` int(11) DEFAULT NULL COMMENT '年纪',
  `sex` varchar(1) DEFAULT NULL COMMENT '性别 1男 2女',
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '账户余额',
  `last_top_up_time` datetime DEFAULT NULL COMMENT '最后充值时间',
  `last_pay_time` datetime DEFAULT NULL COMMENT '最后一次消费时间',
  `top_up_all` int(11) DEFAULT NULL COMMENT '总充值次数',
  `pay_all` int(11) DEFAULT '0' COMMENT '总支付次数',
  `consume_count` int(10) DEFAULT NULL COMMENT '总消费次数',
  `blacklist` tinyint(1) DEFAULT '0' COMMENT '是否是黑名单用户',
  `del` tinyint(1) DEFAULT '0' COMMENT '是否已经删除',
  `consume_all_money` decimal(10,0) DEFAULT '0' COMMENT '消费总金额',
  `top_up_all_money` decimal(10,0) DEFAULT '0' COMMENT '充值总金额',
  `create_user` varchar(100) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL COMMENT '电话号码',
  PRIMARY KEY (`id`,`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`id`,`uid`,`register_time`,`name`,`age`,`sex`,`balance`,`last_top_up_time`,`last_pay_time`,`top_up_all`,`pay_all`,`consume_count`,`blacklist`,`del`,`consume_all_money`,`top_up_all_money`,`create_user`,`phone`) values 
(4,'af28b540a37211e8840aafca4ef5f206','2018-08-19 13:42:39','oldWang',23,'1',999.00,NULL,NULL,NULL,0,NULL,0,0,0,NULL,'admin','18216811014'),
(5,'4ad28860a37611e8840aafca4ef5f206','2018-08-19 14:08:29','测试王',23,'1',90.00,NULL,NULL,NULL,0,NULL,0,0,0,0,'admin','10086'),
(6,'4252a580a39411e886515795df457708','2018-08-19 17:42:59','admin',15,'1',0.00,NULL,NULL,NULL,0,NULL,0,0,0,0,'admin','11010');

/*Table structure for table `user_files` */

DROP TABLE IF EXISTS `user_files`;

CREATE TABLE `user_files` (
  `path` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `thumbnail` varchar(2000) DEFAULT NULL COMMENT '缩略图',
  `mobile_url` varchar(1000) DEFAULT NULL COMMENT '备用',
  `id` int(11) NOT NULL DEFAULT '0' COMMENT '外键',
  `uid` varchar(32) NOT NULL,
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_files` */

insert  into `user_files`(`path`,`thumbnail`,`mobile_url`,`id`,`uid`) values 
('images/user/1534658611205_pexels-photo-839347.jpg',NULL,NULL,0,'af28b540a37211e8840aafca4ef5f206'),
('images/user/1534658908301_food-salad-healthy-lunch.jpg',NULL,NULL,0,'4ad28860a37611e8840aafca4ef5f206'),
('images/user/1534671778672_food-dinner-pasta-spaghetti-8500.jpg',NULL,NULL,0,'4252a580a39411e886515795df457708');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
