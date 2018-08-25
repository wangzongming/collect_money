 import React, { Component } from "react";
import {  message as Msg } from "antd"; 

class Index extends Component {
  componentDidMount(){
    // console.log('props:', this.props)
  }
  // componentWillReceiveProps(props, aa) {
  //   console.log(props, aa);
  // }
  loginBtn = () => {
    Msg.loading('loading');
    const { myFetch } = this.props; 
    myFetch({
      apiName:'login',  
      params:{
        username: "admin",
        password: "123456"
      }
    }).then((data)=>{
      Msg.destroy() 
    })
    // const {
    //   dispatch,
    //    actions = {} } = this.props;
    // const { login } = actions;

     
    // dispatch(
    //   login({
    //     userName: "oldWang",
    //     pwd: "123456"
    //   })
    // );
  };

  render() {
    return (
      <div>
          home
      </div>
    );
  }
}

 
export default Index;
