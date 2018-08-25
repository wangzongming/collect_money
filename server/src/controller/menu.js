import { add, update, del } from "../rules/menu";
const Base = require("./base.js");
//数据库配置
const dbTable = "menu"; //主表数据表名
const dbTableFiles = "menu_files"; //附件表名
const keyId = "menu_id"; //主键id
const filesField = "images"; //上传的附件name

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
    try {
      //附件表情况下查询时需要查附件表
      const params = await think.newParams(this.ctx);
      let data = await think.select(dbTable, params, dbTableFiles, [
        keyId,
        keyId
      ], 'images', {
        sort:'ASC'
      });
      //将分类名字查出来 属于特殊处理
      const fm = think.model("classify");
      const classifyList = await fm.select();
      data = data.map(item => {
        for (let i = 0; i < classifyList.length; i++) {
          if (item.classify === classifyList[i]["classify_id"]) {
            item.classifyName = classifyList[i]["classify_name"];
          }
        }
        return item;
      });

      this.ctx.body = {
        message: "查询成功",
        success: true,
        data: data,
        totalNumber: data.length
      };
    } catch (err) {
      think.sysErr(err, this.ctx);
    }
  }
  async delAction() {
    try {
      //附件表情况下删除时需要删除附件
      const params = await think.newParams(this.ctx, del);
      if (params.success) {
        delete params.success;

        if (dbTableFiles) {
          //附件表存需要删除附件
          const modelf = think.model(dbTableFiles);
          const dataf = await modelf.where({ [keyId]: params[keyId] }).delete();
        }

        const model = think.model(dbTable);
        const data = await model.where({ [keyId]: params[keyId] }).delete();
        this.ctx.body = think.delRes(data);
      }
    } catch (err) {
      think.sysErr(err, this.ctx);
    }
  }
  async addAction() {
    try {
      const params = await think.newParams(this.ctx, add);

      if (params.success) {
        delete params.success;
        //生成id
        const id = think.createUid();
        params[keyId] = id;
        params.create_user = this.ctx.state.username;
        params.sort = params.sort ? params.sort : 100;
        //有附件的话将附件存起来
        if (
          dbTableFiles &&
          params[filesField] &&
          think.isArray(params[filesField])
        ) {
          //附件表存需要插入附件
          params[filesField] = params[filesField].map(item => {
            //设置主键
            item[keyId] = params[keyId];
            return item;
          });

          const modelf = think.model(dbTableFiles);
          await modelf.addMany(params[filesField]);
        }

        const model = think.model(dbTable);
        const data = await model.thenAdd(
          {
            ...params
          },
          {
            name: params.name
          }
        );
        this.ctx.body = think.addRes(data, params);
      }
    } catch (err) {
      think.sysErr(err, this.ctx);
    }
  }
  async updateAction() {
    try {
      const params = await think.newParams(this.ctx, update);
      if (params.success) {
        delete params.success;

        //有附件得更新所有附件附件
        if (
          dbTableFiles &&
          params[filesField] &&
          think.isArray(params[filesField]) &&
          !think.isEmpty(params[filesField])
        ) {
          const modelf = think.model(dbTableFiles);
          params[filesField] = params[filesField].map(item => {
            //设置主键
            item[keyId] = params[keyId];
            return item;
          });
          //先删后增
          await modelf.where({ [keyId]: params[keyId] }).delete();
          await modelf.addMany(params[filesField]);
        }

        const model = think.model(dbTable);
        const data = await model.where({ [keyId]: params[keyId] }).update({
          ...params
        });
        this.ctx.body = think.updateRes(data);
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
