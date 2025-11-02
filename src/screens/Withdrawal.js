import React, {useState, useEffect, useRef, useCallback} from 'react';
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
// import Header from '../components/Header';
import {Picker} from '@react-native-picker/picker';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
import {RadioButton} from 'react-native-paper';
import Menu from '../components/Menu';
import {Header2 as Header} from '../components/Header';

const Withdrawal = () => {
  const [confirmAccountNumber, setConfirmAccountNumber] = useState('');
  const [amount, setAmount] = useState(1000);
  const [isModalVisible, setModalVisible] = useState(false);
  const [checked, setChecked] = useState('');

  const [isLoading, setisLoading] = useState(true);
  const [uData, setUData] = useState([]);
  const [users, setUsers] = useState([]);
  const [BankName, setBankName] = useState('');
  const [AccountNo, setAccountNo] = useState('');
  const [BranchName, setBranchName] = useState('');
  const [IfscCode, setIfscCode] = useState('');
  const [AccountHolderName, setAccountHolderName] = useState('');
  const [updatedAt, setupdatedAt] = useState('');

  useEffect(() => {
    const GetDataFunc = async () => {
      const sliderDataApi = await fetch('https://jobipo.com/api/Agent/index', {
        method: 'GET',
      })
        .then(res => res.json())
        .catch(err => console.log(err));

      if (sliderDataApi) {
        if (sliderDataApi.logout != 1) {
          setUsers(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users,
          );

          // // console.log('uData.NewProduct ss');
          setBankName(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
              .BankName,
          );
          setAccountNo(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
              .AccountNo,
          );
          setBranchName(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
              .BranchName,
          );
          setAccountHolderName(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
              .AccountHolderName,
          );
          setupdatedAt(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
              .updatedAt,
          );
          setIfscCode(
            JSON.parse(JSON.parse(JSON.stringify(sliderDataApi)).msg).users
              .IfscCode,
          );
          setisLoading(false);
          // console.log(AccountHolderName);
        } else {
          navigation.navigate('Login');
        }
      } else {
        Alert.alert(
          'Connection Issue',
          'Please check your internet connection.',
        );
      }
    };

    GetDataFunc();
  }, []);

  const UpdatePayment = async () => {
    setisLoading(true);
    try {
      var formdat = {
        BankName: BankName,
        AccountNo: AccountNo,
        BranchName: BranchName,
        AccountHolderName: AccountHolderName,
        IfscCode: IfscCode,
      };

      const asd = await fetch(
        'https://jobipo.com/api/Agent/doPaymentssettings',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formdat),
        },
      )
        .then(res => res.json())
        .catch(err => console.log(err));

      // // console.log('gfdg fgfdgfd');
      // // console.log(asd);
      setisLoading(false);
      if (JSON.parse(JSON.stringify(asd)).status == 'success') {
        alert(JSON.parse(JSON.stringify(asd)).msg);
      } else {
        alert(JSON.parse(JSON.stringify(asd)).msg);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleWithdrawal = () => {
    if (accountNumber !== confirmAccountNumber) {
      Alert.alert('Error', 'Account numbers do not match!');
      return;
    }
    setModalVisible(true);
  };

  const handleConfirmTransfer = () => {
    setModalVisible(false);
    Alert.alert('Success', `₹${amount} will be transferred to your account.`);
  };

  var options = [
    'AIRTEL PAYMENTS BANK',
    'ALLAHABAD BANK',
    'ANDHRA BANK',
    'AU SMALL FINANCE BANK',
    'AXIS BANK',
    'BANDHAN BANK LIMITED',
    'BANK OF BARODA',
    'BANK OF INDIA',
    'BANK OF MAHARASHTRA',
    'BARODA RAJSTHAN KSHETRIY GRAMIN BANK',
    'CANARA BANK',
    'CAPITAL SMALL FINANCE BANK',
    'CENTRAL BANK OF INDIA',
    'CITIBANK',
    'CITY UNION BANK LTD',
    'CORPORATION BANK',
    'DBS BANK LTD',
    'DCB BANK LIMITED',
    'DENA BANK',
    'EQUITAS SMALL FINANCE BANK',
    'ESAF SMALL FINANCE BANK',
    'FINCARE SMALL FINANCE BANK',
    'FINO PAYMENTS BANK',
    'HDFC BANK LTD',
    'HSBC',
    'ICICI BANK LTD',
    'IDBI BANK LTD',
    'IDFC BANK',
    'INDIA POST PAYMENT BANK',
    'INDIAN BANK',
    'INDIAN OVERSEAS BANK',
    'INDUSIND BANK LTD',
    'JANA SMALL FINANCE BANK',
    'JIO PAYMENTS BANK',
    'KARNATAKA BANK LTD',
    'KERALA GRAMIN BANK',
    'KOTAK MAHINDRA BANK',
    'NSDL PAYMENTS BANK',
    'ORIENTAL BANK OF COMMERCE',
    'PAYTM PAYMENTS BANK',
    'PRATHAMA BANK',
    'PUNJAB AND SIND BANK',
    'PUNJAB NATIONAL BANK',
    'RAJASTHAN MARUDHARA GRAMIN BANK',
    'RBL BANK LIMITED',
    'SOUTH INDIAN BANK',
    'STANDARD CHARTERED BANK',
    'STATE BANK OF INDIA',
    'SURYODAY SMALL FINANCE BANK',
    'TELANGANA STATE COOP APEX BANK',
    'THE FEDERAL BANK LTD',
    'THE JAMMU AND KASHMIR BANK LTD',
    'THE KOLHAPUR URBAN BANK',
    'THE NAINITAL BANK LIMITED',
    'UCO BANK',
    'UJJIVAN SMALL FINANCE BANK',
    'UNION BANK OF INDIA',
    'UNITED BANK OF INDIA',
    'UTKARSH SMALL FINANCE BANK',
    'YES BANK LTD',
  ];

  return (
    <>
      <Header title="Withdrawal" />

      <ScrollView contentContainerStyle={styles.ScrollViewcontainer}>
        <View style={styles.container}>
          <View style={styles.card}>
            <Picker
              selectedValue={BankName}
              mode="cover"
              dropdownIconColor="#323232"
              dropdownIconRippleColor="#ccc"
              style={{
                width: '100%',
                color: '#000',
                backgroundColor: '#FFFFFF',
                borderWidth: 1,
                borderColor: '#D9D9D9',
              }}
              onValueChange={(itemValue, itemIndex) => {
                setBankName(itemValue);
              }}>
              <Picker label="Select Your Bank" value="" />
              {options.map((item, index) => {
                return <Picker.Item label={item} value={item} key={index} />;
              })}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Enter Account Number"
              value={AccountNo}
              onChangeText={setAccountNo}
              keyboardType="number-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm Account Number"
              value={AccountNo}
              onChangeText={setAccountNo}
              keyboardType="number-pad"
            />

            <TextInput
              style={styles.input}
              placeholder="Branch Name"
              value={BranchName}
              onChangeText={setBranchName}
            />

            <TextInput
              style={styles.input}
              placeholder="Account Holder Name"
              value={AccountHolderName}
              onChangeText={setAccountHolderName}
            />
            <Text style={styles.UpdatedText}>Last Updated : {updatedAt}</Text>

            <View style={styles.saveButtonContainer}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => UpdatePayment()}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.withdrawSection}>
            <Text style={styles.withdrawLabel}>
              Withdrawal from Jobipo Wallet
            </Text>
            <View style={styles.AmountSection}>
              {/* <Text style={styles.AmountText}>₹ {amount}</Text> */}
              <TextInput
                style={styles.AmountTextInput}
                value={`₹ ${amount}`} // Add ₹ symbol before the amount
                onChangeText={text => {
                  const numericValue = text.replace(/[^0-9]/g, ''); // Strip non-numeric characters
                  setAmount(numericValue);
                }}
                keyboardType="numeric"
              />
              <Text style={styles.AmountAmountText}>Amount </Text>
            </View>
            <View style={styles.amountButtonsContainer}>
              <TouchableOpacity
                onPress={() => setAmount(amount + 100)}
                style={styles.amountButton}>
                <Text style={styles.amountText}>+ ₹100</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAmount(amount + 200)}
                style={styles.amountButton}>
                <Text style={styles.amountText}>+ ₹200</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAmount(amount + 500)}
                style={styles.amountButton}>
                <Text style={styles.amountText}>+ ₹500</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setAmount(amount + 1000)}
                style={styles.amountButton}>
                <Text style={styles.amountText}>+ ₹1000</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.proceedButton}
              onPress={handleWithdrawal}>
              <Text style={styles.proceedButtonText}>
                Proceed to withdrawal ₹ {amount}
              </Text>
            </TouchableOpacity>
            <View style={styles.withdrawalContainer}>
              <Text style={styles.withdrawalText}>
                • Minimum withdrawal amount ₹ {amount}
              </Text>
              <Text style={styles.withdrawalText}>
                • Amount will be creadited in your bank account 24 to 48 working
                hours.(Saturday, Sunday and national holiday's withdrawal
                request proceed to next working day))
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.transferOptionContainer}>
              <RadioButton
                value="transfer"
                color="#0d4574"
                uncheckedColor="#0d4574"
                status={checked === 'transfer' ? 'checked' : 'unchecked'}
                onPress={() =>
                  setChecked(checked === 'transfer' ? '' : 'transfer')
                }
              />
              <Text style={styles.transferOptionText}>
                Transfer my money to this account.
              </Text>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmTransfer}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Menu />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
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
  card: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    padding: 8,
    marginBottom: 13,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  picker: {
    //   padding: 0,
    marginBottom: 13,
    backgroundColor: '#fff',
  },
  pickerItem: {
    fontSize: 15,
    color: 'gray',
  },
  AmountSection: {
    padding: 10,
    marginBottom: 13,
    fontSize: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#ffa500',
    padding: 14,
    width: '50%',
    borderRadius: 25,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  AmountText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  AmountAmountText: {
    marginTop: 10,
    fontSize: 16,
  },
  withdrawSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  withdrawLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  transferSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  amountButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  amountButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 17,
    paddingVertical: 4,
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
  withdrawalText: {
    fontSize: 11,
  },
  UpdatedText: {
    fontSize: 11,
    color: '#0d4574',
    marginBottom: 5,
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
    flex: 0.45,
  },
  confirmButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  withdrawalContainer: {
    paddingBottom: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'fff',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 61,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
});

export default Withdrawal;
