import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import ContentLoader, {Circle, Rect} from 'react-content-loader/native';
import Colors from '../theme/colors';
import {WINDOW_WIDTH} from '../theme/mixins';

export const RideListLoaderCard = ({length = 5}) => {
  return (
    <View style={{alignSelf: 'center', marginTop: 12}}>
      {new Array(length).fill(0).map((i, indx) => (
        <ContentLoader
          key={String(indx)}
          backgroundColor={Colors.secondary.CLOUDY_GREY}
          style={{...styles.aboveSurfaceShimmerLoader}}
          height={130}
          width={WINDOW_WIDTH - 48}>
          <Rect ry={8} width={WINDOW_WIDTH - 48} height={130} />
        </ContentLoader>
      ))}
    </View>
  );
};
export const ChatDetailSimmer = () => {
  return (
    <View
      style={{
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 10,
      }}>
      {[1, 2, 3, 4, 5, 6, 7].map((_, index) => (
        <View key={index} style={{alignItems: 'center', marginBottom: 0}}>
          <ContentLoader
            speed={1}
            width={WINDOW_WIDTH - 32}
            height={90}
            backgroundColor={Colors.secondary.CLOUDY_GREY}>
            <Circle cx="40" cy="45" r="25" y={15} />
            <Rect
              x={WINDOW_WIDTH / 2 + 30}
              y="0"
              rx="10"
              ry="10"
              width="35%"
              height="20"
            />
            <Rect x={75} y="50" rx="10" ry="10" width="35%" height="20" />
          </ContentLoader>
        </View>
      ))}
    </View>
  );
};
export const TransactionListLoader = ({length = 4}) => {
  return (
    <View style={{alignSelf: 'center', marginTop: 12}}>
      {new Array(length).fill(0).map((i, indx) => (
        <ContentLoader
          key={String(indx)}
          backgroundColor={Colors.secondary.CLOUDY_GREY}
          style={{marginBottom: 10}}
          height={80}
          width={WINDOW_WIDTH - 20}>
          <Circle cx="40" cy="45" r="28" />

          {/* Rectangular shimmer for the card content */}
          <Rect x="80" y="20" rx="10" ry="10" width="70%" height="15" />
          <Rect x="80" y="50" rx="8" ry="8" width="50%" height="13" />
        </ContentLoader>
        // <ContentLoader
        //   key={String(indx)}
        //   speed={1}
        //   width={WINDOW_WIDTH - 48}
        //   height={80} // Adjusted height to fit all elements
        //   backgroundColor={Colors.secondary.CLOUDY_GREY}
        //   foregroundColor="#e0e0e0">
        //   {/* Circular shimmer for the left image */}
        //   <Circle cx="40" cy="50" r="28" />

        //   {/* Rectangular shimmer for the card content */}
        //   <Rect x="80" y="20" rx="10" ry="10" width="70%" height="15" />
        //   <Rect x="80" y="50" rx="8" ry="8" width="50%" height="13" />
        //   {/* <Rect x="80" y="75" rx="8" ry="8" width="60%" height="12" /> */}
        //   {/* Row of three small boxes aligned just below the third row */}
        // </ContentLoader>
      ))}
    </View>
  );
};

export const RideDetailLoader = () => {
  return (
    <View style={{alignSelf: 'center', marginTop: 12}}>
      {/* {[1, 2, 3, 4, 5].map((i, indx) => ( */}
      <ContentLoader
        backgroundColor={Colors.secondary.CLOUDY_GREY}
        style={{...styles.aboveSurfaceShimmerLoader}}
        height={140}
        width={WINDOW_WIDTH - 48}>
        <Rect ry={8} width={WINDOW_WIDTH - 48} height={140} />
      </ContentLoader>

      <ContentLoader
        backgroundColor={Colors.secondary.CLOUDY_GREY}
        style={{marginBottom: 18}}
        height={22}
        width={WINDOW_WIDTH - 48}>
        <Rect ry={8} width={WINDOW_WIDTH - 48} height={22} />
      </ContentLoader>
      <ContentLoader
        backgroundColor={Colors.secondary.CLOUDY_GREY}
        style={{...styles.aboveSurfaceShimmerLoader}}
        height={20}
        width={WINDOW_WIDTH - 48}>
        <Rect ry={8} width={WINDOW_WIDTH - 48} height={20} />
      </ContentLoader>

      <ContentLoader
        backgroundColor={Colors.secondary.CLOUDY_GREY}
        style={{...styles.aboveSurfaceShimmerLoader}}
        height={80}
        width={WINDOW_WIDTH - 48}>
        <Rect ry={8} width={WINDOW_WIDTH - 48} height={80} />
      </ContentLoader>
      <ContentLoader
        backgroundColor={Colors.secondary.CLOUDY_GREY}
        style={{...styles.aboveSurfaceShimmerLoader}}
        height={20}
        width={180}>
        <Rect ry={8} width={180} height={20} />
      </ContentLoader>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <ContentLoader
          backgroundColor={Colors.secondary.CLOUDY_GREY}
          style={{marginBottom: 10}}
          height={20}
          width={100}>
          <Rect ry={8} width={100} height={20} />
        </ContentLoader>
        <ContentLoader
          backgroundColor={Colors.secondary.CLOUDY_GREY}
          style={{marginBottom: 10}}
          height={20}
          width={140}>
          <Rect ry={8} width={140} height={20} />
        </ContentLoader>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <ContentLoader
          backgroundColor={Colors.secondary.CLOUDY_GREY}
          style={{...styles.aboveSurfaceShimmerLoader}}
          height={20}
          width={100}>
          <Rect ry={8} width={100} height={20} />
        </ContentLoader>
        <ContentLoader
          backgroundColor={Colors.secondary.CLOUDY_GREY}
          style={{...styles.aboveSurfaceShimmerLoader}}
          height={20}
          width={140}>
          <Rect ry={8} width={140} height={20} />
        </ContentLoader>
      </View>
      <ContentLoader
        backgroundColor={Colors.secondary.CLOUDY_GREY}
        style={{...styles.aboveSurfaceShimmerLoader}}
        height={110}
        width={WINDOW_WIDTH - 48}>
        <Rect ry={8} width={WINDOW_WIDTH - 48} height={110} />
      </ContentLoader>

      <ContentLoader
        backgroundColor={Colors.secondary.CLOUDY_GREY}
        style={{...styles.aboveSurfaceShimmerLoader}}
        height={56}
        width={WINDOW_WIDTH - 48}>
        <Rect ry={8} width={WINDOW_WIDTH - 48} height={56} />
      </ContentLoader>
      {/* ))} */}
    </View>
  );
};

const styles = StyleSheet.create({
  aboveSurfaceShimmerLoader: {
    marginBottom: 20,
  },
});
