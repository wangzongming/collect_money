// 将传入的类型转换为组件需要的类型

const _typeSwitch = (type) => {
    let _newType = '';
    switch (type) {
        case 'string':
            _newType = 'string';
            break;
        case 'number':
            _newType = 'number';
            break;
        case 'email':
            _newType = 'email';
            break;
        case 'date':
            _newType = 'date';
            break;
        case 'images':
            _newType = 'array';
            break;
        default:
            _newType = ''
            break;
    }

    return _newType;
}

export default _typeSwitch;