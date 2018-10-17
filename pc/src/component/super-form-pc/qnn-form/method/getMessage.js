//获取消息提醒 (输入框类型， 规则)
const getMessageType = (type) => { 
    switch (type) {
        case 'string':
            return `请填写字符串`
        case 'email':
            return `请填写邮箱`
        case 'url':
            return `请填写网址`
        case 'number':
            return `请填写数字`
        case 'integer':
            return `请填写整数`
        case 'date':
            return `请填写日期`
        case 'regexp':
            return `请填写正则`
        default:
            return '未知类型'
    }
}

export { getMessageType }