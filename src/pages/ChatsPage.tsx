import React, { useMemo, useState } from 'react';
import ChatRoom from 'components/Chats/ChatRoom';
import ChatPreview from 'components/Chats/ChatPreview';
import { CircularProgress } from '@mui/material';
import { useChatPreviews } from 'hooks/useChatPreviews';
import { ChatPreviewModel } from 'models/ChatPreviewModel';

const ChatsPage = () => {
  const [currentRoom, setCurrentChat] = useState<ChatPreviewModel | null>(null);
  const [rooms, roomsLoading] = useChatPreviews();
  console.log(rooms, 'rooms');

  const sortedRooms = useMemo(
    () => (rooms ? rooms.sort((a, b) => b.createdAt - a.createdAt) : null),
    [rooms]
  );

  return (
    <div className='container mx-auto p-3 flex'>
      <div className='resize-x max-w-[300px] w-48 select-none rounded-l-xl divide-y min-w-[120px] bg-sky-200 dark:bg-indigo-800 overflow-y-auto'>
        {!roomsLoading && sortedRooms ? (
          sortedRooms.map((room) => (
            <ChatPreview
              onChatSelect={setCurrentChat}
              key={room.roomId}
              room={room}
            />
          ))
        ) : (
          <CircularProgress />
        )}
      </div>
      <ChatRoom room={currentRoom} />
    </div>
  );
};

export default ChatsPage;
