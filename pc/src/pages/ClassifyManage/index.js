import React, { Component } from "react";
import QnnT from "../../component/qnn-table";
class index extends Component {
  render() {
    return (
      <div>
        <QnnT
          fetch={this.props.myFetch}
          headers={{ token: this.props.userInfo.token }}
          history={this.props.history}
          match={this.props.match}
          {...window.Classify_config}
        />
      </div>
    );
  }
}

export default index;
