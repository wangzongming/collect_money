import store from "storejs";
export default () => {
  return new Promise(resolve => {
    const userInfo = store.get("userInfo") || {};
    const token = store.get("token");
    const _userinfo = {
      token,
      userInfo: userInfo
    };
    resolve(_userinfo);
  });
};
