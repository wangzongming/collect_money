//创建输入框的组件
import React from 'react'
import { Icon } from 'antd';
import { getMessageType } from '../method';
import { General, Linkage } from '../components';
import moment from 'moment';

let formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};
const createInput = function (_params, index) {
    let params = { ..._params };//防止改变对象数据
    formItemLayout = this.props.formItemLayout || formItemLayout;
    let { type, isUrlParams, initialValue, field, message, typeMessage } = params;
    //参数的统一处理
    params.message = message ? message : `必填项`;
    params.typeMessage = typeMessage ? typeMessage : getMessageType(type);
    if (isUrlParams) {
        let _params = this.props.match.params[field]
        params.initialValue = _params ? _params : initialValue;
    }

    //特殊类型的初始值处理
    if ((type === 'date' || type === 'time' || type === 'datetime') && this.isMobile() === false) {
        let _ini = initialValue || null;
        params.initialValue = _ini ? moment(_ini) : null
    }

    //图标前缀
    if (params.prefix) {
        params.prefix = <Icon type={params.prefix} style={(params.prefixStyle ? params.prefixStyle : { color: 'rgba(0,0,0,.25)' })} />
    }
    //图标后缀
    if (params.suffix) {
        params.suffix = <Icon type={params.suffix} style={(params.suffixStyle ? params.suffixStyle : { color: 'rgba(0,0,0,.25)' })} />
    }

    //传给item的props  需要取出
    const antdProps = this.filterObjAttr(params, ['help'], 'get');

    //传给input的props
    //需要删除一些字段然后在传给inpu的props组件
    //不删除直接geiinput组件的话会出问题 
    let delArr = ['hide', 'defaultValue', 'addShow', 'editShow', 'detailShow', 'desc', 'spanForm', 'editDisabled', 'spanSearch', 'formatter', 'span', 'condition', 'subdesc', 'is24', 'multiple', 'linkage', 'showSearch', 'optionConfig', 'fetchConfig', 'optionData', 'onChange', 'typeMessage', 'isUrlParams', 'require', 'prefixStyle', 'suffixStyle', 'type', 'label', 'field', 'render', 'change', 'initialValue'];
    const inputProps = this.filterObjAttr(params, delArr, 'del');
    //公用的props
    const _props = {
        ...params,
        inputProps: inputProps,
        antdProps: antdProps,
        formItemLayout,
        form: this.props.form,
        isMobile: this.isMobile(),
        myFetch: this.fetch,
        headers: this.headers,
        match: this.props.match,
        setState: obj => this.setState({ ...obj }),
        getState: name => this.state[name],
        getSelectKey: this.selectKey,
        selectKey: this.selectKey(field),
        btnfns: this.btnfns,
    }

    //处理linkage类型 
    let formConfig = [];
    if (type === 'linkage') {

        const getChildren = (obj, parentInfo) => {
            const _inputProps = this.filterObjAttr(obj.form, delArr, 'del');
            const _antdProps = this.filterObjAttr(obj.form, ['help'], 'get');
            const _table = obj.table || {};
            const _form = obj.form || {};
            const _type = obj.form.type || '';
            const _dataIndex = _table.dataIndex;
            const _field = _form.field || _dataIndex;

            //从顶级到当前级的下拉
            let allSelectKeys = [parentInfo.allSelectKeys];
            let allField = [...parentInfo.allField, _field];//顶级为空 
            //顶级的下拉key
            let parentSelectKey = parentInfo.selectKey;//顶级为空
            let parentField = parentInfo.field;
            if (_type === 'select' || _type === 'cascader') {
                //只有下拉类型持有
                allSelectKeys = [...parentInfo.allSelectKeys, this.selectKey(_field)];//顶级为空  
            }
            
            _inputProps.disabled = _props.disabled;

            //联动特定props
            let _formProps = {
                field: _field,
                label: _form.label ? _form.label : _table.title,
                ..._props,
                ...obj.form,
                selectKey: this.selectKey(_field),
                antdProps: { ..._antdProps },
                inputProps: { ..._inputProps },
                //特殊处理的属性
                // disabled:,
                //联动特有属性
                allSelectKeys,//所有父级下拉选项key
                parentSelectKey, //父级下拉选项key
                parentField,//父级字段名
                allField,//父级字段名
            }
        
            // console.log(_formProps);
            formConfig.push(_formProps);
            if (obj.children) {
                getChildren(obj.children, _formProps)
            }
        }
        getChildren(params.children, { allSelectKeys: [], allField: [] })
    }
    // console.log(_props)
    switch (type) {
        case 'linkage':
            //将每个联动项的子集过滤出来
            let formConfigLen = formConfig.length;
            // console.log(formConfigLen)
            let { allField } = formConfig[formConfigLen - 1];
            formConfig = formConfig.map((item, index) => {
                let _allField = [...allField];
                item.allChildrenField = _allField.splice(index + 1, formConfigLen);//全部子集field 
                return item
            })
            return <Linkage formConfig={formConfig} />
        default:
            //内置组件
            return <General {..._props} />
    }
}


export default createInput;