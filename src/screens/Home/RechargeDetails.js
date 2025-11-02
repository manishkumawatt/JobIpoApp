import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Header2 as Header} from '../../components/Header';
import {useFocusEffect} from '@react-navigation/native';
//import PhonePePaymentSDK from 'react-native-phonepe-pg'
const RechargeDetails = ({navigation, route}) => {
  const rechargeData = [
    {
      id: '1',
      plan: '₹199',
      validity: '28 Days',
      data: '1.5GB/Day',
      label: 'Best 5G Plan | 90 Days',
      totalData: '42GB',
      highSpeedData: '1.5GB/day',
      voice: 'Unlimited Calls',
      sms: '100 SMS/day',
      extraPoints: [
        'Free OTT subscription',
        'Unlimited free SMS for the first 15 days',
        'Recharge with ₹199 and get ₹10 cashback on your next recharge',
        'unlimited 5G data for eligible subscribers',
      ],
    },
    {
      id: '2',
      plan: '₹399',
      validity: '56 Days',
      data: '2GB/Day',
      label: 'Popular 5G Plan',
      totalData: '112GB',
      highSpeedData: '2GB/day',
      voice: 'Unlimited Calls',
      sms: '100 SMS/day',
      extraPoints: [
        'Access to premium content',
        'Unlimited free calls to any network across India',
        'Get 2GB additional high-speed data every day for 30 days',
      ],
    },
    {
      id: '3',
      plan: '₹599',
      validity: '84 Days',
      data: '1.5GB/Day',
      label: '',
      totalData: '126GB',
      highSpeedData: '1.5GB/day',
      voice: 'Unlimited Calls',
      sms: '100 SMS/day',
      extraPoints: [
        'Free caller tunes',
        'International roaming benefits',
        'Get 1000 free SMS every month',
        'Recharge with ₹599 and get ₹50 cashback on your next recharge',
      ],
    },
    {
      id: '4',
      plan: '₹999',
      validity: '365 Days',
      data: '2.5GB/Day',
      label: 'Top Value Plan',
      totalData: '912.5GB',
      highSpeedData: '2.5GB/day',
      voice: 'Unlimited Calls',
      sms: '100 SMS/day',
      extraPoints: ['Priority customer support', 'Unlimited night data'],
    },
  ];

  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState();
  const [isLoading, setisLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [operator, setOperator] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        const sliderDataApi = await fetch(
          `https://jobipo.com/api/Agent/rechselOperator`,
          {
            method: 'POST',
            body: JSON.stringify({
              mobile: route.params.mobile,
            }),
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));

        if (sliderDataApi.status === 1) {
          // // console.log(JSON.parse(JSON.stringify(sliderDataApi)))
          setFilteredData(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg),
          );

          setOperator(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).operator),
          );

          setSelectedTab(
            Object.keys(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).info,
            )[0],
          );

          setisLoading(false);
        } else {
          setFilteredData([]);
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

  // // console.log(filteredData, 'filteredData')

  const handleSearch = text => {
    setSearchText(text);
    const filtered = rechargeData.filter(
      item =>
        item.plan.includes(text) ||
        item.validity.toLowerCase().includes(text.toLowerCase()) ||
        item.data.toLowerCase().includes(text.toLowerCase()),
    );
    setFilteredData(filtered);
  };

  // https://jobipo.com/api/Agent/rechargeplink
  // rechargeplink
  // planDetails
  // operator
  // canumber
  // amount

  // echo json_encode(array('status' => 1, 'msg' => json_encode($response), 'circle' => $response -> info -> circle, 'operator' => $response -> info -> operator)); exit;
  const handlePlan = async item => {
    // setPaymentLoading(true);

    // // console.log(item, 'item')
    // console.log(operator, 'operator')
    // console.log(route.params.mobile, 'mobile number');

    navigation.navigate('Payment', {
      planDetails: item,
      operator: operator,
      canumber: route.params.mobile,
    });

    // const res = await PhonePePaymentSDK.init('SANDBOX', 'M22DF5V2WDKTU', '1234556', true)

    // const authToken = await fetchAuthToken();
    // const order = await createOrder();

    // await PhonePePaymentSDK.startTransaction('').then((res) => {
    //   if (res) {
    //     // console.log(res)
    //   }
    // }).finally(() => {
    //   setPaymentLoading(false);
    // })
  };

  const fetchAuthToken = async () => {
    const res = await fetch(
      'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: 'TEST-M22DF5V2WDKTU_25043',
          client_version: '1',
          client_secret: 'OTNkOTU1NzYtNDU0Yi00NDcxLWI3NDQtOTNlZmFhNDYyYTAy',
          grant_type: 'client_credentials',
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    ).then(response => response.json());

    return res;
  };

  const createOrder = async () => {
    const res = await fetch(
      'https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/sdk/order',
      {
        method: 'POST',
        body: JSON.stringify({
          merchantOrderId: 'TEST-M22DF5V2WDKTU_25043',
          amount: '100',
          paymentFlow: {},
          'paymentFlow.type': 'PG_CHECKOUT',
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer <access_token>',
        },
      },
    ).then(response => response.json());

    return res;
  };

  const renderItem = ({item}) => {
    // Guard against undefined item
    if (!item) {
      return null;
    }

    return (
      <View style={styles.card}>
        {item?.offer ? (
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>{item.offer}</Text>
          </View>
        ) : null}

        <View style={styles.cardDetails}>
          <Text style={styles.plan}>Rs.{item?.rs || '0'}</Text>
          <View>
            <Text style={styles.validity}>
              {item?.validity == 'N/A'
                ? 'Current Plan'
                : item?.validity || 'N/A'}
            </Text>
            <Text style={styles.validitysmall}>validity</Text>
          </View>
          {/* <TouchableOpacity onPress={() => navigation.navigate('PlanDetails', { plan: item })}>
            <Ionicons name="chevron-forward-outline" size={20} color="#333" />
          </TouchableOpacity> */}
        </View>

        <View>
          <Text
            style={[
              styles.data,
              {
                paddingHorizontal: 16,
              },
            ]}>
            {item?.desc || 'No description'}
          </Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => {
              if (item) {
                handlePlan(item);
              }
            }}>
            <Text style={styles.buyButtonText}>Buy</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Get tab keys from filteredData?.info or fallback to empty array
  const tabKeys = filteredData?.info ? Object.keys(filteredData.info) : [];

  // Filter plans based on selected tab
  const plansToShow =
    selectedTab && filteredData?.info
      ? filteredData.info[selectedTab]
      : filteredData;

  return (
    <>
      <Header title="Recharge Details" />
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search-outline"
            size={25}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search a plan, validity or data..."
            value={searchText}
            onChangeText={handleSearch}
          />
        </View>

        {tabKeys.length > 0 && (
          <FlatList
            horizontal
            data={tabKeys}
            showsHorizontalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => setSelectedTab(item)}
                style={[
                  {
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    height: 40,
                    borderBottomWidth: selectedTab === item ? 2 : 0,
                    borderBottomColor:
                      selectedTab === item ? '#0d4574' : 'transparent',
                  },
                ]}>
                <Text
                  style={{
                    color: selectedTab === item ? '#0d4574' : '#333',
                    fontWeight: selectedTab === item ? 'bold' : 'normal',
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={item => item}
            contentContainerStyle={{paddingVertical: 10}}
            style={{marginBottom: 10}}
          />
        )}

        <FlatList
          data={plansToShow}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.noResultsText}>No results found.</Text>
          }
        />
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: '#333',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: '#333',
  },
  listContent: {
    paddingBottom: 16,
  },
  noResultsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: 'relative',
    minHeight: 110,
  },
  labelContainer: {
    // position: 'absolute',
    // top: 1,
    // left: 1,
    backgroundColor: '#ffa500',
    paddingHorizontal: 14,
    paddingVertical: 3,
    // borderRadius: 4,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    zIndex: 1,
  },
  labelText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    padding: 16,
  },
  plan: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000',
    marginBottom: 4,
  },
  validity: {
    fontSize: 14,
    color: '#000',
  },
  validitysmall: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  data: {
    fontSize: 14,
    color: '#000',
  },
  buttonRow: {
    alignItems: 'center',
    marginVertical: 8,
    paddingTop: 8,
    borderTopWidth: 0.3,
    borderTopColor: '#535353',
  },
  buyButton: {
    backgroundColor: '#0d4574',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 38,
  },
  buyButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RechargeDetails;
