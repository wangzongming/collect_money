### qnn-form帮助文档  v0.0.43 
* 1、引用
  
            import QnnForm from 'XXX/qnn-form' 

* 2、使用
  
        <QnnForm 
            form={this.props.form} //使用QnnForm的页面必须使用rc-form插件包裹，并且将form传递给props
            fetch={this.props.myFetch} //必须返回一个promise
            //内部自带发送ajax的组件发送请求时会自动加到head头里面的数据 （上传会用到）
            headers={{ token: this.props.loginAndLogoutInfo.loginInfo.token }}
            formItemLayout={//布局
                labelCol: {
                    xs: { span: 24 },
                    sm: { span: 5 }
                },
                wrapperCol: {
                    xs: { span: 24 },
                    sm: { span: 16 }
                }
            }
            {...config}
        />

        config配置
        {
            请求配置  后会自动去请求并且赋值到表单可使用rcform设置数据
            fetchConfig:{
                apiName:'123',
                params:{//从表单中取字段  此时可以取默认值或者网址上的值
                    id:'id',
                },
                otherParams:{//定死的数据
                    test:'123456'
                }
            },

            表单字段
            formConfig:[ 
                {   
                    // 通用属性
                    field: 'id', //唯一的字段名 [string]  ***必传
                    type: 'string', //类型 [string]  ***必传
                    label: 'id', //label [string]  
                    hide: true, //是否隐藏 [boolean] 默认false
                    disabled: false,//是否禁用 [boolean] 默认 false
                    placeholder: '请输入',// [string]
                    required: true,//是否必填 [boolean] 默认false
                    isUrlParams: true,//是否是从地址参数中取值 [boolean] 默认false
                    help: '必须输入全称。',//帮助信息 [string] 默认null
                    initialValue:'', //初始值
                    defaultValue:'', //默认值
                    span:'24',//默认独占一行 栅格化 
                    editDisabled:true,//编辑处于禁用状态
                    style:{//自定义input样式
                        color:'red'
                    },
                    onChange: (v) => {//值切换时的回调
                        console.log(v)
                    },
                    //显示格式化
                    formatter:function(value, prev, all){
                        return '123'
                    } 
                    message:'必填',  //当用户未填写字段时提醒的文字 [string]
                    typeMessage:'只能填写整数',  //类型填写错误时的提示文字 [string]
                    //前后填充暂时只支持普通文本填充
                    addonBefore:"Http://",//前填充 [string]
                    addonAfter:".com", //后填充  [string]
                    //前后缀图标暂时只支持icon名填充具体看 https://ant.design/components/icon-cn/
                    prefix:'user',//前缀图标   [string]
                    prefixStyle:{color:'rgba(0,0,0,.25)'},//前缀图标样式
                    suffix:'link',//后缀图标   [string]
                    suffixStyle:{color:'rgba(0,0,0,.25)'},//后缀图标样式   
                    
                    fetchConfig: {//配置后将会去请求下拉选项数据
                        apiName: 'getSysDepartmentList',
                        otherParams: {}
                    },

                    //特殊属性
                    //默认选项数据 下拉类型特有
                    optionData: [
                        {
                            name: '01name',
                            id: '01id',
                            orgId: '01orgId'
                        },
                        {
                            name: '02',
                            id: '02id',
                            orgId: '02orgId'
                        }
                    ],
                    optionConfig: {//下拉选项配置 下拉类型特有
                        label: 'name', //默认 label
                        value: ['id', 'orgId'],//最终的值使用逗号连接 默认值使用valueName 默认['value']
                    },
                },

                {//隐藏字段 并且是 从浏览器网址取的值
                    type: 'string',
                    label: 'id',
                    field: 'id', //唯一的字段名 ***必传
                    hide: true, //是否隐藏 默认 false
                    disabled: false,//是否禁用 默认 false
                    placeholder: '请输入',
                    required: true,
                    isUrlParams: true,//是否是从地址参数中取值 默认false
                },
                {//文本类型
                    type: 'string',
                    label: 'string',
                    field: 'name', //唯一的字段名 ***必传
                    placeholder: '请输入',//占位符
                    required: true,//是否必填
                    help: '必须输入全称。',//帮助信息  
                    onChange: (v) => {
                        console.log(v)
                    }
                },
                {//密码
                    type: 'password',
                    label: 'password',
                    field: 'password', //唯一的字段名 ***必传
                    placeholder: '请输入',//占位符
                    required: true,//是否必填
                    prefix: 'lock',//前缀图标   [string]
                    prefixStyle: { color: 'rgba(0,0,0,.25)' },//前缀图标样式   
                },
                {//数字类型
                    type: 'number',
                    label: 'number',
                    field: 'number', //唯一的字段名 ***必传
                    placeholder: '请输入',
                    required: true,
                    max: 99, //最大值
                    min: 20, //最大值
                    precision: 2, //数值精度 
                    // formatter:function(value){return value + '$'}, //格式化显示
                },
                {//整数
                    type: 'integer',
                    label: 'integer',
                    field: 'integer', //唯一的字段名 ***必传
                    placeholder: '请输入',
                    required: true,
                },
                {//邮箱
                    type: 'email',
                    label: 'email',
                    field: 'email', //唯一的字段名 ***必传
                    placeholder: '请输入',
                    required: true,
                },
                {//url
                    type: 'url',
                    label: 'url',
                    field: 'url', //唯一的字段名 ***必传
                    placeholder: '请输入',
                    required: true,
                },
                {//date yyyy-mm-dd
                    type: 'date',
                    label: 'date',
                    field: 'date', //唯一的字段名 ***必传
                    placeholder: '请选择',
                    required: true,
                },
                {//time yyyy-mm-dd
                    type: 'time',
                    label: 'time',
                    field: 'time', //唯一的字段名 ***必传
                    placeholder: '请选择',
                    required: true,
                    is24: true,//是否是24小时制 默认true2
                },
                {//dateTime yyyy-mm-dd hh:mm:ss
                    type: 'datetime',
                    label: 'datetime',
                    field: 'datetime', //唯一的字段名 ***必传
                    placeholder: '请选择',
                    required: true,
                    is24: true,//是否是24小时制 默认true 
                },
                {//普通选择框
                    type: 'select',
                    label: 'select',
                    field: 'select', //唯一的字段名 ***必传
                    placeholder: '请选择',
                    required: true,
                    multiple: false, //是否开启多选功能 开启后自动开启搜索功能
                    showSearch: false, //是否开启搜索功能 (移动端不建议开启)
                    // optionData: [//默认选项数据
                    //     {
                    //         name: '01name',
                    //         id: '01id',
                    //         orgId: '01orgId'
                    //     },
                    //     {
                    //         name: '02',
                    //         id: '02id',
                    //         orgId: '02orgId'
                    //     }, 
                    // ],
                    optionConfig: {//下拉选项配置
                        label: 'name', //默认 label
                        value: ['id', 'orgId'],//最终的值使用逗号连接 默认值使用valueName 默认['value']
                    },
                    fetchConfig: {//配置后将会去请求下拉选项数据
                        apiName: 'getSysDepartmentList',
                        otherParams: {}
                    }
                },
                {//层叠联动
                    type: 'cascader',
                    label: 'cascader',
                    field: 'cascader', //唯一的字段名 ***必传
                    placeholder: '请选择',
                    required: true,
                    showSearch: false, //是否开启搜索功能 (移动端不建议开启)
                    optionData: [//默认选项数据
                        {
                            name: '01name',
                            id: '01id',
                            children: [{
                                name: '01name',
                                id: '01id',
                            }]
                        },
                        {
                            name: '02',
                            id: '02id',
                        },
                    ],
                    optionConfig: {//下拉选项配置
                        label: 'name', //默认 label
                        value: 'id',//
                        children: 'children'
                    },
                    // fetchConfig: {//配置后将会去请求下拉选项数据
                    //     apiName: 'getSysDepartmentList',
                    //     otherParams: {}
                    // }
                },
                //树选择
                { 
                    isInTable:false, 
                    form: {
                        label:'树选择',
                        field:'treeSelect',
                        type: 'treeSelect',  
                        initialValue:[],
                        treeSelectOption:{
                            help:true,
                            fetchConfig: {//配置后将会去请求下拉选项数据
                                apiName: 'getSysDepartmentUserAllTree', 
                            },
                            search:true,
                            searchPlaceholder:'姓名、账号、电话',
                            // searchApi:'getSysDepartmentUserAllTree',  //搜索时调用的api  [string]
                            searchParamsKey:'search',//搜索文字的K 默认是'searchText'   [string]
                            searchOtherParams:{pageSize:999}//搜索时的其他参数  [object]
                        } 
                    }
                },

                {//条件显隐例子
                    type: 'string',
                    label: '条件显隐',
                    field: 'condition', //唯一的字段名 ***必传
                    placeholder: '请输入',//占位符
                    required: true,//是否必填 
                    // hide:true,
                    //array类型
                    //条件存在权重 下面条件满足上面条件将会失效 
                    //匹配规则为&&匹配
                    //内置三种action【disabled, show, hide】 
                    condition: [
                        {//条件
                            regex: {//匹配规则 正则或者字符串
                                id: '0',
                                name: 'aaa'
                            },
                            action: 'hide', //disabled,  show,  hide, function(){}
                        }
                    ]
                },
                {//formatter属性例子，显示格式化
                        type: 'string',
                        label: 'formatter案例',
                        field: 'formatter', //唯一的字段名 ***必传
                        placeholder: '请输入',//占位符
                        required: true,//是否必填
                        initialValue: '1',
                        formatter: function (value, prev, all) {
                            return '123'
                        }
                },
                

                {//textarea类型
                    type: 'textarea',
                    label: 'textarea',
                    field: 'textarea', //唯一的字段名 ***必传
                    placeholder: '请输入',//占位符
                    required: true,//是否必填   
                    rows: 4, //行高 默认4
                },
                {//files文件上传
                    type: 'files',
                    label: 'files',
                    field: 'files', //唯一的字段名 ***必传 
                    required: true,//是否必填 
                    desc: '点击或者拖动上传', //默认 点击或者拖动上传
                    subdesc: '只支持单个上传',//默认空
                    fetchConfig: {//配置后将会去请求下拉选项数据
                        apiName: window.configs.domain + 'upload',
                        // name:'123', //上传文件的name 默认空 
                    },
                    accept: 'image/jpeg', //支持上传的类型 默认都支持  格式"image/gif, image/jpeg"
                    max: 2, //最大上传数量
                },
                {//图片上传
                    type: 'images',
                    label: 'images',
                    field: 'images', //唯一的字段名 ***必传 
                    required: true,//是否必填 
                    fetchConfig: {//配置后将会去请求下拉选项数据
                        apiName: window.configs.domain + 'upload',
                        // name:'123', //上传文件的name 默认空 
                    },
                    accept: 'image/jpeg', //支持上传的类型 默认都支持  格式"image/gif, image/jpeg"
                    max: 2, //最大上传数量
                },{//可选相机的文件上传
                    type: 'camera',
                    label: 'camera',
                    field: 'camera', //唯一的字段名 ***必传 
                    required: true,//是否必填 
                    fetchConfig: {//配置后将会去请求下拉选项数据
                        apiName: window.configs.domain + 'upload',
                        // name:'123', //上传文件的name 默认空 
                    },
                    accept: 'image/jpeg', //支持上传的类型 默认都支持  格式"image/gif, image/jpeg"
                    max: 2, //最大上传数量
                }
            ],
            btns: [
                {
                    label: '获取值',
                    type: 'primary',
                    isValidate: false,//是否验证表单 默认true 
                    onClick: function (obj) {
                        console.log(obj)
                    },
                    //同表单条件一样 
                    condition: [
                        {//条件
                            regex: {//匹配规则 正则或者字符串
                                id: '01',
                                // name: 'aaa'
                            },
                            action: 'hide', //disabled,  show,  hide, function(){}
                        }
                    ]
                },
                {
                    label: '提交',
                    type: 'primary', //primary dashed danger
                    fetchConfig: {
                        //api 默认提交整个表单的数据
                        apiName: 'submit',
                        //此参数存在将不会提交全部表单参数而是选取params里的参数提交
                        //提交时需要字段改名获取后台只需要几个字段时会用到
                        // params:{k:field},
                        // delParams:[field,...], //删除不需要提交的参数
                        //定死参数
                        // otherParams:{test:'111'}
                    },
                    onClick: function (obj) { //此时里面会多一个response
                        console.log(obj)
                    },

                    //当事件确定要发生时需要提醒用户时用到
                    affirmTitle: '确认要提交吗？',//有这文字会点击按钮验证通过时将自动弹出提示
                    affirmDesc: '提交后将无法撤回',//有这文字会点击按钮验证通过时将自动弹出提示
                    affirmYes: '确定',// 确认窗的确定按钮文字 默认确定
                    affirmNo: '取消',//确认窗的取消按钮文字  默认取消

                    //其他属性
                    isValidate: true,//点击后是否验证表单 默认true 
                    disabled: false, //是否禁用
                    loading: false, //是否加载状态
                    icon: 'save',//icon
                    // block:true,//将按钮宽度调整为其父宽度
                    // href:'http://baidu.com', //点击事件失效 改为跳转
                    // target:true, //相当于 a 链接的 target 属性，href 存在时生效

                }
            ]
        }

* 使用实例
  
        <QnnForm 
            form={this.props.form} //form对象一定要在这传入
            fetch={this.props.myFetch}
            //内部自带发送ajax的组件发送请求时会自动加到head头里面的数据 
            headers={{ token: this.props.loginAndLogoutInfo.loginInfo.token }}
            {...this.state.config}
        />

        //设置已有的值（非请求方式设置值）
        componentDidMount() {
            let data = {
                name: '测试王',
                date: 1234569877894,
            };  
            //得使用sFormatData静态方法格式化
            let _d = QnnForm.sFormatData(data, this.state.config.formConfig);
            this.props.form.setFieldsValue(_d)
        }
