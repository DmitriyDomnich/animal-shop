import { FirebaseApp, initializeApp } from 'firebase/app';
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  QueryDocumentSnapshot,
  setDoc,
  SnapshotOptions,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { AdvertisementModel } from 'models/AdvertisimentModel';
import { PlaceModel } from 'models/PlaceModel';
import { serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export interface APIResponse<T extends object | void | string> {
  success: boolean;
  error?: string;
  data?: T;
}

const appConfig = {
  apiKey: 'AIzaSyAs2S0VB5G8nDCIS7OsxEJ4bH4JJbeoWv0',
  authDomain: 'animal-shop-69390.firebaseapp.com',
  projectId: 'animal-shop-69390',
  storageBucket: 'animal-shop-69390.appspot.com',
  messagingSenderId: '185500411411',
  appId: '1:185500411411:web:98c09b9ce9062b2cd441e6',
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
      date: serverTimestamp(),
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
      date: +new Timestamp(data.date.seconds, data.date.nanoseconds).toDate(),
      pictures:
        pictures.length < 8
          ? pictures.concat(Array.from({ length: 8 - pictures.length }))
          : pictures,
    };
  },
};

class Fire {
  constructor(private app: FirebaseApp) {}

  async getAllPlaces(): Promise<APIResponse<PlaceModel[]>> {
    const placesQuery = query(
      collection(getFirestore(this.app), 'places').withConverter(
        placesConverter
      )
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
        error: err,
        success: false,
      };
    }
  }
  async getUserAdvertisements(
    userId: string
  ): Promise<APIResponse<AdvertisementModel[]>> {
    const advQuery = query(
      collection(getFirestore(this.app), 'animals').withConverter(
        advertisementsConverter
      ),
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
        error: err,
        success: false,
      };
    }
  }
  async postAdvertisement(
    adv: AdvertisementModel
  ): Promise<APIResponse<AdvertisementModel>> {
    try {
      await setDoc(
        doc(getFirestore(this.app), 'animals', adv.id).withConverter(
          advertisementsConverter
        ),
        adv
      );
      return {
        success: true,
        data: adv,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err,
      };
    }
  }
  async updateAdvertisement(
    adv: AdvertisementModel
  ): Promise<APIResponse<AdvertisementModel>> {
    try {
      await updateDoc(doc(getFirestore(this.app), 'animals', adv.id), {
        ...adv,
      });
      return {
        success: true,
        data: adv,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err,
      };
    }
  }
  async deleteAdvertisement(advId: string): Promise<APIResponse<string>> {
    try {
      await deleteDoc(doc(getFirestore(this.app), 'animals', advId));
      return {
        success: true,
        data: advId,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err,
      };
    }
  }
}

export { firebaseApp as app };
export default new Fire(firebaseApp);
