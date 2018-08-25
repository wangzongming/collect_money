import types from "./action/types";
import store from "storejs";
// console.log(types);
const { login, logout, userInfo } = types;
const reducerObj = {
  login(
    state = {
      isFetching: true,
      lastUpdated: new Date().toLocaleDateString()
    },
    action
  ) {
    const { type, data } = action;
    switch (type) {
      case login: //登录
        return {
          ...state,
          ...data
        };
      default:
        return state;
    }
  },
  logout(state = {}, action) {
    //登出
    const { type, data } = action;
    switch (type) {
      case logout:
        return {
          ...state,
          ...data
        };
      default:
        return state;
    }
  },
  userInfo(state = {
    userInfo:store.get('userInfo'),
    token:store.get('token')
  }, action) {
    //用户信息 
    const { type, data } = action; 
    switch (type) {
      case userInfo:
        return {
          ...state,
          ...data
        };
      default:
        return state;
    }
  }
};

export default reducerObj;
