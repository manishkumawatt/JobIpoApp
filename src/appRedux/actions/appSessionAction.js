import {DeviceEventEmitter} from 'react-native';
import {get, post} from '../apis/apiHelper';
import {loadingButton, loadingShow} from './loadingAction';
import {showToastMessage} from '../../utils/Toast';
import {
  JSON_HEADER,
  kSorryError,
  kUserData,
  kUserToken,
  MULTI_PART_HEADER,
} from '../apis/commonValue';
import {
  ADD_CARD,
  ADD_FAVORITE_ADDRESS,
  ADD_WALLET_AMOUNT,
  AGORA_ACCEPT_CALL,
  AGORA_DISCONNECT_CALL,
  AGORA_GENERATE_TOKEN,
  APPLY_COUPON_CODE,
  CARD_LIST,
  CONFIRM_RIDE,
  DELETE_FAVORITE_ADDRESS,
  DRIVER_PICKUP_LOCATION,
  EDIT_ROUTE,
  FIND_DRIVER,
  GET_COUPONS_LIST,
  GET_FAVORITE_ADDRESS,
  GET_VEHICLE_LIST,
  GET_VEHICLE_SUGGESTION_TYPES,
  HOME_PAGE_API,
  PRODUCT_DETAILS,
  REMOVE_CARD,
  REPORT,
  REPORT_REASONS,
  RIDE_CANCEL,
  RIDE_CANCEL_REASONS,
  SEND_MAIL_PDF,
  SET_DEFAULT_CARD,
  STORE_DESCRIPTION,
  SUPPORT_REASONS,
  TRANSACTION_HISTORY,
  WELCOME_PAGE_DATA,
} from '../apis/endpoints';

import * as Helper from '../../utils/helper';
import {
  CLEAR_HOME_DATA_LIST,
  PRODUCT_DATA_LIST,
  PRODUCT_DETAIL,
  PULL_TO_REFRESH_HOME_DATA_LIST,
  RIDE_CANCEL_DATA_STORE,
  STORES_DESCRIPTIONS,
  WELCOME_DATA,
} from '../constants/appSessionType';
import {sendToReducer} from './userSessionAction';

export const setAppSessionReducer = (type, payload) => {
  return {
    type,
    payload,
  };
};

