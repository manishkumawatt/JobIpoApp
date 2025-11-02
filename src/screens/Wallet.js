import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import JobMenu from '../components/Job/JobMenu';
import Icon from 'react-native-vector-icons/Ionicons';
import IconPer from 'react-native-vector-icons/Feather';
// import Header from '../components/Header';
import {Header2 as Header} from '../components/Header';
import Menu from '../components/Menu';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../context/context';

const Wallet = ({navigation}) => {
  const {signOut} = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('addBalance');
  const [NewProduct, setNewProduct] = useState([]);
  const [TopProductData, setTopProductData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [uData, setUData] = useState([]);
  const [users, setUsers] = useState([]);
  const [leader, setLeader] = useState([]);
  const [slider, setSlider] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const [toolTipVisible, setToolTipVisible] = useState('');

  useFocusEffect(
    useCallback(() => {
      const GetDataFunc = async () => {
        // loginState.isLoading = true;
        const sliderDataApi = await fetch(
          'https://jobipo.com/api/Agent/index',
          {
            method: 'GET',
          },
        )
          .then(res => res.json())
          .catch(err => console.log(err));

        if (sliderDataApi) {
          if (sliderDataApi.logout != 1) {
            setNewProduct(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg)
                .NewProduct,
            );

            setTopProductData(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg)
                .TopProduct,
            );

            setCategoryData(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg)
                .category,
            );

            setUData(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).UData,
            );

            setUsers(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users,
            );

            setLeader(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).leader,
            );
            setSlider(
              JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).slider,
            );

            setisLoading(false);
          } else {
            signOut();
            // navigation.navigate('Login');
          }
        } else {
          Alert.alert(
            'Connection Issue',
            'Please check your internet connection.',
          );
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

  // useEffect(() => {
  //   const GetDataFunc = async () => {
  //     // loginState.isLoading = true;
  //     const sliderDataApi = await fetch(
  //       'https://jobipo.com/api/Agent/index',
  //       {
  //         method: 'GET',
  //       },
  //     )
  //       .then(res => res.json())
  //       .catch(err => // console.log(err));

  //     if (sliderDataApi) {
  //       if (sliderDataApi.logout != 1) {
  //         setNewProduct(
  //           JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).NewProduct,
  //         );

  //         setTopProductData(
  //           JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).TopProduct,
  //         );

  //         setCategoryData(
  //           JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).category,
  //         );

  //         setUData(
  //           JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).UData,
  //         );

  //         setUsers(
  //           JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users,
  //         );

  //         setLeader(
  //           JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).leader,
  //         );
  //         setSlider(
  //           JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).slider,
  //         );

  //         setisLoading(false);
  //       } else {
  //         navigation.navigate('Login');
  //       }
  //     } else {
  //       Alert.alert("Connection Issue", "Please check your internet connection.");
  //     }
  //   };

  //   GetDataFunc();
  // }, []);

  // // console.log(users)

  return (
    <>
      {/* <Header/> */}
      {/* <Header title= 'Wallet' /> */}

      <ScrollView style={styles.ScrollViewcontainer}>
        <View style={styles.container}>
          <View style={styles.earningsContainer}>
            <View style={styles.rowContainer}>
              <View
                style={{
                  ...styles.card,
                  borderBottomColor: '#fff',
                  borderBottomWidth: 1,
                }}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      right: 18,
                    },
                  ]}>
                  <FontAwesome name="rupee" size={18} color="#0d4574" />
                </View>
                <View>
                  <Text
                    style={[
                      styles.cardTitle,
                      {
                        right: 18,
                      },
                    ]}>
                    Paid Earning
                  </Text>
                  <Text style={styles.cardValue}>
                    ₹{' '}
                    {parseFloat(uData.PaidEarning) +
                      parseFloat(uData.PaidBonus)}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.card,
                  borderLeftColor: '#fff',
                  borderLeftWidth: 1,
                  borderBottomColor: '#fff',
                  borderBottomWidth: 1,
                }}>
                <View style={styles.iconContainer}>
                  <FontAwesome name="rupee" size={18} color="#0d4574" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Pending Earning</Text>
                  <Text style={styles.cardValue}>
                    ₹{' '}
                    {parseFloat(uData.PendingEarning) +
                      parseFloat(uData.UnPaidBonus)}
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.rowContainer]}>
              <View
                style={{
                  ...styles.card,
                  borderTopColor: '#fff',
                  borderTopWidth: 1,
                }}>
                <View
                  style={[
                    styles.iconContainer,
                    {
                      right: 18,
                    },
                  ]}>
                  <FontAwesome name="rupee" size={18} color="#0d4574" />
                </View>
                <View
                  style={{
                    right: 18,
                  }}>
                  <Text style={styles.cardTitle}>Sign Up Bonus</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setToolTipVisible('Sign Up Bonus');
                    }}
                    style={{
                      marginLeft: 10,
                      position: 'absolute',
                      right: -15,
                      backgroundColor: '#fff',
                      width: 13,
                      height: 13,
                      borderRadius: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#0d4574',
                        fontSize: 11,
                        fontWeight: 'bold',
                      }}>
                      i
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.cardValue}>₹ {uData.SIGNUPBONUS}</Text>
                </View>
              </View>
              <View
                style={{
                  ...styles.card,
                  borderLeftColor: '#fff',
                  borderLeftWidth: 1,
                }}>
                <View style={styles.iconContainer}>
                  <FontAwesome name="rupee" size={18} color="#0d4574" />
                </View>
                <View>
                  <Text style={styles.cardTitle}>Referral Bonus</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setToolTipVisible('Referral Bonus');
                    }}
                    style={{
                      marginLeft: 10,
                      position: 'absolute',
                      right: -15,
                      backgroundColor: '#fff',
                      width: 13,
                      height: 13,
                      borderRadius: 100,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: '#0d4574',
                        fontSize: 11,
                        fontWeight: 'bold',
                      }}>
                      i
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.cardValue}>₹ {uData.REFERALBONUS}</Text>
                </View>
              </View>
            </View>
          </View>

          {users?.ProfileStatus != 1 && (
            <Pressable
              style={{
                backgroundColor: 'orange',
                padding: 12,
                margin: 8,
                borderRadius: 19,
                alignItems: 'center',
                marginBottom: 20,
              }}
              onPress={() => navigation.navigate('Kyc')}>
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                }}>
                Complete Kyc to settle earning in your account
              </Text>
            </Pressable>
          )}

          {/* <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('AddBalance')}>
              <Text style={styles.buttonText}>Add Balance</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Withdrawal')}>
              <Text style={styles.buttonText}>Withdrawal</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tdsContainer}>
            <View style={styles.iconTDSContainer}>
              <IconPer name="percent" size={24} color="#333" />
            </View>

            <Text style={styles.tdsText}>
              5% TDS will be deducted on commission earning.
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('TDSDetails')} style={styles.knowMoreButton}>
              <Text style={styles.knowMoreText}>Know more</Text>
            </TouchableOpacity>
          </View> */}

          {/* <Text style={styles.TransactionText}>Transaction History</Text> */}

          {/* <View style={styles.historyContainer}>
            <View style={styles.historyTabs}>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'addBalance' && styles.activeTab]}
                onPress={() => setActiveTab('addBalance')}
              >
                <Text style={[styles.tabText, activeTab === 'addBalance' && styles.activetabText]}
                >Add Balance History</Text>

              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tab, activeTab === 'withdrawal' && styles.activeTab]}
                onPress={() => setActiveTab('withdrawal')}
              >
                <Text style={[styles.tabText, activeTab === 'withdrawal' && styles.activetabText]}>Withdrawal History</Text>

              </TouchableOpacity>
            </View>

            {activeTab === 'addBalance' && (
              <View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.dateTran}>05 Feb 2023</Text>
                  <Text style={styles.transactionStatus}>Success</Text>
                </View>
                <View style={styles.transactionItem}>
                  <View style={styles.iconContainerTran}>
                    <Icon name="wallet-outline" size={20} color="#fff" />

                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionWallet}>
                      <Text style={styles.walletText}>Wallet Deposit</Text>
                    </View>
                    <View style={styles.walletrupee} >
                      <Text style={styles.walletTextRs}>Rs. 20</Text>
                      <Text style={styles.walletTextsmall}>****9920</Text>

                    </View>
                  </View>

                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.dateTran}>05 Feb 2023</Text>
                  <Text style={styles.transactionStatus}>Success</Text>
                </View>
                <View style={styles.transactionItem}>
                  <View style={styles.iconContainerTran}>
                    <Icon name="wallet-outline" size={20} color="#fff" />

                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionWallet}>
                      <Text style={styles.walletText}>Wallet Deposit</Text>
                    </View>
                    <View style={styles.walletrupee} >
                      <Text style={styles.walletTextRs}>Rs. 20</Text>
                      <Text style={styles.walletTextsmall}>****9920</Text>

                    </View>
                  </View>

                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.dateTran}>05 Feb 2023</Text>
                  <Text style={styles.transactionStatus}>Success</Text>
                </View>
                <View style={styles.transactionItem}>
                  <View style={styles.iconContainerTran}>
                    <Icon name="wallet-outline" size={20} color="#fff" />

                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionWallet}>
                      <Text style={styles.walletText}>Wallet Deposit</Text>
                    </View>
                    <View style={styles.walletrupee} >
                      <Text style={styles.walletTextRs}>Rs. 20</Text>
                      <Text style={styles.walletTextsmall}>****9920</Text>

                    </View>
                  </View>

                </View>
              </View>
            )}

            {activeTab === 'withdrawal' && (
              <View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.dateTran}>05 Feb 2023</Text>
                  <Text style={styles.transactionStatus}>Success</Text>
                </View>
                <View style={styles.transactionItem}>
                  <View style={styles.iconContainerTran}>
                    <FontAwesome name="bank" size={20} color="#fff" />

                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionWallet}>
                      <Text style={styles.walletText}>Bank Withdrawal</Text>
                      <Text style={styles.walletTextsmall}>TDS Deduction : RS 01.00</Text>
                    </View>
                    <View style={styles.walletrupee} >
                      <Text style={styles.walletTextRs}>Rs. 20</Text>
                      <Text style={styles.walletTextsmall}>****9920</Text>

                    </View>
                  </View>

                </View>

                <View style={styles.transactionDetails}>
                  <Text style={styles.dateTran}>05 Feb 2023</Text>
                  <Text style={styles.transactionStatus}>Success</Text>
                </View>
                <View style={styles.transactionItem}>
                  <View style={styles.iconContainerTran}>
                    <FontAwesome name="bank" size={20} color="#fff" />

                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionWallet}>
                      <Text style={styles.walletText}>Bank Withdrawal</Text>
                      <Text style={styles.walletTextsmall}>TDS Deduction : RS 01.00</Text>
                    </View>
                    <View style={styles.walletrupee} >
                      <Text style={styles.walletTextRs}>Rs. 20</Text>
                      <Text style={styles.walletTextsmall}>****9920</Text>

                    </View>
                  </View>

                </View>


                <View style={styles.transactionDetails}>
                  <Text style={styles.dateTran}>05 Feb 2023</Text>
                  <Text style={styles.transactionStatus}>Success</Text>
                </View>
                <View style={styles.transactionItem}>
                  <View style={styles.iconContainerTran}>
                    <FontAwesome name="bank" size={20} color="#fff" />

                  </View>
                  <View style={styles.transactionDetails}>
                    <View style={styles.transactionWallet}>
                      <Text style={styles.walletText}>Bank Withdrawal</Text>
                      <Text style={styles.walletTextsmall}>TDS Deduction : RS 01.00</Text>
                    </View>
                    <View style={styles.walletrupee} >
                      <Text style={styles.walletTextRs}>Rs. 20</Text>
                      <Text style={styles.walletTextsmall}>****9920</Text>

                    </View>
                  </View>

                </View>


              </View>
            )}
          </View> */}
        </View>
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={toolTipVisible !== ''}
        onRequestClose={() => setToolTipVisible('')}>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Pressable
            style={{
              position: 'absolute',
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              width: '100%',
              height: '100%',
            }}
            onPress={() => setToolTipVisible('')}
          />
          <View
            style={{
              backgroundColor: '#fff',
              padding: 20,
              borderRadius: 10,
              width: '80%',
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 10}}>
              {toolTipVisible}
            </Text>
            <Text style={{fontSize: 14, textAlign: 'center'}}>
              {toolTipVisible === 'Sign Up Bonus'
                ? 'Signup bonus will be approved after successful sale of minimum Rs 100 within 60 days. Otherwise Your Bonus Validity Expired.'
                : 'Referral bonus will be approved after successful sale of minimum Rs 100 within 60 days. Otherwise Your Bonus Validity Expired.'}
            </Text>
          </View>
        </View>
      </Modal>
      <Menu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
    paddingBottom: 100,
  },
  earningsContainer: {
    backgroundColor: '#0d4574',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#0d4574',
    flex: 1,
    padding: 16,
    alignItems: 'center',
    // flexDirection: 'row',
  },
  iconContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: 8,
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  iconContainerTran: {
    backgroundColor: '#ffc266',
    borderRadius: 18,
    marginRight: 8,
    width: 35,
    height: 35,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: 20,
  },
  cardTitle: {
    fontSize: 14,
    color: '#fff',
  },
  cardValue: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#ffc266',
    padding: 12,
    margin: 8,
    borderRadius: 19,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  TransactionText: {
    color: '#000',
    marginVertical: 10,
  },
  tdsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  iconTDSContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: 8,
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  tdsText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginHorizontal: 10,
  },
  knowMoreButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#0d4574',
    borderRadius: 12,
  },
  knowMoreText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  historyContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  historyTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0.8,
    borderColor: '#333',
    borderRadius: 25,
    color: '#fff',
    backgroundColor: '#fff',
  },
  activeTab: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 0.8,
    borderColor: '#ffc266',
    borderRadius: 25,
    backgroundColor: '#ffc266',
  },
  tabText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#3a3c45',
  },
  activetabText: {
    color: '#fff',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 9,
  },
  transactionIcon: {
    width: 40,
    marginRight: 10,
  },
  transactionText: {
    width: 100,
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  transactionWallet: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletText: {
    color: '#000',
    fontSize: 16,
  },
  walletTextRs: {
    color: '#000',
    fontSize: 16,
  },
  walletTextsmall: {
    color: '#000',
    fontSize: 11,
  },
  dateTran: {
    color: '#000',
    fontSize: 12,
  },
  transactionStatus: {
    color: '#fff',
    fontSize: 12,
    backgroundColor: '#0d4574',
    borderRadius: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
});

export default Wallet;
