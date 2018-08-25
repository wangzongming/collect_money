import React, { Component } from "react";
import s from "./style.less";
import {
  Table,
  Divider,
  Button,
  message as Msg,
  Popconfirm,
  Form,
  Row,
  Col,
  Input,
  Drawer
} from "antd";
const FormItem = Form.Item;
class index extends Component {
  state = {
    modal: false, //弹出成
    data: [],
    menuList: [
      //菜数据
      {
        name: "宫爆鸡丁",
        value: "01",
        price: "10.00",
        number: 2,
        allPrice: "20.00"
      },
      {
        name: "小炒肥肠",
        value: "02",
        price: "10.00",
        number: 2,
        allPrice: "20.00"
      }
    ],
    orderDetail: {
      //订单数据
      payPerson: "老王",
      price: "1009.09",
      payMethod: "1",
      payTime: "2018-09-34  21:33:00",
      orderId: "12345"
    }
  };

  componentDidMount() {
    this.refresh();
  }

  //搜索
  search = () => {
    this.props.form.validateFields((err, values) => {
      this.refresh(values);
    });
  };

  refresh = (values = {}) => {
    const { myAxios } = this.props;
    myAxios({
      apiName: "orderList",
      params: { ...values }
    }).then(({ data, success, message }) => {
      if (success) {
        this.setState({
          data
        });
      } else {
        Msg.error(message);
      }
    });
  };

  //删除
  del = ({ orderId }) => {
    const { myAxios } = this.props;
    myAxios({
      apiName: "orderDel",
      params: { orderId }
    }).then(({ data, success, message }) => {
      if (success) {
        Msg.success(message);
        this.refresh();
      } else {
        Msg.error(message);
      }
    });
  };

  //详情
  detail = rowData => {
    this.setState({
      modal: true
    });
    console.log("详情：", rowData);
  };

  columns = [
    {
      title: "下单用户",
      dataIndex: "name",
      key: "name",
      width: 120,
      render: data => {
        if (data) {
          return data;
        } else {
          return "现金结账";
        }
      }
    },
    {
      title: "支付金额/元",
      dataIndex: "price",
      key: "price",
      width: 120
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      render: data => {
        if (data) {
          return data;
        } else {
          return "-";
        }
      }
    },
    {
      title: "支付时间",
      dataIndex: "orderPayTime",
      key: "orderPayTime"
    },
    {
      title: "支付方式",
      dataIndex: "payMethod",
      key: "payMethod",
      render: data => {
        let _t = "";
        switch (data) {
          case "0":
            _t = "刷脸支付";
            break;
          case "1":
            _t = "现金支付";
            break;
          default:
            _t = "未知";
            break;
        }

        return _t;
      }
    },
    {
      title: "操作",
      dataIndex: "address",
      key: "address",
      render: (data, rowData) => {
        return (
          <span>
            <Popconfirm
              title="确定删除吗?"
              onConfirm={() => {
                this.del(rowData);
              }}
              onCancel={() => {}}
              okText="确认"
              cancelText="取消"
            >
              <a>删除</a>
            </Popconfirm>

            <Divider type="vertical" />
            <a
              onClick={() => {
                this.detail(rowData);
              }}
            >
              详情
            </a>
          </span>
        );
      }
    }
  ];

  render() {
    const { data, modal, menuList = [], orderDetail = {} } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={s.root}>
        <Drawer
          title="订单详情"
          placement="right"
          width="35vw"
          closable={false}
          onClose={() => {
            this.setState({ modal: false });
          }}
          visible={modal}
        >
          <Row style={{ margin: "12px 0" }}>
            <Col span={6}>菜名</Col>
            <Col span={6}>单价/元</Col>
            <Col span={6}>份数</Col>
            <Col span={6}>总计/元</Col>
          </Row>
          {menuList.map(({ price, number, allPrice, name }, i) => {
            return (
              <Row style={{ margin: "12px 0" }} key={i}>
                <Col span={6}>{name}</Col>
                <Col span={6}>{price}</Col>
                <Col span={6}>{number}</Col>
                <Col span={6}>{allPrice}</Col>
              </Row>
            );
          })}
          <Row style={{ margin: "18px 0", fontSize: "13px" }}>
            <Col span={24} style={{ fontSize: "12px" }}>
              订单号：
              {orderDetail.orderId}
            </Col>
            <Col span={24}>
              付款人：
              {orderDetail.payMethod === "0"
                ? orderDetail.payPerson
                : "现金结账"}
            </Col>
            <Col span={24} style={{ color: "orange" }}>
              总价：
              {orderDetail.price}元
            </Col>
          </Row>
        </Drawer>

        <Form className="ant-advanced-search-form" onSubmit={this.search}>
          <Row gutter={24}>
            <Col span={8}>
              <FormItem label={`用户名`}>
                {getFieldDecorator(`name`)(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label={`联系电话`}>
                {getFieldDecorator(`phone`)(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                重置
              </Button>
            </Col>
          </Row>
        </Form>
        <br />
        <Table
          rowKey={rowData => {
            return rowData.orderId;
          }}
          columns={this.columns}
          dataSource={data}
        />
      </div>
    );
  }
}

const w = Form.create()(index);
export default w;
