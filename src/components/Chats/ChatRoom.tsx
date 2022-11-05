import React, { useEffect, useRef } from 'react';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';
import { ChatPreviewModel } from 'models/ChatPreviewModel';
import MessageInput from './MessageInput';
import ChatMessages from './ChatMessages';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import {
  collection,
  getFirestore,
  orderBy,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from 'firebase/firestore';
import { MessageModel } from 'models/MessageModel';
import { app } from 'services/fire';

type Props = {
  room: ChatPreviewModel | null;
};
export const messageConverter = {
  toFirestore: (message: MessageModel): MessageModel => {
    return {
      ...message,
      createdAt: Date.now(),
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): MessageModel => {
    const data = snapshot.data(options) as MessageModel;

    return {
      ...data,
      id: snapshot.id,
    };
  },
};
const ChatRoom = ({ room }: Props) => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const lastDivRef = useRef<HTMLDivElement>(null);

  const [messages] = useCollectionData(
    room
      ? query(
          collection(
            getFirestore(app),
            'rooms',
            room.roomId,
            'messages'
          ).withConverter(messageConverter),
          orderBy('createdAt')
        )
      : null
  );

  useEffect(() => {
    lastDivRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='h-[85vh] flex-grow '>
      {room ? (
        <div className='flex flex-col h-full'>
          <div className='shadow-xl basis-14 bg-sky-200 dark:bg-indigo-800'>
            <div className='flex p-2 justify-between items-center h-full'>
              <span className='text-lg text-gray-800 dark:text-gray-200'>
                {room.userName}
              </span>
              <span className='text-gray-800 dark:text-gray-200'>
                {room.phoneNumber}
              </span>
            </div>
          </div>
          <ChatMessages messages={messages} ref={lastDivRef} />
          <MessageInput room={room} />
        </div>
      ) : (
        <div className='h-full w-full flex items-center justify-center font-mono text-xl sm:text-2xl md:text-4xl text-gray-800 dark:text-gray-200'>
          {dictionary.chatRoomNoSelectedText}
        </div>
      )}
    </div>
  );
};

export default ChatRoom;
