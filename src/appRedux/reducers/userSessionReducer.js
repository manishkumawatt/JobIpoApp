import {  COUSTMER_SEETING, USER_DATA_KEY } from "../constants/userSessionType";

const initialState = {
  userData: null,
  coustmer_setting:null
};

const userSessionReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case USER_DATA_KEY: {
      return {
        ...state,
        userData: payload,
      };
    }
    case COUSTMER_SEETING: {
      return {
        ...state,
        coustmer_setting: payload,
      };
    }
   

    default:
      return { ...state };
  }
};
export default userSessionReducer;
