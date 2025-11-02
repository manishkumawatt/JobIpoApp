import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Linking,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobMenu from '../../components/Job/JobMenu';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import LearningHeader from '../../components/LearningHeader';
import {VideoPlaySvgWhite} from '../JobSvgIcons';
import {showToastMessage} from '../../utils/Toast';
import {AUTH_TOKEN} from '../../appRedux/apis/commonValue';
import {loadingShow} from '../../appRedux/actions/loadingAction';
import {useDispatch} from 'react-redux';
import {ActivityIndicator} from 'react-native-paper';
const Learning = props => {
  const videos = [
    {id: '3hH8kTHFw2A', title: 'Mastering Data Structures and Algorithms'},
    {id: 'rfscVS0vtbw', title: 'Python Full Course for Beginners'},
    {id: 'Z1Yd7upQsXY', title: 'SQL Interview Preparation - Top Questions'},
    {id: 'Ukg_U3CnJWI', title: 'Top 10 React Interview Questions'},
  ];
  const {paramArr} = props?.route?.name;
  const [data, setData] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [imageArr, setImageArr] = useState([]);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoPosition, setVideoPosition] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreenModal, setIsFullscreenModal] = useState(false);
  const [showFsControls, setShowFsControls] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(false);
  const videoRef = React.useRef(null);
  const fullVideoRef = React.useRef(null);
  const positionRef = React.useRef(0);
  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        setisLoading(true);
        const sliderDataApi = await fetch(
          // 'https://jobipo.com/api/Agent/learning', --old api
          'https://jobipo.com/api/v3/get-learning',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${AUTH_TOKEN}`,
            },
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));
        if (sliderDataApi?.status == 'success') {
          // fetch only video items
          const imageArrays = sliderDataApi?.data?.training.filter(
            item => item.type === 'video',
          );
          setImageArr(imageArrays);

          setisLoading(false);
        } else {
          showToastMessage('Please check your internet connection.');
        }
      };

      let mount = true;

      if (mount) {
        GetDataFunc();
      }

      return () => {
        mount = false;
      };
    }, []),
  );

  const openVideo = url => setActiveVideoUrl(url);

  // Pause/cleanup video on screen blur or unmount to avoid crashes
  useFocusEffect(
    useCallback(() => {
      setIsPaused(false);
      return () => {
        setIsPaused(true);
      };
    }, []),
  );

  const formatTime = secs => {
    if (!secs || Number.isNaN(secs)) return '0:00';
    const total = Math.floor(secs);
    const m = Math.floor(total / 60);
    const s = total % 60;
    const padded = s < 10 ? `0${s}` : s;
    return `${m}:${padded}`;
  };
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {activeVideoUrl ? (
        <>
          <LearningHeader />
          <View style={styles.videoHeaderRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setActiveVideoUrl(null)}>
              <Icon name="arrow-back" size={28} color="#333" />
            </TouchableOpacity>
            <Text style={styles.videoTitle}>Now Playing</Text>
            <View style={{width: 28}} />
          </View>

          <View style={styles.fullscreenModalContainer}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                // If controls are visible, toggle them
                // If controls are hidden, close the fullscreen preview
                if (showFsControls) {
                  setShowFsControls(false);
                } else {
                  // Close fullscreen preview
                  setActiveVideoUrl(null);
                  setIsPaused(true);
                  setShowFsControls(true); // Reset controls state
                }
              }}
              style={styles.fullscreenWrapper}>
              <Video
                //  poster={
                //  FIREBASE_IMAGE_URL + content[currentIndex]?.thumb_image
                //  }
                // rate={speed}
                resizeMode="contain"
                onLoadStart={() => {
                  setIsVideoLoading(true);
                }}
                repeat={Platform.OS == 'ios' ? false : true}
                posterResizeMode={'contain'}
                controls={true}
                volume={10}
                ref={fullVideoRef}
                source={{uri: activeVideoUrl}}
                style={styles.fullscreenVideo}
                paused={isPaused}
                onLoad={data => {
                  setIsVideoLoading(false);
                  setVideoDuration(data.duration);
                  const seekTo = positionRef.current || videoPosition || 0;
                  if (
                    fullVideoRef?.current &&
                    typeof fullVideoRef.current.seek === 'function'
                  ) {
                    fullVideoRef.current.seek(seekTo);
                  }
                }}
                onProgress={prog => {
                  const ct = prog?.currentTime || 0;
                  positionRef.current = ct;
                  if (!isSeeking) setVideoPosition(ct);
                }}
                onEnd={() => {
                  // Close video when it completes in fullscreen mode
                  setIsFullscreenModal(false);
                  setIsPaused(true);
                  setActiveVideoUrl(null);
                  setShowFsControls(true); // Reset controls state
                }}
                onError={() => {
                  setIsVideoLoading(false);
                  showToastMessage('Video error');
                }}
              />

              {/* Video Loading Indicator */}
              {isVideoLoading && (
                <View style={styles.videoLoadingContainer}>
                  <View style={styles.videoLoadingContent}>
                    <ActivityIndicator size={'small'} />
                    <Text style={styles.videoLoadingText}>
                      Loading video...
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <LearningHeader />
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            {/* <Text style={styles.heading}>YouTube Videos</Text> */}

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size={'small'} />
                <Text style={styles.loadingText}>Loading videos...</Text>
              </View>
            ) : imageArr && imageArr.length > 0 ? (
              imageArr?.map((video, index) => (
                <View style={styles.maincontainer}>
                  <View key={index} style={styles.container}>
                    <TouchableOpacity
                      style={styles.videoContainer}
                      onPress={() => openVideo(video?.image)}>
                      <Image
                        source={{uri: video?.image}}
                        style={styles.thumbnail}
                      />
                      <Icon
                        name="play-circle-fill"
                        size={50}
                        color="#FF8D53"
                        style={styles.playIcon}
                      />
                    </TouchableOpacity>

                    <View style={styles.content}>
                      <Text style={styles.title}>{video?.title}</Text>
                      <TouchableOpacity
                        style={styles.watchNowContainer}
                        onPress={() => openVideo(video?.image)}>
                        <VideoPlaySvgWhite />
                        <Text style={styles.watchNowText}>Watch Now</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View style={styles.noDataContainer}>
                <Icon name="video-library" size={50} color="#ccc" />
                <Text style={styles.noDataText}>No learning videos found</Text>
                <Text style={styles.noDataSubText}>
                  Check back later for new content
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
      <JobMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 20,
    paddingTop: 10,
  },
  videoScreen: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoPlayer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
  },
  videoWrapper: {
    width: '100%',
    height: 250,
    position: 'relative',
  },
  controlsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fullscreenModalContainer: {
    flex: 1,
    // backgroundColor: '#000',
    // justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  fullscreenWrapper: {
    width: '100%',
    height: '50%',
    position: 'relative',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  fsHeaderRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  fullscreenCloseBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 18,
  },
  fsControlsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  fullscreenBackBtn: {
    position: 'absolute',
    top: 16,
    left: 12,
    zIndex: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 18,
  },
  seekRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    width: 42,
    textAlign: 'center',
    color: '#fff',
    fontWeight: '500',
  },
  seekSlider: {
    flex: 1,
    marginHorizontal: 8,
  },
  volumeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  muteBtn: {
    padding: 6,
    marginRight: 6,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  volumeSlider: {
    flex: 1,
    marginHorizontal: 8,
  },
  playPauseBtn: {
    marginLeft: 8,
    backgroundColor: '#FF8D53',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  videoHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    // elevation: 3,
    marginHorizontal: 10,
    marginBottom: 15,
    overflow: 'hidden',
    height: 120,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },

  videoContainer: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
  },
  playIcon: {
    position: 'absolute',
    zIndex: 1,
  },
  content: {
    width: '50%',
    padding: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  watchNowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF8D53',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  watchNowText: {
    fontSize: 14,
    color: '#fff',
    marginLeft: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: '50%',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#FF8D53',
  },
  noDataContainer: {
    alignItems: 'center',
    marginTop: '50%',
  },
  noDataText: {
    marginTop: 10,
    fontSize: 16,
    color: '#888',
    fontWeight: '600',
  },
  noDataSubText: {
    marginTop: 5,
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  videoLoadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  videoLoadingContent: {
    alignItems: 'center',
  },
  videoLoadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default Learning;
