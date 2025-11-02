import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  FlatList,
  Pressable,
  Share,
  Linking,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import {useColorScheme} from 'react-native';
import {showToastMessage} from '../utils/Toast';
const {width} = Dimensions.get('window');
const height = width * 0.3;
const Sliders = props => {
  const [images, setimages] = useState([
    'https://jobipo.com/uploads/slider/1666088609-0e3673fb-047c-b08b-49d2-e397906a2a84.png',
  ]);

  const GetDataFunc = async () => {
    // loginState.isLoading = true;
    const sliderDataApi = await fetch('https://jobipo.com/api/Agent/index', {
      method: 'GET',
    })
      .then(res => res.json())
      .catch(err => console.log(err));

    if (sliderDataApi) {
      if (sliderDataApi.logout != 1) {
        setimages(
          JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).slider,
        );
      } else {
        navigation.navigate('Login');
      }
    } else {
      showToastMessage('Please check your internet connection.');
    }
  };

  GetDataFunc();

  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ScrollView
      scrollEnabled={false}
      contentContainerStyle={{
        position: 'relative',
        flex: 1,
      }}>
      <View style={style.container}>
        <ScrollView
          pagingEnabled
          horizontal
          onScroll={() => {
            if (images.length > 0) {
              this.change;
            }
          }}
          showsHorizontalScrollIndicator={false}
          style={style.scroll}>
          {images?.map((image, index) => (
            <Image key={index} source={{uri: image}} style={style.image} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const style = StyleSheet.create({
  container: {marginTop: 0, width, height},
  scroll: {width: width - 40, height},
  image: {width: width - 40, height, resizeMode: 'cover'},
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
  },
  pagingText: {fontSize: width / 30, color: '#888', margin: 3},
  pagingActiveText: {fontSize: width / 30, color: '#fff', margin: 3},
});

export default Sliders;
