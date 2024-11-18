import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import tw from 'twrnc';
import CheckBox from "@react-native-community/checkbox";
import Icon from "react-native-vector-icons/Ionicons";
import Icosn from "react-native-vector-icons/Entypo";
import Iconc from "react-native-vector-icons/AntDesign";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from "../../../component/config";
import DeliveryOptions from './delivery';
import PaymentScreen from './orderplace';

const Checkout = () => {
  const [currentStep, setCurrentStep] = useState('Location'); 
  const [isPickupSelected, setIsPickupSelected] = useState(true);
  const [isSameLocation, setIsSameLocation] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressDetails, setAddressDetails] = useState({
    address: '',
    pincode: '',
    city: '',
    state: '',
  });
  const [addresses, setAddresses] = useState([]);
  
  // New States
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Track selected address ID
  const [deliveryOption, setDeliveryOption] = useState(null); // Store selected delivery option
  const [deliveryTime, setDeliveryTime] = useState(null); // Store delivery time
  
  const handleConfirmLocation = () => {
    setCurrentStep('Delivery');
  };

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await axios.get(API_ENDPOINTS.ADDRESSESGET, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAddresses(response.data);
      } catch (error) {
        console.error('Error fetching addresses:', error.response ? error.response.data : error.message);
      }
    };
    fetchAddresses();
  }, []);

  const handleInputChange = (field, value) => {
    setAddressDetails({ ...addressDetails, [field]: value });
  };

  const handleAddAddress = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.post(API_ENDPOINTS.ADDRESSES, addressDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setModalVisible(false);

      // Refresh the address list
      const updatedResponse = await axios.get(API_ENDPOINTS.ADDRESSES, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(updatedResponse.data);
    } catch (error) {
      console.error('Error adding address:', error.response ? error.response.data : error.message);
    }
  };

  const handleSelectAddress = (index, id) => {
    setSelectedAddress(index);
    setSelectedAddressId(id); // Store the selected address ID
    setIsPickupSelected(false);
  };

  const handlePlaceOrder = () => {
    setCurrentStep('Placeorder');
  };

  return (
    <View style={tw`flex-1 p-4`}>
      {/* Step Indicator */}
      <View style={tw`flex-row items-center justify-between mt-6 mb-6`}>
        <View style={tw`items-center`}>
          <TouchableOpacity style={tw`p-2 ${selectedAddress !== null ? 'bg-red-500' : 'bg-gray-300'} rounded-full`}>
            <Icosn name="location-pin" size={20} color="white" />
          </TouchableOpacity>
          <Text style={tw`mt-2 font-bold ${selectedAddress !== null ? 'text-red-500' : 'text-gray-500'}`}>Location</Text>
        </View>
        <View style={tw`w-1/4 h-0.5 bg-gray-300`} />
        <View style={tw`items-center`}>
          <TouchableOpacity style={tw`p-2 ${selectedAddress !== null ? 'bg-red-500' : 'bg-gray-300'} rounded-full`}>
            <Icon name="calendar" size={20} color="white" />
          </TouchableOpacity>
          <Text style={tw`mt-2 ${selectedAddress !== null ? 'text-red-500' : 'text-gray-500'}`}>Delivery</Text>
        </View>
        <View style={tw`w-1/4 h-0.5 bg-gray-300`} />
        <View style={tw`items-center`}>
          <TouchableOpacity style={tw`p-2 bg-gray-300 rounded-full`}>
            <Iconc name="creditcard" size={20} color="gray" />
          </TouchableOpacity>
          <Text style={tw`mt-2 text-gray-500`}>Place Order</Text>
        </View>
      </View>

      {/* Header and Tabs */}
      {/* <View style={tw`flex-row justify-around border-b border-gray-300`}>
        <TouchableOpacity
          style={[
            tw`px-4 py-2 border-b-2`,
            isPickupSelected ? tw`border-red-500` : tw`border-transparent`
          ]}
          onPress={() => setIsPickupSelected(true)}
        >
          <Text style={tw`text-center ${isPickupSelected ? 'text-red-500' : 'text-gray-500'}`}>
            Pickup Address
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tw`px-4 py-2 border-b-2`,
            !isPickupSelected ? tw`border-red-500` : tw`border-transparent`
          ]}
          onPress={() => setIsPickupSelected(false)}
        >
          <Text style={tw`text-center ${!isPickupSelected ? 'text-red-500' : 'text-gray-500'}`}>
            Delivery Address
          </Text>
        </TouchableOpacity>
      </View> */}

      {currentStep === 'Location' && (
        <>
          {/* {isPickupSelected && (
            <View style={tw`flex-row items-center mt-4`}>
              <CheckBox
                value={isSameLocation}
                onValueChange={setIsSameLocation}
              />
              <Text style={tw`ml-2`}>Delivery location same as pickup location</Text>
            </View>
          )} */}

          {/* Addresses List */}
          <ScrollView style={tw` w-full h-[50%]   overflow-hidden`}>
            {addresses && addresses.length > 0 ? (
              addresses.map((address, index) => (
                <TouchableOpacity key={index} onPress={() => handleSelectAddress(index, address.id)}>
                  <View style={tw`p-4 mb-4 ${selectedAddress === index ? 'bg-red-100 border-red-500' : 'bg-white border-gray-300'} border rounded-md`}>
                    <Text style={tw`text-lg font-bold ${selectedAddress === index ? 'text-red-500' : 'text-gray-700'}`}>{address.address}</Text>
                    <Text style={tw`text-gray-500`}>
                      {address.city}, {address.state}, {address.pincode}, India
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={tw`text-center text-gray-500`}>No addresses found. Please add a new address.</Text>
            )}
          </ScrollView>

          {/* Add Address Button */}
          <TouchableOpacity
            style={tw`w-[8rem] absolute bottom-25 right-9 px-4 py-2 mt-8 bg-red-500 rounded-full`}
            onPress={() => setModalVisible(true)}
          >
            <Text style={tw`text-center text-white`}>Add Address</Text>
          </TouchableOpacity>

          {/* Confirm Button */}
          <TouchableOpacity style={tw`absolute py-3 mt-8 bg-red-500 rounded bottom-5 right-8 left-8`} onPress={handleConfirmLocation}>
            <Text style={tw`text-center text-white`}>Confirm Location</Text>
          </TouchableOpacity>

          {/* Modal for Adding Address */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={tw`items-center justify-center flex-1 bg-gray-800 bg-opacity-50`}>
              <View style={tw`w-3/4 p-4 bg-white rounded-lg`}>
                <Text style={tw`mb-2 text-lg font-bold`}>Add Address</Text>
                <TextInput
                  placeholder="Address"
                  value={addressDetails.address}
                  onChangeText={(text) => handleInputChange('address', text)}
                  style={tw`p-2 mb-2 border border-gray-300 rounded`}
                />
                <TextInput
                  placeholder="Pincode"
                  value={addressDetails.pincode}
                  onChangeText={(text) => handleInputChange('pincode', text)}
                  style={tw`p-2 mb-2 border border-gray-300 rounded`}
                />
                <TextInput
                  placeholder="City"
                  value={addressDetails.city}
                  onChangeText={(text) => handleInputChange('city', text)}
                  style={tw`p-2 mb-2 border border-gray-300 rounded`}
                />
                <TextInput
                  placeholder="State"
                  value={addressDetails.state}
                  onChangeText={(text) => handleInputChange('state', text)}
                  style={tw`p-2 mb-2 border border-gray-300 rounded`}
                />
                <TouchableOpacity style={tw`p-2 bg-red-500 rounded`} onPress={handleAddAddress}>
                  <Text style={tw`text-center text-white`}>Add Address</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={tw`absolute p-1 bg-red-500 rounded-full top-2 right-2`}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={tw`font-bold text-white`}>X</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}

      {currentStep === 'Delivery' && (
        <>
          <DeliveryOptions
            selectedAddress={selectedAddressId} // Pass the selected address ID
            deliveryOption={deliveryOption} // Pass selected delivery option
            setDeliveryOption={setDeliveryOption} // Set delivery option from child component
            setDeliveryTime={setDeliveryTime} // Set delivery time from child component
            handlePlaceOrder={handlePlaceOrder} // Pass down the place order function
          />
        </>
      )}

      
      {currentStep === 'Placeorder' && (
        <>
         <PaymentScreen
  selectedAddressId={selectedAddressId}
  // deliveryDate={deliveryDate}
  deliveryOption={deliveryOption}
/>
        </>
      )}
    </View>
  );
};

export default Checkout;
