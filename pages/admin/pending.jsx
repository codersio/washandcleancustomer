import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../../component/footer';
import { API_ENDPOINTS } from "../../component/config";

const PendingOrder = ({ handleNavigation, navigation }) => {
  const [orders, setOrders] = useState([]);
  const [distances, setDistances] = useState([]);

  useEffect(() => {
   const fetchPendingOrders = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      const response = await axios.get(API_ENDPOINTS.PENDINGORDER, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure "Bearer" prefix is used
        },
      });
      setOrders(response.data.data || []);
    } else {
      console.error('Token is missing');
    }
  } catch (error) {
    console.error('Error fetching pending orders:', error.response ? error.response.data : error.message);
  }
};


    fetchPendingOrders();
  }, []);

  useEffect(() => {
    const fetchDistances = async () => {
      try {
        const storeId = 10; // Replace with your actual store ID
        const response = await axios.get(
          `${API_ENDPOINTS.CUSTOMERDISTSNCE}/${storeId}`
        );

        setDistances(response.data || []);
      } catch (error) {
        console.error('Error fetching distances:', error);
      }
    };

    fetchDistances();
  }, []);

  const handleAccept = async (orderId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const endpoint = `${API_ENDPOINTS.ORDERSACCEPT}/${orderId}`;

      if (token) {
        await axios.post(
          endpoint,
          { deliveryacc_id: 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
    }
  };

  return (
    <View style={tailwind`flex-1`}>
      <ScrollView contentContainerStyle={tailwind`p-4`}>
        <Text style={tailwind`text-xl font-bold mb-4 text-black`}>Orders</Text>
        {orders.length === 0 ? (
          <Text>No orders found.</Text>
        ) : (
          orders.map((order, index) => (
            <View key={index} style={tailwind`bg-white p-4 mb-4 rounded-lg shadow relative`}>
              <Text style={tailwind`text-lg font-semibold text-black`}>#{order.order_number}</Text>
              <Text style={tailwind`text-gray-600`}>
                {order.status === 0 ? "Pending" :
                 order.status === 1 ? "Pickup" :
                 order.status === 2 ? "Processing" :
                   order.status === 3 ? "Ready to Deliver" :
                   order.status === 4 ? "Deliverd" :
                 order.status ===5 ? "Canceled" :
                 "Unknown"}
              </Text>
              <Text style={tailwind`text-gray-600`}>Total: ${order.total}</Text>
              {/* Display distances if available */}
              {distances.length > 0 && distances.map((distance, idx) => (
                <Text key={idx} style={tailwind`text-gray-600`}>
                  Customer #{distance.customer_id} is {distance.distance.toFixed(2)} km away
                </Text>
              ))}
              {order.deliveryacc_id === 0 ? (
                <TouchableOpacity 
                  style={tailwind`bg-blue-200 p-2 rounded-lg absolute top-10 right-5`}
                  onPress={() => handleAccept(order.id)}
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
              ) : (
                <TouchableOpacity 
                  style={tailwind`bg-blue-200 p-2 rounded-lg absolute top-10 right-5`}
                  onPress={() => handleAccept(order.id)}
                >
                  <Text style={tailwind`text-white text-center`}>Accept</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>
      {/*<Footer handleNavigation={handleNavigation} />*/}
    </View>
  );
};

export default PendingOrder;
