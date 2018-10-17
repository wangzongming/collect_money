//使用回调写法，防止兼容问题
//需要绑定this
const myFetch = function(apiName, params, success){
    this.fetch(apiName, params).then((data) => {
        success(data)
    })
}

export default myFetch;