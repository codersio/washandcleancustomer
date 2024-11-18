import React, { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './pages/login/login';
import LogoutScreen from './pages/login/logout';
import Dashboard from './pages/admin/dashboard';
import Booking from './pages/admin/booking';
import OrderDetails from './pages/admin/orderdetails';
import WalletScreen from './pages/admin/wallet';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
  const navigationRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [targetRoute, setTargetRoute] = useState(null); // Store the target route

  // Function to check token validity
  const checkTokenValidity = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log(token);
      if (token) {
        // Additional logic to check token expiration can be added here
        setIsLoggedIn(true); // Assume token is valid if it's present
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Failed to fetch token', error);
      setIsLoggedIn(false);
    }
  };

  // Handle navigation based on login status
  const handleNavigation = (routeName) => {
    if (isLoggedIn) {
      navigationRef.current?.navigate(routeName);
    } else {
      setTargetRoute(routeName); // Store target route
      navigationRef.current?.navigate('Login');
    }
  };

  // Redirect to target route after login
  useEffect(() => {
    if (isLoggedIn && targetRoute) {
      navigationRef.current?.navigate(targetRoute);
      setTargetRoute(null); // Clear target route
    }
  }, [isLoggedIn, targetRoute]);

  // Check token validity on app start
  useEffect(() => {
    checkTokenValidity();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator>
        {/* Show only if user is logged in */}
        {isLoggedIn ? (
          <>
            <Stack.Screen 
              name="Dashboard" 
              options={{
                headerStyle: { backgroundColor: '#007bff' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                contentStyle: { backgroundColor: '#f0f8ff' },
              }}
            >
              {props => <Dashboard {...props} handleNavigation={handleNavigation} />}
            </Stack.Screen>
            <Stack.Screen
              name="Booking"
              options={{
                headerStyle: { backgroundColor: '#007bff' },
                headerTintColor: '#fff',
                headerTitleStyle: { fontWeight: 'bold' },
                contentStyle: { backgroundColor: '#f0f8ff' },
              }}
            >
              {props => <Booking {...props} handleNavigation={handleNavigation} />}
            </Stack.Screen>

            <Stack.Screen name="LogoutScreen" component={LogoutScreen} />
            <Stack.Screen name="OrderDetails" component={OrderDetails} />
            <Stack.Screen name="WalletScreen"  >
               {props => <WalletScreen {...props} handleNavigation={handleNavigation} />}
            </Stack.Screen>
          </>
        ) : (
          <Stack.Screen
            name="Login"
            options={{ headerShown: false }}
          >
            {props => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
