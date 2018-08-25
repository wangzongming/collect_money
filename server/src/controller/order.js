/*
订单操作
*/

import { add, update, del } from "../rules/order";
const Base = require("./base.js");
//数据库配置
const dbTable = "order"; //主表数据表名
const dbTableFiles = ""; //附件表名
const keyId = "order_id"; //主键id
const filesField = "files"; //上传的附件name

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
      //用户信息 菜信息  
      //附件表情况下查询时需要查附件表
      const params = await think.newParams(this.ctx);
      let data = await think.select(dbTable, params, dbTableFiles, [
        keyId,
        keyId
      ]);
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
    //新增订单  不是结账
    try {
      // const params = await think.newParams(this.ctx, add);
      const params = await this.ctx.post();
      if (!think.isEmpty(params) && think.isArray(params)) {
        //数据符合格式
        let create_user = this.ctx.state.username; //创建者
        var order_price = 0; //订单价格
        var price = 0; //实付价格

        let _ww = []; //存入数据库的所有id 有重复的是个二维数组  存入格式 aaa,aaaa-bbb,bbb-cccc
        let _w = [];
        let _number = {}; //{menu_id:number}
        params.map((item, i) => {
          //遍历时除了遍历菜的id外还得遍历菜的份数
          let menuId = item.menuId;
          let number = item.count;
          _number[menuId] = number;
          let _a = "";
          for (let k = 0; k < number; k++) {
            if (k === 0) {
              _a += menuId;
            } else {
              _a += `,${menuId}`;
            }
          }
          _ww.push(_a);
          _w.push(menuId);
          return item;
        });
        _ww = _ww.join("-"); //存入库的订单id
        const model = think.model("menu");
        //所有被定的菜
        let data = await model
          .where({ menu_id: ["IN", _w.join(",")] })
          .select();
        //遍历每条订单id去查询数据  确保数据用的是数据库里的数据 然后确定份数
        for (const key in _number) {
          for (let j = 0; j < data.length; j++) {
            if (data[j].menu_id === key) {
              //将份数设置进去、计算总价
              let _price = data[j].price;
              data[j].number = _number[key];
              order_price += _number[key] * _price;
              price += _number[key] * _price;
            }
          }
        }

        //放进数据库状态为暂存
        const model2 = think.model(dbTable);
        const id = think.createUid();
        const _data = await model2.add({
          order_id: id,
          order_create_user: create_user,
          order_price,
          price,
          menu_id: _ww,
          order_status: "0",
          awaitPay: true
        });

        this.ctx.body = {
          success: true,
          message: "订单生产成功",
          data: {
            orderId: id,
            menuList: data, //菜列表
            price: price, //实付价格
            orderPrice: order_price, //订单价格
            receiver: create_user
          }
        };
      } else {
        this.ctx.body = {
          success: false,
          message: "未传入订单数据"
        };
      }
    } catch (err) {
      think.sysErr(err, this.ctx);
    }
  }
  async payAction() {
    //确认支付接口  传入oder_id  直接更改一些状态变为支付成功的订单
    try {
      const params = await this.ctx.post();
      const {
        orderId,
        orderStatus = "2",
        uid = "",
        waitPay = false,
        payMethod = "0"
      } = params; //action 订单状态  0等待支付 1成功 2失败
      if (orderId) {
        const model = think.model(dbTable);
        const arow = await model.where({ order_id: orderId }).update({
          order_pay_time: ["exp", "now()"],
          order_over_time: ["exp", "now()"],
          wait_pay: waitPay,
          order_status: orderStatus,
          uid: uid,
          pay_method: payMethod 
        });

        this.ctx.body = {
          success: true,
          message: "结账成功"
        };
      } else {
        this.ctx.body = {
          success: false,
          message: "订单id不能为空"
        };
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
