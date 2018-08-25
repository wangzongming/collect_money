//退出登陆
// import React from "react"; 
import store from "storejs";

export default (history) => {
  store.remove("token");
  store.remove("userInfo");
  history.replace("/login"); 
};
