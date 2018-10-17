//菜单增删改
window.Menu_config = {
  dev: false,
  fetchConfig: {
    apiName: "menuList",
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
            apiName: "menuAdd"
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
        apiName: "menuDel"
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
        title: "菜名", //表头标题
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
      table: {
        title: "价格", //表头标题
        dataIndex: "price", //表格里面的字段
        align: "right",
        sorter: (a, b) => a.price - b.price,
        render: function(text) {
          return "<div>￥" + text + "</div>";
        },
        key: "price" //表格的唯一key
      },
      form: {
        type: "number",
        placeholder: "请输入...",
        required: true
      }
    },

    {
      table: {
        title: "已售份数", //表头标题
        dataIndex: "soldOut", //表格里面的字段
        align: "right",
        sorter: (a, b) => a.soldOut - b.soldOut,
        render: function(text) {
          return "<div>￥" + text + "</div>";
        },
        key: "soldOut" //表格的唯一key
      },
      form: {
        type: "number",
        placeholder: "请输入...",
        required: true
      }
    },
    {
      isInTable: false,
      form: {
        label: "分类",
        field: "classify",
        type: "select",
        placeholder: "请选择",
        fetchConfig: {
          apiName: "classifyList"
        },
        optionConfig: {
          value: "id",
          label: "classifyName"
        }
      }
    },
    {
      table: {
        // width: 100,
        title: "显隐状态", //表头标题
        dataIndex: "show", //表格里面的字段
        key: "show", //表格的唯一key ,
        align: "center",
        render: function(data) {
          if (data == "0") {
            return "隐藏";
          } else {
            return "显示";
          }
        }
      },
      form: {
        type: "select",
        initialValue: "1",
        optionData: [
          {
            label: "显示",
            value: "1"
          },
          {
            label: "隐藏",
            value: "0"
          }
        ]
      }
    },
    {
      table: {
        title: "排序", //表头标题
        dataIndex: "sort", //表格里面的字段
        key: "sort" //表格的唯一key
      },
      form: {
        type: "number",
        placeholder: "请输入...",
        required: true,
        initialValue: 1000,
        help: "越小越往前排"
      }
    },
    {
      table: {
        width: 115,
        title: "图片/1",
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
        label: "图片",
        type: "images",
        fetchConfig: {
          name: "menu",
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
                  apiName: "menuUpdate"
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
