import React, { Component } from "react";
import { Button } from "antd"; // Upload, Icon, message
import "wcamera/model/tracking.js";
import "wcamera/model/data/face.js";
import "wcamera";

class Index extends Component {
  componentDidMount() {
    // this.myCamera = new window.Camera({
    //   el: "webcam", //元素必须为id名
    //   width: window.innerHeight / 2 + 100,
    //   height: window.innerHeight / 2 + 100,
    //   audio: false, //是否开启声音  [booblean] 默认false  开启后无声卡会报错
    //   video: true, //是否开启声音  [booblean] 默认true

    //   //开启人脸后必须引入 tracking.js  tracker所配置的对应的js文件（所有需要的js都放置在model/data下）
    //   linColor: "#1890ff", //线条的颜色
    //   tracking: true, //是否开启跟踪，不开启将使用简洁版，
    //   tracker: "face" // 需要引入 face.js mouth.js eye.js r
    //   //不识别这些部位就可不引入需要别的办成数组即可 eg、['face', 'mouth', 'eye']
    //   // rect:(event)=>{} //这里面是捕捉到的区域数据
    // });
  }
  render() {
    // const { token } = this.props.userInfo;

    return (
      <div>
        <div id="webcam" style={{ position: "relative" }} />
        <br />
        <center>
          <Button
            onClick={() => { 
              this.myCamera.save(base64 => {
                //返回一个回调函数回调参数是base64 获取不到相片也会执行，只是数据为'获取图像失败'
                console.log(base64);
              });
              // this.props.myFetch('faceApprove')
            }}
          >
            认证
          </Button>
        </center>
      </div>
    );
  }
}

export default Index;
