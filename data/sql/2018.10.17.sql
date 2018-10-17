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
  `last_login` bigint(13) DEFAULT NULL COMMENT '最后一次登录',
  `head_img` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '头像地址（废弃）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

/*Data for the table `admin_user` */

insert  into `admin_user`(`id`,`username`,`password`,`login_count`,`phone`,`permissions`,`uid`,`last_login`,`head_img`) values 
(18,'oldWang','11bc14353e6defbe4816f68d16036d95',5,'18216811014','0','1f59fcf0cf4e11e8a8302360240f34a8',20181015205131,'');

/*Table structure for table `classify` */

DROP TABLE IF EXISTS `classify`;

CREATE TABLE `classify` (
  `id` varchar(32) NOT NULL,
  `classify_name` varchar(100) NOT NULL COMMENT '分类名字',
  `del` tinyint(1) DEFAULT NULL COMMENT '是否删除/备用',
  `sort` int(12) DEFAULT '100' COMMENT '排序/备用',
  `create_time` bigint(13) DEFAULT NULL,
  `show` varchar(1) DEFAULT '0' COMMENT '显隐状态',
  `create_user` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `classify` */

insert  into `classify`(`id`,`classify_name`,`del`,`sort`,`create_time`,`show`,`create_user`) values 
('5','川菜',NULL,1,20180816220435,'0',NULL),
('6','凉菜',NULL,2,20180816220444,'0',NULL),
('7','麻辣',NULL,3,20180816220451,'0',NULL),
('8','热菜',NULL,100,20180819130736,'0',NULL),
('f7e8ccc0d15311e889169105ef3ffb2c','111',NULL,100,1539701920650,'1','oldWang');

/*Table structure for table `menu` */

DROP TABLE IF EXISTS `menu`;

CREATE TABLE `menu` (
  `id` varchar(32) NOT NULL COMMENT '主键iD',
  `name` varchar(100) NOT NULL COMMENT '菜名',
  `sold_out` int(10) NOT NULL DEFAULT '0' COMMENT '已售份数',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '价格',
  `discount_price` decimal(10,2) DEFAULT NULL COMMENT '折扣价(备用)',
  `classify` varchar(100) DEFAULT NULL COMMENT '分类（备用）',
  `recommend` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否属于推荐菜品（备用）',
  `today_recommend` tinyint(1) DEFAULT '0' COMMENT '是否属于今日推荐菜品（备用）',
  `feature` tinyint(1) DEFAULT '0' COMMENT '是否是特色菜（备用）',
  `sort` int(4) NOT NULL DEFAULT '1000' COMMENT '排序',
  `create_user` varchar(20) DEFAULT NULL COMMENT '创建者',
  `create_time` bigint(13) NOT NULL COMMENT '创建时间',
  `show` varchar(1) DEFAULT '1' COMMENT '是否显示',
  `del` tinyint(1) DEFAULT '0' COMMENT '是否已删除',
  `create_user_id` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `menu` */

insert  into `menu`(`id`,`name`,`sold_out`,`price`,`discount_price`,`classify`,`recommend`,`today_recommend`,`feature`,`sort`,`create_user`,`create_time`,`show`,`del`,`create_user_id`) values 
('b43ecdc1d14a11e891ea8bfa12d8282e','222',222,222.00,NULL,'8',0,0,0,1000,'oldWang',1539697941660,'1',0,NULL),
('ca85de01d15b11e881cd9d796530a400','小炒肥肠',10,100.00,NULL,'7',0,0,0,1000,'oldWang',1539705280480,'1',0,'1f59fcf0cf4e11e8a8302360240f34a8');

/*Table structure for table `menu_files` */

DROP TABLE IF EXISTS `menu_files`;

CREATE TABLE `menu_files` (
  `path` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `thumbnail` varchar(2000) DEFAULT NULL COMMENT '缩略图',
  `mobile_url` varchar(1000) DEFAULT NULL COMMENT '备用',
  `id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `menu_files` */

insert  into `menu_files`(`path`,`thumbnail`,`mobile_url`,`id`) values 
('images/menu/2018Y10M16D22h36m33s_358286940680424944.jpg','',NULL,'b43ecdc1d14a11e891ea8bfa12d8282e'),
('images/menu/2018Y10M16D22h38m13s_443193299153041220.jpg','',NULL,'b43ecdc1d14a11e891ea8bfa12d8282e'),
('images/face/2018Y10M16D23h18m50s_794391400786549859.jpg','',NULL,'ed22b420d15511e8a2a39d5273652c6d'),
('images/menu/2018Y10M16D23h54m39s_pexels-photo-76093.jpg',NULL,NULL,'ca85de01d15b11e881cd9d796530a400');

/*Table structure for table `order` */

DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `id` varchar(32) NOT NULL,
  `menu_id` varchar(10000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '菜id',
  `uid` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '用户id',
  `order_price` decimal(10,2) NOT NULL COMMENT '订单价格',
  `price` decimal(10,2) NOT NULL COMMENT '实付价格',
  `discounts_price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '优惠价格',
  `order_create_time` bigint(13) NOT NULL COMMENT '创建时间',
  `order_create_user` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL COMMENT '订单创建者',
  `order_pay_time` bigint(13) DEFAULT NULL COMMENT '支付时间',
  `order_over_time` bigint(13) DEFAULT NULL COMMENT '订单结束时间',
  `order_status` varchar(1) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL COMMENT '订单状态  0等待支付 1成功 2失败',
  `pay_method` varchar(1) DEFAULT '0' COMMENT '支付方式 0刷脸 1现金',
  `order_pay_name` varchar(100) DEFAULT NULL COMMENT '付款用户',
  `order_pay_phone` varchar(11) DEFAULT NULL COMMENT '联系电话',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `order` */

insert  into `order`(`id`,`menu_id`,`uid`,`order_price`,`price`,`discounts_price`,`order_create_time`,`order_create_user`,`order_pay_time`,`order_over_time`,`order_status`,`pay_method`,`order_pay_name`,`order_pay_phone`) values 
('09b08480d16711e8802fe96e52eafaa5','b43ecdc1d14a11e891ea8bfa12d8282e-1,ca85de01d15b11e881cd9d796530a400-1',NULL,322.00,322.00,0.00,1539710110920,'1f59fcf0cf4e11e8a8302360240f34a8',NULL,NULL,'0','0',NULL,NULL),
('15fb9a00d16611e8b34b45df2af5e257','b43ecdc1d14a11e891ea8bfa12d8282e-1,ca85de01d15b11e881cd9d796530a400-3',NULL,522.00,522.00,0.00,1539709702048,'1f59fcf0cf4e11e8a8302360240f34a8',NULL,NULL,'0','0',NULL,NULL),
('862da300d16511e8b317d5cfd48be40e','b43ecdc1d14a11e891ea8bfa12d8282e-1,ca85de01d15b11e881cd9d796530a400-3',NULL,0.00,0.00,0.00,1539709460785,'1f59fcf0cf4e11e8a8302360240f34a8',NULL,NULL,'0','0',NULL,NULL),
('8eeb6120d16611e8a37a77f2d77cd678','b43ecdc1d14a11e891ea8bfa12d8282e-1,ca85de01d15b11e881cd9d796530a400-3',NULL,522.00,522.00,0.00,1539709904946,'1f59fcf0cf4e11e8a8302360240f34a8',NULL,NULL,'0','0',NULL,NULL),
('afffdad0d16611e8ab4b8f61d0619652','b43ecdc1d14a11e891ea8bfa12d8282e-1,ca85de01d15b11e881cd9d796530a400-3',NULL,522.00,522.00,0.00,1539709960445,'1f59fcf0cf4e11e8a8302360240f34a8',NULL,NULL,'0','0',NULL,NULL),
('e01aeb10d16611e8802fe96e52eafaa5','b43ecdc1d14a11e891ea8bfa12d8282e-1,ca85de01d15b11e881cd9d796530a400-1',NULL,322.00,322.00,0.00,1539710041153,'1f59fcf0cf4e11e8a8302360240f34a8',NULL,NULL,'0','0',NULL,NULL),
('f748ac70d16411e884c9e13bccf40658','b43ecdc1d14a11e891ea8bfa12d8282e-1,ca85de01d15b11e881cd9d796530a400-3',NULL,522.00,522.00,0.00,1539709221047,'1f59fcf0cf4e11e8a8302360240f34a8',NULL,NULL,'0','0',NULL,NULL);

/*Table structure for table `recharge` */

DROP TABLE IF EXISTS `recharge`;

CREATE TABLE `recharge` (
  `id` varchar(32) NOT NULL COMMENT '充值记录表主键id',
  `uid` varchar(32) NOT NULL COMMENT '用户id',
  `order_id` varchar(32) NOT NULL COMMENT '订单id',
  `money` decimal(10,2) NOT NULL COMMENT '充值金额',
  `recharge_time` bigint(13) NOT NULL COMMENT '充值时间',
  `create_user` varchar(20) DEFAULT NULL COMMENT '创建者',
  PRIMARY KEY (`id`,`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `recharge` */

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` varchar(32) NOT NULL,
  `create_time` bigint(13) DEFAULT NULL COMMENT '注册时间',
  `name` varchar(20) NOT NULL COMMENT '用户名',
  `age` int(11) DEFAULT NULL COMMENT '年纪',
  `sex` varchar(1) DEFAULT NULL COMMENT '性别 1男 2女',
  `balance` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '账户余额',
  `last_top_up_time` bigint(13) DEFAULT NULL COMMENT '最后充值时间',
  `last_pay_time` bigint(13) DEFAULT NULL COMMENT '最后一次消费时间',
  `top_up_all` int(11) DEFAULT NULL COMMENT '总充值次数',
  `pay_all` int(11) DEFAULT '0' COMMENT '总支付次数',
  `consume_count` int(10) DEFAULT NULL COMMENT '总消费次数',
  `blacklist` tinyint(1) DEFAULT '0' COMMENT '是否是黑名单用户',
  `del` tinyint(1) DEFAULT '0' COMMENT '是否已经删除',
  `consume_all_money` decimal(10,2) DEFAULT '0.00' COMMENT '消费总金额',
  `top_up_all_money` decimal(10,2) DEFAULT '0.00' COMMENT '充值总金额',
  `create_user` varchar(100) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL COMMENT '电话号码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`id`,`create_time`,`name`,`age`,`sex`,`balance`,`last_top_up_time`,`last_pay_time`,`top_up_all`,`pay_all`,`consume_count`,`blacklist`,`del`,`consume_all_money`,`top_up_all_money`,`create_user`,`phone`) values 
('97308a50d15b11e8bd6da38983ab05d6',1539705194357,'1',1,'1',0.00,NULL,NULL,NULL,0,NULL,0,0,0.00,0.00,'oldWang','1'),
('ed22b420d15511e8a2a39d5273652c6d',1539702761570,'oldWang',18,'1',10.00,NULL,NULL,NULL,0,NULL,0,0,0.00,0.00,'oldWang','18216811014');

/*Table structure for table `user_files` */

DROP TABLE IF EXISTS `user_files`;

CREATE TABLE `user_files` (
  `path` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `thumbnail` varchar(2000) DEFAULT NULL COMMENT '缩略图',
  `mobile_url` varchar(1000) DEFAULT NULL COMMENT '备用',
  `id` varchar(32) NOT NULL DEFAULT '0' COMMENT '外键',
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `user_files` */

insert  into `user_files`(`path`,`thumbnail`,`mobile_url`,`id`) values 
('images/face/2018Y10M16D23h37m16s_794391400786549859.jpg','',NULL,'ed22b420d15511e8a2a39d5273652c6d'),
('images/face/2018Y10M16D23h53m13s_236609830364789727.jpg','',NULL,'97308a50d15b11e8bd6da38983ab05d6'),
('images/face/2018Y10M16D23h53m46s_443193299153041220.jpg','',NULL,'97308a50d15b11e8bd6da38983ab05d6');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
