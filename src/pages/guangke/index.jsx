import './index.css';
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { Button, Form, Input, message, Upload } from 'antd';
import Cookies from 'js-cookie';
import { fetchChatBot, uploadFile } from '../../api/chatBot';
import { MESSAGE_TYPE } from '../../constants';
import ChatMessage from '../../components/chatMessage';
import { botInfo } from '../../constants';
import { CloudUploadOutlined, LoadingOutlined } from '@ant-design/icons';



const Chatbot = ({ port }) => {

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false)
  const [messages, setMessages] = useState([]);
  const username = Cookies.get('user');
  const [fileList, setFileList] = useState([]);

  console.log("loading", loading)

  const onhandleFinished = async () => {
    const values = await form.getFieldsValue();

    // 空状态
    if (!values?.content) return;

    setLoading(true);
    // 处理表单提交
    const newMessage = Object.assign(values, { sender: MESSAGE_TYPE.USER });
    console.log("newMessage", newMessage)
    const submitMessages = messages.concat([newMessage, botInfo]);
    setMessages(submitMessages);


    // 重置表单
    await form.resetFields();

    const params = { user_id: username, message: values.content };
    try {
      const result = await fetchChatBot(params, port);
      const newBotMessage = {
        content: result,
        sender: MESSAGE_TYPE.BOT,
      };

      // 删除临时信息
      const filterMessages = filterBotMessages(submitMessages);
      const newMessages = filterMessages.concat(newBotMessage);
      localStorage.setItem('guangkeBot', JSON.stringify(newMessages));

      setMessages(newMessages);
      setLoading(false);
    } catch (e) {
      const filterMessages = filterBotMessages(submitMessages);
      setMessages(filterMessages);
      setLoading(false);
      return '请求出错啦';
    }
  };



  const filterBotMessages = (submitMessages) => {
    return submitMessages.filter((item) => !item.loading) || [];
  };

  useEffect(() => {
    const initMessages = localStorage.getItem('guangkeBot');
    if (!!initMessages) {
      try {
        setMessages(JSON.parse(initMessages));
      } catch (e) { }
    }
  }, []);

  useEffect(() => {
    const container = document.querySelector('.chat-message-list');
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 1000)
    }
  }, [messages]);



  const beforeUpload = (file) => {
    setFileList([]);
    if (file.size / 1024 / 1024 > 5) {
      message.error("文件大小限制在5MB以内");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const onUploadFile = useCallback(
    async (file, onSuccess, onError) => {
      var formData = new FormData();
      formData.append('file', file);


      formData.append('type', file.type);

      uploadFile(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: function (progressEvent) {
          var percent = (progressEvent.loaded / progressEvent.total) * 100;
        },
      }, port)
        .then((response) => {
          if (response?.status === 200) {
            onSuccess(response);
          } else {
            onError(response);
          }
        })
        .catch(function (error) {
          console.error('Upload error:', error);
        });
    },
    [],
  );


  const uploadProps = useMemo(() => {
    return {
      listType: 'picture',
      multiple: true,
      showUploadList: false,
      beforeUpload,
      customRequest: ({ file, onSuccess, onError }) => onUploadFile(file, onSuccess, onError),
      onChange(info) {
        const { file } = info;
        const { status } = file;

        if (status === 'uploading') {
          setUploading(true);
          setFileList([...info.fileList]);
          const fileList = info.fileList;
          const fileNames = fileList.map(item => item.name);



          const messageList = messages.slice();
          messageList.push({
            content: `${fileNames.join('、')}文件上传`,
            sender: MESSAGE_TYPE.USER
          });

          setMessages(messageList)

        }
        if (status === 'done') {
          setUploading(false);
        } else if (status === 'error') {
          setUploading(false);
          message.error(`${info.file.name} 上传失败`);
        }
      },

    };
  }, [messages]);





  return (
    <div className='chat-bot'>
      {!messages.length && (
        <div className='chat-bot-empty'>
          <div className='chat-bot-title'>你好，我是光刻大模型</div>
          <div className='chat-bot-question'>有什么相关问题吗？</div>
          <div className='chat-bot-intro'>支持自动化晶圆缺陷检测、晶圆知识查询</div>
          <div className='chat-bot-intro' style={{ marginTop: -10 }}>请上传您需要查询的晶圆图像</div>
        </div>
      )}
      {messages.length && (
        <div className='chat-message-list'>
          {messages.map((item, index) => (
            <ChatMessage
              key={index}
              sendType={item.sender}
              message={item.content}
              loading={item.loading}
            ></ChatMessage>
          ))}
        </div>
      )}
      <div className='chat-bot-footer'>
        <Form
          form={form}
          layout='inline'
          style={{ width: '100%' }}
          onFinish={onhandleFinished}
          autoComplete='off'
        >
          <Form.Item name='content' style={{ width: 'calc(100% - 150px)' }}>
            <Input placeholder='尽管问...1'></Input>
          </Form.Item>
          <Upload {...uploadProps} fileList={fileList}>
            <Button>
              {uploading ? <LoadingOutlined /> : <CloudUploadOutlined />}</Button>
          </Upload>

          <div className='devide-line'></div>
          <Form.Item>
            <Button
              disabled={loading}
              loading={loading}
              htmlType='submit'
              icon={
                <img
                  src={require('../../assets/send.png')}
                  style={{ height: 32, width: 32 }}
                ></img>
              }
            ></Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Chatbot;
