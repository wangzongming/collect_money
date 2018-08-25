import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import actionObj from "../reduxConfig/action";
import * as globalConfig from "../global";

//并不是一个空组件  包裹后会带上一些数据到props
class Blank extends Component {
  //防止缓存的跳转路由
  myHistory = {
    push: url => {
      this.props.history.push(this.updateUrl(url));
    },
    replace: url => {
      this.props.history.push(this.updateUrl(url));
    },
    go: url => {
      this.props.history.go(url);
    },
    goBack: url => {
      this.props.history.goBack();
    }
  };

  //防止缓存
  updateUrl = (url, _key) => {
    let key = (_key || "t") + "="; //默认是"t"
    let reg = new RegExp(key + "\\d+"); //正则：t=1472286066028
    let timestamp = +new Date();
    if (url.indexOf(key) > -1) {
      //有时间戳，直接更新
      return url.replace(reg, key + timestamp);
    } else {
      //没有时间戳，加上时间戳
      if (url.indexOf("?") > -1) {
        let urlArr = url.split("?");
        if (urlArr[1]) {
          return urlArr[0] + "?" + key + timestamp + "&" + urlArr[1];
        } else {
          return urlArr[0] + "?" + key + timestamp;
        }
      } else {
        if (url.indexOf("#") > -1) {
          return (
            url.split("#")[0] + "?" + key + timestamp + window.location.hash
          );
        } else {
          return url + "?" + key + timestamp;
        }
      }
    }
  };

  //所有公共props
  otherProps = {
    ...globalConfig,
    ...this.myHistory,
    actions: {
      ...actionObj
    }
  };

  render() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        ...this.props,
        ...this.otherProps
      })
    );
  }
}
//让所有组件默认被redux连接
const NBlack = connect(state => state)(withRouter(Blank));

const blank = CurComponent => {
  return props => {
    return (
      <NBlack>
        <CurComponent {...props} />
      </NBlack>
    );
  };
};
export default blank;
