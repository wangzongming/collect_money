import React, { Component } from "react";
import { Input, Icon } from "antd";

class index extends Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    let newObj = { ...prevState, ...nextProps }; 
    if(newObj.value){
      newObj.value = newObj.value.map((item, index) => {
        return {
          id: index,
          label: item
        };
      });
    }
    return newObj;
  }

  state = {
    value: this.props.value || [],
    disabled: this.props.disabled,
    addLabel: this.props.addLabel || "添加"
  };
  addBtn = () => {
    let { value=[] } = this.state;
    if(!value){
      value = []
    }
    let obj = {
      label: "",
      id: value.length
    };
    value.push(obj);
    if (this.props.onChange) {
      let _value = value.map(item => {
        return item.label;
      });
      this.props.onChange(_value);
    } 
    this.setState({
      value
    });
  };

  getAfter = index => {
    return String.fromCharCode(64 + parseInt(index + 1));
  };
  render() {
    const { value = [], disabled = false, addLabel } = this.state;  
    return (
      <div>
        {value &&
          value.map((item, index) => {
            let { label, id = { index } } = item;
            return (
              <div key={index}>
                <Input
                  onChange={val => {
                    val = val.target.value;
                    let { value } = this.state;
                    for (let i = 0; i < value.length; i++) {
                      let _id = value[i].id;
                      if (_id === id) {
                        value[i].label = val;
                      }
                    }
                    if (this.props.onChange) {
                      let _value = value.map(item => {
                        return item.label;
                      });
                      this.props.onChange(_value);
                    }
                    this.setState({
                      value
                    });
                  }}
                  placeholder={this.props.placeholder || "请输入..."}
                  value={label}
                  addonAfter={
                    <span
                      onClick={() => {
                        let { value } = this.state;
                        for (let i = 0; i < value.length; i++) {
                          let _id = value[i].id;
                          if (_id === id) {
                            value.splice(i, 1);
                          }
                        } 
                        if (this.props.onChange) {
                          let _value = value.map(item => {
                            return item.label;
                          });
                          this.props.onChange(_value);
                        }
                        this.setState({
                          value
                        });
                      }}
                      style={{
                        color: "red",
                        cursor: "pointer"
                      }}
                    >
                      <Icon type="close" theme="outlined" />
                    </span>
                  }
                  addonBefore={<span>{this.getAfter(index)}</span>}
                />
              </div>
            );
          })}
        {disabled ? null : <a onClick={this.addBtn}>{addLabel}</a>}
      </div>
    );
  }
}

export default index;
