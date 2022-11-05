import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  collectionGroup,
  deleteDoc,
  doc,
  documentId,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  updateDoc,
  where,
} from 'firebase/firestore';
import { AdvertisementModel } from 'models/AdvertisimentModel';
import { PlaceModel } from 'models/PlaceModel';
import { getAuth } from 'firebase/auth';
import { PublisherModel, UserModel } from 'models/UserModel';
import { ChatPreviewModel } from 'models/ChatPreviewModel';

export interface APIResponse<T extends object | void | string> {
  success: boolean;
  error?: string;
  data?: T;
}

const appConfig = {
  apiKey: 'AIzaSyCCIuAMNjY194cSN5_Suh_x4ldHKfpuH3w',
  authDomain: 'animal-shop-2.firebaseapp.com',
  projectId: 'animal-shop-2',
  storageBucket: 'animal-shop-2.appspot.com',
  messagingSenderId: '461108934805',
  appId: '1:461108934805:web:a12fc813b2002bd1abc39c',
};
const firebaseApp = initializeApp(appConfig);

const placesConverter = {
  toFirestore: (place: PlaceModel) => {
    return {
      id: place.id,
      name: place.name,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): PlaceModel => {
    const data = snapshot.data(options) as PlaceModel;
    return {
      ...data,
      id: snapshot.id,
    };
  },
};
export const advertisementsConverter = {
  toFirestore: (adv: AdvertisementModel): AdvertisementModel => {
    return {
      ...adv,
      date: Date.now(),
      userId: getAuth(firebaseApp).currentUser!.uid,
      pictures: adv.pictures.filter(Boolean),
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): AdvertisementModel => {
    const data = snapshot.data(options) as AdvertisementModel;
    const { pictures } = data;
    return {
      ...data,
      id: snapshot.id,
      pictures:
        pictures.length < 8
          ? pictures.concat(Array.from({ length: 8 - pictures.length }))
          : pictures,
    };
  },
};
export const userConverter = {
  toFirestore: (user: PublisherModel): PublisherModel => {
    return user;
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): PublisherModel => {
    const data = snapshot.data(options) as PublisherModel;

    return data;
  },
};

class Fire {
  private db: Firestore;
  constructor(private app: FirebaseApp) {
    this.db = getFirestore(app);
  }

  async getChatPreviews(
    roomId: string,
    userId: string,
    animalId: string
  ): Promise<APIResponse<ChatPreviewModel>> {
    try {
      const lastMessageQuery = query(
        collection(this.db, 'rooms', roomId, 'messages'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );
      const userPreviewQuery = doc(this.db, 'users', userId).withConverter(
        userConverter
      );
      const advertisementUserQuery = doc(
        this.db,
        'animals',
        animalId
      ).withConverter(advertisementsConverter);
      const [messageSnapshot, userSnapshot, advertisementSnapshot] =
        await Promise.all([
          getDocs(lastMessageQuery),
          getDoc(userPreviewQuery),
          getDoc(advertisementUserQuery),
        ]);
      const userData = userSnapshot.data()!;
      const messageData = messageSnapshot.docs[0].data();
      const advertisementUserData = advertisementSnapshot.data()!;
      const result: ChatPreviewModel = {
        userName: advertisementUserData.userName,
        imgUrl: userData.imageUrl,
        createdAt: messageData.createdAt,
        lastMessage: messageData.text,
        phoneNumber: advertisementUserData.phoneNumber,
        roomId,
      };
      return {
        success: true,
        data: result,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.toString(),
      };
    }
  }

  async getTagsByTerm(term: string): Promise<APIResponse<string[]>> {
    try {
      const tagsQuery = query(
        collection(this.db, 'tags'),
        where('name', '>=', term),
        where('name', '<=', term + '\uf8ff')
      );
      const snapshot = await getDocs(tagsQuery);
      const tagNames = snapshot.docs.map((doc) => doc.data().name);
      return {
        data: tagNames,
        success: true,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.toString(),
      };
    }
  }

  async getAdvertisements(queryConstraints: QueryConstraint[]): Promise<{
    data: AdvertisementModel[];
    lastSnapshotRef: QueryDocumentSnapshot<AdvertisementModel>;
  } | null> {
    const advsQuery = query(
      collection(this.db, 'animals').withConverter(advertisementsConverter),
      ...queryConstraints
    );
    try {
      const snapshot = await getDocs(advsQuery);
      const advs = snapshot.docs.map((adv) => adv.data());
      const lastSnapshotRef = snapshot.docs[snapshot.docs.length - 1];
      return {
        data: advs,
        lastSnapshotRef,
      };
    } catch (err: any) {
      console.log(err);
      return null;
    }
  }

  async getAllPlaces(): Promise<APIResponse<PlaceModel[]>> {
    const placesQuery = query(
      collection(this.db, 'places').withConverter(placesConverter)
    );
    try {
      const snapshot = await getDocs(placesQuery);
      const places = snapshot.docs.map((doc) => doc.data());
      return {
        success: true,
        data: places,
      };
    } catch (err: any) {
      return {
        error: err.toString(),
        success: false,
      };
    }
  }
  async getUserAdvertisements(
    userId: string
  ): Promise<APIResponse<AdvertisementModel[]>> {
    const advQuery = query(
      collection(this.db, 'animals').withConverter(advertisementsConverter),
      where('userId', '==', userId)
    );
    try {
      const snapshot = await getDocs(advQuery);
      const advs = snapshot.docs.map((doc) => doc.data());
      return {
        success: true,
        data: advs,
      };
    } catch (err: any) {
      return {
        error: err.toString(),
        success: false,
      };
    }
  }
  async postAdvertisement(
    adv: AdvertisementModel
  ): Promise<APIResponse<AdvertisementModel>> {
    try {
      await setDoc(
        doc(this.db, 'animals', adv.id).withConverter(advertisementsConverter),
        adv
      );
      if (adv.tags.length) {
        for await (const tag of adv.tags) {
          await addDoc(collection(this.db, 'tags'), {
            name: tag,
          });
        }
      }
      return {
        success: true,
        data: adv,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.toString(),
      };
    }
  }
  async updateAdvertisement(
    adv: AdvertisementModel
  ): Promise<APIResponse<AdvertisementModel>> {
    try {
      await updateDoc(
        doc(this.db, 'animals', adv.id).withConverter(advertisementsConverter),
        {
          ...adv,
          pictures: adv.pictures.filter(Boolean),
        }
      );
      return {
        success: true,
        data: adv,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.toString(),
      };
    }
  }
  async deleteAdvertisement(advId: string): Promise<APIResponse<string>> {
    try {
      await deleteDoc(doc(this.db, 'animals', advId));
      return {
        success: true,
        data: advId,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.toString(),
      };
    }
  }

  async getUserFollowedAdvertisements(
    userId: string
  ): Promise<APIResponse<AdvertisementModel[]>> {
    const userQuery = query(
      collectionGroup(this.db, 'followers'),
      where('uid', '==', userId)
    );

    try {
      const snapshot = await getDocs(userQuery);
      const advIds = snapshot.docs.map((doc) => doc.ref.parent.parent!.id);
      if (!advIds.length) {
        return {
          success: true,
          data: [],
        };
      }
      const advsQuery = query(
        collection(this.db, 'animals'),
        where(documentId(), 'in', advIds)
      ).withConverter(advertisementsConverter);

      const advsSnapshot = await getDocs(advsQuery);
      const advs = advsSnapshot.docs.map((doc) => doc.data());
      return {
        success: true,
        data: advs,
      };
    } catch (err: any) {
      return {
        error: err.toString(),
        success: false,
      };
    }
  }
  async postUserFollowedAdvertisement(
    adv: AdvertisementModel,
    user: UserModel
  ): Promise<APIResponse<AdvertisementModel>> {
    try {
      await setDoc(
        doc(this.db, 'animals', adv.id, 'followers', user.uid).withConverter(
          userConverter
        ),
        user
      );
      return {
        success: true,
        data: adv,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.toString(),
      };
    }
  }
  async deleteUserFollowedAdvertisement(
    advId: string,
    userId: string
  ): Promise<APIResponse<string>> {
    try {
      await deleteDoc(doc(this.db, 'animals', advId, 'followers', userId));
      return {
        success: true,
        data: advId,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.toString(),
      };
    }
  }
}

export { firebaseApp as app };
export default new Fire(firebaseApp);
