import {post} from '../apis/apiHelper';
import {loadingButton, loadingShow} from './loadingAction';
import {showToastMessage} from '../../utils/Toast';
import {
  JSON_HEADER,
  kRememberData,
  kRememberManagerData,
  kSorryError,
  kUserData,
  kUserToken,
  MULTI_PART_HEADER,
} from '../apis/commonValue';
import {
  CHECK_USER,
  GET_PROFILE,
  REGISTER,
  VERIFY_OTP,
  FORGOT_PASSWORD,
  RESEND_OTP,
  RESET_PASSWORD,
  LOGIN,
  LOGOUT,
  CHANGE_PASSWORD,
  DELETE_ACCOUNT,
  UPDATE_NOTIFICATION,
  SETUP_PROFILE,
  GET_MOBILITY_EQUIPMENTS,
  GET_TRANSFER_LEVELS,
  PROFILE_SETUP,
  UPLOAD_PROFILE_IMAGE,
  UPLOAD_NOTIFICATION,
  GET_CUSTOMER_SETTING,
  SOCIAL_LOGIN,
  RESEND_MOBILE_OTP,
  SEND_OTP_EMAIL,
  CHECK_PASSWORD,
  GET_UPCOMING_RIDES,
  PAST_RIDES,
  UPCOMING_RIDES,
  RIDE_DETAILS,
  POST_REVIEW_RATING,
  POST_SUPPORT_QUERY,
  STORE_TOKEN,
} from '../apis/endpoints';
import {logout, showErrorMessage} from '../../utils/helper';
import {setData} from '../apis/keyChain';
import {COUSTMER_SEETING, USER_DATA_KEY} from '../constants/userSessionType';
import * as Helper from '../../utils/helper';
import {handlePush, handleSetRoot} from '../../navigation/navigationService';
import {setAppSessionReducer} from './appSessionAction';
import {
  CURRENT_DESTINATION,
  DESTINATION,
  FIND_DRIVER_DATA,
} from '../constants/appSessionType';

export const saveUserData = (dispatch, response) => {
  setData(kUserData, response?.data);
  Helper.setUserData(response?.data);
  if (response?.token) {
    global.userToken = response?.token;
    setData(kUserToken, response?.token);
    Helper.setGlobalUserToken(response?.token);
  }
  dispatch(setUserDataPayLoad(USER_DATA_KEY, response?.data));
};

export const sendToUserReducer = (type, payload) => {
  return {
    type,
    payload,
  };
};

export const setUserDataPayLoad = (type, response) => {
  return {
    type: type,
    payload: response,
  };
};

// Check user Request Api
export function checkUserApi(request, navigation, type) {
  return async dispatch => {
    // // console.log('request--=-=-=', request);
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: CHECK_USER,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.success || response?.success == 'true') {
        showToastMessage(response?.message, 'success');
        // handlePush({name: 'VerificationScreen', params: {signUpReq: request}});
        dispatch(loadingShow(false));
        return response;
      } else {
        showToastMessage(response?.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}

// sign up user Request Api
export function registerApi(request, navigation) {
  Helper.appLog('request-=======', request);
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: REGISTER,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        // dispatch(sendToUserReducer(USER_DATA_KEY,response?.data))
        saveUserData(dispatch, response);
        dispatch(loadingButton(false));

        return response;
      } else {
        dispatch(loadingButton(false));
        showToastMessage(response.message);
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}

// resetPasswordApi Request Api
export function resetPasswordApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: RESET_PASSWORD,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        handlePush({name: 'LoginScreen'});
        dispatch(loadingButton(false));
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
// resetPasswordApi Request Api
export function storeTokenApi(request, navigation) {
  return async dispatch => {
    try {
      const response = await post({
        url: STORE_TOKEN,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        return false;
      }
    } catch (error) {}
  };
}
// changePasswordApi Request Api
export function changePasswordApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: CHANGE_PASSWORD,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        navigation.goBack();
        dispatch(loadingButton(false));
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
// logOut user Request Api
export function logOutApi(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: LOGOUT,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        dispatch(loadingShow(false));
        dispatch(setAppSessionReducer(CURRENT_DESTINATION, {}));
        dispatch(setAppSessionReducer(DESTINATION, {}));
        logout();
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}
// resendOtpApi Request Api
export function resendOtpApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: RESEND_OTP,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // dispatch(loadingButton(false));
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        dispatch(loadingButton(false));
        return response;
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
// edit user Request Api
export function editProfileApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: SETUP_PROFILE,
        data: request,
        header: MULTI_PART_HEADER,
      });
      dispatch(loadingShow(false));
      if (
        response?.status == true ||
        (response?.status == 'true' && response?.data)
      ) {
        showToastMessage(response.message, 'success');

        saveUserData(dispatch, response);
        navigation.goBack();
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}
export function deleteAccountApi(request) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: DELETE_ACCOUNT,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        dispatch(loadingButton(false));
        dispatch(loadingShow(false));
        logout();
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      dispatch(loadingShow(false));
      showErrorMessage(kSorryError);
    }
  };
}
//Notifaction Update
export function updateNotification(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: UPDATE_NOTIFICATION,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      dispatch(loadingShow(false));
      if (response?.status == true) {
        saveUserData(dispatch, response);
        showToastMessage(response.message, 'success');
      } else {
        showToastMessage(response.message);
        dispatch(loadingShow(false));
      }
    } catch (error) {
      dispatch(loadingShow(false));
      showToastMessage(error);
    }
  };
}

