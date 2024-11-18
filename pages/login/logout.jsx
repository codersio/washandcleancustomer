import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleLogout = async ({navigation}) => {
  try {
    await AsyncStorage.removeItem('userToken');
    console.log('Token removed successfully.');
    navigation.navigate('Login'); // Navigate to login screen after logout
  } catch (error) {
    console.error('Failed to remove token', error);
  }
};

const LogoutScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>You are logged in</Text>
      <Button title="Logout" onPress={() => handleLogout(navigation)} />
    </View>
  );
};

export default LogoutScreen;
