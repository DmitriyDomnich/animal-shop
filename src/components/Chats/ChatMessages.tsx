import React, { forwardRef } from 'react';
import { MessageModel } from 'models/MessageModel';
import ChatMessage from './ChatMessage';
import { useAppSelector } from 'rdx/hooks';
import { selectAppLocale } from 'rdx/app/selectors';

type Props = {
  messages: MessageModel[] | undefined;
};

const ChatMessages = forwardRef<HTMLDivElement, Props>(
  ({ messages }: Props, ref) => {
    const { dictionary } = useAppSelector(selectAppLocale);

    console.log(messages, 'messages');

    return (
      <div className='flex-grow overflow-y-auto p-3'>
        {messages?.length ? (
          <div className='flex flex-col space-y-2'>
            {messages.map((message) => (
              <ChatMessage message={message} key={message.id} />
            ))}
            <div ref={ref}></div>
          </div>
        ) : (
          <div className='h-full w-full text-gray-800 dark:text-gray-200 flex justify-center items-center text-3xl'>
            {dictionary.noMessages}
          </div>
        )}
      </div>
    );
  }
);

export default ChatMessages;
