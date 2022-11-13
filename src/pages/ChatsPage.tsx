import React, { useEffect, useMemo, useState } from 'react';
import ChatRoom from 'components/Chats/ChatRoom';
import ChatPreview from 'components/Chats/ChatPreview';
import { CircularProgress } from '@mui/material';
import { useChatPreviews } from 'hooks/useChatPreviews';
import { ChatPreviewModel } from 'models/ChatPreviewModel';
import { useSearchParams } from 'react-router-dom';

const ChatsPage = () => {
  const [rooms] = useChatPreviews();
  const [searchParams] = useSearchParams();

  const [currentRoom, setCurrentRoom] = useState<ChatPreviewModel | null>(null);

  const sortedRooms = useMemo(
    () =>
      rooms
        ? rooms.sort((a, b) =>
            a.createdAt && b.createdAt
              ? b.createdAt - a.createdAt
              : !a.createdAt
              ? -1
              : 1
          )
        : null,
    [rooms]
  );
  useEffect(() => {
    const roomId = searchParams.get('roomId');

    if (roomId && rooms?.length) {
      setCurrentRoom(rooms.find((room) => room.roomId === roomId)!);
    }
  }, [searchParams, rooms]);

  return (
    <div className='container mx-auto p-3 flex'>
      <div className='w-14 md:w-64 select-none rounded-l-xl divide-y bg-sky-200 dark:bg-indigo-800 overflow-y-auto overflow-x-hidden'>
        {sortedRooms ? (
          sortedRooms.map((room) => (
            <ChatPreview
              onChatSelect={setCurrentRoom}
              key={room.roomId}
              room={room}
            />
          ))
        ) : (
          <div className='h-full w-full flex justify-center items-center p-1'>
            <CircularProgress />
          </div>
        )}
      </div>
      <ChatRoom room={currentRoom} />
    </div>
  );
};

export default ChatsPage;
