import React, { Component } from "react";
// import SuperForm from "../../component/super-form-pc";
import s from "./style.less";
import {
  Table,
  Divider,
  Icon,
  Button,
  message as Msg,
  Popconfirm,
  Form,
  Row,
  Col,
  Input
} from "antd";
const FormItem = Form.Item;
class index extends Component {
  state = {
    modal: false, //弹出成
    data: []
  };

  componentDidMount() {
    //因为分类需要从后台取所以需要回调操作
    //请求分类
    // this.setState({});
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
      apiName: "userList",
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

  handleOk = params => {
    const {
      editClassify,
      editClassify: { classifyId }
    } = this.state;
    const { myAxios } = this.props;
    if (editClassify) {
      params.values.classifyId = classifyId;
      myAxios({
        apiName: "classifyUpdate",
        params: params.values
      }).then(({ data, success, message }) => {
        if (success) {
          Msg.success(message);
          this.refresh();
          this.setState({
            editClassify: false,
            modal: false
          });
        } else {
          Msg.error(message);
        }
      });
    } else {
      myAxios({
        apiName: "classifyAdd",
        params: params.values
      }).then(({ data, success, message }) => {
        if (success) {
          Msg.success(message);
          this.refresh();
          this.setState({
            editClassify: false,
            modal: false
          });
        } else {
          Msg.error(message);
        }
      });
    }
  };

  del = ({ uid }) => {
    const { myAxios } = this.props;
    myAxios({
      apiName: "userDel",
      params: { uid }
    }).then(({ data, success, message }) => {
      if (success) {
        Msg.success(message);
        this.refresh();
      } else {
        Msg.error(message);
      }
    });
  };

  addBtn = () => {
    this.props.push(`/user/add`);
  };

  edit = rowData => {
    this.props.push(`/user/edit/${rowData.uid}`);
  };

  config = {
    dev: true,
    formConfig: [
      {
        field: "classifyName",
        type: "string",
        label: "分类名",
        message: "必填",
        must: true
      }
    ],
    btns: [
      {
        field: "reset",
        label: "重置",
        isVerify: false,
        click: params => {
          const { form } = params;
          form.resetFields();
        }
      },
      {
        field: "sumbit",
        label: "提交",
        other: {
          type: "primary"
        },
        click: params => {
          this.handleOk(params);
        }
      }
    ]
  };

  columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
      width: 120
    },
    {
      title: "年纪",
      dataIndex: "age",
      key: "age",
      width: 100
    },
    {
      title: "性别",
      dataIndex: "sex",
      key: "sex",
      width: 100
    },
    {
      title: "联系电话",
      dataIndex: "phone",
      key: "phone",
      width: 150
    },
    {
      title: "账户余额/元",
      dataIndex: "balance",
      key: "balance"
    },
    {
      title: "消费总额/元",
      dataIndex: "consumeAllMoney",
      key: "lastPayTime"
    },
    {
      title: "注册时间",
      dataIndex: "registerTime",
      key: "registerTime"
    },
    {
      title: "用户人脸",
      dataIndex: "images",
      key: "images",
      render: imagesList => {
        return <img src={imagesList[0].url} width="50px" alt="1" />;
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
                this.edit(rowData);
              }}
            >
              修改
            </a>
          </span>
        );
      }
    }
  ];

  render() {
    const { data } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={s.root}>
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
            return rowData.uid;
          }}
          columns={this.columns}
          dataSource={data}
          footer={() => {
            return [
              <Button key="0" onClick={this.addBtn} type="primary">
                <Icon type="plus" />
                新增
              </Button>
            ];
          }}
        />
      </div>
    );
  }
}

const w = Form.create()(index);
export default w;
