import React, { Component } from "react";
import s from "./style.less";
import Order from "../../component/order";
import {
  message as Msg,
  Card,
  Col,
  Row,
  Icon,
  Drawer,
  Button,
  Divider,
  Spin,
  Popconfirm
} from "antd";
const { Meta } = Card;

class index extends Component {
  state = {
    imgHeight: window.innerWidth * 0.16, //图片高
    edit: false, //是否是编辑模式
    visible: false, //右边抽屉显示状态
    editVisible: false, //右边编辑抽屉显示状态
    editMneu: null, //被编辑的菜
    selected: [], //选择的菜
    data: [
      // {
      //   name: "宫保鸡丁",
      //   price: 82.12,
      //   menuId: "123456", //id
      //   soldOut: 10, //售出份数
      //   img: "https://images.pexels.com/photos/838846/pexels-photo-838846.jpeg?auto=compress&cs=tinysrgb&h=350",
      //   classify: [
      //     {//分类
      //       label: "川菜",
      //       value: "01"
      //     }
      //   ],
      //   sort: 0
      // }
    ],
    orderForm: {}, //后台生产的订单
    stepVisible: false
  };

  componentDidMount() {
    this.refresh();
    window.onresize = () => {
      this.setState({
        imgHeight: window.innerWidth * 0.16
      });
    };
  }

  payCancel = ()=>{
    this.setState({
      stepVisible:false,
      orderForm:{}
    })
  }

  refresh = () => {
    const { myAxios } = this.props;
    myAxios({
      apiName: "menuList"
    }).then(({ data, success, message }) => {
      if (success) {
        data.map((item, i) => {
          if (item.classify) {
            item.classify = item.classify.split(",");
          }
          item.img = item.images[0] ? item.images[0].url : "";
          return item;
        });
        this.setState({
          data,
          loading: false
        });
      } else {
        Msg.error(message);
      }
    });
  };

  //切换抽屉是否显示
  drawerChange = show => {
    this.setState({
      visible: show
    });
  };

  //菜被点击时将菜加入选中列表或者从列表里删除
  menuClick = params => {
    let { selected = [], edit } = this.state;
    //设置默认份数
    if (!edit) {
      //非编辑模式能添加
      params.count = 1;
      let exist = false;
      let index = 0;
      for (let i = 0; i < selected.length; i++) {
        let { menuId } = selected[i];
        if (params.menuId === menuId) {
          //存在需要删除
          exist = true;
          index = i;
          break;
        }
      }
      if (exist) {
        //存在需要删除
        selected.splice(index, 1);
      } else {
        //不存在
        selected.push(params);
      }
      this.setState({ selected });
    }
  };

  //增加份数
  add = menuId => {
    let { selected = [] } = this.state;
    selected = selected.map(item => {
      if (item.menuId === menuId) {
        //份数加一个
        item.count++;
      }
      return item;
    });
    this.setState({
      selected
    });
  };

  //删除份数
  minus = menuId => {
    let { selected = [] } = this.state;
    selected = selected.map(item => {
      if (item.menuId === menuId) {
        //份数减一个
        if (item.count > 0) {
          item.count--;
        }
      }
      return item;
    });
    this.setState({
      selected
    });
  };

  //清空已选列表
  delSelected = () => {
    this.setState({
      selected: []
    });
  };

  //结算  生成订单
  createOrder = () => {
    const { selected } = this.state;
    const { myAxios } = this.props;
    myAxios({
      apiName: "orderAdd",
      params: selected
    }).then(({ success, message, data }) => {
      if (success) { 
        this.setState({
          orderForm: data,
          stepVisible: true,
          visible:false
        });
      } else {
        Msg.error(message);
      }
    });
  };

  //删除菜
  delMenu = params => {
    const { myAxios } = this.props;
    myAxios({
      apiName: "menuDel",
      params: params
    }).then(({ success, message }) => {
      if (success) {
        Msg.success(message);
        this.refresh();
      } else {
        Msg.error(message);
      }
    });
  };

  //编辑按钮
  editBtn = () => {
    this.setState({
      edit: !this.state.edit,
      selected: []
    });
  };

  //菜的编辑按钮
  editMenuBtn = params => {
    //跳转编辑页面
    const { push } = this.props;
    push(`/menu/edit/${params.menuId}`);
  };

