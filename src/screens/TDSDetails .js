import React from 'react';
import { View, Text,ScrollView, TouchableOpacity, StyleSheet, Image, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Play icon
import { Header2 as Header } from '../components/Header';
import Menu from '../components/Menu';

const TDSDetails = () => {
  const handlePlayVideo = () => {
    // const videoUrl = 'https://www.youtube.com/watch?v=2AxaAxRG7gE';
    const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

    Linking.openURL(videoUrl).catch(err => console.error("Couldn't load page", err));
  };
  const data = [
    { heading: 'Quarter - 1', subHeading: ' April 2023 - June 2024' },
    { heading: 'Quarter - 2', subHeading: ' July 2024 - September 2025' },
    { heading: 'Quarter - 3', subHeading: ' April 2025 - June 2026' },
    { heading: 'Quarter - 4', subHeading: 'July 2026 - September 2027' },
    { heading: 'Quarter - 5', subHeading: 'April 2027 - June 2028' },
  ];
  return (
    <>
                {/* <Header title= 'TDS Details ' /> */}
    
        <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.container}>
      <View style={styles.videoContainer}>
        <Image
          source={{ uri: 'https://img.youtube.com/vi/2AxaAxRG7gE/0.jpg' }} 
          style={styles.videoThumbnail}
        />
        <TouchableOpacity 
          onPress={handlePlayVideo}
          style={styles.playButton}
        >
          <Icon name="play-arrow" size={50} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.leftSection}>
            <Text style={styles.heading}>Financial Year</Text>
            <Text style={styles.subHeading}>2023 - 2024</Text>
          </View>

          <View style={styles.rightSection}>
            <TouchableOpacity onPress={() => alert('Download initiated')} >
              <Text><Icon name="arrow-drop-down" size={40} color="#000" /></Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {data.map((item, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.leftSection}>
              <Text style={styles.heading}>{item.heading}</Text>
              <Text style={styles.subHeading}>{item.subHeading}</Text>
            </View>

            <View style={styles.rightSection}>
              <TouchableOpacity onPress={() => alert('Download initiated')} style={styles.downloadButton}>
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </View>
        </ScrollView>
        <Menu/>
    </>
 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
    paddingBottom:80,
  },
  ScrollViewcontainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 16,
    backgroundColor: '#ccc',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  playButton: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    borderRadius: 50,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginVertical:5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  heading: {
    fontSize: 18,
    fontWeight: '400',
    color: '#333',
  },
  subHeading: {
    fontSize: 13,
    color: '#666',
    marginTop:2,
  },
  rightSection: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  downloadButton: {
    backgroundColor: '#0d4574',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  downloadText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default TDSDetails;
