//确认弹窗
import { Modal } from 'antd';
const confirm = function (title, content, onOk, yes = '确认', no = '取消') {
    Modal.confirm({
        title: title,
        content: content,
        okText: yes,
        cancelText: no,
        onOk
    });
}

export default confirm;