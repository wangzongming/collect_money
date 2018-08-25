import types from "./types";
import { myAxios } from "../../global";
import { message as Msg } from "antd";
import { setUserInfo } from "../../global";
export default (params = {}) => {
  return dispatch => {
    dispatch({ type: types.login, data: {} });
    return myAxios({
      apiName: "login",
      params: { ...params },
      notNeetToken: true
    }).then(({ success, data = {}, message }) => {
      // console.log(success, data, message);
      let _json = {};
      if (data) {
        _json = {
          token: data.token,
          ...data.userInfo,
          isFetching: false
        };
      } else {
        _json = {
          token: "",
          isFetching: false
        };
      }

      dispatch({ type: types.login, data: _json });
      if (success) {
        Msg.success(message, 1, () => {
          setUserInfo(_json);
          dispatch({ type: types.userInfo, data: _json });
          window.location.href = window.location.origin;
        });
      } else {
        setUserInfo({});
        Msg.error(message);
      }
    });
  };
};
