import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import {PDFIconRed, DownloadIcon, BackArrowIcon} from '../JobSvgIcons';
import LearningHeader from '../../components/LearningHeader';
import {ScrollView} from 'react-native';
import JobMenu from '../../components/Job/JobMenu';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
// import {PicturesDirectoryPath} from 'react-native-fs';
import RNFS, {
  // named exports if provided by the package
  PicturesDirectoryPath,
  DocumentDirectoryPath,
  writeFile,
  readFile,
  // …other exports
} from '@exodus/react-native-fs';
import {loadingShow} from '../../appRedux/actions/loadingAction';
import {showToastMessage} from '../../utils/Toast';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {AUTH_TOKEN} from '../../appRedux/apis/commonValue';

const PdfComponent = () => {
  const dummyData = Array(2).fill({
    title: '70-hour work week, does it make sense?',
  });

  const [pdfArr, setPdfArr] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [activePdfUrl, setActivePdfUrl] = useState(null);
  const [activeImageUrl, setActiveImageUrl] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    setisLoading(true);
    GetDataFunc();
  }, []);
  // useFocusEffect(
  //   useCallback(() => {
  //     let mount = true;

  //     if (mount) {
  //       GetDataFunc();
  //     }

  //     return () => {
  //       mount = false;
  //     };
  //   }, []),
  // );
  const GetDataFunc = async () => {
    // setisLoading(true);
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
      .catch(err => {
        setisLoading(false);
      });
    if (sliderDataApi?.status == 'success') {
      setisLoading(false);
      const pdfAndImageArrays = sliderDataApi?.data?.training.filter(
        item => item.type === 'pdf' || item.type === 'image',
      );
      setPdfArr(pdfAndImageArrays);

      setisLoading(false);
    } else {
      setisLoading(false);
      showToastMessage('Please check your internet connection.');
    }
  };
  const downloadImage = (url, type) => {
    // dispatch(loadingShow(true));
    // if (!url) {
    //   return;
    // }
    let date = new Date();
    let image_URL = url;

    let ext = getExtention(image_URL);
    ext = '.' + ext[0];
    const {config, fs, ios} = ReactNativeBlobUtil;
    let PictureDir =
      Platform.OS == 'android' ? PicturesDirectoryPath : fs.dirs.DocumentDir;

    const iosConfig = {
      fileCache: true,
      appendExt: ext,
      path:
        PictureDir +
        '/' +
        type +
        '_' +
        Math.floor(date.getTime() + date.getSeconds() / 2) +
        ext,
      useDownloadManager: true,
    };
    const androidConfig = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path:
          PictureDir +
          '/' +
          type +
          '_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          ext,
        description: 'File download',
      },
    };
    const configOptions = Platform.select({
      ios: iosConfig,
      android: androidConfig,
    });

    config(configOptions)
      .fetch('GET', image_URL)
      .then(res => {
        setisLoading(false);
        if (Platform.OS == 'ios') {
          fs.writeFile(iosConfig.path, res.data, 'base64');
          ios.previewDocument(iosConfig.path);
        } else {
          showToastMessage('Downloaded Successfully.', 'success');
        }
        // Showing alert after successful downloading
        // // console.log("res -> ", JSON.stringify(res));
      })
      .catch(error => {
        showToastMessage('File could not be downloaded');
      });
  };
  // // console.log('pdfArr-=-=--=', pdfArr);
  const getExtention = filename => {
    // To get the file extension
    return /[.]/.exec(filename) ? /[^.]+$/.exec(filename) : undefined;
  };
  const PdfCard = ({title, image, type}) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        {type === 'pdf' ? (
          <View style={{paddingVertical: 38}}>
            <PDFIconRed />
          </View>
        ) : (
          <Image
            source={{uri: image}}
            resizeMode="cover"
            style={styles.imagePreview}
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.openBtn}
            onPress={() => {
              if (type === 'pdf') {
                setActivePdfUrl(image);
              } else {
                setActiveImageUrl(image);
              }
            }}>
            <Text style={styles.openBtnText}>Open Now</Text>
          </TouchableOpacity>
          <TouchableOpacity
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            activeOpacity={0.6}
            style={styles.downloadBtn}
            onPress={() => downloadImage(image, type)}>
            <DownloadIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  return (
    <View style={{flex: 1}}>
      {activePdfUrl ? (
        <View style={styles.pdfScreen}>
          <LearningHeader />
          <View style={styles.pdfHeaderRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setActivePdfUrl(null)}>
              <BackArrowIcon size={30} />
            </TouchableOpacity>
            <Text style={styles.pdfTitle}>Document</Text>
            <View style={{width: 60}} />
          </View>
          <View style={styles.pdfContainer}>
            <Pdf
              source={{uri: activePdfUrl, cache: true}}
              style={styles.pdf}
              trustAllCerts={false}
              onError={() => showToastMessage('Unable to render PDF')}
            />
          </View>
          <JobMenu />
        </View>
      ) : activeImageUrl ? (
        <View style={styles.imageScreen}>
          <LearningHeader />
          <View style={styles.imageHeaderRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setActiveImageUrl(null)}>
              <BackArrowIcon size={30} />
            </TouchableOpacity>
            <Text style={styles.imageTitle}>Image</Text>
            <View style={{width: 60}} />
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: activeImageUrl}}
              style={styles.fullImage}
              resizeMode="contain"
            />
          </View>
          <JobMenu />
        </View>
      ) : (
        <View style={{flex: 1}}>
          <LearningHeader />

          <View
            style={{
              backgroundColor: '#F5F4FD',
              paddingBottom: 12,
              flex: 1,
              paddingTop: 10,
            }}>
            <FlatList
              data={pdfArr}
              keyExtractor={(_, i) => i.toString()}
              renderItem={({item}) => <PdfCard {...item} />}
              contentContainerStyle={{padding: 10}}
            />
          </View>

          <JobMenu />
        </View>
      )}
      {isLoading ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            position: 'absolute',
            zIndex: 5,
            left: 0,
            right: 0,
            top: '40%',
          }}>
          <ActivityIndicator size="large" color="#535353" />
        </View>
      ) : (
        <View />
      )}
    </View>
  );
};

export default PdfComponent;

const styles = StyleSheet.create({
  pdfScreen: {
    flex: 1,
    backgroundColor: '#F5F4FD',
  },
  pdfHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backBtn: {
    backgroundColor: '#FF8D53',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  pdfTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pdf: {
    flex: 1,
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  iconContainer: {
    width: '50%',
    // height: 50,
    borderWidth: 0.5,
    borderColor: '#D0D0D0',
    backgroundColor: '#ECECF5',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    // paddingVertical: 30,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  openBtn: {
    backgroundColor: '#3C3C3C',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
  },
  openBtnText: {
    color: '#fff',
    fontSize: 12,
  },
  downloadBtn: {
    backgroundColor: '#FF8D53',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  imageScreen: {
    flex: 1,
    backgroundColor: '#F5F4FD',
  },
  imageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  imageContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  imagePreview: {
    width: '100%',
    height: 115,
    borderRadius: 10,
  },
});
