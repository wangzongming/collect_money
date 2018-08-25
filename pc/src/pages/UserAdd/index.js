import React, { Component } from "react";
import SuperForm from "../../component/super-form-pc";
import { message as Msg } from "antd";

class index extends Component {
  state = {
    config: false
  };

  componentDidMount() {
    const { myAxios } = this.props;
    if (this.props.match.params.uid) {
      //编辑
      this.setState({
        config: {
          dev: false,
          fetchConfig: {
            apiName: "userList",
            params: ["uid"]
          },
          formConfig: [
            {
              field: "uid",
              type: "string",
              label: "uid",
              message: "必填",
              isUrlParam: true,
              isHide: true
            },
            {
              field: "name",
              type: "string",
              label: "用户名",
              message: "必填",
              must: true
            },
            {
              field: "phone",
              type: "string",
              label: "联系电话",
              message: "必填",
              must: true
            },
            {
              field: "age",
              type: "number",
              label: "年龄"
            },
            {
              field: "sex",
              type: "select",
              label: "性别",
              selectOptionData: [
                {
                  label: "男",
                  value: "1"
                },
                {
                  label: "女",
                  value: "2"
                }
              ]
            },
            {
              field: "balance",
              type: "number",
              label: "账号余额/元",
              initialValue: '0'
            },
            {
              field: "images",
              type: "images",
              label: "人脸图片",
              message: "必填",
              must: true,
              maxNumber:1,
              url: window.globalConfig.apiUrl + "upload",
              token: this.props.userInfo.token,
              name: "user"
            }
          ],
          btns: [
            {
              field: "goback",
              label: "返回",
              isVerify: false,
              click: params => {
                this.props.goBack();
              }
            },
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
                  apiName: "userUpdate",
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
              label: "用户名",
              message: "必填",
              must: true
            },
            {
              field: "phone",
              type: "string",
              label: "联系电话",
              message: "必填",
              must: true
            },
            {
              field: "age",
              type: "number",
              label: "年龄"
            },
            {
              field: "sex",
              type: "select",
              label: "性别",
              selectOptionData: [
                {
                  label: "男",
                  value: "1"
                },
                {
                  label: "女",
                  value: "2"
                }
              ]
            },
            {
              field: "balance",
              type: "string",
              label: "账号余额/元",
              initialValue: '0'
            },
            {
              field: "images",
              type: "images",
              label: "人脸图片",
              message: "必填",
              must: true,
              maxNumber:1,
              url: window.globalConfig.apiUrl + "upload",
              token: this.props.userInfo.token,
              name: "user"
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
                  apiName: "userAdd",
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
  }

  render() {
    const { config } = this.state;
    return (
      <div>
        {config ? (
          <SuperForm
            ref="SuperForm"
            config={config}
            myFetch={this.props.myAxios}
            help
          />
        ) : null}
      </div>
    );
  }
}

export default index;
