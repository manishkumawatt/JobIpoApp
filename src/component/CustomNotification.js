import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import fonts from "../theme/fonts";
import imagePath from "../theme/imagePath";
import ImageLoadView from "../utils/imageLoadView";
import { notificationNavigate } from "./NotificationNavigate";
import { IMAGE_URL } from "../appRedux/apis/commonValue";

const IsIos = Platform.OS === "ios";

const CustomNotification = () => {
  const [msg, setMsg] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    global.notificationPush = (data) => {
      if (!isMounted.current || global.chatToUser) return;
      setMsg(data);
      fadeIn();
    };

    return () => {
      isMounted.current = false;
    };
  }, []);

  const fadeIn = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: IsIos ? 100 : 90,
      duration: 500,
      useNativeDriver: true,
    }).start(() => fadeOut());
  }, [msg]);

  const fadeOut = useCallback(() => {
    Animated.sequence([
      Animated.delay(2500),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [msg]);

  const fadeOutFast = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!msg) return null;

  return (
    <View pointerEvents="box-none" style={styles.container}>
      <Animated.View
        pointerEvents={fadeAnim ? "box-none" : "box-only"}
        style={[
          styles.fadingContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim }],
          },
        ]}
      >
        <TouchableOpacity
          pointerEvents={fadeAnim ? "box-none" : "box-only"}
          disabled={!fadeAnim}
          onPress={() => {
            fadeOutFast();
            notificationNavigate(msg);
          }}
        >
          <View style={styles.header}>
            {msg?.profile_image ? (
              <ImageLoadView
                source={{ uri: IMAGE_URL + msg.profile_image }}
                style={styles.profileImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={imagePath.user}
                resizeMode="cover"
                style={styles.profileImage}
              />
            )}
            <Text numberOfLines={1} style={styles.fadingText}>
              {msg?.full_name}
            </Text>
          </View>

          <Text numberOfLines={1} style={styles.messageText}>
            {msg?.message_type === "TEXT"
              ? msg.body
              : msg?.message_type === "PDF"
              ? "PDF"
              : msg?.message_type === "DOCUMENT"
              ? "DOCUMENT"
              : "IMAGE"}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default CustomNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    width: "100%",
  },
  fadingContainer: {
    padding: 20,
    backgroundColor: "black",
    position: "absolute",
    top: IsIos ? -100 : -120,
    width: "100%",
  },
  fadingText: {
    fontSize: fonts.SIZE_13,
    color: "white",
    fontFamily: fonts.NunitoSans_Regular,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? 40 : 20,
  },
  profileImage: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    marginRight: 15,
  },
  messageText: {
    fontSize: 18,
    marginTop: 10,
    color: "#fff",
  },
});
