import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {  RadioButton } from "react-native-paper";
import Menu from '../components/Menu';
import { Header2 as Header } from '../components/Header';

const AddBalance = () => {
  const [bank, setBank] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [branchName, setBranchName] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [amount, setAmount] = useState(1000);
  const [isModalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState(''); 

  const handleWithdrawal = () => {
    if (accountNumber !== confirmAccountNumber) {
      Alert.alert('Error', 'Account numbers do not match!');
      return;
    }
    setModalVisible(true);
  };

  const handleConfirmTransfer = () => {
    setModalVisible(false);
    Alert.alert('Success', `₹${amount} Add Balance to your account.`);
  };

  return (
    <>
        <Header title= 'Add Balance' />
        <ScrollView contentContainerStyle={styles.ScrollViewcontainer}>
    <View style={styles.container}>


      <View style={styles.withdrawSection}>
     

        <Text style={styles.withdrawLabel}>Add Money to Jobipo Wallet</Text>
        <View style={styles.AmountSection}>
        {/* <Text style={styles.AmountText}>₹ {amount}</Text> */}
        <TextInput
                style={styles.AmountTextInput}
                value={`₹ ${amount}`}  // Add ₹ symbol before the amount
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, ''); // Strip non-numeric characters
                  setAmount(numericValue); 
                }}  
                keyboardType="numeric" 
              />
        <Text style={styles.AmountAmountText}>Amount </Text>
        </View>
        <View style={styles.amountButtonsContainer}>
          <TouchableOpacity onPress={() => setAmount(amount + 100)} style={styles.amountButton}>
            <Text style={styles.amountText}>+ ₹100</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAmount(amount + 200)} style={styles.amountButton}>
            <Text style={styles.amountText}>+ ₹200</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAmount(amount + 500)} style={styles.amountButton}>
            <Text style={styles.amountText}>+ ₹500</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAmount(amount + 1000)} style={styles.amountButton}>
            <Text style={styles.amountText}>+ ₹1000</Text>
          </TouchableOpacity>
        </View>
      

        <TouchableOpacity style={styles.proceedButton} onPress={handleWithdrawal}>
          <Text style={styles.proceedButtonText}>Proceed to add ₹ {amount}</Text>
        </TouchableOpacity>
       
      </View>
      </View>
    </ScrollView>
    <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Ionicons name="close" size={20} color="#fff" />
            </TouchableOpacity>

          <View style={styles.transferOptionContainer}>
        <RadioButton
            value="transfer" color="#0d4574" 
             uncheckedColor="#0d4574"
            status={checked === 'transfer' ? 'checked' : 'unchecked'}
            onPress={() => setChecked(checked === 'transfer' ? '' : 'transfer')}
          />
         <View style={styles.AddContainer}>
         <Text style={styles.AddText}>Add ₹ {amount} once confirm </Text>
          <Text style={styles.AddsmallText}>using UPI Credit or Debit Card & Netbanking</Text>
          </View>
        </View>

            <View style={styles.actionButtonsContainer}>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmTransfer}
              >
                <Text style={styles.confirmButtonText}>Add ₹ {amount}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Menu/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal:16,
    backgroundColor: '#f8f8f8',
  },
  ScrollViewcontainer: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    flexGrow: 1,

  },

AmountTextInput: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    width: '70%', 
  },
  AmountSection:{
    padding: 5,
    marginBottom: 13,
    fontSize: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
 
  AmountText:{
    color: '#000',
    fontSize: 16,
    fontWeight:'bold',
  },
  AmountAmountText:{
    marginTop:10,
    fontSize: 16,
  },
  withdrawSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal:16,
 paddingVertical:9,
  },
  withdrawLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  transferSection:{
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 2,
    
  },
  amountButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountButton: {
    backgroundColor: '#fff',
    paddingHorizontal:17,
    paddingVertical:4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0d4574',
  },
  amountText: {
    fontSize: 14,
    color: '#333',
  },
  amountDisplay: {
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  proceedButton: {
    backgroundColor: '#0d4574',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  proceedButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  transferOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  transferOptionText: {
    fontSize: 16,
    color: '#333',
  },
  withdrawalText:{
    fontSize:11,
  },
 
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#0d4574',
    padding: 16,
    borderRadius: 8,
    flex: 0.45,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#0d4574',
    padding: 16,
    borderRadius: 8,
    flex:1,
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  withdrawalContainer:{
    paddingBottom:6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'fff',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
     paddingVertical:61,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal:16,
    paddingVertical:38,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  AddsmallText:{
    fontSize:12,
  },
  AddText:{
    fontSize:22,
    color: '#000',
    
  },
  AddContainer:{
    paddingHorizontal:23,
   
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 1,
    backgroundColor:'#000',
    borderRadius:20,
    padding:4,
  },
});

export default AddBalance;
