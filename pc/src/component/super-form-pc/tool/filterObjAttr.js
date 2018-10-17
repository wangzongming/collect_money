//传入对象和一组key值 将匹配上的key删掉 或者将匹配取出来  ----includes有兼容问题
const filterObjAttr = function (obj, delArr = [], model = "del") {// del删掉  get取
    if (obj && delArr.length > 0) {
        const newObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const element = obj[key];
                if (model === 'del') {//将包含的删除掉字段
                    if (!delArr.includes(key)) {
                        newObj[key] = element;
                    }
                } else {//取出包含的字段
                    if (delArr.includes(key)) {
                        newObj[key] = element;
                    }
                }
            }
        }
        return newObj;
    } else {
        return obj;
    }
}
export default filterObjAttr;
