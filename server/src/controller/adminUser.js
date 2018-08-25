import login from "../rules/login";
import adminUserRules from "../rules/adminUser";

const Base = require("./base.js");

module.exports = class extends Base {
  __before() {
    // 通过 Promise.resolve 将返回值包装为 Promise
    // 如果返回值确定为 Promise，那么就不需要再包装了
    return Promise.resolve(super.__before()).then(flag => {
      // 如果父级想阻止后续继承执行会返回 false，这里判断为 false 的话不再继续执行了。
      if (flag === false) return false;
      return true;
      // 其他逻辑代码
    });
  }
  async listAction() {
    //查询
    try {
      //参数通过验证后将走数据库存储
      //只有超级管理员可以查看所有用户列表
      //权限查询
      const model = think.model("admin_user");
      const userInfo = this.ctx.state;
      let me = await model.where({ uid: userInfo.uid }).find();
      if (me.permissions === "0") {
        const adminUserList = await model.select();
        this.ctx.body = {
          data: adminUserList,
          success: true,
          message: "查询成功"
        };
      } else {
        this.ctx.body = {
          success: true,
          message: "对不起，您的权限不足"
        };
      }
    } catch (err) {
      think.sysErr(err, this.ctx);
    }
  }
  async loginAction() {
    //登录 生成token
    const params = await think.newParams(this.ctx, login);
    //验证成功后继续执行查询更新
    if (params.success) {
      let { username = "", password = "" } = params;
      //加密password并且查询
      password = think.passwordFn(password, "en");
      //用户查询 and 用户附件表查询
      let model = think.model("admin_user");
      let data = await model
        .where({
          username,
          password
        })
        .find();
      if (data.id) {
        //当数据存在时  生成token
        let userToken = {
          username,
          uid: data.uid
        };

        //更新用户数据 、登录次数
        await model
          .where({
            username,
            password
          })
          .update({
            login_count: ["exp", "login_count+1"],
            last_login: ["exp", "NOW()"]
          });

        //更新完数据在重新读取一遍  使用联合查询将附件表数据查出来
        data = await model
          .where({
            username,
            password
          })
          .join({
            admin_user_files: {
              on: ["id", "id"]
            }
          })
          .find();

        think.createToken(userToken).then(token => {
          this.ctx.body = {
            data: {
              token,
              userInfo: { ...data }
            },
            message: "登录成功",
            success: true
          };
        });
      } else {
        this.ctx.body = {
          data: {},
          success: false,
          message: "账号/密码错误",
          code: "102"
        };
      }
    }
  }
  async delAction() {
    //删除接口

    try {
      //参数验证
      let params = await think.newParams(this.ctx, [
        {
          field: "uid",
          rules: [{ require: true, message: "uid为必传" }]
        }
      ]);

      if (params.success) {
        //参数通过验证后将走数据库存储
        let { uid } = params;
        //只有超级管理员可以删除用户
        //删除表单数据and附件表
        const userInfo = this.ctx.state;

        const model = think.model("admin_user");
        const imagesModel = think.model("admin_user_files");
        //权限查询
        let me = await model.where({ uid: userInfo.uid }).find();
        if (me.permissions === "0") {
          await imagesModel.where({ uid }).delete();
          await model.where({ uid }).delete();
          this.ctx.body = {
            success: true,
            message: "删除成功"
          };
        } else {
          this.ctx.body = {
            success: true,
            message: "对不起，您的权限不足"
          };
        }
      }
    } catch (err) {
      think.logger.error("err", err);
      this.ctx.body = {
        data: "",
        success: true,
        message: "系统异常",
        code: "200"
      };
    }
  }
  async addAction() {
    try {
      //参数验证
      let params = await think.newParams(this.ctx, adminUserRules);
      if (params.success) {
        //参数通过验证后将走数据库存储
        let {
          username,
          password,
          permissions = "1", //权限
          verification, //验证码
          phone,
          //模拟附件参数
          images = [
            {
              uid: "0",
              url:
                "https://images.pexels.com/photos/936102/pexels-photo-936102.jpeg?auto=compress&cs=tinysrgb&h=350"
            }
          ]
        } = params;
        //将密码加密处理
        password = think.passwordFn(password, "en");
        //根据时间戳创建32位uid
        const uid = think.createUid();

        //存储表单数据
        const model = think.model("admin_user");

        //第一个参数为要添加的数据，第二个参数为添加的条件，根据第二个参数的条件查询无相关记录时才会添加
        //用户名不能重

        const { id, type } = await model
          .where({
            username
          })
          .thenAdd({
            username,
            password,
            permissions, //权限
            phone,
            uid
          });
        if (type === "exist") {
          this.ctx.body = {
            success: false,
            message: "该账号名或者手机号已被使用"
          };
        } else {
          if (!think.isEmpty(images)) {
            //往附件表插数据
            //附件需要存入附件表admin_user_files
            const obj = {
              uid,
              id,
              url: images[0].url
            };
            const imgModel = think.model("admin_user_files");
            let img = await imgModel.add({
              ...obj
            });
          }

          this.ctx.body = {
            success: true,
            message: "创建成功"
          };
        }
      }
    } catch (err) {
      think.sysErr(err, this.ctx);
    }
  }
  async updateAction() {
    try {
      //参数验证
      let params = await think.newParams(this.ctx, adminUserRules);
      if (params.success) {
        //参数通过验证后将走数据库存储
        let {
          // username,
          password,
          permissions = "1", //权限
          verification, //验证码  无用
          phone,
          uid, //必传
          //模拟附件参数
          images = [
            {
              uid: "0",
              url:
                "https://images.pexels.com/photos/936102/pexels-photo-936102.jpeg?auto=compress&cs=tinysrgb&h=350"
            }
          ]
        } = params;
        //将密码加密处理
        password = think.passwordFn(password, "en");

        //根据uid更新数据
        //存储表单数据
        //更新时用户名也不能改为表里其他的用户名
        const model = think.model("admin_user");
        //更新表单
        let row = await model.where({ uid }).update({
          // username,
          password,
          permissions, //权限
          phone
        });
        //附件存在将更新附件
        if (!think.isEmpty(images)) {
          //往附件表插数据
          //附件需要存入附件表admin_user_files
          const obj = {
            url: images[0].url
          };
          const imgModel = think.model("admin_user_files");
          let img = await imgModel.where({ uid }).update({
            ...obj
          });
        }

        this.ctx.body = {
          success: true,
          message: "更新成功"
        };
      }
    } catch (err) {
      think.sysErr(err, this.ctx);
    }
  }
  __call() {
    //如果相应的Action不存在则调用该方法
    think.noInterface(this.ctx);
  }
};
