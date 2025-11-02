import React from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Platform} from 'react-native';

const KeyboardScroll = props => {
  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps={'handled'}
      bounces={false}
      enableAutomaticScroll={true}
      enableOnAndroid={true}
      extraScrollHeight={Platform.OS === 'android' ? 20 : 0}
      keyboardOpeningTime={Platform.OS === 'android' ? 250 : 0}
      enableResetScrollToCoords={false}
      {...props}></KeyboardAwareScrollView>
  );
};

export default KeyboardScroll;
