import moment,{ isMoment } from 'moment'
//获取全部表单值
//需要绑定this
const getValues = function (isValidate = false, cb) {//参数为是否需要验证
    // 格式化参数方法
    const formatParams = (params) => {
        let _params = {};
        for (const key in params) {
            if (params.hasOwnProperty(key)) {
                let element = params[key];
                if(isMoment(element)){//将moment格式化为时间戳
                    element=moment(element).valueOf()
                }
                _params[key] = element
            }
        }
        return _params;
    }
    
    if (!isValidate) {
        //不需要验证
        let values =formatParams(this.props.form.getFieldsValue());
        cb({
            ...values
        })
    } else {
        this.props.form.validateFieldsAndScroll((error, values) => {
            values = formatParams(values)
            if (!error) {
                cb({
                    ...values
                })
            }
        });

    }
}

export default getValues;