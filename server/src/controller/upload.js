/* 
文件上传 
主要文件uid只是前端用的id不是用户id
*/
const fs = require("fs");
const path = require("path");
const rename = think.promisify(fs.rename, fs); // 通过 promisify 方法把 rename 方法包装成 Promise 接口
// var images = require("images");
// var compress_images = require("compress-images");
// var gm = require("gm");
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
        const y = new Date().getFullYear();
        const m = new Date().getMonth() + 1;
        const d = new Date().getDate();
        const s = new Date().getSeconds();
        const mm = new Date().getMinutes();
        const h = new Date().getHours();
        const date = `${h}h${mm}m${s}s`; //文件名+时间戳
        const file = files[_name];
        // const _path = `www/images/${_name}/${date + "_" + file.name}`; //上传的路径
        // const url = `images/${_name}/${date + "_" + file.name}`; //nginx的路径
        const _n = `${_name}/${y}Y${m}M${d}D${date}_${file.name}`;
        const _path = `www/images/${_n}`; //上传的路径
        const url = `images/${_n}`; //nginx的路径
        const filepath = path.join(think.ROOT_PATH, _path);
        let _dotArr = file.name.split(".");
        if (_dotArr && _dotArr.length > 2) {
          //如果文件名中有.存在将不能保存
          ctx.body = {
            success: false,
            url: "xxx",
            message: "文件名中不能包含特殊符号(./|)等, 请删除重新上传！"
          };
          return;
        }
        think.mkdir(path.dirname(filepath));
        await rename(file.path, filepath);
        const nginxUrl = `${think.staticUrl}${url}`;
        //图片压缩
        switch (_name) {
          case "book": 
            // images(filepath) //Load image from file
            //   //加载图像文件
            //   .size(640)
            //   .save(filepath, {
            //     quality: 50 //保存图片到文件,图片质量为50
            //   });
            break;
          default:
            break;
        }

        ctx.body = {
          data: {
            path: url,
            url: nginxUrl,
            uid: think.createUid(),
            name: file.name
          },
          success: true,
          message: "请求成功"
        };
      };
      //将文件存入相应静态文件
      if (files.book) {
        await saveFiles("book", this.ctx);
      } else if (files.schoolbag) {
        await saveFiles("schoolbag", this.ctx);
      } else if (files.adminUser) {
        await saveFiles("adminUser", this.ctx);
      } else if (files.user) {
        await saveFiles("user", this.ctx);
      }else if (files.menu) {
        //菜相片
        await saveFiles("menu", this.ctx);
      }else if (files.face) {
        //人脸
        await saveFiles("face", this.ctx);
      }
    } catch (err) {
      think.sysErr(err, this.ctx);
    }
  }
};
