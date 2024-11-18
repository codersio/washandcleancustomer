import React, { useEffect, useState,useRef  } from 'react';
import { Text, View, ActivityIndicator, ScrollView, Modal, Button, TouchableOpacity,TextInput } from 'react-native';
import tailwind from 'twrnc';
import { API_ENDPOINTS } from "../../component/config";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Picker} from '@react-native-picker/picker';
import RNPickerSelect from 'react-native-picker-select';


const OrderDetails = ({ route }) => {
  const { orderId } = route.params; // Get the order ID from navigation params
const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPaymentType, setSelectedPaymentType] = useState('');
  const [receivedAmount, setReceivedAmount] = useState('');
  const [duePayment, setDuePayment] = useState('');
   const [selectedStatus, setSelectedStatus] = useState( '');
   const [editedQuantity, setEditedQuantity] = useState('');
   const [isQtyModalVisible, setQtyModalVisible] = useState(false);
const pickerRef = useRef();
  useEffect(() => {
    fetchOrderDetails();
  }, []);
 

  const parseAddonDetails = (addonDetails) => {
    if (!addonDetails) return [];
    return addonDetails.split(', ').map((addon) => {
      const [name, price] = addon.split(' - ').map((item) => item.trim());
      return { name, price };
    });
  };
  const fetchOrderDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      console.log('API Endpoint:', `${API_ENDPOINTS.ORDERSDELIVERY}/${orderId}`);
      if (token) {
        const response = await axios.get(
          `${API_ENDPOINTS.ORDERSDELIVERY}/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data);
        setOrderDetails(response.data.data || null);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

    const handleQuantitySave = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const updatedData = {
        order_id: orderDetails.id,
        service_id: orderDetails.service_id,
        new_quantity: editedQuantity, // Pass the updated quantity to the backend
      };
      console.log(updatedData);

      if (token) {
        const response = await axios.post(`${API_ENDPOINTS.CUPDATE_QTY_ORDER}`, updatedData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchOrderDetails(); // Fetch updated order details after saving
        console.log('Order quantity updated successfully:', response.data);
        setQtyModalVisible(false); // Close modal after saving
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };
  // Function to handle payment type selection
  const handlePayment = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const paymentData = {
        order_id: orderDetails.id,
        // received_amount: setReceivedAmount,
        payment_type: selectedPaymentType, // Use the selected payment type from state
        paid_amount:receivedAmount, // Example: using service price as paid amount
        pstatus: '1', // Assume '1' means completed
      };
console.log(paymentData)
      if (token) {
        const response = await axios.post(`${API_ENDPOINTS.PROCESS_PAYMENT}`, paymentData, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchOrderDetails();
        console.log('Payment processed successfully:', response.data);
        setModalVisible(false); // Close modal after payment processing
      }
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };
  



  const parsePaymentDetails = (paymentDetails) => {
    if (!paymentDetails) return [];
    return paymentDetails.split(', ').map((payment) => {
      const [amount, date, status] = payment.split(' - ').map((item) => item.trim());
      return { amount, date, status };
    });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
const totalReceivedAmount = parseFloat(orderDetails.total_received_amount) || 0;
  const totalAmount = parseFloat(orderDetails.total) || 0;
  const duePayments = totalReceivedAmount - totalAmount;
  console.log('rc',orderDetails.total_received_amount)
  console.log('total',totalAmount)
   const handleStatusChange = async (newStatus) => {
    try {
      setSelectedStatus(newStatus); // Update state immediately for a better UI response
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const response = await axios.post(
          `${API_ENDPOINTS.UPDATE_ORDER_STATUS}`, // Replace with your endpoint
          {
            order_id: orderDetails.id,
            status: newStatus, // New status to be updated
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log('Order status updated successfully:', response.data);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };
  return (
    <ScrollView style={tailwind`flex-1 p-1`}>
      {orderDetails ? (
        <View style={tailwind` p-2 mb-4 rounded-lg`}>
          <View>
            <Text style={tailwind`text-sm font-semibold`}>Order ID: #{orderDetails.order_number}</Text>
          </View>
          <View style={tailwind`shadow bg-white p-3 rounded`}>
            <Text style={tailwind`text-sm underline`}>Customer Details</Text>
            <View>
              <Text style={tailwind`font-bold`}>{orderDetails.cname}</Text>
              <Text style={tailwind`text-sm`}>{orderDetails.phone}</Text>
              <Text style={tailwind`text-sm`}>{orderDetails.email}</Text>
              <Text style={tailwind`text-sm`}>{orderDetails.customer_address} {orderDetails.city},{orderDetails.state},{orderDetails.customer_pincode}</Text>
            </View>
          </View>
          <View style={tailwind`shadow bg-white p-3 rounded mt-5`}>
            <Text style={tailwind`text-sm underline`}>Order Details</Text>
            <View>
              <Text style={tailwind`font-bold`}>{orderDetails.sname}/{orderDetails.service_quantity} </Text>
              <Text style={tailwind`text-sm font-semibold mt-4`}>Service Type:</Text>
              <View style={tailwind`text-sm flex-row justify-between`}>
                <Text>{orderDetails.service_name}</Text>
                <Text>${orderDetails.service_price}</Text>
              </View>
              <Text style={tailwind`text-sm font-semibold mt-4`}>Add-ons:</Text>
            {parseAddonDetails(orderDetails.addon_details).map((addon, index) => (
  <View key={`addon-${index}`} style={tailwind`text-sm text-blue-800 flex-row justify-between`}>
    <Text style={tailwind`text-sm`}>{addon.name}</Text>
    <Text>${addon.price}</Text>
  </View>
))}
 <TouchableOpacity
                style={tailwind`mt-3 bg-blue-500 p-2 rounded`}
                onPress={() => {
                  setQtyModalVisible(true);
                  setEditedQuantity(orderDetails.service_quantity.toString()); // Initialize with current quantity
                }}
              >
                <Text style={tailwind`text-white text-center`}>Edit Quantity</Text>
              </TouchableOpacity>
{/* Quantity Edit Modal */}
          <Modal visible={isQtyModalVisible} transparent={true}>
            <View style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-50`}>
              <View style={tailwind`bg-white p-5 rounded-lg w-11/12`}>
                <Text style={tailwind`font-semibold mb-4`}>Edit Order Quantity</Text>
                <TextInput
                  style={tailwind`border p-2 mb-4`}
                  value={editedQuantity}
                  onChangeText={setEditedQuantity}
                  keyboardType="numeric"
                />
                <View style={tailwind`flex-row justify-end gap-4`}>
                  <Button title="Cancel" onPress={() => setQtyModalVisible(false)} />
                  <Button title="Save" onPress={handleQuantitySave} />
                </View>
              </View>
            </View>
          </Modal>
            </View>
          </View>
          <View style={tailwind`shadow bg-white p-3 rounded mt-5`}>
            <Text style={tailwind`text-sm underline`}>Payment Details</Text>
            <View style={tailwind`border-t border-gray-300`}>
              <View style={tailwind`flex-row border-b border-gray-300 py-2`}>
                <Text style={tailwind`w-1/5 text-sm font-bold text-black `}>Amount</Text>
                <Text style={tailwind`w-2/5 text-sm font-bold text-black text-center`}>Date</Text>
                <Text style={tailwind`w-2/5 text-[0.7rem] font-bold text-black text-center`}>Payment Mode</Text>
              </View>
            {parsePaymentDetails(orderDetails.payment_details).map((payment, index) => (
  <View key={`payment-${index}`} style={tailwind`flex-row py-2 border-b border-gray-200`}>
    <Text style={tailwind`w-2/5 text-sm text-blue-800`}>${payment.amount}</Text>
    <Text style={tailwind`w-2/5 text-sm text-blue-800`}> {new Date(payment.date).toLocaleDateString()}</Text>
    <Text style={tailwind`w-2/5 text-sm text-blue-800`}>
      {payment.status === '1' ? 'Cash' : payment.status === '2' ? 'UPI' : ''}
    </Text>
  </View>
))}

            </View>
          </View>

          
<View style={tailwind`shadow bg-white p-3 rounded mt-5`}>
            
            <View>
             
              {/* <Text style={tailwind`text-sm font-semibold mt-4`}>Service Type:</Text> */}
              <View style={tailwind`text-sm flex-row justify-between`}>
                <Text>Sub total </Text>
                <Text>${orderDetails.sub_total}</Text>
              </View>
             
              <View style={tailwind`text-sm flex-row justify-between`}>
                <Text style={tailwind`text-sm font-semibold mt-4`}>Add-ons total:</Text>
                <Text style={tailwind`text-sm font-semibold mt-4`}>${orderDetails.addon_total}</Text>
              </View>
               <View style={tailwind`text-sm flex-row justify-between`}>
                <Text style={tailwind`text-sm font-semibold mt-4`}>Total:</Text>
                <Text style={tailwind`text-sm font-semibold mt-4`}>${orderDetails.total}</Text>
              </View>
              <View style={tailwind`text-sm flex-row justify-between`}>
                <Text style={tailwind`text-sm font-semibold mt-4`}>Due amount:</Text>
                <Text style={tailwind`text-sm font-semibold mt-4`}>${duePayments}</Text>
              </View>


            </View>
          </View>

         <View style={tailwind `flex-row gap-3 justify-end`}>
        <View style={tailwind`mt-4 `}>
            {/* <Text style={tailwind`text-sm font-semibold `}>Order Status</Text> */}
           <TouchableOpacity
        onPress={() => {
          pickerRef.current.togglePicker(); // Opens the picker on label click
        }}
        style={tailwind`flex-row items-center`}
      >
        <Text style={tailwind`text-sm font-semibold mr-2`}>Order Status:</Text>
      </TouchableOpacity>

      {/* RNPickerSelect component */}
      <RNPickerSelect
        ref={pickerRef} // Use ref to control picker
        onValueChange={handleStatusChange}
        items={[
          { label: 'Pickup', value: '1' },
          { label: 'Processing', value: '2' },
          { label: 'Ready to deliver', value: '3' },
          { label: 'Delivered', value: '4' },
          { label: 'Return', value: '5' },
        ]}
        placeholder={{ label: 'select status', value: null }}
        style={{
          inputIOS: tailwind`border border-gray-300 rounded p-2`, // iOS styling
          inputAndroid: tailwind`border border-gray-300 rounded p-2`, // Android styling
        }}
        value={selectedStatus} // Controlled input value
        useNativeAndroidPickerStyle={false} // Prevents default Android picker style
      />
          </View>
           {/* Payment Button */}
             {duePayments < 0 ? (
            <TouchableOpacity style={tailwind`mt-5 p-3 bg-blue-500 rounded`} onPress={() => setModalVisible(true)}>
              <Text style={tailwind`text-white text-center`}>Make Payment</Text>
            </TouchableOpacity>
          ) : (
            <View style={tailwind`mt-5 p-3 bg-green-500 rounded`}>
              <Text style={tailwind`text-white text-center`}>Payment Full</Text>
            </View>
          )}
         </View>

          {/* Modal for Payment Type Selection */}
        <Modal visible={isModalVisible} transparent={true} animationType="slide">
            <View style={tailwind`flex-1 justify-center items-center bg-black bg-opacity-50`}>
              <View style={tailwind`w-4/5 bg-white p-5 rounded-lg`}>
                <Text style={tailwind`text-lg font-bold mb-4`}>Select Payment Type</Text>
                
                {/* Picker for Payment Type */}
                <Picker
                  selectedValue={selectedPaymentType}
                  onValueChange={(itemValue) => setSelectedPaymentType(itemValue)}
                  style={tailwind`border border-gray-300 rounded p-2`}
                >
                  <Picker.Item label="Select Payment Type" value="" />
                  <Picker.Item label="Cash" value="1" />
                  <Picker.Item label="UPI" value="2" />
                </Picker>

                {/* Received Amount Input Field */}
                <TextInput
                  style={tailwind`border border-gray-300 rounded p-2 mt-4`}
                  placeholder="Enter Received Amount"
                  keyboardType="numeric"
                  value={receivedAmount}
                  onChangeText={(text) => setReceivedAmount(text)}
                />

                {/* Display Due Payment */}
                <Text style={tailwind`text-sm mt-2`}>Due Payment: ${duePayments}</Text>
                {/* <Text style={tailwind`text-sm mt-2`}>t Payment: ${orderDetails.total}</Text> */}

                {/* Modal Action Buttons */}
                <View style={tailwind`flex-row justify-end mt-4`}>
                  <Button title="Cancel" color="red" onPress={() => setModalVisible(false)} />
                  <Button title="Confirm Payment" onPress={handlePayment} />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      ) : (
        <Text>No details found for this order.</Text>
      )}
    </ScrollView>
  );
};

export default OrderDetails;
