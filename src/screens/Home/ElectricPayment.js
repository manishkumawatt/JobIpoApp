import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image ,Pressable} from 'react-native';
import { Header2 as Header } from '../../components/Header';

const ElectricPayment = () => {
  const [amount, setAmount] = useState('');

  const handlePayment = () => {
    // // console.log('Payment confirmed for amount:', amount);
        alert(`Payment confirmed for amount ${amount}`);
  };

  const predefinedAmounts = [310, 560, 910, 1200];

  const handlePredefinedAmount = (selectedAmount) => {
    setAmount(selectedAmount.toString());
  };

  return (
    <>
      <Header title="Payment" />
      <View style={styles.container}>
      

        <View style={styles.card}>
          <Text style={styles.label}>Enter Amount</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric" 
              placeholder="Enter Amount"
              placeholderTextColor="#888"
            />
          </View>
          <View style={styles.amountOptions}>
          {predefinedAmounts.map((amountOption, index) => (
            <Pressable
              key={index}
              style={styles.amountBox}
              onPress={() => handlePredefinedAmount(amountOption)}
            >
              <Text style={styles.amountText}>₹{amountOption}</Text>
            </Pressable>
          ))}
        </View>
        </View>

      
      </View>

      <TouchableOpacity
        style={[styles.paymentButton, amount ? styles.paymentButtonActive : null]}
        onPress={handlePayment}
        disabled={!amount} 

      >
        <Text style={[styles.paymentButtonText, amount ? styles.paymentButtonTextActive : null]}>
          PROCEED TO PAY
        </Text>
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 5,
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: 170,
    marginBottom: 10,
    borderWidth: 0.1,
    borderColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 10,
    height: 50,
  },
  currencySymbol: {
    fontSize: 18,
    color: '#000',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 5,
  },
  amountOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  amountBox: {
    backgroundColor: '#fff',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 5,
    alignItems: 'center',
  },
  amountText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
  paymentButton: {
    backgroundColor: '#dcdcdc',
    paddingVertical: 22,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  paymentButtonActive: {
    backgroundColor: '#0d4574',  
  },
  paymentButtonText: {
    color: '#808080', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentButtonTextActive: {
    color: '#fff',  
  },
});

export default ElectricPayment;
