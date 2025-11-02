//  dev

const BASE_URL = 'https://jobipo.com/api/';
const IMAGE_URL = 'https://demo.dev9server.com/dais-dev/';
const PRIVACY_POLICY = 'https://demo.dev9server.com/dais-dev/Privacy-Policy';
const TERMS_AND_CON = 'https://demo.dev9server.com/dais-dev/Terms-&-Conditions';
const ABOUT_US = 'https://demo.dev9server.com/dais-dev/page-view/About-Us';
const AUTH_TOKEN = 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6';

const kInternetError = "You're offline \n Please check internet connection.";
const kSorryError = 'Sorry, something wrong.';
const kStatus = 'status';
const kMessage = 'message';
const kTrue = true;
const kFalse = false;
const kPost = 'POST';
const kGet = 'GET';
const kPut = 'PUT';
const kUserToken = 'user_token';
const kUserData = 'userData';
const kRememberData = 'remember_me_data';
const kUserFilterData = 'userFilterData';
const kAndroidProminent = 'androidProminent';
const KAUthToken = 'auth_token';
const kUserType = 'user_type';
const kIntroStatus = 'isIntroDone';

const JSON_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};
const MULTI_PART_HEADER = {
  Accept: 'application/json',
  'Content-Type': 'multipart/form-data',
};
const API_FAILED = {
  status: false,
  message: kSorryError,
};
const INTERNET_FAILED = {
  status: false,
  message: kInternetError,
};
export {
  BASE_URL,
  IMAGE_URL,
  JSON_HEADER,
  MULTI_PART_HEADER,
  INTERNET_FAILED,
  API_FAILED,
  kStatus,
  kTrue,
  kFalse,
  kMessage,
  kInternetError,
  kSorryError,
  kPost,
  kGet,
  kPut,
  kUserData,
  kUserToken,
  kRememberData,
  kUserFilterData,
  PRIVACY_POLICY,
  TERMS_AND_CON,
  ABOUT_US,
  kAndroidProminent,
  KAUthToken,
  kUserType,
  kIntroStatus,
  AUTH_TOKEN,
};
