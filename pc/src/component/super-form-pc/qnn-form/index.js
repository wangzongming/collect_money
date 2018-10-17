
import React, { PureComponent } from 'react'
import { Form, Input, Button, message, message as Msg, Row, Col } from 'antd';
import { withRouter } from 'react-router-dom';
import { createInput, filterObjAttr, getDeviceType, getParams } from './tool';
import { myFetch, getValues, setValues, sFormatData, submit, confirm, help, wran, setSelectOptionData } from './method';
import s from './style.less';

const FormItem = Form.Item;
const version = window.QnnForm_version = 'test';

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 5,
        }
    },
};

class index extends PureComponent {
    static getDerivedStateFromProps(props, state) {
        let obj = {
            ...state,
            ...props,
        }
        return obj;
    }

    static sFormatData(data, formConfig, type) {
        return sFormatData(data, formConfig, type)
    }

    constructor(...args) {
        super(...args);
        help.bind(this)(version);
        wran.bind(this)();

        this.state = {
            fetchConfig: this.props.fetchConfig || {},
            formConfig: this.props.formConfig || [],
            btns: []
        }

        //按钮布局
        this.tailFormItemLayout = this.props.tailFormItemLayout || tailFormItemLayout;

        //外部传入的fetch方法返回必须是个promise
        this.fetch = this.props.fetch;
        this.headers = this.props.headers;

        //给一些方法绑定this
        this.createInput = createInput.bind(this);
        this.myFetch = myFetch.bind(this);
        this.getValues = getValues.bind(this);
        this.submit = submit.bind(this);
        this.confirm = confirm.bind(this);
        this.filterObjAttr = filterObjAttr;
        this.getDeviceType = getDeviceType;
        this.getParams = getParams.bind(this);
        this.setValues = setValues.bind(this);

        //下选择的数据key名
        this.selectKey = (field) => `${field}_optionData`;

        //绑定给按钮点击后回调使用的方法
        this.btnfns = {
            getValues: this.getValues,
            setValues: this.setValues,
            myFetch: this.myFetch,
            Msg: message,
            confirm: this.confirm,
            formatData: sFormatData,
            match: this.props.match,
        }
    }

    isMobile = () => this.getDeviceType() === 'mobile';
    // isMobile = () => true;
    isPc = () => this.getDeviceType() === 'pc';

    componentDidMount() {
        const { fetchConfig } = this.state;
        const { apiName, params, otherParams } = fetchConfig;
        if (apiName) {
            let _params = this.getParams(params, otherParams);
            this.myFetch(apiName, _params, ({ success, data, message }) => {
                if (success) {
                    this.setValues(data)
                } else {
                    Msg.error(message)
                }
            });
        }

        //设置所有的下拉选项
        setSelectOptionData.bind(this)()
    }

    render() {
        const { formConfig = [], btns = [] } = this.state;
        const { getFieldValue, getFieldDecorator } = this.props.form;
        return (
            <div className={s.root}>
                <Form>
                    {
                        <Row gutter={24}>
                            {
                                formConfig.map((item, index) => {
                                    if (item.hide) {
                                        let { isUrlParams, field, initialValue } = item;
                                        if (isUrlParams) {
                                            let _params = this.props.match.params[field]
                                            initialValue = _params ? _params : initialValue;
                                        }
                                        return getFieldDecorator(item.field, {
                                            initialValue: initialValue
                                        })(<Input type="hidden" key={index} />);
                                    } else {
                                        return <Col key={index} span={item.span || '24'}>
                                            {this.createInput(item, index)}
                                        </Col>
                                    }
                                })
                            }
                        </Row>
                    }
                    {
                        btns.length > 0 ? <Row gutter={24}>
                            <FormItem {...this.tailFormItemLayout}>
                                {
                                    btns.map((item, index) => {
                                        const { type, label, condition } = item;
                                        //需要将item中的一些不需要的属性过滤掉然后直接传给Button属性
                                        let delArr = ['isValidate', 'condition', 'onClick', 'fetchConfig', 'affirmTitle', 'affirmDesc', 'affirmYes', 'affirmNo'];
                                        const _props = this.filterObjAttr(item, delArr, 'del');
                                        let _defaultStyle = {
                                            marginRight: '8px'
                                        }

                                        //条件设置
                                        if (condition) {
                                            for (let i = 0; i < condition.length; i++) {
                                                let { regex = {}, action } = condition[i];
                                                let _pass = true;//是否满足条件
                                                for (const key in regex) {
                                                    if (regex.hasOwnProperty(key)) {
                                                        const targetValue = regex[key];//给的值
                                                        const fieldValue = getFieldValue(key);//获取的表单支
                                                        if (targetValue !== fieldValue) {
                                                            _pass = false;
                                                        }
                                                    }
                                                }
                                                if (_pass) {
                                                    if ((typeof action) === 'function') {
                                                        action()
                                                    } else {
                                                        switch (action) {
                                                            case 'disabled':
                                                                _props.disabled = true;
                                                                break;
                                                            case 'hide':
                                                                _defaultStyle.display = 'none';
                                                                break;
                                                            case 'show':
                                                                _defaultStyle.display = 'inline-block';
                                                                break;
                                                            default:
                                                                console.log(`${action}动作无效`)
                                                                break;
                                                        }
                                                    }
                                                }
                                            }
                                        }

                                        return <Button
                                            style={{ ..._defaultStyle }}
                                            key={index}
                                            onClick={() => { this.submit(item) }}
                                            type={type}
                                            {..._props}>
                                            {label}
                                        </Button>
                                    })
                                }
                            </FormItem>
                        </Row>
                            : null
                    }

                </Form>
            </div>
        )
    }
}
// const rForm = Form.create()(index); 
export default withRouter(index);