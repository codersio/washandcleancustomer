import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import Footer from '../../component/footer';
import { API_ENDPOINTS } from "../../component/config";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Booking = ({ handleNavigation,navigation }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const response = await axios.post(
            API_ENDPOINTS.ORDERDELIVERY,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Log the entire response to check its structure
          console.log('API response:', response.data);

          // Adjust based on the actual structure of the API response
          setOrders(response.data.data || []); 
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleAccept = async (orderId) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    
    // Log the endpoint to verify it's correct
    const endpoint = `${API_ENDPOINTS.ORDERSACCEPT}/${orderId}`;
    console.log('Orders Accept Endpoint:', endpoint);
    
    if (token) {
      const response = await axios.post(
        endpoint, // Make sure this is the correct endpoint
        { deliveryacc_id: 1 }, // Include necessary parameters
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Log response for debugging
      console.log('Response from accept API:', response.data);

      // Refresh orders after updating
      const refreshResponse = await axios.post(
        API_ENDPOINTS.ORDERDELIVERY,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(refreshResponse.data.data || []);
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    if (error.response) {
      console.error('Server responded with:', error.response.data);
    }
  }
};


  return (
    <View style={tailwind`flex-1`}>
      <ScrollView contentContainerStyle={tailwind`p-4`}>
        <Text style={tailwind`text-xl font-bold mb-4`}>Orders</Text>
        {orders.length === 0 ? (
          <Text>No orders found.</Text>
        ) : (
          orders.map((order, index) => (
            <View key={index} style={tailwind`bg-white p-4 mb-4 rounded-lg shadow relative`}>
              <Text style={tailwind`text-lg font-semibold`}>#{order.order_number}</Text>
              <Text style={tailwind`text-gray-600`}>
                {order.status === 0 ? "Pending" :
                 order.status === 1 ? "Pickup" :
                 order.status === 2 ? "Delivered" :
                 order.status === 3 ? "Cancelled" :
                 "Unknown"}
              </Text>
              <Text style={tailwind`text-gray-600`}>Total: ${order.total}</Text>
              {/* Add more fields as necessary */}
              {order.deliveryacc_id === 0 ? (
                <TouchableOpacity 
                  style={tailwind`bg-blue-200 p-2 rounded-lg absolute top-10 right-5`}
                  onPress={() => handleAccept(order.id)} // Pass the order ID to handleAccept
                >
                  <Text style={tailwind`text-white text-center`}>Accept</Text>
                </TouchableOpacity>
              ) : order.deliveryacc_id === 1 ? (
                <TouchableOpacity 
                  style={tailwind`bg-blue-200 p-2 rounded-lg absolute top-10 right-5`}
                  onPress={() => navigation.navigate('OrderDetails', { orderId: order.id })}
                >
                  <Text style={tailwind`text-white text-center`}>View Orders</Text>
                </TouchableOpacity>
              ) : <TouchableOpacity 
                  style={tailwind`bg-blue-200 p-2 rounded-lg absolute top-10 right-5`}
                  onPress={() => handleAccept(order.id)} // Pass the order ID to handleAccept
                >
                  <Text style={tailwind`text-white text-center`}>Accept</Text>
                </TouchableOpacity>}
            </View>
          ))
        )}
      </ScrollView>
      <Footer handleNavigation={handleNavigation} />
    </View>
  );
};

export default Booking;
