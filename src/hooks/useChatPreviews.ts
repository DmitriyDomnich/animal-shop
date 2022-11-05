import {
  collection,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  where,
} from 'firebase/firestore';
import { ChatPreviewModel } from 'models/ChatPreviewModel';
import { useEffect, useState } from 'react';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { app } from 'services/fire';
import { useAppAuth } from './useAppAuth';
import Fire from 'services/fire';
import { RoomModel } from 'models/RoomModel';

type ChatPreviewsModel = {
  loading: boolean;
  data: null | ChatPreviewModel[];
  error: null | string;
};

const roomsConverter = {
  toFirestore: (room: RoomModel): RoomModel => {
    return room;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): RoomModel => {
    const data = snapshot.data(options) as {
      animalId: string;
      users: string[];
    };

    return {
      ...data,
      id: snapshot.id,
    };
  },
};

export const useChatPreviews = (): [
  ChatPreviewModel[] | null,
  boolean,
  any | null
] => {
  const [user] = useAppAuth();
  const [chatPreviews, setChatPreviews] = useState<ChatPreviewsModel>({
    data: null,
    error: null,
    loading: false,
  });
  const [rooms] = useCollectionData(
    query(
      collection(getFirestore(app), 'rooms'),
      where('users', 'array-contains', user!.uid)
    ).withConverter(roomsConverter)
  );

  useEffect(() => {
    if (rooms) {
      setChatPreviews((prev) => ({ ...prev, loading: true, error: null }));
      Promise.all(
        rooms.map((room) =>
          Fire.getChatPreviews(
            room.id,
            room.users.find((userId) => userId !== user!.uid)!,
            room.animalId
          )
        )
      )
        .then((responses) => {
          const previews = responses
            .map((response) => {
              console.log(response.error);
              return response.success ? response.data : null;
            })
            .filter(Boolean);
          setChatPreviews({
            data: previews as ChatPreviewModel[],
            error: null,
            loading: false,
          });
        })
        .catch((err) =>
          setChatPreviews({
            data: null,
            error: err.toString(),
            loading: false,
          })
        );
    }
  }, [rooms, user]);

  return [chatPreviews.data, chatPreviews.loading, chatPreviews.error];
};
