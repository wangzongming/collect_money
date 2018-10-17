import React from "react";
//普通输入框 包含 string number email float integer regexp richtext datetime time date
import {
  Input,
  Form,
  Icon,
  Upload,
  InputNumber,
  DatePicker,
  TimePicker,
  Select,
  Spin,
  Cascader
} from "antd"; //message as Msg 
import { DatePicker as MobileDatePicker, List } from "antd-mobile";
import PullPerson from "../pullPersion";
import Camera from "../upload";
import PullPersonMobile from "../pullPersionMobile";
import { Editor, EditorState } from "draft-js";

const FormItem = Form.Item;
const Option = Select.Option;

//文件上传后转换
const normFile = e => {
  const { fileList } = e;
  let newFileList = fileList.map((item, index) => {
    if (item.response && item.response.success) {
      if (!item.response.data.uid) {
        item.response.data.uid = index;
      }
      return {
        ...item,
        ...item.response.data,
        status: "done",
        name: item.response.data.name,
        url: item.response.data.url,
        thumbUrl: item.response.data.thumbUrl
      };
    }
    return { ...item };
  });

  return newFileList;
};

export default props => {
  let {
    field,
    type,
    required,
    message,
    initialValue,
    label,
    disabled,
    hide,
    antdProps = {},
    form: { getFieldDecorator, getFieldValue },
    inputProps,
    typeMessage,
    formItemLayout,
    style = {},
    isMobile, //用于移动端和pc端差异插件的区别使用
    onChange,
    is24, //时间组件特有
    multiple, //是否支持多选
    showSearch,
    optionData = [], //下拉选项
    optionConfig = {}, //下拉选项配置
    fetchConfig = {},
    desc,
    subdesc,
    myFetch,
    // setState,
    getState,
    headers, //父方法
    formatter,
    condition,
    treeSelectOption,
    selectKey
  } = props;
  optionData = getState(selectKey) || optionData;

  //处理initialValue
  if (formatter && initialValue) {
    initialValue = formatter(initialValue);
  }

  //通用的input props
  inputProps = {
    ...inputProps,
    style: {
      width: "100%",
      ...inputProps.style
    }
  };

  //通用的rc-form规则 时间规则例外
  let rules = [
    {
      required: required,
      message
    },
    {
      type,
      message: typeMessage
    }
  ];

  //通用的rc-form参数
  let rcFormParams = {
    initialValue,
    rules: [...rules],
    onChange: v => {
      if (onChange) {
        let val = v.target ? v.target.value : v;
        onChange(val);
      }
    },
    normalize: (value, prev, all) => {
      if (formatter) {
        return formatter(value, prev, all);
      }
      return value;
    }
  };

  //通用
  let { apiName, name } = fetchConfig;

  //上传组件使用
  let max = inputProps.max;
  let fileList = getFieldValue(field) || [];

  //条件设置
  if (condition) {
    for (let i = 0; i < condition.length; i++) {
      let { regex = {}, action } = condition[i];
      let _pass = true; //是否满足条件
      for (const key in regex) {
        if (regex.hasOwnProperty(key)) {
          const targetValue = regex[key]; //给的值
          const fieldValue = getFieldValue(key); //获取的表单支
          if (targetValue !== fieldValue) {
            _pass = false;
          }
        }
      }
      if (_pass) {
        if (typeof action === "function") {
          action();
        } else {
          switch (action) {
            case "disabled":
              inputProps.disabled = true;
              break;
            case "hide":
              hide = true;
              break;
            case "show":
              hide = false;
              break;
            default:
              console.log(`${action}动作无效`);
              break;
          }
        }
      }
    }
  }

  // isMobile = true; //测试
  //定死的样式
  let _style = {
    display: hide ? "none" : "",
    ...style
  };
  //通用Item props
  let commProps = {
    label,
    ...antdProps,
    ...formItemLayout,
    style: {
      ..._style
    }
  };

  //文件上传组件的props
  let uploadProps = {
    valuePropName: "fileList",
    getValueFromEvent: normFile,
    ...rcFormParams,
    rules: [
      {
        required: required,
        message
      }
    ]
  };

  ///下拉选项配置
  const _optionConfig = {
    label: 'label', //默认 label
    value: ['value'], //最终的值使用逗号连接 默认值使用valueName 默认['value'] 
    children: ['children'], //最终的值使用逗号连接 默认值使用valueName 默认['value'] 
    ...optionConfig
  }

  switch (type) {
    case "string":
    case "email":
    case "url":
      return (
        <FormItem {...commProps}>
          {getFieldDecorator(field, {
            ...rcFormParams
          })(<Input {...inputProps} />)}
        </FormItem>
      );
    case "password":
      return (
        <FormItem {...commProps}>
          {getFieldDecorator(field, {
            ...rcFormParams,
            rules: [
              {
                required: required,
                message
              }
            ]
          })(<Input type="password" {...inputProps} />)}
        </FormItem>
      );
    case "textarea":
      return (
        <FormItem {...commProps}>
          {getFieldDecorator(field, {
            ...rcFormParams,
            rules: [
              {
                required: required,
                message
              }
            ]
          })(<Input.TextArea rows="4" {...inputProps} />)}
        </FormItem>
      );
    case "number":
    case "integer":
      return (
        <FormItem {...commProps}>
          {getFieldDecorator(field, {
            ...rcFormParams
          })(<InputNumber {...inputProps} />)}
        </FormItem>
      );
    case "datetime":
    case "date":
    case "time":
      if (isMobile) {
        return (
          <FormItem {...commProps}>
            {getFieldDecorator(field, {
              ...rcFormParams,
              rules: [
                {
                  required: required,
                  message
                }
              ]
            })(
              <MobileDatePicker mode={type} {...inputProps}>
                <List.Item
                  className={disabled ? "datetimeDisabled" : ""}
                  arrow={disabled ? "" : "horizontal"}
                >
                  <span style={{ color: "rgb(191, 191, 191)" }}>请选择</span>
                </List.Item>
              </MobileDatePicker>
            )}
          </FormItem>
        );
      } else {
        return (
          <FormItem {...commProps}>
            {getFieldDecorator(field, {
              ...rcFormParams,
              rules: [
                {
                  required: required,
                  message
                },
                {
                  type: "object",
                  message: typeMessage
                }
              ]
            })(
              type === "time" ? (
                <TimePicker
                  format={is24 ? "HH:mm:ss" : "h:mm:ss"}
                  {...inputProps}
                />
              ) : (
                  <DatePicker
                    format={is24 ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD hh:mm:ss"}
                    showTime={true}
                    {...inputProps}
                  />
                )
            )}
          </FormItem>
        );
      }
    case "select": 
      let { label, value } = _optionConfig;

      //下拉类型全部改为array类型
      return (
        <FormItem {...commProps}>
          {getFieldDecorator(field, {
            ...rcFormParams,
            rules: [
              {
                required: required,
                message
              }
            ]
          })(
            <Select
              // onFocus={() => {
              //   const { apiName, otherParams = {} } = fetchConfig;
              //   if (!getState(selectKey) && apiName) {
              //     setState({
              //       selectLoading: true
              //     });
              //     myFetch(apiName, { ...otherParams }).then(
              //       ({ data, success, message }) => {
              //         setState({
              //           selectLoading: false,
              //           [selectKey]: data
              //         });
              //       }
              //     );
              //   }
              // }}
              notFoundContent={
                getState("selectLoading") ? <Spin size="small" /> : null
              }
              showSearch={showSearch}
              mode={multiple ? "multiple" : null}
              {...inputProps}
            >
              {optionData && optionData.length > 0
                ? optionData.map((item, index) => {
                  let _label = item[label];
                  let _value = "";
                  //需要重新设置值
                  if (Array.isArray(value)) {
                    _value = value.map(val => {
                      return item[val];
                    });
                    _value = _value.join();
                  } else {
                    _value = item[value];
                  }
                  return (
                    <Option key={index} value={_value}>
                      {_label}
                    </Option>
                  );
                })
                : null}
            </Select>
          )}
        </FormItem>
      );
    case "cascader": 
      return (
        <FormItem {...commProps}>
          {getFieldDecorator(field, {
            ...rcFormParams,
            rules: [
              {
                required: required,
                message
              }
            ]
          })(
            <Cascader
              notFoundContent={
                getState("selectLoading") ? <Spin size="small" /> : null
              }
              showSearch={showSearch}
              fieldNames={_optionConfig}
              options={optionData}
              {...inputProps}
            />
          )}
        </FormItem>
      );
    case "files":
      inputProps.disabled = inputProps.disabled || fileList.length + 1 > max;
      return (
        <FormItem {...commProps}>
          <div className="dropbox">
            {getFieldDecorator(field, { ...uploadProps })(
              <Upload.Dragger
                name={name}
                headers={{ ...headers }}
                action={apiName}
                {...inputProps}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">{desc || "点击或者拖动上传"}</p>
                <p className="ant-upload-hint">{subdesc || ""}</p>
              </Upload.Dragger>
            )}
          </div>
        </FormItem>
      );
    case "images":
      return (
        <FormItem {...commProps}>
          <div className="dropbox">
            {(inputProps.disabled && fileList.length) === 0 ? (
              <span className="ant-upload-hint">无图片</span>
            ) : null}
            {getFieldDecorator(field, { ...uploadProps })(
              <Upload
                name={name}
                listType="picture-card"
                headers={{ ...headers }}
                action={apiName}
                {...inputProps}
              >
                {fileList.length >= max || inputProps.disabled ? null : (
                  <div>
                    <Icon type="plus" />
                    <div className="ant-upload-text">上传</div>
                  </div>
                )}
              </Upload>
            )}
          </div>
        </FormItem>
      );
    case "richtext":
      return (
        <FormItem {...commProps}>
          {getFieldDecorator(field, {
            // ...rcFormParams,
            getValueFromEvent: e => {
              console.log(e);
              return e;
            },
            valuePropName: "editorState",
            initialValue: EditorState.createEmpty()
          })(<Editor />)}
        </FormItem>
      );
    case "camera":
      return (
        <FormItem {...commProps}>
          {getFieldDecorator(field, {
            rules: [
              {
                required: required,
                message
              }
            ],
            initialValue: initialValue || []
          })(
            <Camera
              action={apiName}
              headers={{ ...headers }}
              edit={!inputProps.disabled}
              {...inputProps}
            />
          )}
        </FormItem>
      );
    case "treeSelect":
      if (isMobile) {
        return (
          <FormItem {...commProps}>
            {getFieldDecorator(field, {
              valuePropName: "defaultValue",
              initialValue: initialValue || []
            })(
              <PullPersonMobile
                edit={!inputProps.disabled}
                // treeData={[]}
                myFetch={myFetch}
                {...treeSelectOption}
                {...inputProps}
              />
            )}
          </FormItem>
        );
      }

      return (
        <FormItem {...commProps}>
          {getFieldDecorator(field, {
            valuePropName: "defaultValue",
            initialValue: initialValue || []
          })(
            <PullPerson
              edit={!inputProps.disabled}
              treeData={[]}
              myFetch={myFetch}
              {...treeSelectOption}
              {...inputProps}
            />
          )}
        </FormItem>
      );
    default:
      return <div>未知类型</div>;
  }
};
