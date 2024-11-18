import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Correctly import the Icon
// import DateTimePicker from '@react-native-community/datetimepicker'; // Import the DateTimePicker component for pickup time
import tw from 'twrnc'; // Tailwind utility for styling

const DeliveryOptions = ({
  selectedAddress, // Address ID passed from parent
  deliveryOption, // Current selected delivery option from parent
  setDeliveryOption, // Function to set delivery option in parent
  setDeliveryTime, // Function to set delivery time in parent
  handlePlaceOrder, // Function to handle order placement in parent
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());

  // Handle delivery option selection
  const handleOptionSelect = (optionType) => {
    setDeliveryOption(optionType); // Set delivery option in parent state
  };

  // Delivery options array
  const deliveryOptions = [
    {
      type: 'Regular Delivery',
      description: 'Delivery will be made after 6 days',
    },
    {
      type: 'Fast Delivery',
      description: 'Delivery in 2 days, 50% additional charge applicable',
    },
    {
      type: 'Express Delivery',
      description: 'Delivery in 1 day, 100% additional charge applicable',
    },
  ];

  // Handle date change
  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || new Date();
    setShowDatePicker(false);
    setSelectedDate(currentDate);
    setDeliveryTime(currentDate);
  };

  // Handle time change
  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || new Date();
    setShowTimePicker(false);
    setSelectedTime(currentTime);
    setDeliveryTime(currentTime);
  };

  return (
    <ScrollView style={tw`p-4 bg-gray-100`}>
      {/* Delivery Type Section */}
      <View style={tw`p-4 bg-white rounded-lg shadow mb-6`}>
        <Text style={tw`text-lg font-semibold mb-4`}>Delivery Type</Text>
        {deliveryOptions.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={tw`flex-row items-center p-2 mb-2`}
            onPress={() => handleOptionSelect(option.type)}
          >
            {/* Radio Button */}
            <View
              style={tw`w-5 h-5 rounded-full border border-gray-400 mr-3 ${
                deliveryOption === option.type ? 'bg-red-500' : 'bg-white'
              } flex items-center justify-center`}
            >
              {deliveryOption === option.type && (
                <Icon name="check" size={14} color="white" />
              )}
            </View>
            {/* Delivery Option Details */}
            <View style={tw`flex-1`}>
              <Text
                style={tw`text-base ${
                  deliveryOption === option.type ? 'font-bold text-red-500' : 'text-gray-700'
                }`}
              >
                {option.type}
              </Text>
              <Text style={tw`text-sm text-gray-500`}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Pickup Date & Time */}
      <View style={tw`p-4 bg-white rounded-lg shadow mb-6`}>
        <Text style={tw`text-lg font-semibold mb-4`}>Pickup Date & Time</Text>
        {/* Date Picker */}
        <TouchableOpacity
          style={tw`flex-row items-center justify-between bg-gray-100 p-2 rounded mb-2`}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={tw`text-gray-700`}>
            {selectedDate.toDateString()}
          </Text>
          <Icon name="calendar-today" size={20} color="gray" />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        {/* Time Picker */}
        <TouchableOpacity
          style={tw`flex-row items-center justify-between bg-gray-100 p-2 rounded`}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={tw`text-gray-700`}>
            {selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Icon name="access-time" size={20} color="gray" />
        </TouchableOpacity>
        {/* {showTimePicker && (
          <DateTimePicker
            value={selectedTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )} */}
      </View>

      {/* Confirm Button */}
      <TouchableOpacity style={tw`bg-red-500 py-3 rounded-full`} onPress={handlePlaceOrder}>
        <Text style={tw`text-center text-white text-lg`}>Confirm to Proceed</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DeliveryOptions;
