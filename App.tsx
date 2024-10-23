import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './screens/Login';
import { SignupScreen } from './screens/Signup';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import { useEffect, useState } from 'react';
import SettingsScreen from './screens/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import RegisterForm from './screens/RegisterForm';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { StripeProvider } from '@stripe/stripe-react-native';
import { Prices } from './constants';

export type AuthStackParams = {
  Login: undefined;
  Signup: undefined;
  RegisterForm: {
    email: string,
    password: string,
    currency: keyof Prices,
    inWFK: string
  };
  resetPassword: undefined;
}

const AuthStack = createNativeStackNavigator<AuthStackParams>();

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [initializing, setInitializing] = useState(true);
  
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return unsubscribe;
  }, [])

  const RootTabs = () => {
    return (
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string;

            if (route.name === 'Home') {
              iconName = focused
                ? 'home'
                : 'home-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            } else {
              iconName = 'list';
            }
            
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#8797AF',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen 
          options={{
            title: "Home", 
            headerShown: true,
            headerTitleAlign: 'center',
          }}
          name="Home"
          component={HomeScreen}
        />
        <Tab.Screen 
          options={{ title: "Settings", headerShown: false }}
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    )
  }

  const RenderContent = () => {
    if (user)
      return <RootTabs />
    else 
      return (
        <AuthStack.Navigator initialRouteName='Signup'>
          <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
          <AuthStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}/>
          <AuthStack.Screen name="RegisterForm" component={RegisterForm} options={{ headerShown: true, title: "Registration Page" }}/>
        </AuthStack.Navigator>
      );
  };

  return (
    <StripeProvider publishableKey={process.env.STRIPE_PUBLISHABLE_KEY as string}>
      <NavigationContainer><RenderContent /></NavigationContainer>
    </StripeProvider>
  )
}