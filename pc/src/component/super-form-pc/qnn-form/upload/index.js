//单独独立出来的 取至upload组件

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import $ from 'jquery'; 
import { Toast, NavBar } from 'antd-mobile';
import s from './style.less'; 
  
const imgs = {
    ppt: require('./img/ppt.png'),
    doc: require('./img/doc.png'),
    pdf: require('./img/pdf.png'),
    wz: require('./img/wz.png'),
    xlsx: require('./img/xlsx.png'),
}

class Upload extends Component {
    static propTypes = {
        value: PropTypes.array,
        help: PropTypes.bool,
        fetchConfig: PropTypes.object
    }

    state = {
        value: this.props.value || [], //默认值 
        prewShow: false,
        curPrewUrl: '',//当前预览窗口的内容的地址
        curPrewTitle: '', //当前预览窗口内容的标题
        edit: this.props.edit,
        percent: 0, //上传进度 //`上传中...${percent}%`
        fieldName:this.props.fieldName || 'imageFile',//唯一的id名
    }

    //sjax配置
    fetchConfig = this.props.fetchConfig;
    componentDidMount() {
        if (this.props.help) {
            this.help();
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            ...props
        })
    }
    
    //退出组件时也应该将meta标签变回来
    componentWillUnmount(){
        setMeta('mobile')
    }

    help = () => {
        console.log(`
        %c
            upload组件上传帮助
                使用此组件需要jquery依赖包 

                <Upload 
                    edit //是否可编辑
                    value:array, //[{name:'xxx', url:'http://XX.png'}]
                    help:bool,
                    fetchConfig:object, {apiName:'XXX'}
                /> 
        `, 'color:orange')
    }


    //文件上传
    fileSelected = () => {
        const _this = this; 
        const fieldName = this.state.fieldName;
        var oFile = document.getElementById(fieldName).files[0];    //读取文件
        var _formData = new FormData();
        _formData.append("myfile", oFile);
        $.ajax({
            url:  _this.props.action,
            type: 'post',
            dataType: 'json',
            data: _formData,
            beforeSend: function (xhr) { 
                xhr.setRequestHeader("token", _this.props.headers.token);
            },
            xhr: function () {
                var xhr = $.ajaxSettings.xhr();
                if (xhr.upload) {
                    xhr.upload.addEventListener('progress', function (event) {
                        let percent = Math.floor(event.loaded / event.total * 100);
                        if (percent && percent <= 100) {
                            _this.setState({
                                percent
                            })
                        }
                    }, false);
                }
                return xhr
            },
            cache: false,
            processData: false,   //告诉Jquery不要处理发送的数据
            contentType: false,  //告诉Jquery不要去理contenet-type请求头
            success: function ({ message, success, data }) {
                if (success && data) {
                    let { value=[] } = _this.state;
                    if(!Array.isArray(value)){
                        value = []
                    }
                    value.push(data);
                    _this.setState({
                        value
                    });

                    document.getElementById(fieldName).value = '';
                    if (_this.props.onChange) {//可控
                        _this.props.onChange(value);
                    }
                } else {
                    Toast.fail(message);
                }
            }
        })
    }


    //附件被点击是的方法
    clickFn = (url, name) => {
        let me = this.props.parentPrew || this
        if (url) {
            me.setState({
                prewShow: true,
                curPrewUrl: url,//当前预览窗口的内容的地址
                curPrewTitle: name, //当前预览窗口内容的标题
            }, () => {
                setMeta('pc')
            })
        } else {
            Toast.fail('未知文件类型不可预览')
        }
    }
    //删除
    del = (url) => {
        const { value } = this.state;
        let _value = [];
        for (let i = 0, j = value.length; i < j; i++) {
            let _u = value[i].url || value[i].fileUrl;
            if (_u !== url) {
                _value.push(value[i])
            }
        }

        this.setState({
            value: _value
        })
        //用于rc-form
        if (this.props.onChange) {
            this.props.onChange(_value)
        }
    }

    render() { 
        const { value, prewShow, curPrewTitle, curPrewUrl, edit, percent } = this.state;
        const fieldName = this.state.fieldName || '';
        // console.log(value);
        const _imgExg = /\.(png|gif|jpg|jpeg|webp|ico)/ig;
        const _docExg = /\.(doc)/ig;
        const _xlsExg = /\.(xls)/ig;
        const _xlsxExg = /\.(xlsx)/ig;
        const _pptExg = /\.(ppt)/ig;
        const _pdfExg = /\.(pdf)/ig;

        // 预览弹窗
        const prew = (<div className={s.prew}>
            <div className={s.top}>
                <NavBar
                    mode="dark"
                    style={{
                        height: '100px'
                    }}
                    rightContent={[
                        <span key="0" onClick={() => {

                            this.setState({
                                prewShow: false,
                                curPrewUrl: '',//当前预览窗口的内容的地址
                                curPrewTitle: '', //当前预览窗口内容的标题
                            }, () => {
                                setMeta('mobile')
                            })
                        }} style={{ fontSize: '100px', color: '' }}>×</span>
                    ]}
                ><div style={{
                    maxWidth: '50vw',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: '50px'
                }}>
                        {curPrewTitle}</div>
                </NavBar>
            </div>
            <div className={s.con}>
                <iframe
                    id="myIframe"
                    src={curPrewUrl} title={curPrewTitle} frameBorder="none">
                </iframe>
            </div>
        </div>)
        return (
            <div className={s.root} >
                {/*进度条*/}
                <div className={s.progress} style={{ display: percent < 100 && percent > 0 ? 'flex' : 'none' }}>
                    上传中...{percent}%
                </div>

                {/*内容*/}
                <div className={s.filesCon}>
                    {
                        value && value.map((item, index) => {
                            const { url, name, mobileUrl } = item;
                            if (!url) {
                                return '';
                            }
                            if (url.search(_imgExg) !== -1) {
                                //图片
                                return <div className={s.fitem} key={index} onClick={() => { this.clickFn(url, name) }}>
                                    <div className={s.imgCon}>
                                        <img src={url} alt="" width="100%" />
                                    </div>
                                    <div className={s.name}>{name}</div>
                                    <div style={{ display: !edit ? 'none' : '' }} className={s.del} onClick={(e) => { e.stopPropagation(); this.del(url) }}>×</div>
                                </div>
                            } else if (url.search(_docExg) !== -1) {
                                return <div className={s.fitem} key={index} onClick={() => { this.clickFn(mobileUrl, name) }}>

                                    <div className={s.imgCon}>
                                        <img src={imgs.doc} alt="" />
                                    </div>
                                    <div className={s.name}>{name}</div>
                                    <div className={s.del} onClick={(e) => { e.stopPropagation(); this.del(url) }}>×</div>
                                </div>
                            } else if (url.search(_xlsExg) !== -1 || url.search(_xlsxExg) !== -1) {
                                return <div className={s.fitem} key={index} onClick={() => { this.clickFn(mobileUrl, name) }}>

                                    <div className={s.imgCon}>
                                        <img src={imgs.xlsx} alt="" />
                                    </div>
                                    <div className={s.name}>
                                        {name}
                                    </div>
                                    <div style={{ display: !edit ? 'none' : '' }} className={s.del} onClick={(e) => { e.stopPropagation(); this.del(url) }}>×</div>
                                </div>
                            } else if (url.search(_pdfExg) !== -1) {
                                return (
                                    <div className={s.fitem} key={index} onClick={() => { this.clickFn(mobileUrl, name) }}>
                                        <div className={s.imgCon}>
                                            <img src={imgs.pdf} alt="" />
                                        </div>
                                        <div className={s.name}>{name}</div>
                                        <div style={{ display: !edit ? 'none' : '' }} className={s.del} onClick={(e) => { e.stopPropagation(); this.del(url) }}>×</div>
                                    </div>)
                            } else if (url.search(_pptExg) !== -1) {
                                return <div className={s.fitem} key={index} onClick={() => { this.clickFn(mobileUrl, name) }}>
                                    <div className={s.imgCon}>
                                        <img src={imgs.ppt} alt="" />
                                    </div>
                                    <div className={s.name}>{name}</div>
                                    <div style={{ display: !edit ? 'none' : '' }} className={s.del} onClick={(e) => { e.stopPropagation(); this.del(url) }}>×</div>
                                </div>
                            } else {
                                return <div className={s.fitem} key={index} onClick={(e) => { e.stopPropagation(); this.clickFn(false) }}>
                                    <div className={s.imgCon}>
                                        <img src={imgs.wz} alt="" />
                                    </div>
                                    <div className={s.name}>{name}</div>
                                    <div style={{ display: !edit ? 'none' : '' }} className={s.del} onClick={() => { this.del(url) }}>×</div>
                                </div>
                            }
                        })
                    }
                </div>

                {/* 表单区域 */}
                <div className={s.formCon}>
                    <input type="file" hidden name="files" id={fieldName} onChange={this.fileSelected}  accept="image/*" capture="camera" />
                    <label style={{ display: !edit ? 'none' : '' }} className={s.uploadBtn} htmlFor={fieldName}>＋</label>
                </div>

                {/* 预览阴影层 */}
                <div className={s.shadow} style={{ display: prewShow ? 'block' : 'none' }}></div>
                {
                    prewShow ?
                        prew
                        : ''
                }
            </div>
        )
    }
}


