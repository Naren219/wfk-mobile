import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

const HomeScreen = () => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Handle user state changes
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return unsubscribe;
  }, [])
  
  if (initializing) return null;

  return (
    <SafeAreaView>
      <Text style={styles.header}>
        Welcome!
      </Text>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  unclickableRequests: { 
    borderWidth: 0.5,
    overflow: 'hidden',
    borderRadius: 10,
    marginVertical: 5,
    borderColor: "#9e9e9e", 
    padding: 9, 
    backgroundColor: "#d5dcf5"
  },
  header: { 
    fontSize: 23, 
    marginBottom: 10, 
    alignSelf: "center"
  },
})