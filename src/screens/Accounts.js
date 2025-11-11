/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useState, useCallback, useContext} from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/context';

const {width} = Dimensions.get('window');

const Accounts = ({navigation, route}) => {
  const {params} = route;
  const {signOut} = useContext(AuthContext);
  // const [brandsData, setBrandsData] = useState([]);
  const [categoriesData, setCategoriesData] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [isLoading, setisLoading] = useState(true);

  // Mock categories data - replace with API call if available
  const insuranceCategories = [
    {
      id: 1,
      title: 'Term Plans',
      icon: require('../assests/Insurance.png'),
    },
    {
      id: 2,
      title: 'Health Insurance',
      icon: require('../assests/Insurance.png'),
    },
    {
      id: 3,
      title: 'Job Loss Insurance',
      icon: require('../assests/Insurance.png'),
    },
    {
      id: 4,
      title: 'Two Wheeler Insurance',
      icon: require('../assests/Insurance.png'),
    },
    {
      id: 5,
      title: 'Four Wheeler Insurance',
      icon: require('../assests/Insurance.png'),
    },
    {
      id: 6,
      title: 'Travel Insurance',
      icon: require('../assests/Insurance.png'),
    },
  ];
  const brandsData = [
    {
      id: 1,
      title: 'Term Plans',
      icon: require('../assests/Insurance.png'),
    },
    {
      id: 2,
      title: 'Health Insurance',
      icon: require('../assests/Insurance.png'),
    },
    {
      id: 3,
      title: 'Job Loss Insurance',
      icon: require('../assests/Insurance.png'),
    },
    {
      id: 4,
      title: 'Two Wheeler Insurance',
      icon: require('../assests/Insurance.png'),
    },
    {
      id: 5,
      title: 'Four Wheeler Insurance',
      icon: require('../assests/Insurance.png'),
    },
    {
      id: 6,
      title: 'Travel Insurance',
      icon: require('../assests/Insurance.png'),
    },
  ];
  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const GetDataFunc = async (categoryId = null) => {
        setisLoading(true);
        var formdata = {categoryID: categoryId || params.categoryID};
        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/brands',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formdata),
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));
        setisLoading(false);
        if (sliderDataApi && sliderDataApi.logout != 1) {
          // setBrandsData(
          //   JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).brands,
          // );
        } else {
          signOut();
        }
      };

      if (isActive) {
        setCategoriesData(insuranceCategories);
        setSelectedCategoryId(insuranceCategories[0]?.id);
        GetDataFunc(insuranceCategories[0]?.id);
      }

      return () => {
        isActive = false;
      };
    }, [params.categoryID]),
  );

  const handleCategorySelect = categoryId => {
    setSelectedCategoryId(categoryId);
    // const GetDataFunc = async () => {
    //   setisLoading(true);
    //   var formdata = {categoryID: categoryId};
    //   const sliderDataApi = await fetch('https://jobipo.com/api/Agent/brands', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(formdata),
    //   })
    //     .then(res => res.json())
    //     .catch(err => console.log(err));
    //   setisLoading(false);
    //   if (sliderDataApi && sliderDataApi.logout != 1) {
    //     setBrandsData(
    //       JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).brands,
    //     );
    //   } else {
    //     signOut();
    //   }
    // };
    // GetDataFunc();
  };

  const renderCategoryItem = ({item}) => {
    const isSelected = selectedCategoryId === item.id;
    return (
      <Pressable
        onPress={() => handleCategorySelect(item.id)}
        style={[
          styles.categoryCard,
          isSelected && styles.categoryCardSelected,
        ]}>
        <Image
          source={item.icon}
          style={styles.categoryIcon}
          resizeMode="contain"
        />
        <Text
          style={[
            styles.categoryText,
            isSelected && styles.categoryTextSelected,
          ]}>
          {item.title}
        </Text>
      </Pressable>
    );
  };

  const renderBrandItem = ({item}) => {
    return (
      <Pressable
        onPress={() => {
          navigation.navigate('Product', {
            title: params.title,
            productId: item.productId,
          });
        }}
        style={styles.brandCard}>
        <Text style={styles.brandName} numberOfLines={2}>
          {item.title}
        </Text>
        <Image
          source={{uri: item.image}}
          style={styles.brandLogo}
          resizeMode="contain"
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          isLoading == true
            ? {
                position: 'absolute',
                height: '100%',
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.4)',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 5,
              }
            : {
                display: 'none',
              },
        ]}>
        <ActivityIndicator size="large" />
      </View>
      <Header title={params.title || 'Insurance'} />
      <View style={styles.contentContainer}>
        {/* Left Sidebar - Categories */}
        <View style={styles.sidebar}>
          <FlatList
            data={categoriesData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderCategoryItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.sidebarContent}
          />
        </View>

        {/* Main Content - Brands Grid (2 columns) */}
        <View style={styles.mainContent}>
          <FlatList
            data={brandsData}
            keyExtractor={item =>
              item.productId?.toString() || item.id?.toString()
            }
            renderItem={renderBrandItem}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            // contentContainerStyle={styles.brandsGrid}
            // columnWrapperStyle={styles.brandRow}
          />
        </View>
      </View>
      <Menu />
    </View>
  );
};

export default Accounts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FCFF',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    // width: width * 0.33,
    backgroundColor: '#59C1EE',
  },
  sidebarContent: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingBottom: 100,
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 125,
    width: 82,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  categoryCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: 'white',
    borderWidth: 5,
  },
  categoryIcon: {
    width: 45,
    height: 45,
    marginBottom: 10,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#33334d',
    textAlign: 'center',
    lineHeight: 16,
  },
  categoryTextSelected: {
    color: '#2196F3',
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F6FCFF',
    padding: 12,
  },
  brandsGrid: {
    paddingBottom: 80,
  },
  brandRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  brandCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    height: 156,
    width: '45%',
    margin: 5,
  },
  brandName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#33334d',
    textAlign: 'center',
    marginBottom: 12,
    minHeight: 40,
    lineHeight: 18,
  },
  brandLogo: {
    width: '85%',
    height: '60%',
    flex: 1,
  },
});
