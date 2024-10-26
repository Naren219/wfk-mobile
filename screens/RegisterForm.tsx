import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { AppButton } from './ButtonComponents';
import { FirebaseError } from 'firebase/app';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStripe } from '@stripe/stripe-react-native';
import auth from '@react-native-firebase/auth';
import { getFunctions, httpsCallable } from '@react-native-firebase/functions';
import firestore, { doc, setDoc } from '@react-native-firebase/firestore';
import { academies, ages, currencySymbols, EventPricing, events_pricing_open, events_dict_open, events_dict_WFK, events_pricing_WFK, Prices, EventDict } from '../constants';

/*
  inr
usd
gbp
aud
aed
*/

const RegisterForm = ({ route }: any) => {
  const { email, password, currency, inWFK } = route.params
  const currency_value: keyof Prices = currency
  let events_dict: EventDict;
  let events_pricing: EventPricing;
  if (inWFK == "yes") {
    events_dict = events_dict_WFK
    events_pricing = events_pricing_WFK
  } else {
    events_dict = events_dict_open
    events_pricing = events_pricing_open
  }

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [parentName, setParentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [competitors, setCompetitors] = useState([{ name: '', gender: '', level: '', academy: '', ageGroup: '', events: '' }]);
  const [amount, setAmount] = useState("000")

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePaymentSheet = async () => {
    const paymentIntentResponse: any = await confirmHandler();
    
    const clientSecret = paymentIntentResponse.clientSecret;

    const { error } = await initPaymentSheet({
      merchantDisplayName: "WFK Competitions",
      allowsDelayedPaymentMethods: true,
      paymentIntentClientSecret: clientSecret
    });
    
    if (!error) setLoading(true);
  };

  const confirmHandler = async () => {
    const myFuncs = getFunctions();
    const createPaymentIntentFn = httpsCallable(myFuncs, 'createPaymentIntent');

    try {
      const paymentIntent = await createPaymentIntentFn({ amount, currency });
      return paymentIntent.data;
    } catch (error: any) {
        return { error: error.message };
    }
  }

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      console.log(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, [amount]);
  
  const handleAddCompetitor = () => {
    setCompetitors([...competitors, { name: '', gender: '', level: '', academy: '', ageGroup: '', events: '' }]);
  };

  const handleInputChange = (index: number, field: any, value: any) => {
    const updatedCompetitors = competitors.map((competitor, i) =>
      i === index ? { ...competitor, [field]: value } : competitor
    );
    setCompetitors(updatedCompetitors);
  };

  const handleEventChange = (index: number, selectedEvent: any) => {
    handleInputChange(index, 'events', selectedEvent)
    // Add the new event cost with existing cost
    let newVal = Number(amount)+events_pricing[selectedEvent].prices[currency_value]
    setAmount(newVal.toString())
  }

  const createAccountCheckout = async () => {
    try {
      openPaymentSheet()
      const userCred = await auth().createUserWithEmailAndPassword(email, password)
      firestore()
        .collection('users')
        .doc(userCred.user.uid)
        .set({
          loginEmail: email,
          parentName,
          parentPhoneNum: phoneNumber,
          parentEmail,
          additionalNotes,
          competitors
        })
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else {
        setError('There was a problem with your request');
      }
    }
  };

  const searchByValue = (obj: any, value: any) => {
    // Get the keys of the object and filter them by the value
    return Object.keys(obj).find(key => obj[key] === value);
  };
  
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
      <View style={[styles.shadowProp, styles.card, { marginBottom: 15 }]}>
        <Text style={[styles.infoText, { fontSize: 18 }]}>
          Event Pricing
        </Text>

        {Object.keys(events_pricing).map((key) => {
          const event = events_pricing[key];
          const fullName = searchByValue(events_dict, event.name)
          
          return (
            <View key={event.name}>
              <Text style={styles.infoText}>
                {fullName}: {currencySymbols[currency_value]}
                {(event.prices[currency_value] / 100).toFixed(2).toString()}
              </Text>
            </View>
          );
        })}
      </View>

      <Text style={{ fontSize: 15, marginBottom: Platform.OS == "ios" ? 10 : 10, color: '#333'}}>* Indicates required question</Text>

      <TextInput
        value={parentName}
        onChangeText={setParentName}
        placeholder="Parent's Full Name *"
        placeholderTextColor="#ccc"
        style={styles.inputMain}
      />
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Parent's Phone Number *"
        placeholderTextColor="#ccc"
        style={styles.inputMain}
      />
      <TextInput
        value={parentEmail}
        onChangeText={setParentEmail}
        keyboardType="email-address"
        placeholder="Parent's Email Address *"
        placeholderTextColor="#ccc"
        style={styles.inputMain}
      />
      <TextInput
        value={additionalNotes}
        onChangeText={setAdditionalNotes}
        multiline
        numberOfLines={4}
        maxLength={40}
        placeholder="Additional Notes"
        placeholderTextColor="#ccc"
        style={[styles.inputMain, { height: 60 }]}
      />
            
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          {competitors.map((competitor, index) => (
            <View key={index} style={styles.competitorContainer}>
              <Text style={styles.label}>Competitor {index + 1} Info {index == 0 ? "*" : ""}</Text>

              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Name *"
                  value={competitor.name}
                  onChangeText={(value) => handleInputChange(index, 'name', value)}
                />

                <Picker
                  selectedValue={competitor.gender}
                  style={[styles.picker, { marginTop: Platform.OS == "ios" ? -80 : -10, marginLeft: -10, width: 20 }]}
                  onValueChange={(value) => handleInputChange(index, 'gender', value)}
                >
                  <Picker.Item label="Gender *" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>

              <View style={[styles.inputGroup, { width: 250 }]}>
                <TextInput
                  editable
                  multiline
                  maxLength={40}
                  keyboardType='numeric'
                  style={[styles.input, { height: 60 }]}
                  placeholder={"Completed Level (as of 4/1/25) *"}
                  value={competitor.level}
                  onChangeText={(value) => handleInputChange(index, 'level', value)}
                />
              </View>
              <Picker
                  selectedValue={competitor.academy}
                  style={[styles.picker, { marginTop: Platform.OS == "ios" ? -60 : 0 }]}
                  onValueChange={(value) => handleInputChange(index, 'academy', value)}
                >
                <Picker.Item label="Select Academy *" value="" />
                {academies.map((academy) => (
                  <Picker.Item key={academy} label={academy} value={academy} />
                ))}
              </Picker>
              <View style={[styles.inputGroup, { marginTop: Platform.OS == "ios" ? 70 : 0 }]}>
                <Picker
                  selectedValue={competitor.ageGroup}
                  style={styles.picker}
                  onValueChange={(value) => handleInputChange(index, 'ageGroup', value)}
                >
                  <Picker.Item label="Age Group *" value="" />
                  {ages.map((age) => (
                    <Picker.Item key={age} label={age} value={age} />
                  ))}
                </Picker>
              </View>

              <Picker
                selectedValue={competitor.events}
                style={[styles.picker, { marginTop: Platform.OS == "ios" ? 60 : -20 }]}
                onValueChange={(value) => handleEventChange(index, value)}
              >
                <Picker.Item label="Select Events *" value="" />
                {Object.entries(events_dict).map(([event, abbr]) => (
                  <Picker.Item key={abbr} label={event} value={abbr} />
                ))}
              </Picker>
            </View>
          ))}
          <View style={{ marginBottom: 20 }}>
            <Button title="+ Add Competitor" onPress={handleAddCompetitor} />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
      <AppButton
        title="Checkout"
        extraStyles={{ width: 110, alignSelf: "center", marginVertical: Platform.OS == "ios" ? 0 : 10 }}
        disabled={
          !loading || parentName.length == 0 || phoneNumber.length == 0 || parentEmail.length == 0 || competitors[0].events.length == 0
        }
        onPress={createAccountCheckout}
      />
    </SafeAreaView>
  )
}

export default RegisterForm

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#56667A',
    borderRadius: 8,
    padding: 15,
    width: '100%',
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    padding: 15,
  },
  competitorContainer: {
    marginBottom: Platform.OS == "ios" ? 140 : 30,
    paddingBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: Platform.OS == "ios" ? 10 : 20,
    color: '#333',
  },
  inputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  specialInputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    flex: 1,
    marginRight: 10,
    height: 40
  },
  picker: {
    flex: 1,
    height: 40,
    transform: [
      { scaleX: 0.9 }, 
      { scaleY: 0.9 },
   ],
  },
  fullPicker: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
  },
  contrastBg: { 
    borderWidth: 0.5,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 8,
    borderColor: "#FFFF",
    backgroundColor: "#FFFF", 
    padding: 12
  },
  outer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    textAlign: "center",
    alignSelf: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: "#FFF"
  },
  inputMain: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  error: {
    color: 'red',
  },
  link: {
    color: '#bec7ed',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 15,
    color: "#ccc"
  }
});