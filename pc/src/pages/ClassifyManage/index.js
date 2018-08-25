import React, { Component } from "react";
import SuperForm from "../../component/super-form-pc";
import { Table, Divider, Modal, Icon, Button, message as Msg } from "antd";
class index extends Component {
  state = {
    modal: false, //弹出成
    editClassify: false, //当前编辑
    data: [
      // {
      //   classifyName: "测试",
      //   classifyId: "001",
      //   createTime: "2017-33"
      // }
    ]
  };

  componentDidMount() {
    //因为分类需要从后台取所以需要回调操作
    //请求分类
    // this.setState({});
    this.refresh();
  }

  refresh = () => {
    const { myAxios } = this.props;
    myAxios({
      apiName: "classifyList"
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
    const { editClassify, editClassify:{classifyId} } = this.state;
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

  del = ({ classifyId }) => {
    const { myAxios } = this.props;
    myAxios({
      apiName: "classifyDel",
      params: { classifyId }
    }).then(({ data, success, message }) => {
      if (success) {
        Msg.success(message);
        this.refresh();
      } else {
        Msg.error(message);
      }
    });
  };

  handleCancel = () => {
    this.setState({
      editClassify: false,
      modal: false
    });
  };
  edit = classify => {
    this.setState(
      {
        modal: true,
        editClassify: classify
      },
      () => {
        setTimeout(() => {
          if (this.refs.SuperForm) {
            this.refs.SuperForm.setFieldsValue({ ...this.state.editClassify });
          }
        }, 500);
      }
    );
  };

  addBtn = () => {
    this.setState({
      editClassify: false,
      modal: true
    });
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
      title: "分类名",
      dataIndex: "classifyName",
      key: "classifyName"
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "createTime"
    },
    {
      title: "操作",
      dataIndex: "address",
      key: "address",
      render: (data, rowData) => {
        return (
          <span>
            <a
              onClick={() => {
                this.del(rowData);
              }}
            >
              删除
            </a>
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
    return (
      <div>
        <Modal
          title="操作"
          visible={this.state.modal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
          footer={[]}
        >
          <SuperForm
            ref="SuperForm"
            config={this.config}
            myFetch={this.props.myAxios}
            help
          />
        </Modal>
        <Table
          rowKey={rowData => {
            return rowData.classifyId;
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

export default index;
