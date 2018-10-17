//需要绑定this
import moment from "moment";
import getDeviceType from "../tool/getDeviceType";
let _isMobile = () => getDeviceType() === 'mobile';

const formatData = (data, formConfig, type = "set", isMobile = _isMobile()) => {
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
        // format = "YYYY-MM-DD HH:mm:ss"
      } = formConfig[i];
      field = field || dataIndex;
      switch (type) {
        case "date":
        case "time":
        case "datetime":
          if (!data[field]) {
            data[field] =
              initialValue ||
              defaultValue || null;
            // moment("1970-1-1 00:00:00").valueOf();
          } else {
            //将时间戳位数处理
            if (data[field] && data[field].toString().length === 10) {
              //需要补0
              data[field] = data[field] * 1000;
            }
            if (isMobile === false) {
              //pc端 
              data[field] = moment(data[field]);
            } else {
              data[field] = new Date(data[field]);
            }
          }

          break;
        case "cascader":
          data[field] = data[field] && data[field].split(",");
          break;
        default:
          break;
      }
      _data[field] = data[field];
    }
  } else {
    for (let i = 0; i < formConfig.length; i++) {
      let { type, field, timestamp = 13, dataIndex } = formConfig[i];
      field = field || dataIndex;
      switch (type) {
        case "date":
        case "time":
        case "datetime":
          if (data && data[field]) {
            data[field] = moment(data[field]).valueOf();
            if (timestamp === 10 && data[field]) {
              let _strd = data[field].toString();
              let _d = _strd.substr(0, 10);
              data[field] = Number(_d);
            }
          } else {
            data[field] = '';
          } 
          break;
        case "cascader":
          data[field] = data[field] && data[field].join(",");
          break;
        default:
          break;
      }
      _data[field] = data[field];
    }
  }
  return _data;
};
const setValues = function (data) {
  //数据和是否return格式化好的值而不是直接设置进表单
  const { setFieldsValue } = this.props.form;
  const { formConfig } = this.state;
  let isMobile = this.isMobile();
  console.log(this);
  let _data = formatData(data, formConfig, "set", isMobile);
  setFieldsValue(_data);
};
export { formatData };
export default setValues;
