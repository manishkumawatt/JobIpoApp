/* eslint-disable prettier/prettier */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  View,
  FlatList,
  Pressable,
  ScrollView,
  b,
} from 'react-native';
import React from 'react';
import Menu from '../components/Menu';
import { Header2 as Header } from '../components/Header';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const About = ({ navigation }) => {
  const products = [
    { 
      id: 0,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    { 
      id: 1,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    { 
      id: 2,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    { 
      id: 3,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    { 
      id: 4,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },
    { 
      id: 5,
      title: 'Suggest the Kotak 811 Saving Account to everyone in your network (friends/customers).',
      content: 'Click on the “Share Now” button to share the tracking link with interested customers.',
    },

  ];
  return (
    <>
      {/* <Header title= 'About Us' /> */}
 
      <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>
        <Text style={styles.ttitle}>"Jobipos" - </Text> by Jobipo </Text>
        <Text> </Text>

       <Text style={styles.ttitle}>Company Details : </Text>
       <Text style={styles.title}>
       Jobipo is registered as Fintech company from ROC Jaipur.  Our registered office is at Kuchaman City in District Nagaur of Rajasthan.
       We are working through Mobile Application named "Jobipos" available on Play Store and iOS since Nov'2021. </Text>

       <Text> </Text>

       <Text style={styles.ttitle}>Directors' Details:  </Text>
       <Text style={styles.title}>
       <Text style={styles.ttitle}>1. Mr. Suresh Kumar </Text>(CEO & Founder), having 5+ years of experience in BFSI (Banking, Financial Services & Insurance) and FinTech. </Text>
       <Text style={styles.title}>
       <Text style={styles.ttitle}>2. Mr. Sandeep Sabal</Text>(CO-CEO & Founder), having 7+ years of experience in BFSI (Banking, Financial Services Insurance) and FinTech. He is also the Director of Liberal Microfinance. </Text>
       <Text> </Text>
       <Text style={styles.ttitle}>Our mission : </Text>
       <Text style={styles.title}>
       To provide employment to more than 5 lakh people in India by 2025 through our Fintech. </Text>

       <Text> </Text>

       <Text style={styles.ttitle}>Our vision :</Text>
       <Text style={styles.title}>
       - To provide smooth and essential banking services & solution to people at their doorstep through Mobile Application</Text>
       <Text style={styles.title}>
       - To create self-employment by developing unlimited alternate source of income through digital services</Text>

       <Text> </Text>

       <Text style={styles.ttitle}>Product Details : </Text>
       <Text style={styles.title}>
       We are providing BFSI (Savings Accounts, Demat Accounts, Personal Loans, Business Loans, Credit Cards, EMI Cards, Mutual Funds, Insurance, Pay Later) and many more services through our Fintech model in PAN India.  Also we are providing cross sell products with good and attractive payouts across industries to NBFCs, MFIs and Nidhi companies. </Text>

       <Text> </Text>

       <Text style={styles.ttitle}>Current access area:</Text>
       <Text style={styles.title}>
       We are working across all states. We have served 50,000+ customers across 24 states by providing banking and financial services in urban, semi urban and rural areas till June'22. </Text>
        </ScrollView>
      </View>
 
      <Menu />
    </>
  );
};
8435289879
export default About;
 
const styles1 = StyleSheet.create({
  container: {
    paddingVertical: 14,
    paddingHorizontal: 10,
    backgroundColor: '#f8f8f8',
    flex: 1,
    marginBottom: 50,

  },
  product: {
    backgroundColor: '#fff',
    width: '95%',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 22,
    paddingBottom: 5,
    paddingHorizontal: 4,
    borderRadius: 5,
    flexDirection: 'row',
    flexWrap: 'wrap',  
  },
  image: {
    width: 80,
    height: 80,
    flex: 2,
    backgroundColor: '#edfaff',
    borderRadius: 10,
    marginRight: 20,
    alignItems: 'center',
  }, 
  title: {
    color: '#595959',
    paddingTop: 0,
    fontSize: 14,
    
  },
  
  productNo: {
    color: '#595959',
    marginVertical: 10,
    fontSize: 12,
  },
  productDescBox: {
    width: '80%',
    paddingVertical: 0,
    borderRadius: 0,
    flex: 5,
    borderLeftWidth: 1,
    borderLeftColor: '#EDFAFF',
    paddingLeft: 5,
    paddingBottom: 5,
  },
  productDesc: {
    textAlign: 'center',
    color: '#595959',
    fontSize: 12,
  },
  cardIcon:{
    fontSize: 15,
  },
  cardText:{
    fontSize: 15,
    color: '#0d4574',
  },
  card:{
    marginTop:15,
  },
});





 
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    padding: 8,
    paddingBottom: 8,
    marginBottom: 60,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    color:'#535353',
  },
  ttitle:{ 
    fontWeight:'bold',
    color: '#000',
  },  
  title:{
    color: '#000',
  }
});
 
 