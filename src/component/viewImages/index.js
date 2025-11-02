import {
  View,
  Text,
  Image,
  FlatList,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import styles from './styles';
const {width} = Dimensions.get('window');
// import Pdf from "react-native-pdf";
import {TouchableOpacity} from 'react-native';
import ImageLoadView from '../../utils/imageLoadView';
import Header from '../../components/Header';
// import Pinchable from "react-native-pinchable";
import Entypo from 'react-native-vector-icons/Entypo';

const ViewImages = props => {
  const flatListRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  let {image} = props?.route?.params;

  const [imgArr, setImgArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // // console.log('profiles', image);
  // const renderItem = ({ item, index }) => {
  //   return (
  //     <Pinchable minimumZoomScale={0.1}>
  //       <Image
  //         resizeMode="contain"
  //         source={}
  //         style={styles.viewer_view}
  //       />
  //     </Pinchable>
  //   );
  // };
  return (
    <View style={styles.container}>
      <View style={{marginHorizontal: 10, marginTop: 20, marginBottom: 10}}>
        <Pressable onPress={() => props?.navigation.goBack()}>
          <Entypo name="chevron-thin-left" color="#535353" size={30} />
        </Pressable>
      </View>

      <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
        <ImageLoadView
          resizeMode="contain"
          source={{uri: image}}
          style={styles.viewer_view}
        />
      </View>
    </View>
  );
};

export default ViewImages;
