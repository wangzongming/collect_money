import { message as Msg } from "antd";
//请求数据并且设置表单值
function setFormValues(fetchConfig = {}) {
  const { value } = this.state;
  const { apiName, params = [], otherParams = {} } = fetchConfig;
  const {
    myFetch,
    form: { getFieldValue, setFieldsValue }
  } = this.props;
  let _params = {};
  for (let i = 0; i < params.length; i++) {
    _params[params[i]] = getFieldValue(params[i]) || value[params[i]];
  }

  myFetch({
    apiName,
    params: {
      ..._params,
      ...otherParams
    }
  }).then(({ success, message, data }) => {
    if (success) {
      if (Array.isArray(data)) {
        data = data[0];
      }
      const { formConfig, value } = this.state;
      const _values = {};
      for (let i = 0; i < formConfig.length; i++) {
        let item = formConfig[i];
        let { field } = item;
        _values[field] = data[field];
      }  
      setFieldsValue(_values);

      this.setState({
        loading: false,
        value: { ...value, ..._values }
      });
    } else {
      this.setState({
        loading: false
      });
      Msg.error(message);
    }
  });
}

export default setFormValues;
