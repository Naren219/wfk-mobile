import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParams } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { AppButton } from './ButtonComponents';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Prices } from '../constants';

type signupScreenProp = NativeStackNavigationProp<AuthStackParams, 'Signup'>;

export function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [currency, setCurrency] = useState<keyof Prices>('usd')
    const [inWFK, setInWFK] = useState<string>('no')

    const navigation = useNavigation<signupScreenProp>();
    
    // useEffect(() => {
    //   if (password !== confirmPassword)
    //     setError("Passwords don't match");
    //   else
    //     setError('')
    // }, [confirmPassword])
    
    // useEffect(() => {
    //   if ((password.length < 6) && password.length !== 0)
    //     setError("Password must be at least 6 characters")
    //   else
    //     setError('')
    // }, [password])
  
    // useEffect(() => {
    //   const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; 
    //   if (!emailPattern.test(email) && email.length !== 0)
    //     setError("Invalid email")
    //   else
    //     setError("")
    // }, [email])

    return (
      <SafeAreaView style={styles.outer}>
        <View style={[styles.shadowProp, styles.card, { width: 330 }]}>
          <Text style={styles.header}>Sign up</Text>
          {error && 
            <View style={styles.contrastBg}>
              <Text style={styles.error}>{error}</Text>
            </View>
          }
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.link}>Login to existing account</Text>
          </TouchableOpacity>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="Enter email address"
            autoCapitalize="none"
            placeholderTextColor="#ccc"
            selectionColor={'white'}
            style={styles.input}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Enter password"
            autoCapitalize="none"
            placeholderTextColor="#ccc"
            selectionColor={'white'}
            style={styles.input}
          />
          <TextInput
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            placeholder="Confirm password"
            autoCapitalize="none"
            placeholderTextColor="#ccc"
            selectionColor={'white'}
            style={styles.input}
          />
          <View style={styles.specialInputGroup}>
            <Text style={styles.infoText}>
              Select Location:
            </Text>

            <Picker
              selectedValue={currency}
              style={styles.picker}
              onValueChange={setCurrency}
            >
              <Picker.Item label="India" value="inr" />
              <Picker.Item label="US" value="usd" />
              <Picker.Item label="Great Britain" value="gbp" />
              <Picker.Item label="Australia" value="aud" />
              <Picker.Item label="UAE" value="aed" />
            </Picker>
          </View>

          <View style={styles.specialInputGroup}>
            <Text style={styles.infoText}>
              Part of WFK?
            </Text>

            <Picker
              selectedValue={inWFK}
              style={styles.picker}
              onValueChange={setInWFK}
            >
              <Picker.Item label="Yes" value="yes" />
              <Picker.Item label="No" value="no" />
            </Picker>
          </View>
          <AppButton
            title="Next"
            // disabled={error !== ""}
            onPress={() => navigation.navigate('RegisterForm', { email, password, currency, inWFK })}
          />
        </View>
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  infoText: {
    fontSize: 15,
    color: "#ccc",
    marginTop: 4
  },
  specialInputGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 5
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    color: "#ccc"
  },
  error: {
    color: 'red',
  },
  link: {
    color: '#bec7ed',
    marginBottom: 20,
  },
  picker: {
    flex: 1,
    height: 40,
    transform: [
      { scaleX: 1 }, 
      { scaleY: 1 },
    ],
    color: "#ccc",
    marginTop: -12
  },
});