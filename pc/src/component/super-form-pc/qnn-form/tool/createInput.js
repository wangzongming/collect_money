//创建输入框的组件
import React from 'react'
import { Icon } from 'antd';
import { getMessageType } from '../method';
import { General } from '../components';
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
    let params = {..._params};//防止改变对象数据
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
    if ((type==='date' || type==='time' || type==='datetime') &&  this.isMobile() === false ) { 
        let _ini =   initialValue || null;
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
    let delArr = ['hide', 'defaultValue', 'desc', 'spanForm', 'editDisabled', 'spanSearch', 'formatter', 'span', 'condition', 'subdesc', 'is24',  'multiple', 'linkage', 'showSearch', 'optionConfig', 'fetchConfig', 'optionData', 'onChange', 'typeMessage', 'isUrlParams', 'require', 'prefixStyle', 'suffixStyle', 'type', 'label', 'field', 'render', 'change', 'initialValue'];
    const inputProps = this.filterObjAttr(params, delArr, 'del');

    const _props = {//所有的props
        ...params,
        inputProps: inputProps,
        antdProps: antdProps,
        formItemLayout,
        form: this.props.form,
        isMobile: this.isMobile(),
        myFetch: this.fetch,
        headers:this.headers, 
        setState: obj => this.setState({ ...obj }),
        getState: name => this.state[name],
        selectKey:this.selectKey(field),
    }
    //暂时只能使用内置的
    return <General {..._props} />
}


export default createInput;