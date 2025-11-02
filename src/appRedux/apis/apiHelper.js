import {alert} from '../../utils/alertController';
import {logout, saveAuthToken} from '../../utils/helper';
import {showToastMessage} from '../../utils/Toast';
import {
  API_FAILED,
  INTERNET_FAILED,
  JSON_HEADER,
  BASE_URL,
  kPost,
  kUserToken,
  USER_TYPE,
  kGet,
  MULTI_PART_HEADER,
  KAUthToken,
} from './commonValue';
import {GET_AUTH_TOKEN} from './endpoints';
import {getData, setData} from './keyChain';
import {isNetworkAvailable} from './network';

const methodFetchAccessToken = async () => {
  return new Promise(async (resolve, reject) => {
    let header = MULTI_PART_HEADER;
    const formData = new FormData();
    formData.append('access_token', 'jobfinal_acceess_token');
    let params = {
      method: kPost,
      headers: {
        ...header,
      },
      body: formData,
    };
    // // console.log('body>>>>>', formData);
    let accessToken = await getData(KAUthToken);
    // // console.log('accessTokenaccessToken', accessToken);
    if (!accessToken) {
      let url = BASE_URL + GET_AUTH_TOKEN;
      // // console.log('urlurlurl', url);
      fetch(url, params).then(async response => {
        let json = await response.json();
        // // console.log('auth token value--->', JSON.stringify(json));
        if (json && json.status == true) {
          saveAuthToken(json?.data?.auth_token);
          setData(KAUthToken, json?.data?.auth_token);
          resolve(json?.data?.auth_token);
        } else {
          // // console.log('falsefalsefalse');
          resolve(false);
        }
      });
    } else {
      // // console.log('truetruetrue');
      resolve(accessToken);
    }
  });
};

export const post = async ({url, data, header = JSON_HEADER}) => {
  // // console.log('url-==-=-=-=-', url);
  const isConnected = await isNetworkAvailable();
  // // console.log('isConnectedisConnected', isConnected);
  // showToastMessage("You're offline \nPlease check internet connection.");
  if (!isConnected) {
    return INTERNET_FAILED;
  }

  let auth_token = {auth_token: null};
  // auth_token.auth_token = await methodFetchAccessToken();
  // // console.log('11-1--1-1-1--1');
  let params = {
    method: kPost,
    headers: {
      ...header,
      Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',

      ...auth_token,
    },
    body: data,
  };
  // // console.log(
  //   'Api url----------------------',
  //   BASE_URL + url,
  //   'params:- ',
  //   params,
  // );
  // // console.log('Api params----------------------', BASE_URL + url);

  // // console.log("Api global.userToken----------------------", global.userToken);
  try {
    const response = await fetch(BASE_URL + url, params);
    const json = await response.json();
    // // console.log('jsonjson', BASE_URL + url + JSON.stringify(json));
    if (
      response.status == 404 ||
      response.status == 401 ||
      response.status == 201 ||
      response.status == 402
    ) {
      logout(true);
      return json;
    }
    return json;
  } catch (error) {
    // // console.log('Api Failed----------------------', error);
    return API_FAILED;
  } finally {
    // // console.log('Api finally----------------------');
  }
};

export const get = async ({url}) => {
  const isConnected = await isNetworkAvailable();
  if (isConnected == false) {
    return INTERNET_FAILED;
  }
  let auth_token = {auth_token: null};
  auth_token.auth_token = await methodFetchAccessToken();
  // let auth_token = {
  //   auth_token: global.AuthToken
  //     ? global.AuthToken
  //     :"",
  // };
  let params = {
    method: kGet,
    headers: {
      JSON_HEADER,
      ...{Authorization: 'Bearer a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'},
      ...auth_token,
    },
  };
  // // console.log('Api url----------------------', BASE_URL + url);
  //  // console.log('Api params----------------------', params);
  try {
    const response = await fetch(BASE_URL + url, params);
    const json = await response.json();
    // // console.log('json------------------get', json);
    if (
      response.status == 404 ||
      response.status == 401 ||
      response.status == 201 ||
      response.status == 402
    ) {
      logout(true);
      return json;
    }
    return json;
  } catch (error) {
    // // console.log("Api Failed----------------------", error);
    return API_FAILED;
  } finally {
    // // console.log('Api finally----------------------');
  }
};
