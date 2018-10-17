//提交按钮
//需要绑定this
const submit = function(paramsObj){
    const { onClick, fetchConfig = {}, isValidate = true, affirmTitle = '', affirmDesc = '', affirmYes = '', affirmNo = '' } = paramsObj;
    const { apiName, otherParams = {} } = fetchConfig;
    this.getValues(isValidate, (values) => {
        const postData = () => {
            if (apiName) {
                //需要去提交数据
                this.myFetch(apiName, { ...values, ...otherParams }, (response) => {
                    onClick({
                        response,
                        values,
                        btnfns: this.btnfns,
                    })
                })
            } else if (onClick) {
                onClick({
                    values,
                    btnfns: this.btnfns,
                })
            }
        }

        if (affirmTitle || affirmDesc) {
            //弹出提示
            this.confirm(affirmTitle, affirmDesc, postData, affirmYes, affirmNo)
        } else {
            postData()
        }
    })
}

export default submit;