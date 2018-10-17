/*
订单操作
*/

import { add, update, del } from "../rules/order";
const Base = require("./base.js");
//数据库配置
const dbTable = "order"; //主表数据表名
const dbTableFiles = ""; //附件表名
const keyId = "id"; //主键id
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
      let { data, totalNumber } = await think.select(
        dbTable,
        params,
        dbTableFiles,
        [keyId, keyId]
      );
      this.ctx.body = {
        message: "查询成功",
        success: true,
        data: data,
        totalNumber: totalNumber
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
        let uid = this.ctx.state.uid; //创建者
        var order_price = 0; //订单价格
        var price = 0; //实付价格

        let _allMenu = ""; //所有菜的id 存入数据库的所有id 有重复菜的是个二维数组 存入格式 id(菜的id)-count(份数) eg sdcsdcsdc42435-2
        let _w = [];
        let idAndNum = {}; //id对应着份数 {id:number};

        const model = think.model("menu");

        params.map((item, i) => {
          //遍历时除了遍历菜的id外还得遍历菜的份数
          let id = item.id; //菜的id
          let number = item.count; //菜的份数
          idAndNum[id] = number;
          let _id = `${id}-${number}`;
          if (i === 0) {
            _allMenu += _id;
          } else {
            _allMenu += "," + _id;
          }
          _w.push(id);
          return item;
        });
        let data = await model.where({ [keyId]: ["IN", _w] }).select(); //将所有菜都拿出来

        //从数据库中读取出来的用户选择的数据
        let _d = data.filter(item => {
          return _w.includes(item.id);
        });
        //将菜的信息加上份数在返回到前台
        data = data.map(item => {
          item.number = idAndNum[item.id]; //份数
          item.allPrice = idAndNum[item.id] * item.price; //当前菜的价格份数*菜价
          return item;
        });

        //循环得到的数据进行总价计算
        for (let i = 0; i < _d.length; i++) {
          //订单价格和实付价格
          let _price = _d[i].price; //价格
          order_price += idAndNum[_d[i].id] * _price; //计算份数*价格
          price += idAndNum[_d[i].id] * _price;
        }

        //放进数据库状态为暂存
        const model2 = think.model(dbTable);
        const id = think.createUid();
        const _data = await model2.add({
          [keyId]: id,
          order_create_user: uid,
          order_create_time: new Date().getTime(),
          order_price,
          price,
          menu_id: _allMenu,
          order_status: "0"
        });

        this.ctx.body = {
          success: true,
          message: "订单生成完毕",
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
