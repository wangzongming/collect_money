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
        const { type, fetchConfig = {}, optionConfig = {
            value: 'value',
            label: 'label',
            children: 'children'
        }, field, children, model = '0' } = item;
        if (type === 'linkage') {
            // console.log()
            //设置联动组item下拉选项
            if (model === '0') {
                //只需要请求一次数据 但是请求完后需要需遍历children 然后设置state 
                const { apiName, otherParams, params } = fetchConfig;
                const { getFieldValue } = this.props.form
                if (apiName) {
                    // params 将自动从网址中取值
                    let _params = {};
                    const urlParams = this.props.match.params;
                    for (const key in params) {
                        _params[key] = urlParams[params[key]];
                    }

                    this.myFetch(apiName, { ...otherParams, ..._params }, ({ data, success, message }) => {
                        if (success) {

                            let _opts = {};

                            //设置子集的optionData
                            let setLinkageSelectOptionData = (obj, data) => {
                                let _optionConfig = obj.form.optionConfig || optionConfig;
                                let { value, children } = _optionConfig;
                                let _field = obj.form.field;
                                let _children = obj.children;
                                let _val = getFieldValue(_field);

                                const selectKey = this.selectKey(_field);
                                _opts[selectKey] = data;

                                let _cArr = [];
                                data.map((item) => {
                                    if (item[value] === _val) {
                                        _cArr = item[children];
                                    }
                                    return item
                                });

                                if (_children) {
                                    setLinkageSelectOptionData(_children, _cArr)
                                }
                            }
                            setLinkageSelectOptionData(children, data); //data是数组  
                            this.setState({
                                ..._opts
                            })
                        } else {
                            Toast.fail(message)
                        }

                    });
                }


            } else {
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