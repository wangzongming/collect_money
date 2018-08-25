import React, { Component } from "react";
import { Upload, Icon, message } from "antd";

const Dragger = Upload.Dragger;

class Index extends Component {
  componentDidMount() {
    console.log("props:", this.props);
  }

  render() {
    const { token } = this.props.userInfo;
    //图书导入
    // const props = {
    //   name: "excel",
    //   multiple: false, //暂不支持多选上传
    //   action: "https://mnetwork.xyz:8080/importBookExcel",
    //   accept: ".xls",
    //   headers: { token },
    //   onChange(info) {
    //     const status = info.file.status;
    //     if (status !== "uploading") {
    //       console.log(info.file, info.fileList);
    //     }
    //     if (status === "done") {
    //       message.success(`${info.file.name} file uploaded successfully.`);
    //     } else if (status === "error") {
    //       message.error(`${info.file.name} file upload failed.`);
    //     }
    //   }
    // };

    //附件上传
    const props = {
      name: "book",//后台定
      multiple: true,  
      action: "https://mnetwork.xyz:8080/upload",
      // accept: ".xls",
      headers: { token },
      onChange(info) {
        const status = info.file.status;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    };

    return (
      <div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </Dragger>
        ,
      </div>
    );
  }
}

export default Index;
