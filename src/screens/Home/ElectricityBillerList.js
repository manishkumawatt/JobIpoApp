import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, StatusBar,Pressable, TextInput, FlatList } from 'react-native';
import { Header2 as Header } from '../../components/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ElectricityBillerList = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');

  const providers = [
    { id: '1', name: 'BSES Rajdhani', image: 'https://tse3.mm.bing.net/th?id=OIP.uHPRjnu8uVVkxrNCuRFkvQHaCP&pid=Api&P=0&h=180' },
    { id: '2', name: 'Tata Power', image: 'https://logovtor.com/wp-content/uploads/2020/04/tata-power-logo-vector.png' },
    { id: '3', name: 'Adani Electricity', image: 'https://aniportalimages.s3.amazonaws.com/media/details/JfDoylIL_400x400_599YUIl.jpg' },
    { id: '4', name: 'Torrent Power', image: 'https://tse2.mm.bing.net/th?id=OIP.8B_fQGoCOnh6gVfmYtlVYAAAAA&pid=Api&P=0&h=180' },
    { id: '5', name: 'CESC Limited', image: 'https://bl-i.thgim.com/public/incoming/ryt0ry/article66536119.ece/alternates/FREE_1200/CESC.jfif' },
  ];

  const filteredProviders = providers.filter((provider) =>
    provider.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderProvider = ({ item }) => (
    <Pressable
      style={styles.mainrow}
      onPress={() => navigation.navigate('ElectricIVRS', { title: item.name })}
    >
      <View style={styles.Imagecontainer}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{item.name}</Text>
      </View>
    </Pressable>
  );

  return (
    <>
      {/* <Header title="Select Electricity Provider" /> */}
          {/* <StatusBar backgroundColor="#0d4574" barStyle="light-content" /> */}

      <View style={styles.container}>
      <View  style={styles.headercontainer}>
      <View style={styles.searchBarContainer}>
      <Pressable onPress={()=>navigation.goBack()}>
      <Ionicons name="arrow-back-outline" size={25} color="#666" style={styles.searchIcon} />

      </Pressable>
          <TextInput
            style={styles.searchBar}
            placeholder="Search by biller"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>
        

        <FlatList
          data={filteredProviders}
          keyExtractor={(item) => item.id}
          renderItem={renderProvider}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
  },
  headercontainer:{
     padding:5,
     backgroundColor: '#0d4574',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffff',
    borderRadius: 17,
    paddingHorizontal: 10,
   marginVertical:10,
    borderWidth: 0.5,
    borderColor: '#0d4574',
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 15,
  },
  searchIcon: {
    marginRight: 8,
  },
  mainrow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal:16,
    borderRadius: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    marginBottom: 1,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 16,
  },
  textContainer: {
    marginHorizontal: 20,
  },
  text: {
    fontSize: 16,
    color: '#000',
  },
});

export default ElectricityBillerList;
