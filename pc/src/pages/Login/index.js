import React from "react";
import { connect } from "react-redux";
import { Form, Icon, Input, Button, notification } from "antd";
import s from "./style.less";
const FormItem = Form.Item;
const imgs = {
  logo: require("../../img/logo/logo.png")
};
const openA = () => {
  notification.open({
    //提示
    key: 1,
    duration: 4,
    message: "请重新登陆！",
    description: "登录信息过期或者非法打开页面",
    icon: <Icon type="login" style={{ color: "#108ee9" }} />
  });
};

class index extends React.Component {
  componentDidMount() {
    //判断是否需要给弹窗提醒 从页面跳转多来并且网址带有?noToken=true就会弹出提醒
    const _s = this.props.location.search;
    if (_s) {
      if (_s.indexOf("noToken=true") !== -1) {
        openA();
      }
    }
    this.isNeetLogin();
    document.getElementsByTagName("title")[0].innerText = "管理员登录";
  } 

  isNeetLogin = props => {
    const { getUserInfo } = this.props || props;
    getUserInfo().then(({ token }) => {
      if (token) { 
        window.location.href = window.location.origin;
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {
          dispatch,
          actions: { login }
        } = this.props;

        dispatch(login(values));
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={s.root}>
        <div className={s.formContainer}>
          <div className={s.logo}>
            <img src={imgs.logo} alt="" />
          </div>
          <div className={s.nadmin}>非管理员请自觉离开本页面！</div>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <FormItem>
              {getFieldDecorator("username", {
                rules: [{ required: true, message: "请输入账号!" }]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  placeholder="Username"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator("password", {
                rules: [{ required: true, message: "请输入密码!" }]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                  }
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
            <FormItem style={{ textAlign: "center" }}>
              <Button type="primary" htmlType="submit" className={s.loginBtn}>
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
      </div>
    );
  }
}

const WrappedNormalLoginForm = Form.create()(index);
export default connect(state => state)(WrappedNormalLoginForm);
