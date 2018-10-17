import React, { Component } from 'react';
import { WhiteSpace, Toast, WingBlank, Checkbox, List, Flex, SearchBar, NavBar, Icon, ActivityIndicator, Modal } from 'antd-mobile';
import s from './style.less';
import help from './help'
const CheckboxItem = Checkbox.CheckboxItem;
const version = '0.1.56';
/*
修复苹果样式兼容（0.1.56），
弹出信息版&&修复无线循环bug（0.0.56）
*/
const imgs = {
    //淡蓝色
    bluePersionImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAYAAAAj6qa3AAADJ0lEQVRo3u1YX0hTURyWNP+WIqYRqUsjGArmHwLzXz1ICUVIzYcgAhXCP4nk1YbsnjuwF4UwZ4rNl8T97sRpD4nMMK0HbZFtbufogpjonmoSStFDSehtw90FC1nidr3Gvj18cLmcc75v5/f9zrkhIUEEEUQQAoBOHXRgKi2NrmGPkY76eiYHjmJJZyfPqBfOk+S6Ov69Ay9YybmEJCXRq+wh/FKrRb/gMh7c2kIIAGOO25H590agBVMs2/pZN2wuSkw8QMJZlpD0dKQHFSmz230K9sWnQEoSVlZEvzMa9N1ltrsREdtbeXFxz8K9+RGo8CghSk43bJWFh4uvxjs0r/ByY6PfhXsx3Qp3cHhDg+gMQB3wBRdYLAE3wA4f8JzJJKKaV6uNxujoQAv3Dsl7Bp3u7cmoKDGkfZpVlpoqmAFuVvQOvViwpaTsuwHNt1zpHBMjtAH8vOIJwS0YIjes1oAb4O4G4usCb1z9Xy4PeAhOwAlypKVFhAcgdxiOQDymlpb8bkCCk4ptNtGE347t8LD2ueV2Zia6CCb8cXV1z8LnoBZrHQ4lBypzUUbGgTkSK5ZZ6XyTRII+sfHYOjGxa+FnnbXeo9fzXUb0gisqdE6EhtJGTe5Cbnm5knvt/IWFeXZG1VCWZSMnB62zUvKYpmkjGPGTgQEP26GenFMonHcJmZnLzv5TWtvj8OPy84hGuPy+btj4Pi4O/WAv4G/T055/8AFEkbD5+d0u3NtI2gEKUmw2e8a9BDN4bGrKVRLvTsfG7ptwPoxQLeRhymDwuaWvQhZ+uLaGJJrveGNsjCmF6/hKTw/P/HPPe77Gq3LdNmdnldxTboWLjBS+7Y06a5Tq7xf6APQXN0MTye/rEy7lF8FuKS0s/OcPHALdDRS9mmsLtoKCwBtQwkpx3uTkvgv3Zne3CfylRw7rmNrcFJ0B7nW5wpGUJSf73QBmnGUwVV0tOuFezDzTDFhQZaX/DSgBTGq6u0VvQD4rw4auLv+f7Nwhw3+SYiLYWjLe1sakaGYsX9vb0U3IJsdVKoQ0P/EZtTpg7J6Hn5dfB78uwcIwiCCC+C/wG7di2vTsqe0bAAAAAElFTkSuQmCC",
    blueFolderImg: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgEAYAAAAj6qa3AAABaElEQVRo3u3ZsUtCURTH8fsH1OBoQ6AgtLWJEAgRiG4FQjikD0GpIVIClXz3OTU0lQRha54jOAUJOTg0tYSQ95gNgeEQ4RBovCGcXks0tIb18J3f8p3vhzvdKwSPxxNCCJmEcmeSTMpXdKlesynfIaT2W63f1ljHOTqsVAoFRCKXy3YHL67iW+fM75cSQCnLmlqfIE8rjYbtAIwW3FAilZo6wFeLz7hEp8Ggfa6+RCRKp/8KQN7BjqoNh0YQFG1HIs4D+NkNMNV4NJILoKt6vz+t6h8o1Eu3Kx9gQHu5nH0A/qnFXShTOBBwLIAMVdPqKh53LIBRA42WEwkGYAAGYAAGYAAGYAAGYAAGYAAGYABHAkQxSnVNcxzAcdVUk1hMlKwLTy+6uCi3YFOBac48QB/WyDMeHwyqj+222/39Nqgf1ebvT3w+/Rw1usxm9VtEonx+ViqvoUzhTKZkIRJ5vfwVxuMJIYT4BGQM8pMyG9nLAAAAAElFTkSuQmCC",
}
function closest(el, selector) {
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            return el;
        }
        el = el.parentElement;
    }
    return null;
}
class PullPersionMobile extends Component {

