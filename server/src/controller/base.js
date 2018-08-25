module.exports = class extends think.Controller {
  async __before() {
    const method = this.method; // 获取当前请求类型
    //设置头跨域
    if (method === "OPTIONS") {
      this.header({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "X-Requested-With,Origin,Content-Type,Accept,token",
        "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
      }); //设置 header
      return true;
    } else if (method === "POST") {
      this.header({
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "X-Requested-With,Origin,Content-Type,Accept,token",
        "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
      }); //设置 header
      
      //验证token
      let _next = true;
      const url = this.ctx.url;
      think.logger.debug(`请求的url:${url}`);
      //满足这些条件时不验证token
      const unless = url === "/adminUser/login";
      if (!unless) {
        _next = false;
        const token = this.ctx.header.token;

        await think.verifyToken(token, this.ctx).then(payload => {
          //荷载存在并且不能等于false
          if (payload && (payload !== false || payload !== "false")) {
            // think.logger.debug(`payload:${payload}`);
            const { username, uid } = payload;
            this.ctx.state = { username, uid };

            _next = true;
          } else {
            _next = false;
          }
        });
      }

      return _next;
    } else {
      this.ctx.body = {
        success: false,
        message: "只能使用post请求"
      };
      return false;
    }
  }
};
