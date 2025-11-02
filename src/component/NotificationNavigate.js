export const NAVIGATE_ACTION = {
  CHAT_MESSAGE: 'CHAT_MESSAGE',
  CHAT_SCREEN: 'CHAT_SCREEN',
  CHAT: 'CHAT',
  GROUP_CHAT: 'GROUP_CHAT',
  CALL_NOTIFICATION: 'CALL_NOTIFICATION',
};

export const notificationNavigate = (props, str) => {
  // // console.log('props-=--', props);
  let rider = {
    uuid: props?.user_id,
  };
  let driver = {
    full_name: props?.full_name,
    profile_image: props?.profile_image,
    uuid: props?.other_user_id,
    id: props?.id,
  };
  switch (props?.type) {
    case NAVIGATE_ACTION.CHAT_SCREEN:
      global.navRef.navigate({
        name: 'ChatScreen',
        navigation: global.navRef,
        params: {
          fromFadeNotification: true,
          userData: {
            id: props?.id,
            rider,
            driver,
          },
        },
      });
      return;

    default:
      return;
  }
};
