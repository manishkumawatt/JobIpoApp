/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import imagePath from '../theme/imagePath';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';

let userToken;
userToken = null;

// Calculate card size once
const screenWidth = Dimensions.get('window').width;
const cardSize = (screenWidth - 24 - 12) / 4; // Screen width - container padding (12*2) - spacing between cards (4*3)

const Products = ({navigation}) => {
  const [isLoading, setisLoading] = useState(true);
  const [brandsData, setBrandsData] = useState([]);

  useEffect(() => {
    setTimeout(async () => {
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // console.log(e);
      }
    }, 1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const GetDataFunc = async () => {
        setisLoading(true);
        var formdata = {categoryID: ''};
        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/category',
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
          setBrandsData(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).category,
          );
        }
      };

      if (isActive) {
        GetDataFunc();
      }

      return () => {
        isActive = false;
      };
    }, []),
  );

  // Finance & Insurance section data
  const financeInsuranceData = [
    {
      id: 1,
      title: 'Insurance',
      icon: imagePath.job_ipo,
    },
    {
      id: 2,
      title: 'BNPL / UPI / Wallets',
      icon: imagePath.Rectangle_1,
    },
    {
      id: 3,
      title: 'Credit Cards',
      icon: imagePath.cards,
    },
    {
      id: 4,
      title: 'FD Based Cards',
      icon: imagePath.black_cards,
    },
    {
      id: 5,
      title: 'Investments',
      icon: imagePath.Rectangle_3,
    },
    {
      id: 6,
      title: 'Gold/Digital Gold',
      icon: imagePath.bitcoin,
    },
    {
      id: 7,
      title: 'Credit Score Apps',
      icon: imagePath.credit_scor,
    },
  ];

  // Learning & Upskilling section data
  const learningUpskillingData = [
    {
      id: 1,
      title: 'Online Courses & Platforms',
      icon: imagePath.Rectangle_4,
    },
    {
      id: 2,
      title: 'Tech Bootcamps & Job Training',
      icon: imagePath.Rectangle_6,
    },
    {
      id: 3,
      title: 'Spoken English/ Communication',
      icon: imagePath.Rectangle13,
    },
    {
      id: 4,
      title: 'Interview & Resume Prep',
      icon: imagePath.Rectangle14,
    },
    {
      id: 5,
      title: 'Govt. Exams Preparation',
      icon: imagePath.Rectangle_5,
    },
    {
      id: 6,
      title: 'Freelancing & Side Hustle',
      icon: imagePath.Rectangle_7,
    },
    {
      id: 7,
      title: 'Personality & Mindset',
      icon: imagePath.Rectangle_8,
    },
  ];

  // E-Commerce & Cashback section data
  const ecommerceCashbackData = [
    {
      id: 1,
      title: 'General Marketplaces',
      icon: imagePath.product_1,
    },
    {
      id: 2,
      title: 'Beauty & Personal Care',
      icon: imagePath.product_2,
    },
    {
      id: 3,
      title: 'Fashion & Apparel',
      icon: imagePath.product_1,
    },
    {
      id: 4,
      title: 'Mobiles & Accessories',
      icon: imagePath.product_2,
    },
    {
      id: 5,
      title: 'Recharge & Cashback',
      icon: imagePath.product_1,
    },
    {
      id: 6,
      title: 'Food & Grocery Delivery',
      icon: imagePath.product_2,
    },
  ];

  // Travel & Bookings section data
  const travelBookingsData = [
    {
      id: 1,
      title: 'Hotels',
      icon: imagePath.product_1,
    },
    {
      id: 2,
      title: 'Flights',
      icon: imagePath.product_2,
    },
    {
      id: 3,
      title: 'Bus & Train',
      icon: imagePath.product_1,
    },
    {
      id: 4,
      title: 'Cabs & Rentals',
      icon: imagePath.product_2,
    },
    {
      id: 5,
      title: 'Tours & Visa',
      icon: imagePath.product_1,
    },
  ];

  // OTT & Digital Entertainment section data
  const ottDigitalEntertainmentData = [
    {
      id: 1,
      title: 'Video OTT',
      icon: imagePath.product_1,
    },
    {
      id: 2,
      title: 'Audio OTT / Knowledge App',
      icon: imagePath.product_2,
    },
    {
      id: 3,
      title: 'OTT Bundles & Combos',
      icon: imagePath.product_1,
    },
  ];

  // Electronics & Devices section data
  const electronicsDevicesData = [
    {
      id: 1,
      title: 'Laptops & Accessories',
      icon: imagePath.product_1,
    },
    {
      id: 2,
      title: 'Mobiles & Tablets',
      icon: imagePath.product_2,
    },
    {
      id: 3,
      title: 'Wearables/ Audio',
      icon: imagePath.product_1,
    },
    {
      id: 4,
      title: 'Cameras/ Content Gear',
      icon: imagePath.product_2,
    },
    {
      id: 5,
      title: 'Home & Kitchen Appliances',
      icon: imagePath.product_1,
    },
    {
      id: 6,
      title: 'Smart Devices & Accessories',
      icon: imagePath.product_2,
    },
  ];

  const renderCard = (item, index) => {
    const isLastInRow = (index + 1) % 4 === 0;
    const cardStyle = isLastInRow
      ? [styles.card, {marginRight: 0}]
      : [styles.card, {marginRight: 4}];

    return (
      <Pressable
        key={item.id}
        style={cardStyle}
        onPress={() => {
          if (item.title) {
            navigation.navigate('Accounts', {
              title: item.title,
              categoryID: item.id,
            });
          }
        }}>
        {item.icon && (
          <Image
            source={item.icon}
            style={styles.cardIcon}
            resizeMode="contain"
          />
        )}
        {item.title ? (
          <Text style={styles.cardText} numberOfLines={2}>
            {item.title}
          </Text>
        ) : null}
      </Pressable>
    );
  };

  const renderSection = (title, data, isFirst = false) => {
    return (
      <View style={styles.section}>
        <View
          style={[styles.sectionHeader, isFirst && styles.sectionHeaderFirst]}>
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        {data.length > 0 && (
          <View style={styles.cardGrid}>
            {data.map((item, index) => renderCard(item, index))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {renderSection('Finance & Insurance', financeInsuranceData, true)}
        {renderSection('Learning & Upskilling', learningUpskillingData)}
        {renderSection('E-Commerce & Cashback', ecommerceCashbackData)}
        {renderSection('Travel & Bookings', travelBookingsData)}
        {renderSection(
          'OTT & Digital Entertainment',
          ottDigitalEntertainmentData,
        )}
        {renderSection('Electronics & Devices', electronicsDevicesData)}
        <View style={styles.shopSection}>
          <View style={styles.shopContent}>
            <Text style={styles.shopText}>Shop</Text>
            <Text style={styles.shopText}>Cashback</Text>
            <View style={styles.repeatContainer}>
              <Text style={styles.shopText}>Repeat!</Text>
              <Icon
                name="heart"
                size={28}
                color="#FF6B35"
                style={styles.heartIcon}
              />
            </View>
            <Text style={styles.shopTagline}>Designed for smart shoppers.</Text>
          </View>
        </View>
        {/* Slogan Section */}
        {/* <View style={styles.sloganSection}>
          <View style={styles.sloganContainer}>
            <Text style={styles.sloganText}>Shop</Text>
            <Text style={styles.sloganText}>Cashback</Text>
            <View style={styles.repeatContainer}>
              <Text style={styles.sloganText}>Repeat!</Text>
              <FontAwesome
                name="heart"
                size={32}
                color="#FF0000"
                style={styles.heartIcon}
              />
            </View>
          </View>
          <Text style={styles.taglineText}>Designed for smart shoppers.</Text>
        </View> */}
      </ScrollView>
      <Menu />
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FCFF',
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    marginBottom: 16,
    paddingHorizontal: 4,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    borderStyle: 'dashed',
    paddingTop: 16,
  },
  sectionHeaderFirst: {
    borderTopWidth: 0,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#33334d',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  card: {
    backgroundColor: '#EDF7FF',
    width: Dimensions.get('window').width / 4 - 14,
    height: 125,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    // justifyContent: 'center',
    marginBottom: 12,
    margin: 4,
    borderWidth: 0.5,
    borderColor: '#E0E0E0',
    // elevation: 2,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 12,
    // overflow: 'hidden',
  },
  cardIcon: {
    width: 74,
    height: 83,
    marginTop: -10,
  },
  cardText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#33334d',
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 10,
  },
  sloganSection: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  sloganContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sloganText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#B0B0B0',
    lineHeight: 60,
    textAlign: 'center',
  },
  repeatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartIcon: {
    marginLeft: 8,
  },
  taglineText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#B0B0B0',
    textAlign: 'center',
    marginTop: 8,
  },
  shopSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  shopContent: {marginBottom: 20},
  shopText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#D0D0D0',
    // textAlign: 'center',
  },
  repeatContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartIcon: {
    marginLeft: 10,
  },
  shopTagline: {
    fontSize: 14,
    color: '#D0D0D0',
    marginTop: 15,
    fontWeight: '400',
  },
});
