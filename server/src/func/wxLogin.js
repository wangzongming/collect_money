const https = require("https");

const wxLogin = (config = {}) => {
  return new Promise(resolve => {
    https
      .get(
        `https://api.weixin.qq.com/sns/jscode2session?appid=${
          config.app_id
        }&secret=${config.secret}&js_code=${
          config.code
        }&grant_type=authorization_code`,
        res => {
          res.on("data", d => {
            process.stdout.write(d);
          });
          let _res = {
            success: true,
            ...res
          };
          if (_res.errcode) {
            _res.success = false;
          } else { 
            // {"session_key":"IspXjigQZ4tv0YeMijOIWA==","openid":"oMGS45UOmnL6Ml-HZ-SQqEEV1dW8"}
            resolve({ ..._res });
            return _res;
          }
        }
      )
      .on("error", e => {
        let _res = {
          success: false,
          data: e,
          message: "登录失败"
        };
        resolve({ ..._res });
        return _res;
      });
  });
};

export default wxLogin;
