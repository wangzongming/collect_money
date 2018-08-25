import React, { Component } from "react";

class index extends Component {
  render() { 
    return <div>未找到该页面。{this.props.location.pathname}</div>;
  }
}
export default index;
