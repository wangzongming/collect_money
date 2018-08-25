//菜单配置
// { 配置项
//   label: "工作台",
//   route: "/orb/worktable",
//   componentKey: "worktable",
//   mustLogin:true, //默认true
//   index: true //是否是首页 默认false
//   hide:true  不显示到菜单 默认false
// },


export default {
  title: "收银系统",
  // icon: require("../img/logo/logoCat.png"),
  data: [
    {
      label: "菜单管理",
      icon: "dashboard",
      route: "/menu", //必须和子集对上
      children: [
        {
          label: "菜单", 
          route: "/menu/list",
          componentKey: "menuList",
          index: true //是否是首页 
        },
        {
          label: "编辑菜",
          route: "/menu/edit/:menuId",
          componentKey: "menuAdd",
          mustLogin:true, //默认true
          hide:true  //不显示到菜单 默认false
        },
        {
          label: "加新菜",
          route: "/menu/add",
          componentKey: "menuAdd",
          mustLogin:true, //默认true
        }
      ]
    },
    {
      icon:'form',
      label: "订单管理",
      route: "/order", 
      children: [
        {
          label: "分类管理", 
          route: "/order/orderList",
          componentKey: "orderList",  
        }
      ]
    }, {
      label: "会员管理",
      icon: "user",
      route: "/user", //必须和子集对上
      children: [
        {
          label: "会员列表", 
          route: "/user/list",
          componentKey: "userList", 
        },
        {
          label: "新增会员",
          route: "/user/add",
          componentKey: "userAdd", 
        },
        {
          label: "编辑会员",
          route: "/user/edit/:uid",
          componentKey: "userAdd", 
          hide:true  //不显示到菜单 默认false
        }
      ]
    },
    {
      icon:'form',
      label: "基础管理",
      route: "/baseManage", 
      children: [
        {
          label: "分类管理", 
          route: "/baseManage/ClassifyManage",
          componentKey: "classifyManage", 
        }
      ]
    }, 
    {
      icon:'form',
      label: "测试页面",
      route: "/test",
      componentKey: "test"
    }
  ]
};
