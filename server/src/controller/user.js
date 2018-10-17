import { add, update, del } from "../rules/user";
import table from "../func/table";
const Base = require("./base.js");
//数据库配置
const dbTable = "user"; //数据表名
const dbTableFiles = "user_files"; //主表数据表名
const keyId = "id"; //主键id
const filesField = "images"; //主键id

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
  async addAction() {
    await table.add({
      rules: add,
      ctx: this.ctx,
      keyId,
      dbTable,
      dbTableFiles,
      filesField,
      onlyKey: "", //: "classify_name",
      otherParams: ["create_time", "create_user"], //: ["create_time"]
      // paramsHand: data => {
      //   //加上主键id
      //   if(keyId){ 
      //     return (data[keyId] = think.createUid());
      //   }
      //   return data;
      // }
    });
  }

  async delAction() {
    await table.del({
      ctx: this.ctx,
      rules: del, //数据操作规则
      dbTable, //表 *必传
      keyId, //主键id     ps：非驼峰
      filesField,
      dbTableFiles: dbTableFiles //附件表   ps：非驼峰
    });
  }
  async listAction() {
    await table.list({
      ctx: this.ctx,
      rules: [], //数据操作规则
      dbTable, //表 *必传
      keyId, //主键id     ps：非驼峰
      dbTableFiles, //附件表   ps：非驼峰
      filesField
      //以下全部为驼峰
      // relationTable, //incBook 关系表
      // relationTableKey, //从表关联主表的主键
      // relationTableChildren, // 关系表主键 ps：驼峰
      // relationTableChildrenFilesTableName,
      // relationTableChildrenFilesKey,
      // relationTableChildrenFilesField,
      // relationTableChildrenFilesFieldId
    });
  }

  async updateAction() {
    await table.update({
      ctx: this.ctx,
      rules: update, //数据操作规则
      dbTable, //表 *必传
      keyId, //主键id     ps：非驼峰
      filesField,
      dbTableFiles: dbTableFiles //附件表   ps：非驼峰
    });
  }
  __call() {
    //如果相应的Action不存在则调用该方法
    think.noInterface(this.ctx);
  }
};
