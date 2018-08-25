const btnClick = function(obj={}){
    let { click,fetchConfig = {}, isVerify } = obj; // label, 
    let { apiName, 
        // params, otherParams 
    } = fetchConfig;
    if (click) { 
        this.getValues(isVerify).then((values) => {
            if(apiName){
                //需要去请求
                        
            }else{
                //不需要去请求
                let _params = {
                    values:values,
                    ...this.btnObj
                }
                click(_params);
            } 
        })
    }
}

export default btnClick;