//布局
import { incMenu } from "../layout";
//页面
import {
  // MenuAdd,
  // UserAdd,
  MenuList,
  UserList,
  ClassifyManage,
  Test,
  OrderList,
  Menu
} from "../pages";

const routeData = [
  // {
  //   componentKey: "menuAdd",
  //   component: incMenu(MenuAdd)
  // },
  {
    componentKey: "menuList",
    component: incMenu(MenuList)
  },
  // {
  //   componentKey: "userAdd",
  //   component: incMenu(UserAdd)
  // },
  {
    componentKey: "userList",
    component: incMenu(UserList)
  },
  {
    componentKey: "test",
    component: incMenu(Test)
  },
  {
    componentKey: "classifyManage",
    component: incMenu(ClassifyManage)
  },
  {
    componentKey: "orderList",
    component: incMenu(OrderList)
  },
  {
    componentKey: "menu",
    component: incMenu(Menu)
  }
];

export default routeData;
