import { message as Msg } from "antd";
//请求数据并且设置表单值
function getSelectOptData(fetchConfig = {}) {
  const {
    apiName,
    params = [],
    otherParams = {},
    reviewKey = {}
  } = fetchConfig;
  const {
    myFetch,
    form: { getFieldValue }
  } = this.props;
  let _params = {};
  for (let i = 0; i < params.length; i++) {
    _params[params[i]] = getFieldValue(params[i]);
  }

  myFetch({
    apiName,
    params: {
      ..._params,
      ...otherParams
    }
  }).then(({ success, message, data = [] }) => {
    if (success) {
      const {
        label = "label",
        value = "value",
        children = "children"
      } = reviewKey;
      let _newData = [];
      for (let i = 0; i < data.length; i++) {
        let item = data[i];
        _newData.push({
          label: item[label],
          value: item[value],
          children: item[children]
        });
      }
      return _newData;
    } else {
      this.setState({
        loading: false
      });
      Msg.error(message);
      return false;
    }
  });
}

export default getSelectOptData;