    state = {
        //树结构总数据
        treeData: this.props.treeData || '',

        //默认值传[]会直接把数据清空,页面将要render时最好把选好的默认值存到state中这样能保证数据不丢，
        //[val, val] 也是所选的所有数据
        defaultValue: this.props.defaultValue || [],

        //选中的数据 点击确定后会和defaultValue合并取消则清空 只在弹出层里有效 弹出层关闭即清空
        ModalData: [],

        //编辑状态下可以删除和显示添加按钮
        edit: this.props.edit === false ? false : true,

        //0部门和人员都能选  1只能选部门  2只能选人员  不传则什么都选不了
        selectType: this.props.selectType || false,

        //是否在加载数据 
        loading: this.props.loading,

        //选人的弹出层是否是出现状态
        visible: this.props.visible || false,

        //是否显示navBar
        noBar: this.props.noBar,

        //搜索的文字
        searchValue: '',

        //是否出现搜索框
        search: this.props.search || false,

        //一些其他设置
        //弹窗标题
        title: this.props.title ? this.props.title : '请选择',

        //表单label
        fLabel: this.props.label ? this.props.label : '',

        //导航条数据
        navData: [{
            label: this.props.firstNavLabel || '全部',
            value: 'all',
            type: '0'
        }],

        //当前渲染的节点
        listData: [],

        //最大值最小值
        minNumber: this.props.minNumber ? this.props.minNumber : 0,
        maxNumber: this.props.maxNumber ? this.props.maxNumber : 99999,

        //底部信息
        bottomInfo: this.props.bottomInfo,
        bottomInfoStyle: this.props.bottomInfoStyle || {},
        bottomInfoShow: false,
        bottomInfoId: '',
        bottomInfoList: [],
        bottomInfoField: ''
    }

    //可配置项
    //k值
    k = {
        label: this.props.k ? (this.props.k.label ? this.props.k.label : "label") : "label",
        value: this.props.k ? (this.props.k.value ? this.props.k.value : "value") : "value",
        type: this.props.k ? (this.props.k.type ? this.props.k.type : "type") : "type",
        children: this.props.k ? (this.props.k.children ? this.props.k.children : "children") : "children",
    }

    //一些文字的配置
    textObj = {
        //搜索框的占位符
        searchPlaecholder: this.props.searchPlaecholder || 'search',
        //加载中的文字
        loading: this.props.textObj ? this.props.textObj.loading : 'loading...',
        //没有数据时显示的文字
        noData: this.props.textObj ? this.props.textObj.loading : '暂无数据',
        //底部选中的列表的标题
        subTit: this.props.textObj ? this.props.textObj.subTit : '已选择的部门或成员',
        //添加按钮的文字
        addBtn: this.props.textObj ? this.props.textObj.addBtn : '添加',
        //当selectType===1时弹出的提示
        noSelectPerson: this.props.textObj ? this.props.textObj.noSelectPerson : '只能选择部门！',
        //当selectType===2时弹出的提示
        noSelectDepartment: this.props.textObj ? this.props.textObj.noSelectDepartment : '只能选择人员！',
        //根节点不让选时弹出的提示
        rootNodeNoSelect: this.props.textObj ? this.props.textObj.rootNodeNoSelect : '根节点不可被选择！',
        //右上角保存按钮文字
        saveBtn: this.props.textObj ? this.props.textObj.saveBtn : '保存',
        cancelBtn: this.props.textObj ? this.props.textObj.cancelBtn : <Flex><Icon type="left" /><span>取消</span></Flex>,
        //最大值最小值出限提醒 
        maxNumber: this.props.textObj ? this.props.textObj.maxNumber : '选择数量达到了上限',
        minNumber: this.props.textObj ? this.props.textObj.minNumber : `选择数量不足，至少需要选择${this.state.minNumber}个`
    }

