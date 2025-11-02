import {APP_SETTINGS_DATA} from '../constants/appSettingType';

const initialState = {
  appGradient: ['#ac670d', '#ffe2a3', '#ac670d'],
  themeColor: '#daa75b',
  primary: '#111A20',
  secondary: '#ffffff',
  appSettingData: null,
};

const appSettingReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case APP_SETTINGS_DATA: {
      // // console.log("appSettingReducer payload", payload);

      return {
        ...state,
        appSettingData: payload,
      };
    }
    default:
      return state;
  }
};
export default appSettingReducer;
