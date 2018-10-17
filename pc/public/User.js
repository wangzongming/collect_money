//菜单增删改
window.User_config = {
  dev: false,
  fetchConfig: {
    apiName: "userList",
    params: {
      menuId: "menuId"
    }
  },
  antd: {
    //同步antd table组件配置 ***必传
    rowKey: function(row) {
      // ***必传
      return row.id;
    },
    // bordered: false,
    locale: {
      emptyText: "暂无数据"
    }
  },
  paginationConfig: {
    // 同步antd的分页组件配置
    position: "bottom"
  },
  drawerConfig: {
    width: "800px"
  }, //抽屉的配置 同步antd的Drawer组件配置

  //全局提示框 给false将
  infoAlert: function(selectedRows) {
    return "已选择 " + selectedRows.length + "项";
  },
  isShowRowSelect: true, //是否显示选择框  默认true

  //内置 新增add 删除del
  actionBtns: [
    {
      name: "add",
      icon: "plus", //icon
      type: "primary", //类型  默认 primary
      label: "新增",
      //表单里面的按钮  name内置 【submit， cancel】
      formBtns: [
        {
          name: "cancel", //关闭右边抽屉
          type: "dashed", //类型  默认 primary
          label: "取消"
        },
        {
          name: "submit", //内置add del
          type: "primary", //类型  默认 primary
          label: "提交", //提交数据并且关闭右边抽屉
          fetchConfig: {
            //ajax配置
            apiName: "userAdd"
          }
        }
      ]
    },
    {
      name: "del", //内置add del
      icon: "delete", //icon
      type: "danger", //类型  默认 primary  [primary dashed danger]
      label: "删除",
      fetchConfig: {
        apiName: "userDel"
      }
    }
  ],

  formConfig: [
    {
      isInTable: false,
      form: {
        field: "id",
        hide: true,
        type: "string",
        placeholder: "请输入...",
        required: true
      }
    },
    {
      isInSearch: true,
      table: {
        title: "姓名", //表头标题
        dataIndex: "name", //表格里面的字段
        key: "name" //表格的唯一key
      },
      form: {
        type: "string",
        placeholder: "请输入...",
        required: true
      }
    },
    {
      isInSearch: true,
      table: {
        title: "年纪", //表头标题
        dataIndex: "age", //表格里面的字段
        key: "age" //表格的唯一key
      },
      form: {
        type: "number",
        placeholder: "请输入...", 
      }
    },
    { 
      table: {
        width: 80,
        title: "性别", //表头标题
        dataIndex: "sex", //表格里面的字段
        key: "sex", //表格的唯一key
        render: function(data) {
          if (data) {
            return data === "1" ? "男" : "女";
          } else {
            return "未知";
          }
        }
      },
      form: {
        type: "select",
        placeholder: "请输入",
        required: true,
        initialValue: "1",
        optionData: [
          {
            label: "女",
            value: "2"
          },
          {
            label: "男",
            value: "1"
          }
        ]
      }
    },

    {
      isInSearch: true,
      table: {
        width: 150,
        title: "电话", //表头标题
        dataIndex: "phone", //表格里面的字段
        key: "phone", //表格的唯一key
        render: function(data) {
          if (!data) {
            return "-";
          }
          return data;
        }
      },
      form: {
        type: "string",
        placeholder: "请输入",
        required: true
      }
    },

    {
      table: {
        title: "账户余额", //表头标题
        dataIndex: "balance", //表格里面的字段
        align: "right",
        sorter: (a, b) => a.price - b.price,
        render: function(text) {
          return "<div>￥" + text + "</div>";
        },
        key: "balance" //表格的唯一key
      },
      form: {
        type: "number",
        placeholder: "请输入...", 
      }
    },
    {
      table: {
        title: "累计消费", //表头标题
        dataIndex: "consume_all_money", //表格里面的字段
        align: "right",
        sorter: (a, b) => a.price - b.price,
        render: function(text) {
          return "<div>￥" + text + "</div>";
        },
        key: "consume_all_money" //表格的唯一key
      },
      form: {
        type: "number",
        placeholder: "请输入...", 
        addShow:false,
        editShow:false,
        detailShow:true,
      }
    },
    {
      isInForm: false,
      table: {
        width: 200,
        title: "注册时间", //表头标题
        dataIndex: "createTime", //表格里面的字段
        key: "createTime", //表格的唯一key ,
        format: "YYYY-MM-DD HH:mm:ss"
      },
      form: {
        initialValue: new Date(), 
        type: "datetime", 
        addShow:false,
        editShow:false,
        dateilShow:true,
      }
    }, 
    {
      table: {
        width: 115,
        title: "面部数据",
        dataIndex: "images",
        type: "images",
        imgStyle: {
          width: 50,
          height: 50,
          style: {
            borderRadius: "10%",
            display: "block",
            margin: "0 auto"
          }
        }
      },
      form: {
        label: "面部数据",
        type: "images",
        fetchConfig: {
          name: "face",
          apiName: window.globalConfig.apiUrl + "upload"
        }
      }
    },
    {
      isInForm: false,
      showType: "tile", //出来的样式 bubble（气泡）  tile（平铺） 默认bubble
      table: {
        width: 130,
        title: "<center>操作</center>",
        key: "action",
        fixed: "right", //固定到右边
        btns: [
          {
            name: "edit", // 内置name有【edit, detail， del】
            render: function(rowData) {
              return "<a>编辑</a>";
            },
            //表单里面的按钮  name内置 【submit， cancel】
            formBtns: [
              {
                name: "cancel", //关闭右边抽屉
                type: "dashed", //类型  默认 primary
                label: "取消"
              },
              {
                name: "submit", //内置add del
                type: "primary", //类型  默认 primary
                label: "保存", //提交数据并且关闭右边抽屉
                fetchConfig: {
                  //ajax配置
                  apiName: "userUpdate"
                }
              }
            ]
          },
          {
            name: "detail", // 内置name有【detail， del】
            render: function(rowData) {
              return "<a>详情</a>";
            }
          }
        ]
      }
    }
  ]
};
