/*
设置token和验证token的扩展
*/
import jwt from "jsonwebtoken";
import crypto from "crypto";
import uuidv1 from "uuid/v1";

const verify = think.promisify(jwt.verify); // 解密

module.exports = {
  secretKey: "oldWang_bookborrow_project", //全局密匙
  staticUrl:'https://mnetwork.xyz/',//nginx静态服务地址
  //创建uid
  createUid: () => {
    //根据时间戳创建32位uid
    const uid = uuidv1().replace(/-/g, "");
    return uid;
  },
  //jwt加密解密fn  保存token时间为一周
  createToken(params = {}) {
    return new Promise((resolve, reject) => {
      const token = jwt.sign(params, this.secretKey, { expiresIn: "7d" }); //token签名 有效期为1小时
      if (token) {
        resolve(token);
      } else {
        reject(false, "创建token错误");
      }
    });
  },
  //验证token时传入token和ctx对象
  async verifyToken(token, ctx) {
    //验证token
    return await new Promise((resolve, reject) => {
      verify(token, this.secretKey)
        .then(payload => {
          //为了确保安全解密后再次验证账号是否存在
          const { username } = payload;
          let model = ctx.model("admin_user");
          model
            .where({
              username
            })
            .find()
            .then(data => {
              if (data) {
                resolve(payload);
              } else {
                ctx.body = {
                  data: null,
                  message: "账号/密码错误，请重新登录",
                  success: false,
                  code: "102"
                };
                resolve(false);
              }
            });
        })
        .catch(err => {
          //token错误需要重新登录
          ctx.body = {
            data: null,
            message: "token错误，请重新登录",
            success: false,
            code: "101"
          };
          resolve(false);
        }); // 解密，获取payload
    });
  },

  //将对象所有属性k下划线改为驼峰
  //属性值为空的话会自动去掉  由第三个参数控制
  async paramsFormat(params = {}, type = "_", nullKey = false) {
    //对象  需要转的类型  是否保留空值
    const _params = {};
    return new Promise((resolve, reject) => {
      if (this.isEmpty(params)) {
        //没有参数传入
        // _params.isNull = true;
        resolve(_params);
        return _params;
      } else {
        //将下划线转为驼峰或者反转
        if (type === "_") {
          //转下划线
          for (const key in params) {
            if (params.hasOwnProperty(key)) {
              const element = params[key];
              //属性值为空是否也将保留
              if (element || element===0 || element==='0') {
                _params[this.snakeCase(key)] = element;
              } else {
                if (nullKey) {
                  _params[this.snakeCase(key)] = element;
                }
              }
            }
          }
        } else {
          //转驼峰
          for (const key in params) {
            if (params.hasOwnProperty(key)) {
              const element = params[key];
              if (element) {
                _params[this.camelCase(key)] = element;
              } else {
                if (nullKey) {
                  _params[this.camelCase(key)] = element;
                }
              }
            }
          }
        }
        resolve(_params);
        return _params;
      }
    });
  },
  //和上面的方法一样的，但是是个同步方法
  _paramsFormat(params = {}, type = "_", nullKey = false) {
    const _params = {};
    if (this.isEmpty(params)) {
      //没有参数传入
      // _params.isNull = true;
      return _params;
    } else {
      //将下划线转为驼峰或者反转
      if (type === "_") {
        //转下划线
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            const element = params[key];
            //属性值为空是否也将保留
            if (element) {
              _params[this.snakeCase(key)] = element;
            } else {
              if (nullKey) {
                _params[this.snakeCase(key)] = element;
              }
            }
          }
        }
      } else {
        //转驼峰
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            const element = params[key];
            if (element || element===0 || element==='0') {
              _params[this.camelCase(key)] = element;
            } else {
              if (nullKey) {
                _params[this.camelCase(key)] = element;
              }
            }
          }
        }
      }
      return _params;
    }
  },

  //密码 加密 解密
  // type: en de  默认解密
  passwordFn(data, type = "de", key = this.secretKey, iv = "match") {
    if (type === "en") {
      //加密
      const cipher = crypto.createCipher("aes192", key, iv);
      let crypted = cipher.update(data, "utf8", "hex");
      crypted += cipher.final("hex");
      return crypted;
    } else if (type === "de") {
      //解密
      const decipher = crypto.createDecipher("aes192", key, iv);
      let decrypted = decipher.update(data, "hex", "utf8");
      decrypted += decipher.final("utf8");
      return decrypted;
    } else {
      return `没有${type}密码处理类型`;
    }
  },
  //参数 验证规则 被数据{username:'oldWng'}
  //数组  验证规则类似rc-form  目前只支持这几种
  /*
  [
   { 
     field:'username',
     rules:[
      {
        require:true,
        messsage:'密码为必填', 
      },
      {
        type:'string',
        messsage:'类型必须为string', 
      },
      {
        type:'maxLen',
        messsage:'最大长度为10', 
      }
    ]
   }
    ....
  ]
  */
  async paramsVer(rulesObj, params) {
    const obj = {
      success: true, //有条件不满足时将变为false
      message: "",
      sysErr: false //是否是系统错误 系统错误的信息不能返回到前台
    };
    if (!think.isObject(params)) {
      obj.success = false;
      obj.message = `验证参数时数据源不能传空，或者非object类型的数据`;
      obj.sysErr = true;
      return obj;
    }

    if (think.isArray(rulesObj)) {
      /*
      遍历所有规则和数据源
      创建一个新的规则
        [
          {
            value:'',
            field:'',
            rules:[]
          }
        ]
      */

      const newRules = []; //一个拥有value字段的新验证规则
      for (let i = 0; i < rulesObj.length; i++) {
        let field = rulesObj[i].field;
        let rules = rulesObj[i].rules;
        let _o = {
          rules,
          field,
          value: params[field]
        };
        newRules.push(_o);
      }

      for (let i = 0; i < newRules.length; i++) {
        const field = newRules[i].field;
        const value = newRules[i].value;
        const rules = newRules[i].rules;
        if (!field) {
          obj.success = false;
          obj.message = `验证规则的field不能为空`;
          obj.sysErr = true;
          return obj;
        }
        if (!rules) {
          obj.success = false;
          obj.message = `验证规则的rules不能为空`;
          obj.sysErr = true;
          return obj;
        }

        for (let j = 0; j < newRules[i].rules.length; j++) {
          //遍历每个字段的验证规则
          //如果有添加不满足success将为false且不在遍历
          let item = newRules[i].rules[j];
          let message = item.message || `${field}验证错误`;

          //验证是否是必填
          if (item.require) {
            if (!value) {
              obj.success = false;
              obj.message = message;
              return obj;
            }
          }

          //类型验证 不存在的字段不进行验证
          if (item.type && value) {
            if (item.type === "array") {
              if (!think.isArray(value)) {
                obj.success = false;
                obj.message = message;
                return obj;
              }
            } else if (item.type === "object") {
              if (!think.isObject(value)) {
                obj.success = false;
                obj.message = message;
                return obj;
              }
            } else if (item.type === "string") {
              if (!think.isString(value)) {
                obj.success = false;
                obj.message = message;
                return obj;
              }
            } else if (item.type === "number") {
              if (!think.isNumber(value)) {
                obj.success = false;
                obj.message = message;
                return obj;
              }
            }
          }

          //验证最大长度
          if (value && item.maxLen) {
            if (value.length > item.maxLen) {
              obj.success = false;
              obj.message = message;
              return obj;
            }
          }
        }
      }
      return obj;
    } else {
      return {
        success: false,
        sysErr: true,
        message: "未传入需要验证的参数（传入参数必须是二维数组）"
      };
    }
  },
  //不单单能格式化数据还能验证数据字段是否合法
  //获取参数时不需要调用ctx.post了直接调用此方法
  //ctx对象  验证规则【可选】  参数验证没通过时调用的方法【可选】
  async newParams(ctx, rules, noPassFn) {
    //传入ctx对象  paramsFormat方法的配置
    if (!rules) {
      //无需验证
      return await this.paramsFormat(ctx.post());
    } else {
      //验证
      let params = ctx.post();
      const ver = await this.paramsVer(rules, params);
      if (ver.success) {
        //验证通过
        let _params = await this.paramsFormat(ctx.post());
        _params.success = true;
        return _params;
      } else {
        if (noPassFn) {
          noPassFn(ctx);
        } else {
          //返回
          if (ver.sysErr) {
            //系统配置错误
            ctx.body = {
              success: false,
              message: "系统异常",
              data: ""
            };
          } else {
            //表单验证错误
            ctx.body = {
              success: false,
              message: ver.message,
              data: ""
            };
          }
          return ver;
        }
      }
    }
  },
  //一些提示
  //系统异常时返回数据
  sysErr: (err, ctx, message = "系统异常") => {
    think.logger.error(err);
    ctx.body = {
      message: message,
      success: false
    };
  },
  //没有此接口是返回
  noInterface: (ctx, message) => {
    ctx.body = {
      success: false,
      message: `${ctx.url}无此接口`
    };
  },
  //新增返回
  addRes: (data, params) => {
    let res = {};
    if (data.type === "exist") {
      res = {
        message: `新增失败，${params.name}已存在`,
        success: false
      };
    } else {
      res = {
        message: "新增成功",
        success: true
      };
    }
    return res;
  },
  delRes: data => {
    let res = {};
    if (data === 0) {
      res = {
        message: `删除失败,未查找到该条数据`,
        success: false
      };
    } else {
      res = {
        message: `成功删除${data}条数据`,
        success: true
      };
    }
    return res;
  },
  updateRes: data => {
    let res = {};
    if (data === 0) {
      res = {
        message: "未查到该条数据",
        success: false
      };
    } else {
      res = {
        message: "修改成功",
        success: true
      };
    }
    return res;
  },

  //一些共通查询
  //根据传入的数据查每条数据的附件表 暂无好的优化处理
  async select(dbTable, where = {}, dbTableFiles, key = ["id", "id"], fieldName='images', sort={}) {
    //传入 主表名 主表条件 附件表名 需要查询的主键 附件字段名称 排序 功能：实现类似于sql全联查询
    return new Promise((resolve, reject) => {
      const model = think.model(dbTable);
      data = model
        .where({ ...where })
        .order(sort)
        .select()
        .then(data => {
          if (dbTableFiles) {
            //查询附件表
            const modelF = think.model(dbTableFiles);
            modelF.select().then(fdata => {//附件表数据
              data = data.map((item, i) => {
                let id1 = item[key[0]];//主表主键 
                let files = [];
                for(let j=0;j<fdata.length;j++){
                  let id2 = fdata[j][key[1]];//附件表主键
                  if(id1 === id2){
                    fdata[j].url = `${this.staticUrl}${fdata[j].path}`;
                    fdata[j].path = fdata[j].path;
                    fdata[j].uid = j;
                    fdata[j] = think._paramsFormat(fdata[j], "__", true); 
                    files.push(fdata[j]);
                  }
                } 
                item = think._paramsFormat(item, "__", true);
                item[fieldName] = files;//赋值到附件字段上
                return item;
              });
              resolve(data);
              return data;
            });
          } else {
            data = data.map((item, i) => {
              item = think._paramsFormat(item, "__", true);
              return item;
            });
            resolve(data);
            return data;
          }
        });
    });
  }
};