import React, { useState,useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import tw from 'twrnc';  // Tailwind styling
import { RadioButton } from 'react-native-paper';
import CheckBox from "@react-native-community/checkbox";
import { API_ENDPOINTS } from "../../../component/config";
import axios from 'axios'; // For API requests
const PaymentScreen = ({ selectedAddressId, deliveryDate, deliveryOption }) => {
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [useCredits, setUseCredits] = useState(false);
  const [useOutstanding, setUseOutstanding] = useState(false);
   const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cartItems, setCartItems] = useState([]); // Cart items fetched from backend
  const [overallTotal, setOverallTotal] = useState(0);
  const [overallTotaladdon, setOverallTotaladdon] = useState(0);
  const [receivedAmount, setReceivedAmount] = useState('');
  const [paymentType, setPaymentType] = useState(''); 

  const handleApplyCoupon = () => {
  
  axios
    .post(API_ENDPOINTS.COUPON, { coupon_code: couponCode })
   .then((response) => {
      if (response.data.success) {
        console.log(response.data.new_total_price)
        setDiscountedTotalPrice(response.data.new_total_price); // Update the discounted total price
        setCouponError(""); // Clear any error message
      } else {
        setCouponError(response.data.message); // Display error message
        setDiscountedTotalPrice(null); // Ensure null if coupon fails
      }
    })
    .catch((error) => {
      console.error("Error applying coupon:", error);
      setCouponError("Something went wrong. Please try again."); // General error
      setDiscountedTotalPrice(null); // Ensure null in case of error
    });
};
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
      received_amount: 50,
      payment_type: selectedMethod,
      sub_total: formattedOverallTotal,
       addressid: selectedAddressId,
        deliveryOption: deliveryOption,
      addon_total: formattedOverallTotaladdon, // Adjust addon total calculation if needed
    };
    // Alert(selectedMethod)
    console.log("Order payload:", selectedAddressId);

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


  // Function to handle Place Order click
//   const handlePlaceOrder = () => {
//     const orderDetails = {
//       addressId: selectedAddressId, // Address ID from props
//       deliveryDate: deliveryDate, // Delivery date from props
//       deliveryOption: deliveryOption, // Delivery option from props
//       paymentMethod: selectedMethod, // Selected payment method from state
//       useCredits: useCredits, // Use credits or not
//       useOutstanding: useOutstanding, // Use outstanding or not
//     };

//     // Example: API call or further processing
//     // This is where you would handle your order submission logic
//     // console.log('Order details:', orderDetails.addressid);
//     // Make an API call or show an alert with the order details
//     Alert.alert("Order Placed", `Details: ${selectedMethod}`);
//   };

  return (
    <View style={tw`flex-1 p-4 bg-gray-100`}>
      {/* Navigation Section */}
      {/* <View style={tw`flex-row justify-between`}>
        <TouchableOpacity>
          <View style={tw`items-center`}>
            <Text>Location</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={tw`items-center`}>
            <Text>Delivery</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={tw`items-center`}>
            <Text>Place Order</Text>
          </View>
        </TouchableOpacity>
      </View> */}

      {/* Payment Method Section */}
      <View style={tw`mt-6`}>
        <Text style={tw`text-xl font-semibold`}>Payment method</Text>
        
        {/* LK Credits */}
        {/* <View style={tw`flex-row items-center justify-between p-4 my-2 bg-white rounded-lg`}>
          <View>
            <Text>LK Credits (₹ 0.0)</Text>
            <Text style={tw`text-gray-500`}>₹ 0.0 will be deducted from total payable</Text>
          </View>
          <CheckBox 
            value={useCredits}
            onValueChange={() => setUseCredits(!useCredits)}
          />
        </View> */}

        {/* LK Outstanding */}
        {/* <View style={tw`flex-row items-center justify-between p-4 my-2 bg-white rounded-lg`}>
          <View>
            <Text>LK Outstanding (₹ 0.0)</Text>
            <Text style={tw`text-gray-500`}>₹ 0.0 will be added to total amount</Text>
          </View>
          <CheckBox 
            value={useOutstanding}
            onValueChange={() => setUseOutstanding(!useOutstanding)}
          />
        </View> */}

        {/* Payment Options */}
        <View style={tw`p-4 my-2 bg-white rounded-lg`}>
          <RadioButton.Group
            onValueChange={value => setSelectedMethod(value)}
            value={selectedMethod}
          >
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
      </View>

      {/* Confirm & Pay Button */}
      <TouchableOpacity style={tw`p-4 mt-6 bg-red-500 rounded-lg`} onPress={handlePlaceOrder}>
        <Text style={tw`text-lg font-bold text-center text-white`}>Confirm & Pay</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentScreen;
