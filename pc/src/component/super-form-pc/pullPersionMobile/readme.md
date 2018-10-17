import PullPersonMobile from 'xxx'

    <PullPersonMobile

        treeData            树结构数据 [array | object]  

        meUrl               路由名 [string]  eg  

        routeControl        用不用路由控制 主要作用是手机的back键点击后不会直接退出页面

        selectType="0"      [string]  默认0 选择类型  '0'人员部门都能选  '1'只能选择部门  '2'只能选择人员  

        help                帮助文档   [boolen]  默认false

        edit                是否可编辑 [boolen]  默认true

        label="人员"        左边label  [string]  默认null 

        title="人员选择"    弹出层的标题 [string] 默认“请选择”

        loading            loading状态  [boolen]  默认false

        myFetch={myFetch}  myFetch     [fn]  执行后后必须是return个promise对象    【必传】  

        search             是否开启搜索功能  [boolen]  默认false

        searchApi           搜索时调用的接口 [string]  默认null     【search功能存在时为必填】

        searchParamsKey     搜索时给后台的搜索值得k  [string] 默认searchText 

        searchOtherParams   搜索时的其他参数  [object] 默认空  eg {pageSize:'9999'} 

        rootNodeSelect      根节点是否可被选择 [boolen] 默认false

        minNumber           至少选择数量 [number] 默认 0
        
        maxNumber           最多选择数量 [number] 默认 9999

        visible     是否显示弹出层 [boolen] 默认false

        noBar       是否不显示顶部导航条 [boolen] 默认true

        bottomInfo  当人员节点被点击是是否弹出人员信息 [boolen] 默认false
        bottomInfoField   弹出那些字段  [array | string] [{
            label:'姓名', //这个字段首先会去匹配对象K,对应上后就去k的值，匹配不上就取写死的值
            value:'name', //去匹配值，匹配不上就是空
        }]   为string时会取后台返回的字段  值不存在时将不渲染
        bottomInfoStyle   底部信息框样式

        可选的文字配置项
        textObj = { 
            searchPlaecholder  搜索框的占位符  [string]  默认'search',
            
            loading 加载中的文字  [string] 默认'loading...',
            
            noData 没有数据时显示的文字 [string] 默认'暂无数据',
            
            subTit 底部选中的列表的标题 [string] 默认'已选择的部门或成员',
            
            addBtn   添加按钮的文字  [string] 默认'添加',

            saveBtn   右上角保存按钮文字  [string] 默认'保存',
            
            noSelectPerson  当selectType===1时弹出的提示   默认'只能选择部门！',  

            noSelectDepartment 当selectType===2时弹出的提示 默认'只能选择人员！', 
            
            rootNodeNoSelect 根节点不让选时弹出的提示 默认'根节点不可被选择！',

        }
        
        
        可选的antd的配置
        导航条的配置
        NavBarAntd = {}  [object]  eg 同下
        搜索框的配置
        searchAntd = {}  [object]  eg {clear:true}

        可配置项  k值 
        k = {
            label: [string]  默认"label",
            value:[string]  默认"value",
            type: [string]  默认"type",
            children: [string]  默认"children",
        };

        firstNavLabel='全部'  面包屑导航条第一级名称  [string]   默认 '全部'
        
    />
    
    方法：
        getValue()  返回选中的数据
        setValue(array)  设置数据


    rc-form调用方式：
        const { getFieldDecorator } = form;
        {
            getFieldDecorator('MyFrom', {
                valuePropName: 'defaultValue',
                onChange: (v) => {
                    console.log('aaa', v)
                }
            })(
                <PullPersionMobile
                    help 
                    ref={(me) => {
                        if (me) {
                            this.pullPerson = me;
                        }
                    }}
                    treeData={[
                        {
                            label: '测试',
                            value: '0',
                            type: '2'
                        }
                    ]}
                />
            )
        }
