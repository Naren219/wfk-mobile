import { NavigationContainer, NavigatorScreenParams } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from './screens/Login';
import { SignupScreen } from './screens/Register';

export type AuthStackParams = {
  Login: undefined;
  Signup: undefined;
  resetPassword: undefined;
}

const AuthStack = createNativeStackNavigator<AuthStackParams>();

export default function App() {
  return (
    <NavigationContainer>
      <AuthStack.Navigator initialRouteName='Signup'>
        <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
        <AuthStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }}/>
      </AuthStack.Navigator>
    </NavigationContainer>
  );
}