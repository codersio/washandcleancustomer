import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { RadioButton } from 'react-native-paper';

import axios from 'axios'; 
import tw from 'twrnc';
import tailwind from "twrnc"; // Tailwind styling
import { API_ENDPOINTS } from "../../../component/config";

const PaymentScreen = ({ selectedAddressId, deliveryDate, deliveryOption }) => {
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cartItems, setCartItems] = useState([]); 
  const [overallTotal, setOverallTotal] = useState(0);
  const [overallTotaladdon, setOverallTotaladdon] = useState(0);
  const [discountedTotalPrice, setDiscountedTotalPrice] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false); // To disable button during API call

  // Function to apply coupon
  const handleApplyCoupon = () => {
    axios.post(API_ENDPOINTS.COUPON, { coupon_code: couponCode })
      .then((response) => {
        if (response.data.success) {
          setDiscountedTotalPrice(response.data.new_total_price);
          setCouponError('');
        } else {
          setCouponError(response.data.message);
          setDiscountedTotalPrice(null);
        }
      })
      .catch(() => {
        setCouponError("Something went wrong. Please try again.");
        setDiscountedTotalPrice(null);
      });
  };

  // Fetch cart data on mount
  useEffect(() => {
    axios.post(API_ENDPOINTS.CART)
      .then((response) => {
        setCartItems(Object.values(response.data.cart_items));
        setOverallTotal(response.data.overall_total_price);
        setOverallTotaladdon(response.data.addon_total_price);
      })
      .catch((error) => {
        console.error("Error fetching cart data:", error);
      });
  }, []);

  // Handle order placement
  // import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { Alert } from 'react-native';

const handlePlaceOrder = async () => {
  setIsPlacingOrder(true); // Disable button while processing

  if (!cartItems || cartItems.length === 0) {
    Alert.alert('Error', 'Cart is empty!');
    setIsPlacingOrder(false);
    return;
  }

  const formattedOverallTotal = typeof overallTotal === 'string'
    ? parseFloat(overallTotal.replace(/[^0-9.-]/g, ''))
    : parseFloat(overallTotal);

  const formattedOverallTotaladdon = parseFloat(overallTotaladdon);

  try {
    // Retrieve JWT token from AsyncStorage
    const token = await AsyncStorage.getItem('userToken');

    if (!token) {
      Alert.alert('Error', 'User not authenticated. Please log in again.');
      setIsPlacingOrder(false);
      return;
    }

    // Prepare payload
    const cartItemsPayload = cartItems.map(item => ({
      service_name: item.service_name,
      service_type_name: item.service_type_name,
      service_id: item.service_id,
      price: item.price,
      quantity: item.quantity,
      addons: item.addons,
      total_price: item.total_price
    }));

    const orderPayload = {
      customer_name: customerName,
      phone_number: phoneNumber,
      cart_items: cartItemsPayload,
      payment_type: selectedMethod,
      received_amount: 50,
      sub_total: formattedOverallTotal,
      addressid: selectedAddressId,
      deliveryOption: deliveryOption,
      addon_total: formattedOverallTotaladdon,
      total_price: discountedTotalPrice || formattedOverallTotal // Use discounted total if applied
    };

    // Log payload for debugging
    console.log('Order Payload:', orderPayload);

    // Make the API request with JWT token in Authorization header
    const response = await axios.post(API_ENDPOINTS.ORDER, orderPayload, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (response.status === 200) {
      Alert.alert('Order placed successfully!', `Order ID: ${response.data}`);
    } else {
      Alert.alert('Order failed!', 'Please try again.');
    }
  } catch (error) {
    // Log error for debugging
    console.error('Order placement error:', error.response ? error.response.data : error.message);
    Alert.alert('Error', 'Failed to place the order.');
  } finally {
    setIsPlacingOrder(false); // Re-enable button
  }
};


  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      <View style={tw`mt-6 `}>
      <ScrollView style={tailwind `h-72`}>
          <Text style={tw`text-xl font-semibold`}>Payment method</Text>
        <View style={tw`p-4 my-2 bg-white rounded-lg`}>
          <RadioButton.Group onValueChange={value => setSelectedMethod(value)} value={selectedMethod}>
            <View style={tw`flex-row items-center justify-between`}>
              <View>
                <Text>Cash on delivery</Text>
                <Text style={tw`text-gray-500`}>Pay after delivery made</Text>
              </View>
              <RadioButton value="1" />
            </View>
            <View style={tw`flex-row items-center justify-between mt-4`}>
              <View>
                <Text>Pay Online</Text>
                <Text style={tw`text-gray-500`}>Pay via RazorPay</Text>
              </View>
              <RadioButton value="0" />
            </View>
          </RadioButton.Group>
        </View>

        {/* Coupon Section */}
        <View style={tailwind`p-4 bg-white mt-4`}>
          <Text style={tailwind`text-sm`}>Have a coupon code?</Text>
          <View style={tailwind`flex-row mt-2`}>
            <TextInput
              style={tailwind`border p-2 flex-1 rounded`}
              placeholder="Enter coupon code"
              value={couponCode}
              onChangeText={setCouponCode}
            />
            <TouchableOpacity onPress={handleApplyCoupon} style={tailwind`bg-blue-500 p-2 ml-2 rounded`}>
              <Text style={tailwind`text-white`}>Apply</Text>
            </TouchableOpacity>
          </View>
          {couponError ? <Text style={tailwind`text-red-500 mt-2`}>{couponError}</Text> : null}
        </View>

        {/* Summary Section */}
        <View style={tw`mt-4`}>
          <Text style={tw`text-xl font-semibold`}>Summary</Text>
          <View style={tw`mt-4`}>
            <Text>Subtotal: ₹ {overallTotal}</Text>
            <Text>Add-ons: ₹ {overallTotaladdon}</Text>
            <Text>Total: ₹ {discountedTotalPrice || overallTotal}</Text>
          </View>
        </View>
      </ScrollView>

        {/* Confirm & Pay Button */}
      
      </View>
        <TouchableOpacity 
          style={[tw`absolute bottom-0 p-2 mt-6 bg-red-500 rounded-lg right-8 left-8`, isPlacingOrder ? tw`opacity-50` : tw`opacity-100`]} 
          onPress={handlePlaceOrder}
          disabled={isPlacingOrder}
        >
          <Text style={tw`text-lg font-bold text-center text-white`}>Confirm & Pay</Text>
        </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;
