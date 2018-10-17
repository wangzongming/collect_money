import myFetch from './myFetch'; //内置的fetch
import getValues from './getValues'; //获取整个表单的值
import confirm from './confirm'; //确认弹窗
import submit from './submit';//提交按钮
import help from './help';//帮助文档
import wran from './wran';//警告
import setSelectOptionData from './setSelectOptionData';//设置所有下拉选项数据
import setValues, { formatData as sFormatData } from './setValues';//设置值
import { getMessageType } from './getMessage';//警告

export {
    myFetch, getValues, submit, confirm, help, wran, getMessageType, setValues, sFormatData, setSelectOptionData
}