import './index.css'
import React, { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import { Form, Input, Button } from 'antd';
import { fetchUploadImage, fetchUploadMessage } from '../../../api/fabGpt';
import { botInfo, MESSAGE_TYPE } from '../../../constants';
import ChatMessage from '../../../components/chatMessage';


const FabGPT = () => {
  const [messages, setMessages] = useState([]);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const username = Cookies.get('user');

  console.log("messages", messages)


  const handleImageUpload = () => {
    if (loading) return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      setLoading(true)

      const selectedFile = event.target.files[0];
      const submittedImageUrl = URL.createObjectURL(selectedFile);
      const newUploadMessage = {
        content: <img className="submitted-image" src={submittedImageUrl} alt="加载失败..." onError={null} />,
        sender: MESSAGE_TYPE.USER,
        type: 'img'
      }

      const submitMessages = messages.concat([newUploadMessage, botInfo])

      console.log(JSON.stringify(submitMessages))
      setMessages(submitMessages);

      try {
        // 创建一个 FormData 对象，用于发送文件到服务器
        const formData = new FormData();
        formData.append('file', selectedFile);

        const response = await fetchUploadImage(formData);
        const blobUrl = URL.createObjectURL(response);

        const newBotMessage = {
          content: (
            <img
              className='processed-image'
              src={blobUrl}
              alt="加载失败..."
            />
          ),
          sender: MESSAGE_TYPE.BOT,
          type: 'img'
        };

        // 删除临时信息
        const filterMessages = filterBotMessages(submitMessages);
        const newMessages = filterMessages.concat(newBotMessage);
        localStorage.setItem('fbtMessages', JSON.stringify(newMessages));

        setMessages(newMessages);
        setLoading(false);
      } catch (error) {
        const filterMessages = filterBotMessages(submitMessages);
        setMessages(filterMessages);
        setLoading(false);
        console.error('文件上传失败:', error);
      }
    };
    input.click();
  };

  const filterBotMessages = (submitMessages) => {
    return submitMessages.filter((item) => !item.loading) || [];
  };

  const onhandleFinished = async () => {
    const values = await form.getFieldsValue();
    // 空状态
    if (!values?.content) return;

    setLoading(true);
    // 处理表单提交
    const newMessage = Object.assign(values, { sender: MESSAGE_TYPE.USER });
    const submitMessages = messages.concat([newMessage, botInfo]);
    setMessages(submitMessages);

    // 重置表单
    await form.resetFields();

    try {
      const result = await fetchUploadMessage(values.content);
      const newBotMessage = {
        content: result,
        sender: MESSAGE_TYPE.BOT,
      };

      // 删除临时信息
      const filterMessages = filterBotMessages(submitMessages);
      const newMessages = filterMessages.concat(newBotMessage);
      localStorage.setItem('fbtMessages', JSON.stringify(newMessages));

      setMessages(newMessages);
      setLoading(false);
    } catch (e) {
      const filterMessages = filterBotMessages(submitMessages);
      setMessages(filterMessages);
      setLoading(false);
      return '请求出错啦';
    }
  };

  useEffect(() => {
    const initMessages = localStorage.getItem('fbtMessages');
    if (!!initMessages) {
      try {
        const initContent = JSON.parse(initMessages);
        // 如果有img标签，渲染jsx组件
        initContent.forEach((item) =>
          item.content.type === 'img' ?
            item.content = React.createElement('img', { ...item.content.props }) : item.content
        );
        setMessages(initContent);
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    const container = document.querySelector('.fab-gpt-message-list');
    if (!container) return;

    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 1000)
  }, [messages]);

  return (
    <div className='fab-gpt-bot'>
      {!messages.length && (
        <div className='fab-gpt-empty'>
          <div className='fab-gpt-title'>你好，我是缺陷大模型</div>
          <div className='fab-gpt-question'>有什么相关问题吗？</div>
          <div className='fab-gpt-intro'>支持自动化晶圆缺陷检测、晶圆知识查询</div>
          <div className='fab-gpt-intro' style={{ marginTop: -10 }}>请上传您需要查询的晶圆图像</div>
        </div>
      )}
      {messages.length && (
        <div className='fab-gpt-message-list'>
          {messages.map((item, index) => (
            <ChatMessage
              key={index}
              sendType={item.sender}
              message={item.content}
              loading={item.loading}
              type={item.type}
            ></ChatMessage>
          ))}
        </div>
      )}
      <div className='fab-gpt-footer'>
        <Form
          form={form}
          layout='inline'
          style={{ width: '100%' }}
          onFinish={onhandleFinished}
          autoComplete='off'
        >
          <Form.Item name='content' style={{ width: 'calc(100% - 140px)' }}>
            <Input placeholder='尽管问...'></Input>
          </Form.Item>
          <img
            className='fab-gpt-upload-img'
            src={require('../../../assets/uploadImg.png')}
            onClick={handleImageUpload}
            disabled={loading}
            alt='upload'
          ></img>
          <div className='fab-gpt-devide-line'></div>
          <Form.Item>
            <Button
              disabled={loading}
              loading={loading}
              htmlType='submit'
              icon={
                <img
                  src={require('../../../assets/send.png')}
                  style={{ height: 32, width: 32 }}
                  alt='send'
                ></img>
              }
            ></Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default FabGPT;