  render() {
    const {
      data = [],
      selected,
      visible = false,
      edit,
      loading = false
    } = this.state;
    let selectedNumber = 0; //已选的总数量
    let selectedAllMoney = 0; //已选的总价钱
    for (let i = 0; i < selected.length; i++) {
      selectedNumber += selected[i].count;
    }

    return (
      <Spin spinning={loading}>
        <div>
          {data.length === 0 ? (
            <div className="noData">暂无数据</div>
          ) : (
            <div className={s.root}>
              {//非编辑模式下进入编辑模式会有提醒
              edit ? (
                <a
                  onClick={this.editBtn}
                  style={{ display: "inline-block", padding: "10px 0px" }}
                >
                  {edit ? "退出编辑模式" : "进入编辑模式"}
                </a>
              ) : (
                <Popconfirm
                  placement="top"
                  title={"将清空当前页面所有操作"}
                  onConfirm={this.editBtn}
                  okText="确定"
                  cancelText="取消"
                >
                  <a style={{ display: "inline-block", padding: "10px 0px" }}>
                    {edit ? "退出编辑模式" : "进入编辑模式"}
                  </a>
                </Popconfirm>
              )}

              {/* 菜单项 */}
              <Row gutter={24}>
                {data.map(
                  (
                    {
                      name,
                      price,
                      menuId, //id
                      soldOut, //售出份数
                      classifyName = "暂未分类",
                      img
                    },
                    index
                  ) => {
                    let item = data[index];
                    let _s = false;
                    let _count = 0; //选了多少份
                    //是否被选中
                    for (let i = 0; i < selected.length; i++) {
                      if (selected[i].menuId === menuId) {
                        _s = true;
                        _count = selected[i].count;
                      }
                    }
                    return (
                      <Col
                        style={{ margin: "5px 0" }}
                        span={8}
                        xs={12}
                        lg={6}
                        md={8}
                        sm={8}
                        xxl={4}
                        key={index}
                        onClick={() => {
                          this.menuClick({
                            menuId,
                            name,
                            price
                          });
                        }}
                      >
                        <Card
                          className={`${_s ? s.selected : edit ? "" : s.card}`}
                          hoverable
                          style={{ width: "100%" }}
                          cover={
                            <img
                              alt="example"
                              height={this.state.imgHeight}
                              src={img}
                            />
                          }
                          actions={
                            edit
                              ? [
                                  //编辑模式下的操作
                                  <Popconfirm
                                    placement="top"
                                    title={"确定删除？"}
                                    onConfirm={e => {
                                      e.stopPropagation();
                                      this.delMenu({ ...item });
                                    }}
                                    okText="确定"
                                    cancelText="取消"
                                  >
                                    <Icon type="delete" />
                                  </Popconfirm>,
                                  <Icon
                                    type="edit"
                                    onClick={e => {
                                      e.stopPropagation();
                                      this.editMenuBtn({ ...item });
                                    }}
                                  />
                                ]
                              : [
                                  //非编辑模式下的操作
                                  <Icon
                                    type="plus"
                                    onClick={e => {
                                      e.stopPropagation();
                                      this.add(menuId);
                                    }}
                                  />,
                                  <span className={s.count}>{_count}</span>,
                                  <Icon
                                    type="minus"
                                    onClick={e => {
                                      e.stopPropagation();
                                      this.minus(menuId);
                                    }}
                                  />
                                ]
                          }
                        >
                          <Meta
                            title={name}
                            description={
                              <div>
                                <div>
                                  价格：
                                  {price}元
                                </div>
                                <div>
                                  分类：
                                  {classifyName}
                                </div>
                                <div>
                                  销售份数：
                                  {soldOut}
                                </div>
                              </div>
                            }
                          />
                        </Card>
                      </Col>
                    );
                  }
                )}
              </Row>
              {/* 控制右边菜单的按钮 */}
              {!visible && selected && selected.length > 0 ? (
                <div className={s.LookselectedBtn}>
                  <Button
                    onClick={() => {
                      this.drawerChange(true);
                    }}
                    type="primary"
                  >
                    查看已选
                    <br />
                    {selectedNumber}
                  </Button>
                </div>
              ) : null}

              {/* 右边抽屉 */}
              <Drawer
                width={320}
                title="已选列表"
                placement="right"
                closable={false}
                onClose={() => {
                  this.drawerChange(false);
                }}
                visible={visible}
                style={{ paddingBottom: "50px" }}
              >
                <Row>
                  {selected &&
                    selected.map((item, i) => {
                      let _allMoney = item.count * item.price;
                      selectedAllMoney += _allMoney;
                      return (
                        <Col key={i} span={24}>
                          {/* 每一行 */}
                          {i === 0 ? "" : <Divider />}
                          <Row type="flex" justify="space-between">
                            <Col span={6}>菜名</Col>
                            <Col span={6} style={{ textAlign: "right" }}>
                              {item.name}
                            </Col>
                          </Row>
                          <Row type="flex" justify="space-between">
                            <Col span={6}>数量</Col>
                            <Col span={6} style={{ textAlign: "right" }}>
                              {item.count}
                            </Col>
                          </Row>
                          <Row type="flex" justify="space-between">
                            <Col span={6}>单价/元</Col>
                            <Col span={6} style={{ textAlign: "right" }}>
                              {item.price}
                            </Col>
                          </Row>
                          <Row type="flex" justify="space-between">
                            <Col span={6}>总价/元</Col>
                            <Col span={6} style={{ textAlign: "right" }}>
                              {_allMoney}
                            </Col>
                          </Row>
                        </Col>
                      );
                    })}
                </Row>
                <br />
                {/* 底部结算按钮 */}
                <Row
                  style={{
                    position: "absolute",
                    width: "90%",
                    bottom: "3px",
                    left: "10px",
                    right: "10px",
                    background: "white",
                    padding: "10px"
                  }}
                  type="flex"
                  justify="space-between"
                >
                  <Col span={10}>
                    <Button
                      onClick={this.delSelected}
                      type="Default"
                      style={{ width: "100%" }}
                    >
                      清空
                    </Button>
                  </Col>
                  <Col span={10} style={{ textAlign: "right" }}>
                    <Button
                      type="primary"
                      onClick={this.createOrder}
                      style={{
                        width: "100%",
                        background: "orange",
                        border: "orange"
                      }}
                    >
                      共{selectedAllMoney.toFixed(2)}
                    </Button>
                  </Col>
                </Row>
              </Drawer>
            </div>
          )}

          <Order {...this.props} visible={this.state.stepVisible} orderForm={this.state.orderForm} payCancel={this.payCancel}/>
        </div>
      </Spin>
    );
  }
}

export default index;
