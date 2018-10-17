/*
设置所有下拉类型的下拉选项数据
需要绑定this
因为编辑和详情时数据不能触焦才出来，所以选择在组件实例化完毕后立即请求所有项的下拉数据
需要优化
*/
import { Toast } from 'antd-mobile'

const setSelectOptionData = function () {
    const { formConfig = [] } = this.state;
    for (let i = 0; i < formConfig.length; i++) {
        let item = formConfig[i];
        const { type, fetchConfig = {}, optionConfig, field, children, model = '0' } = item;
        if (type === 'linkage') {
            //设置联动组下拉选项
            if (model === '0') {
                //只需要请求一次数据 但是请求完后需要需遍历children 然后设置state 
                const { apiName, otherParams, params } = fetchConfig;
                if (apiName) {
                    // params 将自动从网址中取值
                    let _params = {};
                    const urlParams = this.props.match.params;
                    for (const key in params) {
                        _params[key] = urlParams[params[key]];
                    }

                    this.myFetch(apiName, { ...otherParams, ..._params }, ({ data, success, message }) => {
                        if (success) {
                            //递归所有childre 和 数据
                            let _opts = {};
                            let setLinkageSelectOptionData = (obj, data) => {
                                obj.form = obj.form || {};
                                let _optionConfig = obj.form.optionConfig || optionConfig;
                                let _childrenKey = _optionConfig.children || 　'children';
                                const selectKey = this.selectKey(obj.form.field);
                                _opts[selectKey] = data;
                                if (obj.children) {
                                    if (data && data.length) {
                                        for (let i = 0; i < data.length; i++) {
                                            data[i][_childrenKey] = data[i][_childrenKey] || [];
                                            setLinkageSelectOptionData(obj.children, data[i][_childrenKey])
                                        }
                                    } else {
                                        setLinkageSelectOptionData(obj.children, [])
                                    }
                                }
                            }
                            setLinkageSelectOptionData(children, data);
                            this.setState({
                                ..._opts
                            })
                        } else {
                            Toast.fail(message)
                        }

                    });
                }


            } else {
                //需要请求几次
                let setLinkageSelectOptionData = (obj) => {
                    const { form = {} } = obj;
                    const _type = form.type;
                    if (_type === 'select' || _type === 'cascader') {
                        const { fetchConfig = {}, field } = form;
                        const { apiName, otherParams, params } = fetchConfig;
                        if (apiName) {
                            // params 将自动从网址中取值
                            let _params = {};
                            const urlParams = this.props.match.params;
                            for (const key in params) {
                                _params[key] = urlParams[params[key]];
                            }

                            const selectKey = this.selectKey(field);
                            this.myFetch(apiName, { ...otherParams, ..._params }, ({ data, success, message }) => {
                                if (success) {
                                    this.setState({
                                        [selectKey]: data
                                    });
                                } else {
                                    Toast.fail(message)
                                }

                            });
                        }
                    }

                    if (obj.children) {
                        setLinkageSelectOptionData(obj.children)
                    }
                }
                setLinkageSelectOptionData(children)
            }

        } else {
            //设置普通的下拉选项
            const { apiName, otherParams = {}, params = {} } = fetchConfig;
            if ((type === 'select' || type === 'cascader') && apiName) {
                const selectKey = this.selectKey(field);
                // params 将自动从网址中取值
                let _params = {};
                const urlParams = this.props.match.params;
                for (const key in params) {
                    _params[key] = urlParams[params[key]];
                }

                this.myFetch(apiName, { ...otherParams, ..._params }, ({ data, success, message }) => {
                    if (success) {
                        this.setState({
                            [selectKey]: data
                        });
                    } else {
                        Toast.fail(message)
                    }

                });
            }
        }

    }
}
export default setSelectOptionData;