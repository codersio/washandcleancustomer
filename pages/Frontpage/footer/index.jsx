import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/Ionicons';

const Footer = ({ handleNavigation, activePage }) => {


  
  return (
    <View style={tailwind`shadow bg-white  bottom-0 left-0 right-0 flex-row border-gray-300`}>
      {/* Home Icon */}
      <TouchableOpacity
        onPress={() => handleNavigation('HomeScreen')}
        style={tailwind`flex-1 p-2 items-center border-gray-300`}
      >
        <FontAwesome name="home" size={25} color={activePage === 'HomeScreen' ? 'blue' : 'gray'} />
        <Text style={tailwind`text-center text-xs underline ${activePage === 'HomeScreen' ? 'text-blue-500' : 'text-gray-500'}`}>
          Home
        </Text>
      </TouchableOpacity>

      {/* Order Icon */}
      <TouchableOpacity
        onPress={() => handleNavigation('OrdersScreen')}
        style={tailwind`flex-1 p-2 items-center border-gray-300`}
      >
        <FontAwesome name="truck" size={25} color={activePage === 'OrdersScreen' ? 'blue' : 'gray'} />
        <Text style={tailwind`text-center text-xs ${activePage === 'OrdersScreen' ? 'text-blue-500' : 'text-gray-500'}`}>
          Order
        </Text>
      </TouchableOpacity>

      {/* Basket Icon */}
      <TouchableOpacity
        onPress={() => handleNavigation('Basket')}
        style={tailwind`flex-1 p-2 items-center border-gray-300`}
      >
        <Icons name="hand-left" size={25} color={activePage === 'Basket' ? 'blue' : 'gray'} />
        <Text style={tailwind`text-center text-xs ${activePage === 'Basket' ? 'text-blue-500' : 'text-gray-500'}`}>
          Basket
        </Text>
      </TouchableOpacity>

      {/* Account Icon */}
      <TouchableOpacity
        onPress={() => handleNavigation('MyAccount')}
        style={tailwind`flex-1 p-2 items-center border-gray-300`}
      >
        <FontAwesome name="user" size={25} color={activePage === 'MyAccount' ? 'blue' : 'gray'} />
        <Text style={tailwind`text-center text-xs ${activePage === 'MyAccount' ? 'text-blue-500' : 'text-gray-500'}`}>
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Footer;
