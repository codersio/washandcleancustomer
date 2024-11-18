// Footer.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icons from 'react-native-vector-icons/Ionicons';

const Footer = ({ handleNavigation }) => {
  return (
    <View style={tailwind`shadow bg-white absolute bottom-0 left-0 right-0 flex-row border-gray-300`}>
      <TouchableOpacity style={tailwind`flex-1 p-2 items-center border-gray-300`} onPress={() => handleNavigation('Home')}>
        <FontAwesome name="home" size={25} color="blue" />
        <Text style={tailwind`text-center text-[0.7rem] underline`}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tailwind`flex-1 p-2 items-center border-gray-300`} onPress={() => handleNavigation('Booking')}>
        <FontAwesome name="truck" size={25} color="gray" />
        <Text style={tailwind`text-center text-[0.7rem]`}>Booking</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tailwind`flex-1 p-2 items-center border-gray-300`} onPress={() => handleNavigation('WalletScreen')}>
        <Icons name="hand-left" size={25} color="gray" />
        <Text style={tailwind`text-center text-[0.7rem]`}>Wallet</Text>
      </TouchableOpacity>
      <TouchableOpacity style={tailwind`flex-1 p-2 items-center border-gray-300`} onPress={() => handleNavigation('Profile')}>
        <Icon name="person" size={25} color="gray" />
        <Text style={tailwind`text-center text-[0.7rem]`}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