export function WelcomeDataAction(request) {
  return async dispatch => {
    // dispatch(loadingShow(true));
    try {
      const response = await post({
        url: WELCOME_PAGE_DATA,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));

      if (response && response?.data && response?.status) {
        dispatch(setAppSessionReducer(WELCOME_DATA, response?.data?.data));
        return Promise.resolve(response);
      } else {
        showToastMessage(response?.message);
        return Promise.resolve(false);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
      return Promise.resolve(false);
    }
  };
}
export function addFavoriteAddressApi(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    // dispatch(loadingButton(true));
    try {
      const response = await post({
        url: ADD_FAVORITE_ADDRESS,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}
export function getFavoriteAddressApi(request) {
  return async dispatch => {
    // dispatch(loadingShow(true));
    try {
      const response = await post({
        url: GET_FAVORITE_ADDRESS,
        // data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}
export function deleteFavoriteAddressApi(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: DELETE_FAVORITE_ADDRESS,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      dispatch(loadingShow(false));

      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}
export function getVehicleListApi(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: GET_VEHICLE_LIST,
        data: JSON.stringify(request),
        header: JSON_HEADER,
        hide: true,
      });

      dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}
export function getVehicleSuggestionApi(request) {
  return async dispatch => {
    // dispatch(loadingShow(true));
    try {
      const response = await post({
        url: GET_VEHICLE_SUGGESTION_TYPES,
        data: JSON.stringify(request),
        header: JSON_HEADER,
        hide: true,
      });

      dispatch(loadingShow(false));
      // // console.log('getVehicleSuggestionApi----------', response);
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}
export function getRideCancelReasonsApi() {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: RIDE_CANCEL_REASONS,
        // data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      dispatch(loadingButton(false));
      if (response?.status == true || response?.status == 'true') {
        dispatch(setAppSessionReducer(RIDE_CANCEL_DATA_STORE, response?.data));
        return response;
      } else {
        dispatch(loadingButton(false));
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showToastMessage(error);
    }
  };
}
export function find_driver_api(request, check) {
  return async dispatch => {
    !check && dispatch(loadingButton(true));
    try {
      const response = await post({
        url: FIND_DRIVER,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingButton(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        dispatch(loadingButton(false));
        // showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showToastMessage(error);
    }
  };
}
export function FindNearByDriver(request) {
  return async dispatch => {
    try {
      const response = await post({
        url: DRIVER_PICKUP_LOCATION,
        data: JSON.stringify(request),
        header: JSON_HEADER,
        hide: true,
      });

      if (response?.status == true || response?.status == 'true') {
        return response;
      }
    } catch (error) {}
  };
}
export function getCouponsListApi(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: GET_COUPONS_LIST,
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        dispatch(loadingShow(false));
        // showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}
export function applyCouponCodeApi(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: APPLY_COUPON_CODE,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}
export function apiRideCancel(request) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: RIDE_CANCEL,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingButton(false));
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response?.message, 'success');
        return response;
      } else {
        dispatch(loadingButton(false));
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showToastMessage(error);
    }
  };
}

export function saveTransaction(request) {
  return async dispatch => {
    dispatch(loadingButton(true));

    try {
      const response = await post({
        url: ADD_WALLET_AMOUNT,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // dispatch(loadingButton(false));
      if (response && response?.status == true) {
        return response;
      } else {
        // dispatch(loadingButton(false));
        showToastMessage(response?.message);
      }
    } catch (error) {
      // dispatch(loadingButton(false));
      // showToastMessage(error);
    }
  };
}
export function addWalletAmount(request) {
  return async dispatch => {
    dispatch(loadingButton(true));

    try {
      const response = await post({
        url: ADD_WALLET_AMOUNT,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // dispatch(loadingButton(false));
      if (response && response?.status == true) {
        return response;
      } else {
        dispatch(loadingButton(false));
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingButton(false));
      // showToastMessage(error);
    } finally {
      // dispatch(loadingButton(false));
    }
  };
}
export function addCard(request) {
  return async dispatch => {
    dispatch(loadingButton(true));

    try {
      const response = await post({
        url: ADD_CARD,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingButton(false));
      if (response?.status === true || response?.status === 'true') {
        // // console.log('response-=======>>>>---f', response);

        dispatch(loadingButton(false));
        return response;
      } else {
        // // console.log('response-======d=>>>>---f', response?.message);

        dispatch(loadingButton(false));
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingButton(false));
      // showToastMessage(error);
    } finally {
      dispatch(loadingButton(false));
    }
  };
}
export function removeCard(request) {
  return async dispatch => {
    dispatch(loadingButton(true));

    try {
      const response = await post({
        url: REMOVE_CARD,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingButton(false));
      if (response && response?.status == true) {
        dispatch(loadingButton(false));
        return response;
      } else {
        dispatch(loadingButton(false));
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showToastMessage(error);
    } finally {
      dispatch(loadingButton(false));
    }
  };
}
export function setAsDefaultCard(request) {
  return async dispatch => {
    // dispatch(loadingButton(true));

    try {
      const response = await post({
        url: SET_DEFAULT_CARD,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // dispatch(loadingButton(false));
      if (response && response?.status == true) {
        // dispatch(loadingButton(false));
        return response;
      } else {
        // dispatch(loadingButton(false));
        showToastMessage(response?.message);
      }
    } catch (error) {
      dispatch(loadingButton(false));
      // showToastMessage(error);
    } finally {
      dispatch(loadingButton(false));
    }
  };
}
export function getcardList(request) {
  return async dispatch => {
    // dispatch(loadingButton(true));

    try {
      const response = await post({
        url: CARD_LIST,
        data: JSON.stringify(request),
        header: JSON_HEADER,
        hide: true,
      });
      // dispatch(loadingButton(false));
      if (response && response?.status == true) {
        // dispatch(loadingButton(false));
        return response;
      } else {
        // dispatch(loadingButton(false));
        // showToastMessage(response?.message);
      }
    } catch (error) {
      // dispatch(loadingButton(false));
      // showToastMessage(error);
    } finally {
      // dispatch(loadingButton(false));
    }
  };
}
export function updatePicupAndDrop(request) {
  return async dispatch => {
    dispatch(loadingShow(true));

    try {
      const response = await post({
        url: EDIT_ROUTE,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // dispatch(loadingButton(false));
      if (response && response?.status == true) {
        dispatch(loadingShow(false));

        return response;
      } else {
        // dispatch(loadingButton(false));
        showToastMessage(response?.message);
      }
    } catch (error) {
      // dispatch(loadingButton(false));
      // showToastMessage(error);
    } finally {
      dispatch(loadingShow(false));
    }
  };
}
export function getTransactionHistory(request) {
  return async dispatch => {
    try {
      const response = await post({
        url: TRANSACTION_HISTORY,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // dispatch(loadingButton(false));
      if (response && response?.status == true) {
        return response;
      } else {
        // dispatch(loadingButton(false));
        showToastMessage(response?.message);
      }
    } catch (error) {
      // dispatch(loadingButton(false));
      // showToastMessage(error);
    } finally {
      dispatch(loadingShow(false));
    }
  };
}
export function getSupportReason(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: SUPPORT_REASONS,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // // console.log(response, '>>>>getSupportReason');
      dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response?.message);
        return false;
      }
    } catch (error) {
      dispatch(loadingShow(false));

      return false;
    }
  };
}
export function aprReport(request) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: REPORT,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // // console.log(response, '>>>>getSupportReason');
      dispatch(loadingButton(false));
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response?.message, 'success');
        return response;
      } else {
        showToastMessage(response?.message);

        dispatch(loadingButton(false));

        return false;
      }
    } catch (error) {
      dispatch(loadingButton(false));

      return false;
    }
  };
}
export function apiGetReportReasons(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: REPORT_REASONS,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // // console.log(response, '>>>>getSupportReason');
      dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response?.message);
        return false;
      }
    } catch (error) {
      dispatch(loadingShow(false));

      return false;
    }
  };
}
export function apiGenerateToken(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: AGORA_GENERATE_TOKEN,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // // console.log('AGORA_GENERATE_TOKEN---', response);
      dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response?.message);

        dispatch(loadingShow(false));

        return false;
      }
    } catch (error) {
      dispatch(loadingShow(false));

      return false;
    }
  };
}
export function apiAcceptCall(request) {
  return async dispatch => {
    // dispatch(loadingShow(true));
    try {
      const response = await post({
        url: AGORA_ACCEPT_CALL,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // // console.log('AGORA_GENERATE_TOKEN---', response);
      // dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response?.message);

        // dispatch(loadingShow(false));

        return false;
      }
    } catch (error) {
      // dispatch(loadin gShow(false));

      return false;
    }
  };
}
export function apiDisconnectCall(request) {
  return async dispatch => {
    // dispatch(loadingShow(true));
    try {
      const response = await post({
        url: AGORA_DISCONNECT_CALL,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // // console.log('AGORA_GENERATE_TOKEN---', response);
      // dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response?.message);

        // dispatch(loadingShow(false));

        return false;
      }
    } catch (error) {
      // dispatch(loadin gShow(false));

      return false;
    }
  };
}
export function apiConfirmRide(request) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: CONFIRM_RIDE,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // // console.log('apiConfirmRide---', response);
      dispatch(loadingButton(false));
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response?.message, 'success');
        return response;
      } else {
        dispatch(loadingButton(false));
        showToastMessage(response?.message);
        return false;
      }
    } catch (error) {
      dispatch(loadingButton(false));

      return false;
    }
  };
}
export function apiSendMailPdf(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: SEND_MAIL_PDF,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // // console.log('apiSendMAilPdf---', response);
      dispatch(loadingShow(false));
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response?.message, 'success');
        return response;
      } else {
        dispatch(loadingShow(false));
        showToastMessage(response?.message);
        return false;
      }
    } catch (error) {
      dispatch(loadingShow(false));

      return false;
    }
  };
}
