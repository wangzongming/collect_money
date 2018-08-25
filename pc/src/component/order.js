import React, { Component } from "react";
import {
  Modal,
  Steps,
  Icon,
  Row,
  Col,
  Radio,
  Button,
  message as Msg
} from "antd";
//订单提交生成组件
const RadioGroup = Radio.Group;
const Step = Steps.Step;
class order extends Component {
  state = {
    visible: this.props.visible, //该组件是否显示
    steps: 0, //当前步骤
    payMethod: "0", //付款方式  0刷脸  1现金
    orderForm: this.props.orderForm || {},
    over: false //订单是否完成
    // orderForm: {
    //   menuList: [
    //     //菜列表
    //     {
    //       name: "宫爆鸡丁",
    //       price: "18.8",
    //       number: 2,
    //       menuId: ""
    //     },
    //   ],
    //   price: "900", //总价
    //   receiver: "admin" //收款人
    // }
  };

  componentWillReceiveProps(props) {
    this.setState({
      ...props
    });
  }

  //支付
  pay = () => {
    const { payMethod, orderForm } = this.state;
    if (payMethod === "0") {
      //刷脸支付
      Msg.info("暂不支持");
    } else {
      //直接结账  直接结账不存uid
      const { myAxios } = this.props;
      myAxios({
        apiName: "menuPay",
        params: {
          waitPay: false,
          orderStatus: "2",
          orderId: orderForm.orderId,
          payMethod
        }
      }).then(({ data, success, message }) => {
        if (success) {
          Msg.success(message, 1, () => {
            // this.props.payCancel()
            this.setState({
              steps: 1,
              over: true
            });
          });
        } else {
          Msg.error(message);
        }
      });
    }
  };

  //付款方式切换
  payOnChange = v => {
    this.setState({
      payMethod: v.target.value
    });
  };
  render() {
    const { visible, steps, payMethod, orderForm = {}, over } = this.state;
    const { menuList = [], price = "0", receiver = "" } = orderForm;
    return (
      <div>
        <Modal
          width="70%"
          title="买单中"
          closable={false}
          visible={visible}
          footer={[]}
        >
          <Steps current={steps}>
            <Step title="确认订单" description="" />
            {payMethod === "0" ? <Step title="刷脸付款" description="" /> : ""}
            <Step title="完成" description="" />
          </Steps>
          <br />
          <div
            style={{
              maxHeight: "300px", 
              display: over ? "" : "none",
              textAlign: "center"
            }}
          >
            <Icon
              style={{ color: "#1890ff", fontSize: "100px" }}
              type="check-circle"
            />  
            <p style={{ fontSize: "20px", color: "orange",margin:'16px' }}>￥{price}</p>
            <Button style={{ width: "130px"  }} onClick={this.props.payCancel}>关闭</Button>
          </div>
          <div
            style={{
              maxHeight: "300px",
              overflowY: "scroll",
              display: steps === 0 ? "" : "none"
            }}
          >
            {menuList.map(({ name, price, number }, i) => {
              return (
                <Row key={i} style={{ margin: "10px 0px" }}>
                  <Col
                    span={5}
                    style={{ textAlign: "right", paddingRight: "16px" }}
                  >
                    {name}
                  </Col>
                  <Col span={12}>
                    {price}元 * {number}份
                  </Col>
                </Row>
              );
            })}
          </div>
          <Row
            style={{
              margin: "10px 0px",
              color: "orange",
              display: over ? "none" : ""
            }}
          >
            <Col span={5} style={{ textAlign: "right", paddingRight: "16px" }}>
              总价
            </Col>
            <Col span={12}>{price}元</Col>
          </Row>
          <div
            style={{
              margin: "20px 0px",
              textAlign: "right",
              display: over ? "none" : ""
            }}
          >
            <span style={{ paddingRight: "8px" }}>付款方式：</span>
            <RadioGroup
              onChange={this.payOnChange}
              value={this.state.payMethod}
            >
              <Radio value={"0"}>刷脸</Radio>
              <Radio value={"1"}>现金</Radio>
            </RadioGroup>
          </div>
          <div
            style={{
              margin: "20px 0px 0px 0px",
              textAlign: "right",
              display: over ? "none" : ""
            }}
          >
            <Button
              onClick={this.props.payCancel}
              style={{ marginRight: "8px" }}
            >
              取消订单
            </Button>
            <Button type="primary" onClick={this.pay}>
              {payMethod === "0" ? "去支付" : "确认结账"}
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default order;
