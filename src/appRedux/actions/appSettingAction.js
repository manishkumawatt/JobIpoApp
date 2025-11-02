import {APP_SETTINGS_DATA} from '../constants/appSettingType';

export function saveAppSettingData(data) {
  return {
    type: APP_SETTINGS_DATA,
    payload: data,
  };
}
