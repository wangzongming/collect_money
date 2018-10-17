import { message as Msg, Modal } from 'antd'
const confirm = Modal.confirm;
//需要绑定this
const action = function (rowInfo, rowData) {
    const { labelConfig, selectedRows } = this.state;
    const { name, onClick, fetchConfig = {}, formBtns = [] } = rowInfo;
    const { apiName, otherParams = {} } = fetchConfig;
    const { forms } = this.state;
    let _date = {};//详情或者编辑时候的数据
    let clickCb = {
        selectedRows,
        rowData,
        rowInfo,
        btnCallbackFn: this.btnCallbackFn,
        _formData:this.props.form.getFieldsValue()
    }
    this.getFromParams('form', (values) => {
        clickCb.formData = values
    })
    this.getFromParams('search', (values) => {
        clickCb.searchData = values
    })

    switch (name) {
        case 'add':
            //打开抽屉
            for (let i = 0; i < forms.length; i++) {
                forms[i].disabled =  forms[i].addDisabled === true ? true : false; //设置不禁用
            }
            this.closeDrawer(true);//打开抽屉
            this.setState({
                forms,
                drawerDetailTitle: labelConfig['add'] || '新增',
                drawerBtns: formBtns
            })
            break;
        case 'edit':
            //打开抽屉并且设置默认值
            this.closeDrawer(true);//打开抽屉
            this.setState({
                drawerDetailTitle: labelConfig['edit'] || '编辑',
                drawerBtns: formBtns
            })
            for (let i = 0; i < forms.length; i++) {
                let { field } = forms[i];
                _date[field] = rowData[field];
                forms[i].disabled = forms[i].editDisabled === true ? true : false; //设置不禁用
            }
            setTimeout(() => {
                _date = this.sFormatData(_date, this.state.forms, 'set');
                this.props.form.setFieldsValue({ ..._date })
            }, 10)
            break;
        case 'detail':
            //打开抽屉并且设置默认值 目前只能使用列表里的数据 
            for (let i = 0; i < forms.length; i++) {
                let { field } = forms[i];
                _date[field] = rowData[field];
                forms[i].disabled = true; //设置禁用
            }
            this.setState({
                drawerDetailTitle: labelConfig['detail'] || '详情',
                drawerBtns: formBtns,
                forms,
            }, () => {
                this.closeDrawer(true);//打开抽屉
                setTimeout(() => {
                    _date = this.sFormatData(_date, this.state.forms, 'set');
                    this.props.form.setFieldsValue({ ..._date })
                }, 10)
            })

            break;
        case 'cancel':
            this.closeDrawer(false);
            break;
        case 'submit':
            this.getFromParams('form', (values) => { 
                this.fetch(apiName, { ...values, ...otherParams }).then(({ data, success, message }) => {
                    if (success) {
                        this.refresh();
                        Msg.success(message)
                        this.closeDrawer(false);
                        if (onClick) {
                            onClick({ data, success, message, ...clickCb })
                        }
                    } else {
                        Msg.error(message)
                    }
                });
            })
            break;
        case 'del':
            const _this = this;
            if(_this.state.selectedRows.length ===0 ){
                Msg.error('请选择需要删除的数据');
                return;
            }
            confirm({
                title: '确认删除吗?',
                content: '删除数据后将无法恢复，取消删除请点击取消按钮。',
                onOk() { 
                    const { apiName, key } = fetchConfig;
                    let _pa = key ? { [key]: _this.state.selectedRows } : _this.state.selectedRows;
                    _this.fetch(apiName, _pa).then(({ success, message }) => {
                        if (success) {
                            Msg.success(message, 1, ()=>{
                                //删除后清空选中的数据
                                _this.setState({
                                    selectedRows:[]
                                })
                            })
                        } else {
                            Msg.error(message)
                        }
                        _this.refresh();
                        if (onClick) {
                            onClick({
                                ...clickCb
                            })
                        }
                    })
                },
                onCancel() { },
            });
            break;
        default:
            if (onClick) {
                onClick({
                    ...clickCb
                })
            }
            break;
    }
}

export default action;