// create user Request Api
export function createUserApi(request, navigation, type = 'create') {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: SETUP_PROFILE,
        data: request,
        header: MULTI_PART_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        saveUserData(dispatch, response);
        if (type == 'create') {
          navigation.reset({
            index: 1,
            routes: [{name: 'BottomTab'}],
          });
        } else {
          navigation.goBack();
        }
        dispatch(loadingButton(false));
      } else {
        dispatch(loadingButton(false));
        showToastMessage(response.message);
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}

// Login user Request Api
export function loginUserApi(request, navigation, remember) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: LOGIN,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        saveUserData(dispatch, response);
        if (response?.data?.is_profile_complete == 0) {
          handleSetRoot({name: 'ProfileSetup'});
        } else if (
          response?.data?.is_profile_complete == 1 &&
          !response?.data?.mobile_number
        ) {
          handleSetRoot({name: 'CreateNumber', params: {checkSide: true}});
        } else if (response?.data?.is_profile_complete >= 2) {
          handleSetRoot({name: 'DrawerStack'});
        }

        // profileSetup
        if (remember) {
          setData(kRememberData, {
            ...request,
            email: request.email,
            password: request.password,
          });
        } else {
          setData(kRememberData, null);
        }

        dispatch(loadingButton(false));
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
export function socialLogin(request, navigation, remember) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: SOCIAL_LOGIN,
        data: request,
        header: MULTI_PART_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        saveUserData(dispatch, response);
        if (!response?.data?.email) {
          handleSetRoot({name: 'EditEmail', params: {loginSide: true}});
        } else {
          if (response?.data?.is_profile_complete) {
            handleSetRoot({name: 'DrawerStack'});
          } else {
            handleSetRoot({name: 'ProfileSetup'});
          }
        }

        dispatch(loadingButton(false));
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
// forgot password Request Api
export function forgotPasswordApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: FORGOT_PASSWORD,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        dispatch(loadingButton(false));
        handlePush({name: 'VerificationScreen', params: {forgotUser: request}});
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
// verify-otp  Request Api
export function verifyOtpApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: VERIFY_OTP,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        // navigation.navigate("ResetPassword", { forgotUser: request });
        dispatch(loadingButton(false));
        return response;
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
export function resendMobileOtpApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: RESEND_MOBILE_OTP,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        // saveUserData(dispatch, response);
        // navigation.navigate("ResetPassword", { forgotUser: request });
        dispatch(loadingButton(false));
        return response;
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
export function sendOtpEmailApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: SEND_OTP_EMAIL,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        dispatch(loadingButton(false));
        handlePush({
          name: 'VerificationScreen',
          params: {type: 'email', editData: response?.data},
        });
        return response;
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
export function checkPasswordApi(request, navigation) {
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: CHECK_PASSWORD,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');
        dispatch(loadingButton(false));

        return response;
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
export function profileSetUPApi(request, navigation, type, profileCreate) {
  Helper.appLog('request=====', JSON.stringify(request));
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: PROFILE_SETUP,
        data: request,
        header: MULTI_PART_HEADER,
      });
      Helper.appLog('response=======>>>>>>', response);
      if (response?.status == true || response?.status == 'true') {
        dispatch(loadingButton(false));
        showToastMessage(response.message, 'success');
        saveUserData(dispatch, response);
        // type == 'profileSetup'
        //   ? handlePush({
        //       name: 'CreateNumber',
        //       params: {checkSide: true},
        //     })
        //   : type == 'editNumber'
        //   ? handlePush({name: 'EditProfile'})
        //   : handleSetRoot({name: 'DrawerStack'});
        return response;
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}
export function uploadMediauImageApi(request, count) {
  return new Promise(async (resolve, reject) => {
    const response = await post({
      url: UPLOAD_PROFILE_IMAGE,
      data: request,
      header: MULTI_PART_HEADER,
    });
    if (count == 1 && response?.error) {
      let newData = await uploadMediauImageApi(request, 2);
      resolve(newData);
    } else {
      resolve(response);
    }
  });
}
export function uploadProfikeImageApi(request, count) {
  return async dispatch => {
    try {
      const response = await uploadMediauImageApi(request, 1);
      if (response?.status == true || response?.status == 'true') {
        // showToastMessage(response?.message, "success");
        return response;
      } else {
        showToastMessage(response?.message);
      }
    } catch (error) {
      showToastMessage(kSorryError);
    }
  };
}
export function updateNotificationApi(request, navigation) {
  Helper.appLog('request=====', JSON.stringify(request));
  return async dispatch => {
    dispatch(loadingButton(true));
    try {
      const response = await post({
        url: UPLOAD_NOTIFICATION,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      Helper.appLog('response=======>>>>>>', response);
      if (response?.status == true || response?.status == 'true') {
        showToastMessage(response.message, 'success');

        dispatch(loadingButton(false));
        return response;
      } else {
        showToastMessage(response.message);
        dispatch(loadingButton(false));
      }
    } catch (error) {
      dispatch(loadingButton(false));
      showErrorMessage(kSorryError);
    }
  };
}

// get user data Request Api

export function getProfileApi() {
  return async dispatch => {
    try {
      const response = await post({
        url: GET_PROFILE,
        data: '',
        header: JSON_HEADER,
        hide: true,
      });
      // // console.log(response, '<====responseGetProfileApi');

      if (response?.status == true || response?.status == 'true') {
        saveUserData(dispatch, response);

        return response;
      } else {
        showToastMessage(response.message);
        return false;
      }
    } catch (error) {
      showToastMessage(error);
      return false;
    }
  };
}
export function getProfileUserApi() {
  return async dispatch => {
    try {
      const response = await post({
        url: GET_PROFILE,
        data: '',
        header: JSON_HEADER,
        hide: true,
      });
      // // console.log(response, '<====responseGetProfileApi');

      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response.message);
        return false;
      }
    } catch (error) {
      showToastMessage(error);
      return false;
    }
  };
}
export function getMobilityWquipmentsMethod() {
  return async dispatch => {
    try {
      const response = await post({
        url: GET_MOBILITY_EQUIPMENTS,
        header: JSON_HEADER,
      });

      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response.message);
      }
    } catch (error) {
      showToastMessage(error);
    }
  };
}
export function getTransferLevelMethod() {
  return async dispatch => {
    try {
      const response = await post({
        url: GET_TRANSFER_LEVELS,
        header: JSON_HEADER,
      });

      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response.message);
      }
    } catch (error) {
      showToastMessage(error);
    }
  };
}
export function getCoustmerSettingApi() {
  return async dispatch => {
    try {
      const response = await post({
        url: GET_CUSTOMER_SETTING,
        header: JSON_HEADER,
      });

      if (response?.status == true || response?.status == 'true') {
        dispatch(sendToUserReducer(COUSTMER_SEETING, response?.data));
        return response;
      } else {
      }
    } catch (error) {}
  };
}

