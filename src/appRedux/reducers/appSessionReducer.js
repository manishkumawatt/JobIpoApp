import {
  WELCOME_DATA,
  DESTINATION,
  CURRENT_DESTINATION,
  MANGE_HOME_PROPS,
  OTHER_MOBILITY_EQUIPMENT,
  SCHEDULE_RIDE_DATE,
  FIND_DRIVER_DATA,
  RIDE_CANCEL_DATA_STORE,
  UPDATE_FAVORITE_LIST,
  ACCEPT_RIDE_STORE,
  DISTANCE_TIME,
} from '../constants/appSessionType';

const initialState = {
  WelcomeData: [],
  get_destination: {},
  current_destination: {},
  manage_home_props: '',
  other_mobility_equipment: {},
  schedule_ride_Date: '',
  find_driver_data: {},
  ride_cancel_data_store: [],
  update_favorite_list: false,
  accept_ride_store: {},
  distance_time: {},
};
const appSessionReducer = (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case WELCOME_DATA: {
      return {
        ...state,
        WelcomeData: payload,
      };
    }
    case DESTINATION: {
      // // console.log('payload-action-=-=-==-=----', action);
      // // console.log('payload-DESTINATION---', payload);
      return {
        ...state,
        get_destination: payload,
      };
    }
    case CURRENT_DESTINATION: {
      return {
        ...state,
        current_destination: payload,
      };
    }
    case MANGE_HOME_PROPS: {
      return {
        ...state,
        manage_home_props: payload,
      };
    }
    case OTHER_MOBILITY_EQUIPMENT: {
      return {
        ...state,
        other_mobility_equipment: payload,
      };
    }
    case SCHEDULE_RIDE_DATE: {
      return {
        ...state,
        schedule_ride_Date: payload,
      };
    }
    case FIND_DRIVER_DATA: {
      return {
        ...state,
        find_driver_data: payload,
      };
    }
    case RIDE_CANCEL_DATA_STORE: {
      return {
        ...state,
        ride_cancel_data_store: payload,
      };
    }
    case UPDATE_FAVORITE_LIST: {
      return {
        ...state,
        update_favorite_list: payload,
      };
    }
    case ACCEPT_RIDE_STORE: {
      return {
        ...state,
        accept_ride_store: payload,
      };
    }

    case DISTANCE_TIME: {
      return {
        ...state,
        distance_time: payload,
      };
    }

    default:
      return {...state};
  }
};

export default appSessionReducer;
