/*
订单操作
*/

import { add, update, del } from "../rules/order";
import table from "../func/table";
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
  async addAction() {
    try {
      //新增充值订单
      const params = await this.ctx.post();
      const model2 = think.model(dbTable);
      const modelbyUser = think.model("user");
      if (!think.isEmpty(params) && think.isObject(params)) {
        if (params.orderType === "1") {
          if (!params.orderPrice || !params.uid) {
            this.ctx.body = {
              success: false,
              message: "充值金额/用户不能为空！"
            };
          }
          let _userInfo = await modelbyUser.where({ id: params.uid }).find();
          if (think.isEmpty(_userInfo)) {
            //用户未查询到处理
            this.ctx.body = {
              message: "未查询到该用户",
              success: false
            };
            return;
          } 
 
          await modelbyUser.where({ id: params.uid }).increment('balance',params.orderPrice); 

          await model2.add({
            uid: params.uid,
            [keyId]: think.createUid(),
            order_create_user: this.ctx.state.uid,
            order_create_time: new Date().getTime(),
            order_pay_time:new Date().getTime(),
            order_over_time:new Date().getTime(),
            discounts_price:0,
            order_price: params.orderPrice,
            price: params.orderPrice,
            order_type: "1",
            order_status: "1"
          });

          this.ctx.body = {
            success: true,
            message: "充值成功", 
          };
        } else {
          this.ctx.body = {
            success: false,
            message: "暂不支持当前订单类型"
          };
        }
        return;
      }
      //新增订单  不是结账
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
        await model2.add({
          [keyId]: think.createUid(),
          order_create_user: uid,
          order_create_time: new Date().getTime(),
          order_price,
          price,
          menu_id: _allMenu, 
          order_type: "0",
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
