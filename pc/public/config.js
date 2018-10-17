var globalConfig = {
  dev: false,
    // apiUrl: "https://mnetwork.xyz:8080/",
  apiUrl: "https://api.liningyuan.com/",
  name: "收银管理系统",
  apiNames: {
    login: "adminUser/login",
    test: "test",
    //菜单操作
    menuAdd: "menu/add",
    menuDel: "menu/del",
    menuUpdate: "menu/update", 
    menuList:"menu/list",

    //会员操作
    userAdd: "user/add",
    userDel: "user/del",
    userUpdate: "user/update",
    userList: "user/list",

    //分类操作
    classifyAdd: "classify/add",
    classifyDel: "classify/del",
    classifyUpdate: "classify/update",
    classifyList: "classify/list",

    //订单操作
    orderAdd: "order/add",
    orderPay: "order/pay",
    orderDel: "order/del",
    orderUpdate: "order/update",
    orderList: "order/list"
  }
};
window.globalConfig = globalConfig;