    //默认值
    defaultValue = [];//默认值

    //antd的配置
    //导航条的配置
    NavBarAntd = this.props.NavBarAntd || {};
    //搜索框的配置
    searchAntd = this.props.searchAntd || {};

    //myFetch必须是一个promise对象
    myFetch = this.props.myFetch || false;
    myFetchConfig = this.props.myFetchConfig || {};

    //搜索时调用的接口
    searchApi = this.props.searchApi;
    //搜索文字的K
    searchParamsKey = this.props.searchParamsKey || 'searchText';
    //搜索时的其他参数 
    searchOtherParams = this.props.searchOtherParams || {};

    //根节点是否可选
    rootNodeSelect = this.props.rootNodeSelect || false;

    //本组件的url（路由）
    meUrl = this.props.meUrl || 'pullPersionMobile';

    //不可配置项
    //让选人组件出来/隐藏的函数
    hideFn = this.hideFn.bind(this);
    showFn = this.showFn.bind(this);
    //删除选中的函数
    delFn = this.delFn.bind(this);
    //删除选中的函数 --弹窗里用的
    modalConDelFn = this.modalConDelFn.bind(this);
    //弹窗出来隐藏函数
    onOpenChange = this.onOpenChange.bind(this);
    //搜索方法
    searchFn = this.searchFn.bind(this);
    //搜索值输入时
    searchChangeFn = this.searchChangeFn.bind(this);
    //保存
    saveFn = this.saveFn.bind(this);
    //取消
    cancelFn = this.cancelFn.bind(this);
    //双击节点
    CheckboxItemDoubleClick = this.CheckboxItemDoubleClick.bind(this);
    //获取数据
    // getValue = this.getValue.bind(this);
    //设置数据
    // setValue = this.setValue.bind(this);
    //导航条被点击
    navClick = this.navClick.bind(this);
    //插件内置使用的设置路由的插件
    setRouter = this.setRouter.bind(this);
    //是否使用路由控制区别就是按底部的返回键时用了路由控制不会直接退出当前页面
    routeControl = this.props.routeControl;
    //父级url
    parentUrl = '';
    //是否走路由监听 在返回和保存时不应该走路由监听
    routeListen = true;

    //判断是双击还是单击
    doubleClickCount = 0;

    componentWillReceiveProps(newProps) {
        this.setState({
            ...newProps
        });
        // 这样在设置表单字段的时候也会更新主要用于rc-form可控
        this.defaultValue = newProps.defaultValue ? [...newProps.defaultValue] : [];
    }

