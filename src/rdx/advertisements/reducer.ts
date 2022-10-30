import { AdvertisementModel } from 'models/AdvertisimentModel';
import { ActionType, getType } from 'typesafe-actions';
import * as Actions from './actions';

export interface AdvertisementsState {
  userAdvertisements: {
    data: AdvertisementModel[];
    loading: boolean;
    error: null | string;
  };
  followedAdvertisements: {
    data: AdvertisementModel[];
    loading: boolean;
    error: null | string;
  };
}
export type AdvertisementsActions = ActionType<typeof Actions>;

const initialState: AdvertisementsState = {
  userAdvertisements: {
    data: [],
    loading: false,
    error: null,
  },
  followedAdvertisements: {
    data: [],
    loading: false,
    error: null,
  },
};

export const advertisementsReducer = (
  state = initialState,
  action: AdvertisementsActions
): AdvertisementsState => {
  switch (action.type) {
    // * getUserAdvertisementsAsyncAction
    case getType(Actions.getUserAdvertisementsAsyncAction.request): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          loading: true,
          error: null,
        },
      };
    }
    case getType(Actions.getUserAdvertisementsAsyncAction.success): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          data: action.payload,
          loading: false,
        },
      };
    }
    case getType(Actions.getUserAdvertisementsAsyncAction.failure): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          loading: false,
          error: action.payload,
        },
      };
    }
    // ? postAdvertisementAsyncAction
    case getType(Actions.postAdvertisementAsyncAction.request): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          loading: true,
        },
      };
    }
    case getType(Actions.postAdvertisementAsyncAction.success): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          data: state.userAdvertisements.data.concat(action.payload),
          loading: false,
        },
      };
    }
    case getType(Actions.postAdvertisementAsyncAction.failure): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          loading: false,
          error: action.payload,
        },
      };
    }
    // ? updateAdvertisementAsyncAction
    case getType(Actions.updateAdvertisementAsyncAction.request): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          loading: true,
        },
      };
    }
    case getType(Actions.updateAdvertisementAsyncAction.success): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          data: state.userAdvertisements.data.map((adv) =>
            adv.id === action.payload.id ? action.payload : adv
          ),
          loading: false,
        },
      };
    }
    case getType(Actions.updateAdvertisementAsyncAction.failure): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          loading: false,
          error: action.payload,
        },
      };
    }
    // ! deleteAdvertisementAsyncAction
    case getType(Actions.deleteAdvertisementAsyncAction.request): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          loading: true,
        },
      };
    }
    case getType(Actions.deleteAdvertisementAsyncAction.success): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          data: state.userAdvertisements.data.filter(
            (adv) => adv.id !== action.payload
          ),
          loading: false,
        },
      };
    }
    case getType(Actions.deleteAdvertisementAsyncAction.failure): {
      return {
        ...state,
        userAdvertisements: {
          ...state.userAdvertisements,
          loading: false,
          error: action.payload,
        },
      };
    }
    default:
      return state;
  }
};
