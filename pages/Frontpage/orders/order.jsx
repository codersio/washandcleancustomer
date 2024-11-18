import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios'; // For API requests
import { API_ENDPOINTS } from "../../../component/config";

const Orders = () => {
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cartItems, setCartItems] = useState([]); // Cart items fetched from backend
  const [overallTotal, setOverallTotal] = useState(0);
  const [overallTotaladdon, setOverallTotaladdon] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [paymentType, setPaymentType] = useState(''); // e.g., 'cash', 'credit'

  // Fetch cart items from the backend when the component mounts
  useEffect(() => {
    axios
      .post(API_ENDPOINTS.CART) // Use your actual API endpoint here
      .then((response) => {
        console.log(response.data.overall_total_price)
        setCartItems(Object.values(response.data.cart_items)); // Ensure carts is an array
        setOverallTotal(response.data.overall_total_price);
        setOverallTotaladdon(response.data.addon_total_price);
      })
      .catch((error) => {
        console.error("Error fetching cart data:", error);
      });
  }, []);

 const handlePlaceOrder = async () => {
  const formattedOverallTotal = typeof overallTotal === 'string'
    ? parseFloat(overallTotal.replace(/[^0-9.-]/g, ''))
    : parseFloat(overallTotal);


  const formattedOverallTotaladdon = typeof overallTotaladdon === 'string'
    ? parseFloat(overallTotaladdon.replace(/[^0-9.-]/g, ''))
    : parseFloat(overallTotaladdon);

  console.log(overallTotal)
  if (!cartItems || cartItems.length === 0) {
    console.error('Cart items are empty');
    Alert.alert('Error', 'Cart is empty!');
    return;
  }

  try {
    // Assuming cartItems is now an array, you can map through it
    const cartItemsPayload = cartItems.map(item => ({
      service_name: item.service_name,
      service_type_name: item.service_type_name,
      service_id: item.service_id,
      price: item.price,
      quantity: item.quantity,
      addons: item.addons, // Pass the addons as they are
      total_price: item.total_price
    }));

    const orderPayload = {
      customer_name: customerName,
      phone_number: phoneNumber,
      cart_items: cartItemsPayload,
      received_amount: receivedAmount,
      payment_type: paymentType,
      sub_total: formattedOverallTotal,
      addon_total: formattedOverallTotaladdon, // Adjust addon total calculation if needed
    };

    console.log("Order payload:", orderPayload);

    const response = await axios.post(API_ENDPOINTS.ORDER, orderPayload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      Alert.alert('Order placed successfully!', `Order ID: ${response.data.order_id}`);
    } else {
      Alert.alert('Order failed!', 'Please try again.');
    }
  } catch (error) {
    console.error("Order placement failed:", error);
    Alert.alert('Error', 'Failed to place the order.');
  }
};

  return (
    <View style={{ padding: 20 }}>
      <Text>Customer Name</Text>
      <TextInput
        value={customerName}
        onChangeText={setCustomerName}
        placeholder="Enter customer name"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Text>Phone Number</Text>
      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter phone number"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Text>Received Amount</Text>
      <TextInput
        value={receivedAmount}
        onChangeText={setReceivedAmount}
        placeholder="Enter received amount"
        keyboardType="numeric"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Text>Payment Type</Text>
      <TextInput
        value={paymentType}
        onChangeText={setPaymentType}
        placeholder="Enter payment type (e.g., cash, credit)"
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
      />

      <Button title="Place Order" onPress={handlePlaceOrder} />
    </View>
  );
};

export default Orders;
