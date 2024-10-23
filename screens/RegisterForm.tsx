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

/*
  update the cost info based on user location (could select on previous screen? -- yes)
  inr
usd
gbp
aud
aed
*/

const RegisterForm = ({ route }: any) => {
  const { email, password } = route.params
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [parentName, setParentName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [competitors, setCompetitors] = useState([{ name: '', gender: '', level: '', academy: '', ageGroup: '', events: '' }]);
  const [amount, setAmount] = useState("000")
  const [currency, setCurrency] = useState<keyof Prices>('usd')

  const academies = ["Academy of Kalari Adimurai", "Kalari Academy of Texas Payil", "Subashini Kalari Group", "Queen City ATA Martial Arts", "Tamil Tutor Inc.", "World Federation Of Kalari"]
  const ages = ["6 Years", "7 to 8 Years", "9 to 10 Years", "11 to 12 Years", "13 to 15 Years", "16 to 18 Years", "18 to 25 Years", "26 to 30 Years", "31 to 35 Years", "36 to 40 Years", "41 to 45 Years", "46 to 50 Years", "51 Years and up"]

  type Prices = {
    inr: number;
    usd: number;
    gbp: number;
    aud: number;
    aed: number;
  };
  
  type EventPricing = {
    [event: string]: {
      name: string;
      prices: Prices;
    };
  };

  const events = ["Silambam", "Kalari Chuvadu & Silambam", "Kalari Chuvadu & Silambam & Vel Kambu", "K.C. & Silambam & V.K. & Kalari Payattu"]
  const events_dict = {"Silambam": "S", "Kalari Chuvadu & Silambam": "KCS", "Kalari Chuvadu & Silambam & Vel Kambu": "KCSVK", "K.C. & Silambam & V.K. & Kalari Payattu": "KCSVKKP"}
  const events_pricing: EventPricing = {
    "S": {
      name: "S",
      prices: {
        inr: 10000,
        usd: 1000,
        gbp: 1000,
        aud: 12000,
        aed: 12000
      }
    },
    "KCS": {
      name: "KCS",
      prices: {
        inr: 10000,
        usd: 1000,
        gbp: 1000,
        aud: 12000,
        aed: 12000
      }
    },
    "KCSVK": {
      name: "KCSVK",
      prices: {
        inr: 10000,
        usd: 1000,
        gbp: 1000,
        aud: 12000,
        aed: 12000
      }
    },
    "KCSVKKP": {
      name: "KCSVKKP",
      prices: {
        inr: 10000,
        usd: 1000,
        gbp: 1000,
        aud: 12000,
        aed: 12000
      }
    }
  };
  
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      merchantDisplayName: "WFK Competitions",
      allowsDelayedPaymentMethods: true,
      intentConfiguration: {
        mode: {
          amount: Number(amount),
          currencyCode: currency
        },
        confirmHandler: confirmHandler
      }
    });
    
    if (!error) setLoading(true);
  };

  const confirmHandler = async (intentCreationCallback: any) => {
    const myFuncs = getFunctions();

    const createPaymentIntentFn = httpsCallable(myFuncs, 'createPaymentIntent');
    const paymentIntent = await createPaymentIntentFn({ amount, currency });

    let data: any = paymentIntent.data  
    let client_secret = data.clientSecret
    if (client_secret) {
      intentCreationCallback({clientSecret: client_secret});
    } else {
      intentCreationCallback({error});
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
    let newVal = Number(amount)+events_pricing[selectedEvent].prices[currency]
    setAmount(newVal.toString())
  }

  const createAccountCheckout = async () => {
    try {
      openPaymentSheet()
      // const userCred = await auth().createUserWithEmailAndPassword(email, password)
      // firestore()
      //   .collection('users')
      //   .doc(userCred.user.uid)
      //   .set({
      //     loginEmail: email,
      //     parentName,
      //     parentPhoneNum: phoneNumber,
      //     parentEmail,
      //     additionalNotes,
      //     competitors
      //   })
    } catch (error) {
      if ((error as FirebaseError).code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else {
        setError('There was a problem with your request');
      }
    }
  };
  
  return (
    <SafeAreaView style={{ flex: 1, marginHorizontal: 20 }}>
      <Text style={styles.infoText}>
        Event Pricing{"\n"}
        - Silambam -&gt; $50 / 4200{"\n"}
        - Kalari Chuvadu & Silambam -&gt; $60{"\n"}
        - Kal. Chuv. & Silambam & Vel Kambu -&gt; $75{"\n"}
        - Kal. Chuv. & Silambam & V.K. & Kalari Payattu -&gt; $100{"\n"}
      </Text>
      <TextInput
        value={parentName}
        onChangeText={setParentName}
        placeholder="Parent's Full Name"
        placeholderTextColor="#ccc"
        style={styles.inputMain}
      />
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Parent's Phone Number"
        placeholderTextColor="#ccc"
        style={styles.inputMain}
      />
      <TextInput
        value={parentEmail}
        onChangeText={setParentEmail}
        keyboardType="email-address"
        placeholder="Parent's Email Address"
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
      

      <View style={styles.specialInputGroup}>
        <Text style={[styles.infoText, { marginTop: 4 }]}>
          Select Location:
        </Text>

        <Picker
          selectedValue={currency}
          style={[styles.picker, {marginTop: -10}]}
          onValueChange={setCurrency}
        >
          <Picker.Item label="India" value="inr" />
          <Picker.Item label="US" value="usd" />
          <Picker.Item label="Great Britain" value="gbp" />
          <Picker.Item label="Australia" value="aud" />
          <Picker.Item label="UAE" value="aed" />
        </Picker>
      </View>
            
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView style={styles.container}>
          {competitors.map((competitor, index) => (
            <View key={index} style={styles.competitorContainer}>
              <Text style={styles.label}>Competitor {index + 1} Info</Text>

              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Name"
                  value={competitor.name}
                  onChangeText={(value) => handleInputChange(index, 'name', value)}
                />

                <Picker
                  selectedValue={competitor.gender}
                  style={[styles.picker, { marginTop: Platform.OS == "ios" ? -80 : -10, marginLeft: -10, width: 20 }]}
                  onValueChange={(value) => handleInputChange(index, 'gender', value)}
                >
                  <Picker.Item label="Gender" value="" />
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>

              <View style={[styles.inputGroup, { width: 200 }]}>
                <TextInput
                  editable
                  multiline
                  maxLength={40}
                  keyboardType='numeric'
                  style={[styles.input, { height: 60 }]}
                  placeholder={"Completed Level \n(as of 4/1/25)"}
                  value={competitor.level}
                  onChangeText={(value) => handleInputChange(index, 'level', value)}
                />
              </View>
              <Picker
                  selectedValue={competitor.academy}
                  style={[styles.picker, { marginTop: Platform.OS == "ios" ? -60 : 0 }]}
                  onValueChange={(value) => handleInputChange(index, 'academy', value)}
                >
                <Picker.Item label="Select Academy" value="" />
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
                  <Picker.Item label="Age Group" value="" />
                  {ages.map((age) => (
                    <Picker.Item key={age} label={age} value={age} />
                  ))}
                </Picker>
              </View>

              <Picker
                selectedValue={competitor.events}
                style={[styles.picker, { marginTop: Platform.OS == "ios" ? 60 : 0 }]}
                onValueChange={(value) => handleEventChange(index, value)}
              >
                <Picker.Item label="Select Events" value="" />
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
        disabled={!loading}
        onPress={createAccountCheckout}
      />
    </SafeAreaView>
  )
}

export default RegisterForm

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    padding: 15,
  },
  competitorContainer: {
    marginBottom: Platform.OS == "ios" ? 140 : 40,
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
    fontSize: 15
  }
});