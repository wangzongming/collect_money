import React, { Component } from "react";
import { menuData } from "../config";
import { connect } from "react-redux";
import { Layout, Menu, Icon } from "antd";
import s from "./createMenu.less";
import { blank } from "../layout";
const { title, icon, data } = menuData;

const { Sider } = Layout; // Footer,Header, Content,
const SubMenu = Menu.SubMenu;

class createMenu extends Component {
  state = {
    collapsed: this.props.collapsed || false,
    menuDomArr: [], //所有菜单数据
    defaultSelectedKeys: this.props.match.url || "" //被选中的菜单
  };

  componentWillReceiveProps(props) {
    this.setState({
      collapsed: props.collapsed
    });
  }

  componentDidMount() {
    let menuDomArr = this.forMenu(data);
    this.setState({
      menuDomArr
    });
  }

  defaultSelectedKeys = [];
  defaultOpenKeys = [];

  onCollapse = collapsed => {
    // console.log(collapsed);
    this.setState({
      collapsed: !collapsed
    });
  };

  forMenu = data => {
    //递归菜单
    let _arr = [];

    for (let i = 0; i < data.length; i++) {
      const { route, children, hide, icon, label, index } = data[i];
      //设置默认首页
      if (index && !this.state.defaultSelectedKeys) {
        this.setState({
          defaultSelectedKeys: route
        });
      }
      if (!hide) {
        //不是隐藏菜单都显示出来
        if (Array.isArray(children) && children.length > 0) {
          //有子集
          _arr.push(
            <SubMenu
              key={route}
              title={
                <span>
                  {icon ? <Icon type={icon} /> : null}
                  <span>{label}</span>
                </span>
              }
            >
              {this.forMenu(children)}
            </SubMenu>
          );
        } else {
          //没有子集
          _arr.push(
            <Menu.Item
              onClick={() => {
                document.getElementsByTagName("title")[0].innerText = label;
                this.props.push(route);
              }}
              key={route}
            >
              {icon ? <Icon type={icon} /> : null}
              <span>{label}</span>
            </Menu.Item>
          );
        }
      }
    }

    return _arr;
  };

  render() {
    const { menuDomArr = [], collapsed, defaultSelectedKeys = "" } = this.state;
    let _defaultSelectedKeys = defaultSelectedKeys
      ? defaultSelectedKeys.split("/")
      : "";
    let defaultSelectedK = _defaultSelectedKeys[1]
      ? [`/${_defaultSelectedKeys[1]}`]
      : [];

    if (menuDomArr.length === 0 || !menuDomArr) {
      return <div />;
    } else {
      return (
        <Sider
          // collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <div className={s.loginContainer}>
            {icon ? <img className={s.logo} src={icon} alt="logo" /> : ""}

            <span style={{ display: collapsed ? "none" : "" }}>
              {title} &nbsp; {window.globalConfig.version}
            </span>
          </div>
          <Menu
            theme="dark"
            defaultOpenKeys={defaultSelectedK}
            defaultSelectedKeys={[
              `/${_defaultSelectedKeys[1]}`,
              defaultSelectedKeys
            ]}
            mode="inline"
          >
            {menuDomArr}
          </Menu>
        </Sider>
      );
    }
  }
}

export default connect(state => state)(blank(createMenu));
