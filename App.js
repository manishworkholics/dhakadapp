import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/screens/SplashScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import OtpScreen from "./src/screens/OtpScreen";
import EmailOtpScreen from "./src/screens/EmailOtpScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import MatchesScreen from "./src/screens/MatchesScreen";
import InterestScreen from "./src/screens/InterestScreen";
import ChatScreen from "./src/screens/ChatScreen";
import ShortlistScreen from "./src/screens/ShortlistScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import PartnerPreferenceScreen from "./src/screens/PartnerPreferenceScreen";
import PlanScreen from "./src/screens/PlanScreen";
import CreateProfileScreen from "./src/screens/CreateProfile/CreateProfileScreen";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="EmailOtp" component={EmailOtpScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Matches" component={MatchesScreen} />
        <Stack.Screen name="Interest" component={InterestScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Shortlist" component={ShortlistScreen} />
        <Stack.Screen name="Notification" component={NotificationScreen} />
        <Stack.Screen name="Plan" component={PlanScreen} />
        <Stack.Screen name="PartnerPreference" component={PartnerPreferenceScreen} />
        <Stack.Screen name="CreateProfile" component={CreateProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
