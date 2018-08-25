import React, { Component } from "react";
import { Form, Spin, Upload, Icon, Button, Modal } from "antd";
import s from "./style.less";
import inpus from "./components/inpus";
import initialValueSwitch from "./methods/initialSwitch";
import _typeSwitch from "./methods/typeSwitch";
import { withRouter } from "react-router-dom";
import {
  setFormValues,
  getSelectOptData,
  getValues,
  btnClick
} from "./methods";
// import { withRouter } from 'react-router-dom';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 13,
      offset: 4
    }
  }
};

class Index extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      loading: true,
      value: {} //所有字段的值
    };
  }

  componentDidMount() {
    // console.log(this)
    console.assert(this.props.myFetch, "SuperFotm的myFetch为必传！！！");
    console.assert(this.props.config, "SuperFotm的config为必传！！！");
    const { config = {} } = this.props;
    const {
      dev = false,
      formConfig = [],
      fetchConfig = {},
      btns = []
    } = config;
    console.assert(formConfig, "config的formConfig为必传！！！");
    this.setState({
      dev,
      formConfig,
      fetchConfig,
      btns
    });
    if (dev) {
      console.log("表单配置:", config);
    }

    //遍历数据请求下拉选项的值或者获取人或者部门的树结构
    for (let i = 0; i < formConfig.length; i++) {
      const { type, fetchConfig = {}, field, isUrlParam } = formConfig[i];
      if (type === "select" && fetchConfig.apiName) {
        let _data = getSelectOptData.bind(this)(fetchConfig);
        if (_data) {
          let { otherData } = this.state;
          let _selectOptionDataKey = `${field}__selectOptionDataKey`;
          otherData[_selectOptionDataKey] = _data;
          this.setState({
            otherData
          });
        }
      }
      if (isUrlParam) {
        let _data = this.props.match.params[field];
        let { value } = this.state;
        if (_data) {
          //   let _d = {};
          value[field] = _data;
          this.setState({
            value
          });
        }
      }
    }

    // setTimeout(() => {
    //     this.setState({
    //         loading: false
    //     })
    // }, 100)

    //暴露出去的方法
    this.getValues = getValues.bind(this);

    //内部使用的方法
    this.btnClick = btnClick.bind(this);

    //按钮回调中的方法
    this.btnObj = {
      getValues: this.getValues,
      form: this.props.form
    };

    //给表单赋默认值  一定要放到最后执行
    if (fetchConfig.apiName) {
      //需要去请求默认表单值
      this.setState({
        loading: true
      });
      setFormValues.bind(this)(fetchConfig);
    } else {
      this.setState({
        loading: false
      });
    }
  }

  handleSubmit = () => {
    console.log("提交");
  };

  imghandleCancel = () => {
    //图片预览关闭
    this.setState({
      imgPreviewVisible: false
    });
  };
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    let { fileList } = e;
    fileList = fileList.map(item => {
      if (item.response && item.response.success) {
        item = item.response.data;
      }
      return item;
    });
    return e && fileList;
  };

  render() {
    const {
      formConfig = [],
      value,
      btns = [],
      loading,
      otherData = {},
      imgPreviewVisible,
      previewImage
    } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className={s.SuperFormPc}>
        <Spin size="large" spinning={loading}>
          <Form onSubmit={this.handleSubmit}>
            {formConfig.map((item, index) => {
              const {
                type,
                field,
                label,
                help,
                other = {},
                message,
                must,
                initialValue,
                rcFormConfig,
                isHide,
                selectOptionData = [],
                url,
                token,
                disabled,
                maxNumber = 999,
                name = "file"
              } = item;

              const { getFieldValue } = this.props.form;
              //下拉选择的选项数据
              let _selectOptionDataKey = `${field}__selectOptionDataKey`;
              item.selectOptionData =
                otherData[_selectOptionDataKey] || selectOptionData;
              switch (type) {
                case "images":
                  return (
                    <FormItem
                      key={index}
                      label={label}
                      help={help}
                      {...formItemLayout}
                      {...other}
                      style={{
                        display: isHide ? "none" : "block",
                        ...other.style
                      }}
                    >
                      <Modal
                        visible={imgPreviewVisible}
                        footer={null}
                        onCancel={this.imghandleCancel}
                      >
                        <img
                          alt="img"
                          style={{ width: "100%" }}
                          src={previewImage}
                        />
                      </Modal>
                      {getFieldDecorator(field, {
                        initialValue:
                          initialValue ||
                          initialValueSwitch(type, value[field]),
                        rules: [
                          {
                            type: _typeSwitch(type),
                            message: message ? message : `${label}为${type}类型`
                          },
                          {
                            required: must,
                            message: message
                              ? message
                              : `${label}为${
                                  type === "select" ? "必选" : "必填"
                                }项`
                          }
                        ],
                        valuePropName: "fileList",
                        getValueFromEvent: this.normFile,
                        ...rcFormConfig
                      })(
                        <Upload
                          key={index}
                          action={url}
                          name={name}
                          listType="picture-card"
                          disabled={disabled}
                          headers={{
                            token
                          }}
                          onPreview={file => {
                            this.setState({
                              previewImage: file.url || file.thumbUrl,
                              imgPreviewVisible: true
                            });
                          }}
                        >
                          {getFieldValue(field).length >= maxNumber ? null : (
                            <div>
                              <Icon type="plus" />
                              <div className="ant-upload-text">上传</div>
                            </div>
                          )}
                        </Upload>
                      )}
                    </FormItem>
                  );
                default:
                  return (
                    <FormItem
                      key={index}
                      label={label}
                      help={help}
                      {...formItemLayout}
                      {...other}
                      style={{
                        display: isHide ? "none" : "block",
                        ...other.style
                      }}
                    >
                      {getFieldDecorator(field, {
                        initialValue: initialValue
                          ? initialValue
                          : initialValueSwitch(type, value[field]),
                        rules: [
                          {
                            type: _typeSwitch(type),
                            message: message ? message : `${label}为${type}类型`
                          },
                          {
                            required: must,
                            message: message
                              ? message
                              : `${label}为${
                                  type === "select" ? "必选" : "必填"
                                }项`
                          }
                        ],
                        ...rcFormConfig
                      })(inpus.bind(this)(item))}
                    </FormItem>
                  );
              }
            })}
            <FormItem {...tailFormItemLayout}>
              {btns.map((item, index) => {
                let { label, other } = item;
                return (
                  <Button
                    onClick={() => {
                      this.btnClick(item);
                    }}
                    style={{ marginRight: "8px" }}
                    key={index}
                    {...other}
                  >
                    {label}
                  </Button>
                );
              })}
            </FormItem>
          </Form>
        </Spin>
      </div>
    );
  }
}

const WrappedRegistrationForm = Form.create()(withRouter(Index));
export default WrappedRegistrationForm;
