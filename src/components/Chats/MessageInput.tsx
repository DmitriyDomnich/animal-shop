import { Button, TextField } from '@mui/material';
import { selectAppLocale } from 'rdx/app/selectors';
import { useAppSelector } from 'rdx/hooks';
import React, { useCallback, useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  updateDoc,
} from 'firebase/firestore';
import { app } from 'services/fire';
import { ChatPreviewModel } from 'models/ChatPreviewModel';
import { useAppAuth } from 'hooks/useAppAuth';
import { messageConverter } from './ChatRoom';

type Props = {
  room: ChatPreviewModel;
};

const MessageInput = ({ room }: Props) => {
  const { dictionary } = useAppSelector(selectAppLocale);
  const [text, setText] = useState('');
  const [user] = useAppAuth();
  const handleInputChange = useCallback(
    ({ target }: React.ChangeEvent<HTMLInputElement>) => setText(target.value),
    [setText]
  );
  const handleSendMessage = useCallback(
    async (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      await addDoc(
        collection(
          getFirestore(app),
          'rooms',
          room.roomId,
          'messages'
        ).withConverter(messageConverter),
        {
          from: user!.uid,
          text,
        } as any
      );
      await updateDoc(doc(getFirestore(app), 'rooms', room.roomId), {
        lastMessage: Date.now(),
      });

      setText('');
    },
    [text, setText, user, room.roomId]
  );

  return (
    <form
      onSubmit={handleSendMessage}
      className='shadow-xl basis-16 p-3 flex bg-sky-200 dark:bg-indigo-800 space-x-2'
    >
      <TextField
        value={text}
        onChange={handleInputChange}
        variant='standard'
        fullWidth
        label={dictionary.writeMessage}
      />
      <Button type='submit' disabled={!text}>
        <SendIcon />
      </Button>
    </form>
  );
};

export default MessageInput;
