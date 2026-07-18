import { StatusBar } from 'expo-status-bar';
import AppNavigator from './AppNavigator';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}