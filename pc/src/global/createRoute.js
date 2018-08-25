//创建路由
import React from "react";
import store from "storejs";
import { Route, Redirect } from "react-router";
//菜单数据和路由数据
import { menuData, routeData } from "../config";
const _menuData = menuData["data"] || [];

const createRoute = () => {
  /*
    先将递归菜单数据和路由数据匹配并且合并格式为 [{path:'', com:Component}, ...]
    在遍历生产路由
    */

  const _routes = [];
  let _haveIndex = false; //没有首页
  const forMenu = data => {
    //递归菜单
    for (let i = 0; i < data.length; i++) {
      const { route, componentKey, children, index, label } = data[i];
      for (let j = 0; j < routeData.length; j++) {
        //遍历路由
        let routeItem = routeData[j];
        const { author = true } = routeItem;
        if (componentKey === routeItem["componentKey"]) {
          //设置首页
          if (index && !_haveIndex && componentKey) {
            //是否是首页 只能有一个首页
            document.getElementsByTagName("title")[0].innerText = label;
            _routes.push(<Redirect exact key={j} from="/" to={route} />);
            _haveIndex = true;
          } else if (index && _haveIndex) {
            //设置第二个首页时提醒
            console.warn(
              `只能设置一个首页！！！【${route}】此路径设置首页无效，默认取了第一个。`
            );
          }
          //判断是否需要登陆未登录状态直接跳转到登陆
          if (author) {
            //有token就是登陆状态
            if (store.get("token")) {
              _routes.push(
                <Route
                  key={j}
                  component={routeItem["component"]}
                  path={route}
                />
              );
            } else {
              //没有token就跳转到登陆页面
              _routes.push(
                <Redirect exact key={j} to={"/login?noToken=true"} />
              );
            }
          } else {
            _routes.push(
              <Route key={j} component={routeItem["component"]} path={route} />
            );
          }
        }
      }
      if (Array.isArray(children) && children.length > 0) {
        forMenu(children);
      }
    }
  };

  forMenu(_menuData);
  return _routes;
};
export default createRoute;
