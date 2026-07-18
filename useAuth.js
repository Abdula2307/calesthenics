import { useContext } from 'react';
import { AuthContext } from './AppNavigator';
import apiClient, { setAuthToken } from './apiClient';

export default function useAuth() {
  const { userToken, setUserToken } = useContext(AuthContext);

  const logout = () => {
    setAuthToken(null);
    setUserToken(null);
  };

  const isLoggedIn = !!userToken;

  return { userToken, isLoggedIn, logout };
}