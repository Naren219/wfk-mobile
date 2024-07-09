import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParams } from '../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack/lib/typescript/src/types';
import { AppButton } from './ButtonComponents';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { FirebaseError } from 'firebase/app';
import { WebView } from 'react-native-webview'; 
import { SafeAreaView } from 'react-native-safe-area-context';

type signupScreenProp = NativeStackNavigationProp<AuthStackParams, 'Signup'>;

export function SignupScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
		const [formInputted, setFormInputted] = useState(false);
    const navigation = useNavigation<signupScreenProp>();

    const createAccount = async () => {
        try {
          await createUserWithEmailAndPassword(auth, email, password)
          showAccountSuccess();
        } catch (error) {
          if ((error as FirebaseError).code === 'auth/invalid-email' || (error as FirebaseError).code === 'auth/wrong-password') {
            setError('Your email is invalid.');
          } else if ((error as FirebaseError).code === 'auth/email-already-in-use') {
            setError('An account with this email already exists');
          } else {
            setError('There was a problem with your request');
          }
        }
      };

    const showAccountSuccess = () =>
        Alert.alert('Your account has been created!', '', [
            {text: 'Continue'},
    ]);
    
    useEffect(() => {
      if (password !== confirmPassword)
        setError("Passwords don't match");
      else
        setError('')
    }, [confirmPassword])
    
    useEffect(() => {
      if ((password.length < 6) && password.length !== 0)
        setError("Password must be at least 6 characters")
      else
        setError('')
    }, [password])
  
    const RegisterWeb = () => {
      return (
				<SafeAreaView style={{ flex: 1 }}>
					<WebView source={{ html: '<script type="text/javascript" src="https://form.jotform.com/jsform/241895780081161"></script>' }} /> 
					<AppButton
						title="Register"
						extraStyles={{ width: 100, alignSelf: "center" }}
						onPress={createAccount}
					/>
				</SafeAreaView>
			)
    }

    return (
				!formInputted ? (
					<SafeAreaView style={styles.outer}>
						<View style={[styles.shadowProp, styles.card, { width: 330 }]}>
							<Text style={styles.header}>Sign up</Text>
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
							<AppButton
								title="Next"
								onPress={() => setFormInputted(true)}
							/>
						</View>
					</SafeAreaView>
				) : <RegisterWeb />
    );
  }

  const styles = StyleSheet.create({
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
  });