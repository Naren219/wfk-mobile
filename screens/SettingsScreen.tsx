import { Alert, Text, View } from 'react-native'
import React from 'react'
import { AuthButton, DeleteAccountButton } from './ButtonComponents'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const SettingsScreen = () => {
  const showConfirmDel = () =>
    Alert.alert('Are you sure you want to delete your account?', 'Click cancel to keep your account. ', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Delete', onPress: () => delAccount()},
    ]);
    
  const delAccount = async () => {
    firestore().collection('users').doc(auth().currentUser!.uid).delete()
    let user = auth().currentUser;
    user!.delete()
  }

  const showConfirmLogout = () =>
    Alert.alert('Are you sure you want to log out?', 'Click cancel to stay on. ', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Log out', onPress: () => logout()},
    ]);

  const logout = async () => {
    try {
      await auth().signOut();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={{ alignItems: "center", marginTop: 120 }}>
      <Text style={{ fontSize: 25 }}>Settings</Text>
      <AuthButton title="Log out" onPress={showConfirmLogout} extraStyles={{ marginTop: 15 }}/>
      <DeleteAccountButton title="Delete account" onPress={showConfirmDel} extraStyles={{ marginTop: 20, borderColor: "red" }}/>
    </View>
  )
}

export default SettingsScreen