//需要绑定this
import moment from "moment";
import getDeviceType from "../tool/getDeviceType";
let _isMobile = () => getDeviceType() === "mobile";

const formatData = (params, formConfig, type = "set", isMobile = _isMobile()) => {
  const data = { ...params };
  //set是设置为表单需要的 get是从表单取出来
  let _data = {};
  if (type === "set") {
    for (let i = 0; i < formConfig.length; i++) {
      let {
        type,
        field,
        dataIndex,
        defaultValue,
        initialValue,
        multiple,
        pullJoin = true,
        children
        // format = "YYYY-MM-DD HH:mm:ss"
      } = formConfig[i];
      field = field || dataIndex;
      switch (type) {
        case "date":
        case "time":
        case "datetime":
          if (!data[field]) {
            _data[field] = initialValue || defaultValue || null;
          } else {
            //将时间戳位数处理
            if (data[field] && data[field].toString().length === 10) {
              //需要补0
              _data[field] = data[field] * 1000;
            }
            if (isMobile === false) {
              //pc端 
              _data[field] = moment(data[field]);
            } else {
              _data[field] = new Date(data[field]);
            }
          }
          break;
        case "cascader":
          _data[field] = data[field] && data[field].split(",");
          break;
        case "select":
          if (multiple) {
            //开启多选的数据需要转换为数组
            if (data[field] && pullJoin) {
              _data[field] = data[field] && data[field].split(",");
            } else {
              _data[field] = data[field] || [];
            }
          } else {
            _data[field] = data[field] || [];
          }
          break;
        case "item":
          if (pullJoin) {
            //开启多选的数据需要转换为数组
            _data[field] = data[field] && data[field].split(",");
          } else {
            _data[field] = data[field]
          }
          break;
        case "linkage":
          //联动赋值 
          const forLinkage = (obj) => {
            _data[obj.form.field] = data[obj.form.field] || defaultValue || '';
            if (obj.children) {
              forLinkage(obj.children)
            }
          }
          forLinkage(children);
          break;
        default:
          _data[field] = data[field] || defaultValue;
          break;
      }
    }
  } else {
    //获取表单的值 
    for (let i = 0; i < formConfig.length; i++) {
      let {
        type,
        field,
        timestamp = 13,
        dataIndex,
        multiple,
        children,
        pushJoin = true,
        defaultValue
      } = formConfig[i];
      field = field || dataIndex;
      switch (type) {
        case "date":
        case "time":
        case "datetime":
          if (data && data[field]) {
            _data[field] = moment(data[field]).valueOf();

            //如果需要十位数的时间戳加上timestamp:10的属性
            if (timestamp === 10 && data[field]) {
              let _strd = data[field].toString();
              let _d = _strd.substr(0, 10);
              _data[field] = Number(_d);
            }
          } else {
            _data[field] = "";
          }
          break;
        case "cascader":
          if (pushJoin) {
            //开启多选的数据需要转换为数组
            _data[field] = data[field] && data[field].join(",");
          } else {
            _data[field] = data[field]
          }
          break;
        case "select":
          if (multiple && data[field] && pushJoin) {
            //开启多选的数据需要转换为数组
            _data[field] = data[field] && data[field].join(",");
          } else {
            _data[field] = data[field]
          }
          break;
        case "item":
          if (pushJoin) {
            //开启多选的数据需要转换为数组
            _data[field] = data[field] && data[field].join(",");
          } else {
            _data[field] = data[field]
          }
          break;
        case 'linkage':
          const forLinkage = (obj) => {
            _data[obj.form.field] = data[obj.form.field] || defaultValue || '';
            if (obj.children) {
              forLinkage(obj.children)
            }
          }
          forLinkage(children);
          break;
        default:
          _data[field] = data[field] || defaultValue;
          break;
      }
    }
  } 
  return _data;
};
const setValues = function (data) {
  //数据和是否return格式化好的值而不是直接设置进表单 
  const { setFieldsValue } = this.props.form;
  const { formConfig } = this.state;
  let isMobile = this.isMobile();
  let _data = formatData(data, formConfig, "set", isMobile);
  setFieldsValue(_data);
};
export { formatData };
export default setValues;
