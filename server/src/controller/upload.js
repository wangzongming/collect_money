/* 
文件上传 
主要文件uid只是前端用的id不是用户id
*/
const fs = require("fs");
const path = require("path");
const rename = think.promisify(fs.rename, fs); // 通过 promisify 方法把 rename 方法包装成 Promise 接口

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
  async indexAction() {
    try {
      const files = this.ctx.file() || {};

      const saveFiles = async (_name, ctx) => {
        const date = new Date().getTime(); //文件名+时间戳
        const file = files[_name];
        const _path = `www/images/${_name}/${date + "_" + file.name}`; //上传的路径
        const url = `images/${_name}/${date + "_" + file.name}`; //nginx的路径
        const filepath = path.join(think.ROOT_PATH, _path);
        think.mkdir(path.dirname(filepath));
        await rename(file.path, filepath);

        ctx.body = {
          data: {
            path: url,
            url: `${think.staticUrl}${url}`,
            uid: think.createUid(),
            name: file.name
          },
          success: true,
          message: "请求成功"
        };
      };
      //将文件存入相应静态文件
      if (files.menu) {
        //菜相片
        await saveFiles("menu", this.ctx);
      } else if (files.user) {
        await saveFiles("user", this.ctx);
      }
    } catch (err) {
      think.sysErr(err, this.ctx);
    }
  }
};
