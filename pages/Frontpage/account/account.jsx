import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import tailwind from 'twrnc';
import { API_ENDPOINTS } from "../../../component/config";
import Footer from "../footer";

const MyAccount = ({ handleNavigation,activePage }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
       

        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get(API_ENDPOINTS.ME, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('User Data:', response); // Debugging
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error); // Debugging

        if (error.response && error.response.status === 401) {
          setError('Unauthorized access. Please log in again.');
          handleNavigation('Login'); // Redirect to login screen
        } else {
          setError(error.message);
        }
        setLoading(false);
      }
    };

    fetchUserData();
  }, [handleNavigation]);

  if (loading) {
    return (
      <View style={tailwind`flex-1 justify-center items-center`}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={tailwind`flex-1 justify-center items-center`}>
        <Text style={tailwind`text-red-500`}>Error: {error}</Text>
        <Button title="Retry" onPress={() => fetchUserData()} />
      </View>
    );
  }

  return (
    <View style={tailwind`flex-1 p-4 bg-white`}>
      <Text style={tailwind`text-xl font-bold mb-4`}>My Account</Text>
      {userData ? (
        <View style={tailwind`bg-gray-100 p-4 rounded-md`}>
          <Text style={tailwind`text-lg font-semibold`}>Name: {userData.name}</Text>
          <Text style={tailwind`text-lg font-semibold`}>Email: {userData.email}</Text>
          <Text style={tailwind`text-lg font-semibold`}>Phone: {userData.phone}</Text>
          {/* Add more fields as needed */}
        </View>
      ) : (
        <Text style={tailwind`text-gray-500`}>No user data available</Text>
      )}
      <Button title="Edit Profile" onPress={() => handleNavigation('EditProfile')} />
      <Footer handleNavigation={handleNavigation} activePage={activePage}/>
    </View>
  );
};

export default MyAccount;
