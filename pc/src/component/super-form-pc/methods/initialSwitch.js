// 传入的类型输出该类型需要的initialValue

const _initialValueSwitch = (type, value) => {
    if (value) {
        return value
    }
    
    let initialValue = '';
    switch (type) {
        case 'string':
            initialValue = '';
            break;
        case 'number':
            initialValue = '';
            break;
        case 'email':
            initialValue = '';
            break;
        case 'date':
            initialValue = '';
            break;
        case 'images':
            initialValue = [];
            break;
        case 'select':
            initialValue = [];
            break;
        default:
            initialValue = ''
            break;
    }

    return initialValue;
}

export default _initialValueSwitch;