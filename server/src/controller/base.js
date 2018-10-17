const isDev = think.env === "development";

module.exports = class extends think.Controller {
  async __before() {
    const method = this.method.toLowerCase(); // 获取当前请求类型

    this.header({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers":
        "X-Requested-With,Origin,Content-Type,Accept,token",
      "Access-Control-Allow-Methods": "PUT,POST,GET,DELETE,OPTIONS"
    }); //设置 header

    //设置头跨域
    if (method === "options") { 
      return;
    } else if (method === "post") { 
      //验证token
      let _next = true;
      const url = this.ctx.url;
      //满足这些条件时不验证token
      const unless = url === "/adminUser/login" || url === "/user/login" || url === "/adminUser/add";
      if (!unless) {
        // && !isDev
        _next = false;
        const token = this.ctx.header.token;
        if (!token) {
          this.ctx.body = {
            success: false,
            message: "token不能为空"
          };
          _next = false;
          return false;
        }

        //验证权限 权限不足时 自动取消执行
        //...待实现
        await think.verifyToken(token, this.ctx).then(payload => {
          //荷载存在并且不能等于false
          if (payload && (payload !== false || payload !== "false")) {
            // think.logger.debug(`payload:${payload}`);
            const { username, uid } = payload;
            this.ctx.state = { username, uid };

            //需要将uid绑定到数据中 没有传uid的话默认使用当前操作人的额uid
            //目前所有uid都是前端传
            // this.ctx.post({
            //   uid: this.ctx.post().uid || uid
            // });
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
