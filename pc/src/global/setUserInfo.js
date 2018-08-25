import store from "storejs";

export default (userInfo = {}) => {
  if (userInfo.token) {
    store.set("token", userInfo.token);
  }else{
    store.remove("token");
  }
  store.set("userInfo", userInfo);
};
