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

/*Table structure for table `menu_files` */

DROP TABLE IF EXISTS `menu_files`;

CREATE TABLE `menu_files` (
  `path` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `thumbnail` varchar(2000) DEFAULT NULL COMMENT '缩略图',
  `mobile_url` varchar(1000) DEFAULT NULL COMMENT '备用',
  `id` varchar(32) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

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

/*Table structure for table `user_files` */

DROP TABLE IF EXISTS `user_files`;

CREATE TABLE `user_files` (
  `path` varchar(2000) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `thumbnail` varchar(2000) DEFAULT NULL COMMENT '缩略图',
  `mobile_url` varchar(1000) DEFAULT NULL COMMENT '备用',
  `id` varchar(32) NOT NULL DEFAULT '0' COMMENT '外键',
  KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
