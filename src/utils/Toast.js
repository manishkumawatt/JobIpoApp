import {duration} from 'moment';
import {showMessage, hideMessage} from 'react-native-flash-message';

export function showToastMessage(message, type = 'danger', duration) {
  showMessage({
    message: message,
    type: type,
    duration: duration ? 6000 : 2750,

    style: {
      paddingTop: 40,
      backgroundColor: type == 'danger' ? '#D7373F' : '#FF8D53',
      // height: 50,
    },
  });
}