    componentDidMount() {
        let { children } = this.k;
        let params = {};//url = "", 
        if (this.routeControl) {
            // url = this.props.match.url;
            params = this.props.params
        }
        // this.defaultValue = [...this.state.defaultValue];

        // if (!this.props.myFetch) {
        //     console.error('myFetch属性为必传')
        // }
        if (this.props.help) {
            help(version)
        }

        //如果路由是当前插件路由就打开弹层
        for (const key in params) {
            if (params[key] === this.meUrl) {
                let { defaultValue } = this.state;
                this.setState({
                    ModalData: Object.assign([], defaultValue), //表单里的数据带到浮层中的选择的列表里
                    visible: true
                })
            }
        }

        if (this.routeControl) {
            //监听路由变化 如果navData有数据就不让回去
            this.props.history.listen((routeInfo) => {
                let { navData } = this.state;
                if (this.routeListen && this.routeControl) {
                    if (routeInfo.pathname === this.parentUrl) {
                        if (navData.length > 1) {
                            //不能回去  并且删除一个导航条  重新设置listData
                            this.setRouter('in');
                            navData.pop();
                            this.setState({
                                navData,
                                listData: navData.length > 1 ? navData[navData.length - 1][children] : this.treeData
                            })
                        } else if (routeInfo.pathname === this.parentUrl) {
                            //关闭弹窗 
                            if (navData.length <= 1) {
                                this.setRouter('out', 'replace');
                                this.setState({
                                    //清空所有数据
                                    visible: false,
                                    ModalData: [],
                                })
                            }
                        }
                    } else if (routeInfo.pathname === this.meUrl) {
                        this.setState({
                            visible: false
                        })
                    }

                }

            })
        }

        setTimeout(() => {
            if (this.state.loading) {
                this.setState({
                    loading: false
                })
            }
        }, 7000)

        this.setValue(this.props.defaultValue);
        if (this.props.defaultValue) {
            this.setState({
                loading: false
            })
        }

        if (this.fetchConfig.apiName) {
            //请求接口
            this.setState({
                loading: true
            })
            this.myFetch(this.fetchConfig.apiName, this.fetchConfig.params)
                .then(({ success, message, data }) => {
                    if (success && data) {
                        if (Array.isArray(data)) {
                            //说明只请求了树结构 
                            this.setState({
                                treeData: data
                            })
                            return
                        }
                        this.setState({
                            ...data
                        })
                    } else {
                        this.setState({
                            loading: false
                        }, () => {
                            Toast.fail(message)
                        })
                    }
                });
        }

        if (this.props.onChange) {
            this.props.onChange(this.props.defaultValue)
        }
    }


    //获取数据
    getValue = () => {
        return this.state.defaultValue;
    }

    //设置数据
    setValue = (arr) => {
        this.setState({
            defaultValue: arr
        })
    }


    //点击节点
    CheckboxItemDoubleClick(e, data) {
        e.stopPropagation();
        // let target = e.target;
        let { children, type, label, value } = this.k;
        this.doubleClickCount++;

        let _type = data[type];
        let _children = data[children];
        let _label = data[label];
        let _value = data[value];
        if (_type !== '2' && _children) {
            let { navData } = this.state;
            navData.push({
                value: _value,
                label: _label,
                type: _type,
                children: _children,
                _index: navData.length //这个是导航条的索引
            })
            //设置listData数据为children 
            this.setState({
                listData: _children.length > 0 ? _children : '',
                navData
            })

            //将滚动条放到最上面
            this.scrollTop();
        } else {
            const { bottomInfoId, bottomInfoList, bottomInfoShow, bottomInfoField } = this.state;

            //判断是否显示
            let _bottomInfoShow;
            if (_value === bottomInfoId && bottomInfoShow) {
                _bottomInfoShow = false;
            } else {
                _bottomInfoShow = true;
            }

            //设置显示的数据
            let _bottomInfoList = [];
            if (Array.isArray(bottomInfoField)) {
                //取前台定义的数据,
                bottomInfoField && bottomInfoField.map((item, i) => {
                    const { label, value } = item;
                    _bottomInfoList.push({
                        label: data[label] || label,
                        value: data[value] || ''
                    })
                    return item;
                });
            } else {
                //直接获取后台的数据 
                _bottomInfoList = data[bottomInfoField] || [];
            }

            this.setState({
                bottomInfoId: _value,
                bottomInfoShow: _bottomInfoShow,

                //设置底部显示的信息
                bottomInfoList: _value === bottomInfoId ? bottomInfoList : _bottomInfoList
            })
        }

    }

    //保存函数
    saveFn() {
        let { ModalData, minNumber } = this.state;
        if (ModalData.length < minNumber) {
            Toast.info(this.textObj.minNumber)
            return;
        }
        this.defaultValue = [...ModalData];
        this.setState({
            defaultValue: Object.assign([], ModalData),
            ModalData: [],
            visible: false,
            bottomInfoShow: false,

            listData: [],//清空渲染的数据
            navData: [{
                label: this.props.firstNavLabel || '全部',
                value: 'all',
                type: '0'
            }],
        })
        if (this.props.onChange) {//用于rc-form
            this.props.onChange(Object.assign([], ModalData));
        }
        this.setRouter('out', 'go');
    }

