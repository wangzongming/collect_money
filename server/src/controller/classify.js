import { classifyUpdate, classifyAdd } from "../rules/classify";
const Base = require("./base.js");
//数据库配置
const dbTable = "classify"; //主表数据表名
const dbTableFiles = ""; //主表数据表名
const keyId = "classify_id"; //主键id
const filesField = "files"; //主键id

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
      ]);
 
      this.ctx.body = {
        message: "查询",
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
      const params = await think.newParams(this.ctx, [
        {
          field: "classifyId",
          rules: [
            {
              require: true,
              message: "classifyId必传"
            }
          ]
        }
      ]);
      if (params.success) {
        delete params.success;

        if (dbTableFiles) {
          //附件表存需要删除附件
          const modelf = think.model(dbTableFiles);
          const dataf = await modelf.where({ [keyId]: params[keyId] }).delete();
        }

        const model = think.model(dbTable);
        const data = await model.where({ ...params }).delete();
        this.ctx.body = think.delRes(data);
      }
    } catch (err) {
      think.sysErr(err, this.ctx);
    }
  }
  async addAction() {
    try {
      const params = await think.newParams(this.ctx, classifyAdd);
      if (params.success) {
        delete params.success;
        //生成id
        const id = think.createUid();
        params[keyId] = id;
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
            classify_name: params.classify_name
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
      const params = await think.newParams(this.ctx, classifyUpdate);
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
            item[keyId] = params[keyId]
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