//设置meta viewport 为pc还是移动
const setMeta = (style) => {
    let metas = document.getElementsByTagName("meta");
    for (let i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("name") === 'viewport') {
            if (style === 'mobile') {
                metas[i].setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no')
            } else {
                metas[i].setAttribute('content', '')
            }
        }
    }
}



export const UploadPrew = (props) => {
    const { curPrewUrl = "", curPrewTitle = "", prewShow = false, parentPrew } = props
    return prewShow ? (
        <div>
            <div className={s.shadow}></div>
            <div className={s.prew}>
                <div className={s.top}>
                    <NavBar
                        mode="dark"
                        style={{
                            height: '100px'
                        }}
                        rightContent={[
                            <span key="0" onClick={() => {
                                parentPrew.setState({
                                    prewShow: false,
                                    curPrewUrl: '',//当前预览窗口的内容的地址
                                    curPrewTitle: '', //当前预览窗口内容的标题
                                }, () => {
                                    setMeta('mobile')
                                })
                            }} style={{ fontSize: '100px', color: '' }}>×</span>
                        ]}
                    ><div style={{
                        maxWidth: '50vw',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '50px'
                    }}>
                            {curPrewTitle}</div>
                    </NavBar>
                </div>
                <div className={s.con}>
                    <iframe
                        id="myIframe"
                        src={curPrewUrl} title={curPrewTitle} frameBorder="none">
                    </iframe>
                </div>
            </div>
        </div>
    ) : null
}

export default Upload;