    //取消函数
    cancelFn() {
        //关闭弹窗并且清空ModalData
        this.setState({
            //清空所有数据
            bottomInfoShow: false,
            visible: false,
            ModalData: [],

            listData: [],//清空渲染的数据
            navData: [{
                label: this.props.firstNavLabel || '全部',
                value: 'all',
                type: '0'
            }],
        })
        this.setRouter('out', 'go');
    }

    //切换
    PonChange = (e, val) => {
        e.stopPropagation();
        let checked = e.target.checked;
        let { ModalData, selectType, maxNumber } = this.state;
        let { value, type } = this.k;
        let _t = val[type]

        //提醒
        if (selectType === '1') {
            if (_t !== '1') {
                Toast.info(this.textObj.noSelectPerson, 2);
            }
        } else if (selectType === '2') {
            if (_t !== '2') {
                Toast.info(this.textObj.noSelectDepartment, 2);
            }
        }

        //根节点被选中时
        if (!this.rootNodeSelect && _t === '0') {
            Toast.info(this.textObj.rootNodeNoSelect, 2);
            return;
        }

        if (checked) {//被选中时
            //如果大于最大数量将不让选择
            if (ModalData.length >= maxNumber) {
                Toast.info(this.textObj.maxNumber)
                return;
            }

            //选的时候判断能不能被选中
            //人员部门都能选
            if (selectType === '0') {
                ModalData.push(val);
                this.setState({
                    ModalData
                })
            } else if (selectType === '1') {//只能选人员
                if (_t === '1') {
                    ModalData.push(val);
                    this.setState({
                        ModalData
                    })
                }
            } else if (selectType === '2') {//只能选部门
                if (_t === '2') {
                    ModalData.push(val);
                    this.setState({
                        ModalData
                    })
                }
            }

        } else {//取消选中时  
            ModalData.map((item, index) => {
                if (item[value] === val[value]) {
                    ModalData.splice(index, 1);
                    return ModalData;
                }
                return item
            })
            this.setState({
                ModalData
            })
        }

    }
    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }
    //搜索框输入值时调用
    searchFn(val) {
        let { treeData } = this.state;
        // console.log(val);
        if (!this.searchApi) {
            console.error('需要搜索必须传入searchApi属性');
        }
        if (val && this.props.myFetch) {
            this.setState({
                loading: true
            })
            this.myFetch(this.searchApi, { [this.searchParamsKey]: val, ...this.searchOtherParams }).then(({ data, message, success }) => {
                if (success) {
                    data.map((item, index) => {
                        return item.search = true;
                    })
                    //备份树结构数据
                    this.treeData = treeData;
                    this.setState({
                        listData: data,
                        loading: false
                    })
                } else {
                    this.setState({
                        loading: false
                    })
                }
            })

        } else {
            this.setState({
                listData: treeData
            })
        }

    }

    searchChangeFn(val) {
        clearTimeout(window.searchChangeTimer);

        window.searchChangeTimer = setTimeout(() => {
            this.searchFn(val);
        }, 200);
    }

    hideFn() {
        this.setState({
            visible: false,
            bottomInfoShow: false
        })
    }

    //将元素滚动条置0
    scrollTop = () => {
        const dom = document.getElementById('myListCon');
        if (dom) {
            dom.scrollTop = 0;
        }
    }

    //导航条被点击
    navClick(item) {
        let { navData, listData, treeData } = this.state;
        let { value, children } = this.k; //label, type, 
        let
            _value = item[value],
            //_label = item[label],_type = item[type],
            _children = item[children],
            _index = item._index;

        //最后一个和第一个都不能被点击
        if (_index && _index !== navData.length - 1) {
            //处理listData和navData
            listData = _children;
            let _navData = navData.splice(0, _index + 1);

            this.setState({
                listData,
                navData: _navData,
                bottomInfoShow: false
            })

            //将滚动条放到最上面
            this.scrollTop();
        } else if (_value === 'all') {
            //点击了全部
            let _navData = navData.splice(0, 1);
            listData = treeData;
            this.setState({
                listData,
                navData: _navData,
                bottomInfoShow: false
            })
        }

    }

    //设置路由
    setRouter(action, fn) {
        if (this.routeControl) {
            if (action === 'in') {
                //进入 
                //将父级url存起来
                //不能使用goback go等
                let { url } = this.props.match;
                this.parentUrl = url;
                //设置路由监听
                this.routeListen = true;
                //设置路由 
                if (fn) {
                    this.props.history[fn](this.meUrl);
                } else {
                    this.props.history.push(this.meUrl);
                }
            } else if (action === 'out') {
                //出去 
                //取消路由监听 
                this.routeListen = false;
                if (fn) {
                    if (fn === 'go') {
                        this.props.history.go(-1);
                        return;
                    }
                    this.props.history[fn](this.parentUrl);
                } else {
                    this.props.history.push(this.parentUrl);
                }

            }
        }
    }

    //弹出层被点出来的时候
    showFn() {
        //将插件路由push到history中
        this.setRouter('in');

        let { defaultValue } = this.state;
        this.setState({
            ModalData: Object.assign([], defaultValue), //表单里的数据带到浮层中的选择的列表里
            visible: true
        })
    }

    delFn(delValue) {
        let { defaultValue } = this.state;
        let { value } = this.k;
        for (let i = 0; i < defaultValue.length; i++) {
            if (defaultValue[i][value] === delValue) {
                //删除该人员或者部门
                defaultValue.splice(i, 1);
                this.setState({
                    defaultValue
                });
                this.defaultValue = defaultValue;
                return;
            }
        }
    }

    //删除的只是弹窗里的数据
    modalConDelFn(delValue) {
        let { ModalData } = this.state;
        let { value } = this.k;
        for (let i = 0; i < ModalData.length; i++) {
            if (ModalData[i][value] === delValue) {
                //删除该人员或者部门
                ModalData.splice(i, 1);
                this.setState({
                    ModalData
                });
                return;
            }
        }
    }

    onOpenChange() {
        this.setState({ visible: !this.state.visible });
    }

    isPhoneNumber = (pone) => {
        var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(pone)) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        let { label, value, type } = this.k;
        let {
            treeData,
            // defaultValue,
            ModalData,
            title,
            edit,
            loading,
            visible,
            fLabel,
            search,
            navData,
            listData,
            selectType,
            noBar,
            bottomInfoList = [],
            bottomInfoShow,
            bottomInfoStyle

        } = this.state;

        //设置树结构为数组
        if (treeData) {
            if (!Array.isArray(treeData)) {
                treeData = [treeData]
            }
        }

        //设置列表渲染数据
        //列表里面的不能用treeData
        if (navData.length === 1) {
            listData = listData && listData.length > 0 ? listData : treeData;
        }

        //设置默认值
        if (listData && listData.length === 0) {
            listData = treeData;
        }

        //form表单里的数据
        // console.log(defaultValue)
        const formCon = (
            this.defaultValue ?
                this.defaultValue.map((item, index) => {
                    let _type = item[type],
                        _value = item[value],
                        _label = item[label];
                    return <div key={index} style={{ paddingRight: edit ? '25px' : '5px' }} className={`${s.fItem}  ${_type === '2' ? s.per : s.folder}`}>
                        {_label}
                        <span style={{ display: !edit ? 'none' : '' }} onClick={() => { this.delFn(_value) }} className={s.fdel}>×</span>
                    </div>
                })
                :
                null
        )

        //弹窗里的数据
        const modalCon = (
            ModalData.length < 1 ?
                <WingBlank style={{ color: '#ccc', boxSizing: 'border-box' }}>
                    <center >{this.textObj.noData}</center>
                </WingBlank> :
                ModalData.map((item, index) => {
                    let _type = item[type],
                        _value = item[value],
                        _label = item[label];
                    return <div key={index} style={{ paddingRight: edit ? '25px' : '5px', boxSizing: 'border-box' }} className={`${'fItem'}  ${_type === '2' ? 'per' : 'folder'}`}>
                        {_label}
                        <span style={{ display: !edit ? 'none' : '' }} onClick={() => { this.modalConDelFn(_value) }} className={'fdel'}>×</span>
                    </div>
                })
        )

        //渲染导航条
        const renderNav = (<div className={'navContainer'}>
            {
                navData.map((item, index) => {
                    return <div key={index} className={'navItem'} onClick={() => { this.navClick(item) }}>
                        {item.label}
                        {
                            index === navData.length - 1 ? '' : <span style={{ paddingLeft: '5px' }}>/</span>
                        }
                    </div>
                })
            }
        </div>)


        //渲染列表
        const renderList = (<div>
            {
                <List
                    className={'myList'}
                    renderHeader={renderNav}
                    renderFooter={<div className={s.footer}>
                        <div className={'tit'}>
                            <WingBlank style={{ color: '#ccc' }}>
                                {this.textObj.subTit}
                            </WingBlank>
                        </div>
                        <div className={'footerCon'}>
                            <WingBlank>
                                {modalCon}
                            </WingBlank>
                        </div>

                    </div>}>
                    <div className={'myListCon'} style={{
                        height: selectType ? '65vh' : '95vh'
                    }} id="myListCon">

                        {
                            listData && listData.length ?
                                listData.map((item, index) => {
                                    let _type = item[type],
                                        _value = item[value],
                                        _search = item.search,
                                        _label = item[label];

                                    let valO = {
                                        ...item,
                                        value: _value,
                                        label: _label,
                                        type: _type
                                    }

                                    //设置是否被选中
                                    let _checked = false;

                                    ModalData.map((v, i) => {
                                        let _val = v[value];
                                        if (_val === _value) {
                                            return _checked = true;
                                        }
                                        return v;
                                    })

                                    let _isCheck = false;//是否可以选择
                                    let _img = '';//应该显示那张图片

                                    if (_type === '2') {//人员
                                        _img = imgs.bluePersionImg;
                                    } else {
                                        _img = imgs.blueFolderImg;
                                    }

                                    if (selectType === '0') {//人员部门都可以选
                                        _isCheck = true;
                                    } else if (selectType === '1') {//只能选择部门
                                        if (_type === '1') {//人员
                                            _isCheck = true;
                                        }
                                    } else if (selectType === '2') {//只能选择人员
                                        if (_type === '2') {//人员 
                                            _isCheck = true;
                                        }
                                    } else {
                                        //不能选人或者部门
                                        // console.log('selectType类型不对')
                                    }
                                    //根节点不可选的时候
                                    if (!this.rootNodeSelect && _type === '0') {//根节点
                                        // _img = imgs.folderImg;
                                        _img = imgs.blueFolderImg;
                                        _isCheck = false;
                                    } else if (this.rootNodeSelect && _type === '0') {
                                        _img = imgs.blueFolderImg;
                                        _isCheck = true;
                                    }


                                    return <div key={index}
                                        className={'lItem'}
                                        onClick={(e) => { this.CheckboxItemDoubleClick(e, item) }}
                                    >
                                        {
                                            _isCheck ?
                                                <CheckboxItem
                                                    onClick={(e) => {
                                                        //点击是input框的话需要阻止冒泡
                                                        if (e.target.type === 'checkbox') {
                                                            e.stopPropagation();
                                                        }
                                                    }}
                                                    extra={<img src={_img} alt='img' />}
                                                    checked={_checked}
                                                    arrow={(_type === '2' || _search) ? '' : "horizontal"}
                                                    onChange={(e) => this.PonChange(e, valO)}
                                                >
                                                    {_label}
                                                </CheckboxItem>
                                                :
                                                <List.Item
                                                    onClick={(e) => {
                                                        //点击是input框的话需要阻止冒泡
                                                        if (e.target.type === 'checkbox') {
                                                            e.stopPropagation();
                                                        }
                                                    }}
                                                    arrow={(_type === '2' || _search) ? '' : "horizontal"}
                                                    extra={<img src={_img} alt='img' />}>
                                                    {_label}

                                                </List.Item>
                                        }

                                    </div>
                                })
                                :
                                <div className={'treeNoData'}>
                                    {this.textObj.noData}
                                </div>
                        }
                    </div>
                </List>

            }

        </div>)


        //主内容
        const sidebar = (<div className={s.pullPersonContainer}>
            <div>
                {
                    noBar ? '' :
                        <NavBar
                            mode="dark"
                            icon={<Flex><div>{this.textObj.cancelBtn}</div></Flex>}
                            onLeftClick={this.cancelFn}
                            rightContent={<div onClick={this.saveFn}>{this.textObj.saveBtn}</div>}
                            {...this.NavBarAntd}
                        >{title}</NavBar>
                }

            </div>
            <div style={{ display: search ? 'block' : 'none' }} className={s.searchContainer}>
                <SearchBar onSubmit={this.searchFn} onChange={this.searchChangeFn} placeholder="Search" {...this.searchAntd} />
            </div>

            {/* 节点渲染 */}
            <div className={'treeContainer'}>
                <WhiteSpace />
                {
                    loading ?
                        <ActivityIndicator className={'myActivityIndicator'} text={this.textObj.loading} />
                        :
                        treeData ? renderList : <div className={s.noData}>{this.textObj.noData}</div>

                }
                <WhiteSpace />
            </div>
            {/* 底部信息框 */}
            <div className={'bottomInfo'} style={{
                transform: bottomInfoShow ? 'translateY(0)' : 'translateY(100%)',
                WebkitTransform: bottomInfoShow ? 'translateY(0)' : 'translateY(100%)',
                ...bottomInfoStyle
            }}>
                <div className={'close'} onClick={() => {
                    this.setState({
                        bottomInfoShow: false,
                    })
                }}>关闭</div>
                <div className={'content'}>
                    {
                        bottomInfoList.length === 0 ? <div style={{ color: '#ccc' }}>无数据</div> : null
                    }
                    {
                        bottomInfoList.map((item, i) => {
                            let { label, value } = item;
                            value = value ? value.replace(/\s/ig, '') : '';
                            //判断value是不是电话号码，是的话需要能点击
                            return <div key={i} className={'item'}>
                                <span>{label}</span>
                                {this.isPhoneNumber(value) ?
                                    <a href={`tel:${value}`}>{value}</a> :
                                    <span>{value}</span>}
                            </div>

                        })
                    }
                </div>

            </div>
        </div>);



        return (
            <div className={s.PullPersionMobile}>
                {/* form表单 */}
                <div>
                    <Flex align="start">
                        <div className={s.label} style={{ display: !fLabel ? 'none' : '' }}>
                            <WhiteSpace />
                            {fLabel}
                            <WhiteSpace />
                        </div>
                        <div className={s.con}>
                            {formCon}
                            {
                                edit
                                    ?
                                    <div className={s.addBtn}><span onClick={this.showFn}>{this.textObj.addBtn}</span></div>
                                    : null
                            }

                        </div>
                    </Flex>
                </div>

                <Modal
                    visible={visible}
                    popup={true}
                    style={{ width: document.documentElement.clientWidth, maxWidth: document.documentElement.clientWidth, color: '#A6A6A6', boxSizing: 'border-box', height: document.documentElement.clientHeight }}
                    maskClosable={false}
                    onClose={() => {
                        this.setState({
                            visible: false
                        })
                    }}
                    wrapProps={{ onTouchStart: this.onWrapTouchStart }}
                >
                    <div className={'myDrawer'}>
                        {sidebar}
                    </div>
                </Modal>
            </div>
        )
    }
}
// export default withRouter(PullPersionMobile);
export default PullPersionMobile;