import { combineReducers } from "redux";
import userSessionReducer from "./userSessionReducer";
import loadingReducer from "./loadingReducer";     
import appSessionReducer from "./appSessionReducer";
import appSettingReducer from "./appSettingReducer";

const rootReducer = combineReducers({
  session: userSessionReducer,
  loading: loadingReducer,
  appSession: appSessionReducer,
  appSettingReducer: appSettingReducer,
});
export default rootReducer;
