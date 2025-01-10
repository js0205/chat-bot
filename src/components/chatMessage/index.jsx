import React, { useMemo } from 'react';
import { Avatar, Spin } from 'antd';
import { MESSAGE_AVATAR, MESSAGE_TYPE } from '../../constants';
import './index.css';
import classNames from 'classnames';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
  breaks: true,
})

const ChatMessage = (props) => {
  const { sendType, message, loading, type } = props;
  const avatarUrl = MESSAGE_AVATAR[sendType];

  const isImgUrl = useMemo(() => {
    return type === 'img'
  }, [type])

  const newMessage = isImgUrl ? message : md.render(message);

  return (
    <div
      className={classNames(
        'chat-message',
        sendType === MESSAGE_TYPE.USER && 'chat-message-right'
      )}
    >
      <Avatar shape='square' size={48} src={avatarUrl}></Avatar>
      <div className={classNames('message-content', isImgUrl && 'message-img-content', loading && 'message-loading')}>
        {isImgUrl ? (
          <span>{newMessage}</span>
        ) : (
          <React.Fragment>
            <div dangerouslySetInnerHTML={{ __html: newMessage }}></div>
            {loading && <Spin size='small' style={{ marginLeft: 8 }}></Spin>}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
