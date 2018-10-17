// 让组件包含左边菜单
import React from "react";
import blank from "./blank";
import { Layout, Icon, Row, Col, Avatar, Popover } from "antd";
import { CreateMenu, logout, getUserInfo } from "../global";
const { Header } = Layout;

class SiderMenu extends React.Component {
  state = {
    userInfo: {
      avatar: "",
      name: ""
    },
    collapsed: false
  };
  componentDidMount() {
    getUserInfo().then(({ userInfo: { head_img, username = "未知" } }) => {
      this.setState({
        userInfo: {
          avatar: head_img,
          name: username
        }
      });
    });
  }
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed
    });
  };
  logout = () => {
    logout(this.props.history);
  };
  render() {
    const {
      userInfo: { avatar, name }
    } = this.state;
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <CreateMenu collapsed={this.state.collapsed} />
        <Layout>
          <Header style={{ background: "#fff", padding: 0 }}>
            <Row>
              <Col span={8}>
                <div style={{ marginLeft: "16px" }}>
                  <Icon
                    style={{ fontSize: "20px" }}
                    className="trigger"
                    type={this.state.collapsed ? "menu-unfold" : "menu-fold"}
                    onClick={this.toggle}
                  />
                </div>
                <div />
              </Col>
              <Col span={8} offset={7} style={{ textAlign: "right" }}>
                <Popover
                  content={
                    <div style={{ minWidth: "100px", textAlign: "center" }}>
                      <a onClick={this.logout}>登出</a>
                    </div>
                  }
                  placement="bottom"
                >
                  <Avatar src={avatar} />
                  <span style={{ marginLeft: "5px" }}>{name}</span>
                </Popover>
              </Col>
            </Row>
          </Header>
          <div
            style={{
              padding: 16,
              boxSizing: "box-border",
              minHeight: "80vh"
            }}
          >
            <div
              style={{
                padding: 16,
                boxSizing: "box-border",
                background: "#fff",
                minHeight: "80vh"
              }}
            >
              {this.props.children ? (
                React.Children.map(this.props.children, child =>
                  React.cloneElement(child, {
                    ...this.props
                  })
                )
              ) : (
                <div />
              )}
            </div>
          </div>
        </Layout>
      </Layout>
    );
  }
}
const siderMenu = CurComponent => {
  const NewCom = blank(CurComponent);
  return props => {
    return (
      <SiderMenu {...props}>
        <NewCom {...props} />
      </SiderMenu>
    );
  };
};
export default siderMenu;
