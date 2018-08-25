import React from "react";
/*
Form, Tooltip, Cascader, Row, Col, Checkbox, Button,AutoComplete,
*/
import { Input, Select, InputNumber } from "antd";
const { TextArea } = Input;
const { Option } = Select;

const _switchField = function(obj) {
  const {
    type,
    disabled,
    placeholder,
    inputConfig = {},
    selectOptionData = [], 
  } = obj;
  // const { getFieldValue } = this.props.form;

  let _placeholder =
    placeholder || type === "select" ? "请选择..." : "请输入...";

  switch (type) {
    case "string":
    case "text":
      return (
        <Input
          disabled={disabled}
          placeholder={_placeholder}
          {...inputConfig}
        />
      );
    case "number":
      return (
        <InputNumber
          disabled={disabled}
          placeholder={placeholder || "请输入..."}
          {...inputConfig}
          style={{
            width: "100%",
            ...inputConfig.style
          }}
        />
      );
    case "textarea":
      return (
        <TextArea
          disabled={disabled}
          autosize={{ minRows: 3 }}
          placeholder={_placeholder}
          {...inputConfig}
        />
      );
    case "select":
      return (
        <Select
          style={{ width: "100%" }}
          placeholder={_placeholder}
          {...inputConfig}
        >
          {selectOptionData &&
            selectOptionData.map((item, index) => {
              return (
                <Option key={index} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
        </Select>
      );

    case "email":
      return (
        <Input
          disabled={disabled}
          placeholder={_placeholder}
          {...inputConfig}
        />
      );
    default:
      return <div style={{ color: "red" }}>{`没有${type}类型的表单`}</div>;
  }
};

export default _switchField;