export function getUpcomingRides(request) {
  return async dispatch => {
    try {
      const response = await post({
        url: UPCOMING_RIDES,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
      }
    } catch (error) {}
  };
}

export function getPastRides(request) {
  return async dispatch => {
    try {
      const response = await post({
        url: PAST_RIDES,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });

      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response?.message);
      }
    } catch (error) {
      // showToastMessage(error);
    }
  };
}

export function getRideDetails(request) {
  return async dispatch => {
    dispatch(loadingShow(true));
    try {
      const response = await post({
        url: RIDE_DETAILS,
        data: JSON.stringify(request),

        header: JSON_HEADER,
      });
      // // console.log('responseresponseresponse', response);
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

export function postRideReview(request) {
  return async dispatch => {
    try {
      const response = await post({
        url: POST_REVIEW_RATING,
        data: JSON.stringify(request),

        header: JSON_HEADER,
      });

      if (response?.status == true || response?.status == 'true') {
        return response;
      } else {
        showToastMessage(response?.message);
      }
    } catch (error) {
      showToastMessage(error);
    }
  };
}
export function submitSupport(request) {
  return async dispatch => {
    // // console.log('request-==-=-', request);
    try {
      dispatch(loadingButton(true));
      const response = await post({
        url: POST_SUPPORT_QUERY,
        data: JSON.stringify(request),
        header: JSON_HEADER,
      });
      // // console.log('response-==-=-', response);
      if (response?.status == true || response?.status == 'true') {
        dispatch(loadingButton(false));
        // showToastMessage(response?.message, "success");
        return response;
      } else {
        showToastMessage(response?.message);
      }
      dispatch(loadingButton(false));
    } catch (error) {
      dispatch(loadingButton(false));
      showToastMessage(error);
    }
  };
}
export function giveRatings(request) {
  return async dispatch => {
    try {
      dispatch(loadingButton(true));
      const response = await post({
        url: POST_REVIEW_RATING,
        data: JSON.stringify(request),

        header: JSON_HEADER,
      });
      // // console.log('POST_REVIEW_RATING-==-=---==-', response);
      if (response?.status == true || response?.status == 'true') {
        dispatch(loadingButton(false));
        showToastMessage(response?.message, 'success');
        // dispatch(getRideDetails({ ride_id: request?.ride_id }));
        return response;
      } else {
        showToastMessage(response?.message);
      }
      dispatch(loadingButton(false));
    } catch (error) {
      dispatch(loadingButton(false));
      showToastMessage(error);
    }
  };
}
