//获取参数需要绑定this
const getFromParams = function (type = 'form', cb) {
    let params = {};
    if (type === 'search') {
        const { searchFroms } = this.state;
        //获取搜索参数
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                for (let i = 0; i < searchFroms.length; i++) {
                    let { field } = searchFroms[i];
                    params[field] = values[field] || ''
                } 

                let _params = this.sFormatData(params, this.state.searchFroms, "get");

                //特殊处理
                let _newParams = {};
                for (let key in _params) {
                    if (_params.hasOwnProperty(key)) {
                        const element = _params[key];
                        //需要将search__去掉
                        key = key.substr(8, key.length);
                        _newParams[key] = element
                    }
                }  
                cb(_newParams) 
            }
        });
    } else {
        //获取表单数据
        const { forms } = this.state;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                for (let i = 0; i < forms.length; i++) {
                    let { field, type, children } = forms[i];
                    //联动组需要特殊处理
                    if(type === 'linkage'){
                        const forLinkage = (obj)=>{
                            params[obj.field] =  values[obj.field] || '';
                            if(obj.children){
                                forLinkage(obj.children)
                            }
                        }
                        forLinkage(children);
                    }else{ 
                        params[field] = values[field] || ''
                    }
                }

                let _params = this.sFormatData(params, this.state.forms, "get"); 
                cb(_params)
            }
        });
    }
}

export default getFromParams;