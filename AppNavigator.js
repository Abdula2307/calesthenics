import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useState, createContext } from 'react';

import AuthScreen from './AuthScreen';
import OnboardingScreen from './OnboardingScreen';
import DashboardScreen from './DashboardScreen';
import Day1WorkoutScreen from './Day1WorkoutScreen';
import Day2WorkoutScreen from './Day2WorkoutScreen';

const Stack = createNativeStackNavigator();
export const AuthContext = createContext(null);

export default function AppNavigator() {
  const [userToken, setUserToken] = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  return (
    <AuthContext.Provider value={{ userToken, setUserToken, needsOnboarding, setNeedsOnboarding }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#111' }, headerTintColor: '#fff' }}>
          {!userToken ? (
            <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
          ) : needsOnboarding ? (
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          ) : (
            <>
              <Stack.Screen name="Dashboard" component={DashboardScreen} />
              <Stack.Screen name="Onboarding" component={OnboardingScreen} />
              <Stack.Screen name="Day1Workout" component={Day1WorkoutScreen} options={{ title: 'Day 1: Hypertrophy' }} />
              <Stack.Screen name="Day2Workout" component={Day2WorkoutScreen} options={{ title: 'Day 2: Skills' }} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}