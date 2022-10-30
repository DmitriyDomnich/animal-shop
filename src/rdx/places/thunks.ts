import { ThunkAppType } from 'rdx/actions';
import Fire from 'services/fire';
import { getAllPlacesAsyncAction } from './actions';

export const getAllPlaces = (): ThunkAppType => async (dispatch) => {
  try {
    const response = await Fire.getAllPlaces();
    if (response.success && response.data) {
      dispatch(getAllPlacesAsyncAction.success(response.data));
    } else {
      dispatch(getAllPlacesAsyncAction.failure(response.error!));
    }
  } catch (err) {
    dispatch(getAllPlacesAsyncAction.failure('Something went wrong'));
  }
};
