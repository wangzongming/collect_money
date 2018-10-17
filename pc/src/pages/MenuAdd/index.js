import React, { Component } from "react";
// import SuperForm from "../../component/super-form-pc";
import QnnForm from "../../component/super-form-pc";
import { message as Msg, Form } from "antd";

class index extends Component {
  state = {
    config: false
  };

  componentDidMount() {
    const { myAxios } = this.props;
    //先去获取分类
    myAxios({
      params: {},
      apiName: "classifyList"
    }).then(({ success, data = [], message }) => {
      if (success) {
        data = data.map((item, i) => {
          item.label = item.classifyName;
          item.value = item.classifyId;
          return item;
        });
        //因为分类需要从后台取所以需要回调操作
        //请求分类
        if (this.props.match.params.menuId) {
          //编辑
          this.setState({
            config: {
              dev: false,
              fetchConfig: {
                apiName: "menuList",
                params: ["menuId"]
              },
              formConfig: [
                {
                  field: "menuId",
                  type: "string",
                  label: "menuId",
                  message: "必填",
                  isUrlParam: true,
                  isHide: true
                },
                {
                  field: "name",
                  type: "string",
                  label: "菜名",
                  message: "必填",
                  required: true
                },
                {
                  field: "price",
                  type: "number",
                  label: "价格",
                  message: "必填",
                  required: true
                },
                {
                  field: "show",
                  type: "select",
                  label: "是否显示",
                  message: "必填",
                  initialValue: "0",
                  selectOptionData: [
                    {
                      label: "显示",
                      value: "0"
                    },
                    {
                      label: "隐藏",
                      value: "1"
                    }
                  ],
                  required: true
                },
                {
                  field: "soldOut",
                  type: "number",
                  label: "已售份数",
                  message: "必填",
                  required: true,
                  initialValue: "0"
                },
                {
                  field: "classify",
                  type: "select",
                  label: "分类",
                  message: "必填",
                  selectOptionData: data,
                  required: true
                },
                {
                  field: "sort",
                  type: "number",
                  label: "排序",
                  initialValue: 1000,
                  message: "必填",
                  required: true,
                  help: "越小越往前排"
                },
                {
                  field: "images",
                  type: "images",
                  label: "图片",
                  message: "必填",
                  required: true,
                  url: window.globalConfig.apiUrl + "upload",
                  token: this.props.userInfo.token,
                  name: "menu"
                }
              ],
              btns: [
                {
                  field: "reset",
                  label: "重置",
                  isVerify: false,
                  click: params => {
                    const { form } = params;
                    form.resetFields();
                  }
                },
                {
                  field: "sumbit",
                  label: "提交",
                  other: {
                    type: "primary"
                  },
                  click: params => {
                    //编辑模式
                    myAxios({
                      apiName: "menuUpdate",
                      params: params.values
                    }).then(({ data, success, message }) => {
                      if (success) {
                        Msg.success(message, 2, () => {
                          params.form.resetFields();
                          this.props.goBack();
                        });
                      } else {
                        Msg.error(message);
                      }
                    });
                  }
                }
              ]
            }
          });
        } else {
          this.setState({
            config: {
              dev: false,
              formConfig: [
                {
                  field: "name",
                  type: "string",
                  label: "菜名",
                  message: "必填",
                  required: true
                },
                {
                  field: "price",
                  type: "number",
                  label: "价格",
                  message: "必填",
                  required: true
                },
                {
                  field: "show",
                  type: "select",
                  label: "是否显示",
                  message: "必填",
                  initialValue: "0",
                  selectOptionData: [
                    {
                      label: "显示",
                      value: "0"
                    },
                    {
                      label: "隐藏",
                      value: "1"
                    }
                  ],
                  required: true
                },
                {
                  field: "soldOut",
                  type: "number",
                  label: "已售份数",
                  message: "必填",
                  required: true,
                  initialValue: "0"
                },
                {
                  field: "classify",
                  type: "select",
                  label: "分类",
                  message: "必填",
                  selectOptionData: data,
                  required: true
                },
                {
                  field: "sort",
                  type: "number",
                  label: "排序",
                  initialValue: 1000,
                  message: "必填",
                  required: true,
                  help: "越小越往前排"
                },
                {
                  field: "images",
                  type: "images",
                  label: "图片",
                  message: "必填",
                  required: true,
                  url: window.globalConfig.apiUrl + "upload",
                  token: this.props.userInfo.token,
                  name: "menu"
                }
              ],
              btns: [
                {
                  field: "reset",
                  label: "重置",
                  isVerify: false,
                  click: params => {
                    const { form } = params;
                    form.resetFields();
                  }
                },
                {
                  field: "sumbit",
                  label: "提交",
                  other: {
                    type: "primary"
                  },
                  click: params => {
                    //新增
                    myAxios({
                      apiName: "menuAdd",
                      params: params.values
                    }).then(({ data, success, message }) => {
                      if (success) {
                        Msg.success(message);
                      } else {
                        Msg.error(message);
                      }
                    });
                  }
                }
              ]
            }
          });
        }
      } else {
        Msg.error(message);
      }
    });
  }

  render() {
    const { config } = this.state;
    console.log(config)
    return (
      <div>
        {config ? (
          <QnnForm 
            // ref="SuperForm"
            // formConfig={config}
            {...config}
            fetch={this.props.myAxios}
            headers={{ token: this.props.userInfo.token }}
            history={this.props.history}
            match={this.props.match}
            form={this.props.form}
          />
        ) : null}
      </div>
    );
  }
}
const rForm = Form.create()(index);
export default rForm;
