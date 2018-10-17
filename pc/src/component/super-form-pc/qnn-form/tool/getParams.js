
//需要绑定this
const getParams = function (params, otherParams = {}) { //第一个参数是从表单中取值的  第二个参数是定义的死参数
    let _params = { ...otherParams }; 
    if (params && this.props.form) {
        const { getFieldValue } = this.props.form;
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                const field = params[key];
                _params[key] = getFieldValue(field)
            }
        }
        return _params;
    } else {
        return otherParams;
    }
}

export default getParams