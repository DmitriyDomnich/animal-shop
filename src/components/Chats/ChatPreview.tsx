import { Avatar } from '@mui/material';
import { ChatPreviewModel } from 'models/ChatPreviewModel';
import moment from 'moment';
import React, { Dispatch, SetStateAction, useCallback, useMemo } from 'react';

type Props = {
  room: ChatPreviewModel;
  onChatSelect: Dispatch<SetStateAction<ChatPreviewModel | null>>;
};

const ChatPreview = ({ room, onChatSelect }: Props) => {
  const timeFormatted = useMemo(
    () => (room.createdAt ? moment(room.createdAt).fromNow() : ''),
    [room.createdAt]
  );

  const handleSelect = useCallback(() => {
    onChatSelect(room);
  }, [room, onChatSelect]);

  return (
    <div
      onClick={handleSelect}
      className='h-16 flex space-x-1 items-center cursor-pointer hover:bg-sky-300 dark:hover:bg-indigo-900 active:bg-sky-400 dark:active:bg-blue-800 pr-1'
    >
      <div className='p-2'>
        <Avatar alt={room.userName} src={room.imgUrl} />
      </div>
      <div className='flex-grow'>
        <div className='flex flex-col'>
          <div className='flex justify-between space-x-1'>
            <span className='font-bold text-gray-800 dark:text-gray-200 line-clamp-1'>
              {room.userName}
            </span>
            <span className='line-clamp-1 text-gray-900 dark:text-gray-300'>
              {timeFormatted}
            </span>
          </div>
          <div className='line-clamp-1 text-gray-800 dark:text-gray-200'>
            {room.lastMessage || ''}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;
