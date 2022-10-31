import { ThunkAppType } from 'rdx/actions';
import {
  deleteAdvertisementAsyncAction,
  deleteUserFollowedAdvertisementsAsyncAction,
  getUserAdvertisementsAsyncAction,
  getUserFollowedAdvertisementsAsyncAction,
  postAdvertisementAsyncAction,
  postUserFollowedAdvertisementsAsyncAction,
  updateAdvertisementAsyncAction,
} from './actions';
import Fire from 'services/fire';
import { AdvertisementModel } from 'models/AdvertisimentModel';
import { UserModel } from 'models/UserModel';

export const getUserAdvertisements =
  (userId: string): ThunkAppType =>
  async (dispatch) => {
    dispatch(getUserAdvertisementsAsyncAction.request());
    try {
      const response = await Fire.getUserAdvertisements(userId);
      if (response.success && response.data) {
        dispatch(getUserAdvertisementsAsyncAction.success(response.data));
      } else {
        dispatch(getUserAdvertisementsAsyncAction.failure(response.error!));
      }
    } catch (err) {
      dispatch(
        getUserAdvertisementsAsyncAction.failure('Something went wrong')
      );
    }
  };

export const postAdvertisement =
  (adv: AdvertisementModel): ThunkAppType =>
  async (dispatch) => {
    dispatch(postAdvertisementAsyncAction.request());
    try {
      const response = await Fire.postAdvertisement(adv);
      if (response.success && response.data) {
        dispatch(postAdvertisementAsyncAction.success(response.data));
      } else {
        dispatch(postAdvertisementAsyncAction.failure(response.error!));
      }
    } catch (err) {
      dispatch(postAdvertisementAsyncAction.failure('Something went wrong'));
    }
  };
export const updateAdvertisement =
  (adv: AdvertisementModel): ThunkAppType =>
  async (dispatch) => {
    dispatch(updateAdvertisementAsyncAction.request());
    try {
      const response = await Fire.updateAdvertisement(adv);
      if (response.success && response.data) {
        dispatch(updateAdvertisementAsyncAction.success(response.data));
      } else {
        dispatch(updateAdvertisementAsyncAction.failure(response.error!));
      }
    } catch (err) {
      dispatch(updateAdvertisementAsyncAction.failure('Something went wrong'));
    }
  };
export const deleteAdvertisement =
  (advId: string): ThunkAppType =>
  async (dispatch) => {
    dispatch(deleteAdvertisementAsyncAction.request());
    try {
      const response = await Fire.deleteAdvertisement(advId);
      if (response.success && response.data) {
        dispatch(deleteAdvertisementAsyncAction.success(response.data));
      } else {
        dispatch(deleteAdvertisementAsyncAction.failure(response.error!));
      }
    } catch (err) {
      dispatch(deleteAdvertisementAsyncAction.failure('Something went wrong'));
    }
  };

export const getUserFollowedAdvertisements =
  (userId: string): ThunkAppType =>
  async (dispatch) => {
    dispatch(getUserFollowedAdvertisementsAsyncAction.request());
    try {
      const response = await Fire.getUserFollowedAdvertisements(userId);
      if (response.success && response.data) {
        dispatch(
          getUserFollowedAdvertisementsAsyncAction.success(response.data)
        );
      } else {
        dispatch(
          getUserFollowedAdvertisementsAsyncAction.failure(response.error!)
        );
      }
    } catch (err) {
      dispatch(
        getUserFollowedAdvertisementsAsyncAction.failure('Something went wrong')
      );
    }
  };
export const postUserFollowedAdvertisement =
  (adv: AdvertisementModel, user: UserModel): ThunkAppType =>
  async (dispatch) => {
    dispatch(postUserFollowedAdvertisementsAsyncAction.request());
    try {
      const response = await Fire.postUserFollowedAdvertisement(adv, user);
      if (response.success && response.data) {
        dispatch(
          postUserFollowedAdvertisementsAsyncAction.success(response.data)
        );
      } else {
        dispatch(
          postUserFollowedAdvertisementsAsyncAction.failure(response.error!)
        );
      }
    } catch (err) {
      dispatch(
        postUserFollowedAdvertisementsAsyncAction.failure(
          'Something went wrong'
        )
      );
    }
  };
export const deleteUserFollowedAdvertisement =
  (advId: string, userId: string): ThunkAppType =>
  async (dispatch) => {
    dispatch(deleteUserFollowedAdvertisementsAsyncAction.request());
    try {
      const response = await Fire.deleteUserFollowedAdvertisement(
        advId,
        userId
      );
      if (response.success && response.data) {
        dispatch(
          deleteUserFollowedAdvertisementsAsyncAction.success(response.data)
        );
      } else {
        dispatch(
          deleteUserFollowedAdvertisementsAsyncAction.failure(response.error!)
        );
      }
    } catch (err) {
      dispatch(
        deleteUserFollowedAdvertisementsAsyncAction.failure(
          'Something went wrong'
        )
      );
    }
  };
