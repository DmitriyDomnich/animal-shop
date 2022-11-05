import { useAppAuth } from 'hooks/useAppAuth';
import { MessageModel } from 'models/MessageModel';
import React from 'react';

type Props = {
  message: MessageModel;
};
const defaultMessageStyles =
  'rounded-lg text-gray-200 dark:text-gray-800 bg-sky-500 dark:bg-sky-100 shadow-sm p-3';
const userMessageStyles = defaultMessageStyles + ' self-end';
const otherUserMessageStyles = defaultMessageStyles + ' self-start';

const ChatMessage = ({ message }: Props) => {
  const [user] = useAppAuth();

  return (
    <div
      className={
        user!.uid === message.from ? userMessageStyles : otherUserMessageStyles
      }
    >
      {message.text}
    </div>
  );
};

export default ChatMessage;
