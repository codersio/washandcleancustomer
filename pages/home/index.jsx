import React from 'react';
import { View, Text, Button } from 'react-native';
import tailwind from 'twrnc';
import DeliveryIcon from '../../assets/undraw_on_the_way_re_swjt.svg';
import Collection from '../../assets/undraw_treasure_of-9-i.svg';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={tailwind`w-full px-2 gap-5 flex-wrap flex-row justify-center py-10`}>
      <View style={tailwind`p-2 justify-center items-center rounded-3xl bg-white shadow`}>
        <DeliveryIcon width={100} height={100} fill="black" />
        <Text style={tailwind`mt-5`}>Delivery</Text>
      </View>

      <View style={tailwind`p-2 justify-center items-center rounded-3xl bg-white shadow`}>
        <Collection width={100} height={100} fill="black" />
        <Text style={tailwind`mt-5`}>Pending</Text>
      </View>

      <View style={tailwind`p-2 justify-center items-center rounded-3xl bg-white shadow`}>
        <Collection width={100} height={100} fill="black" />
        <Text style={tailwind`mt-5`}> Pickup</Text>
      </View>

      <View style={tailwind`p-2 justify-center items-center rounded-3xl bg-white shadow`}>
        <Collection width={100} height={100} fill="black" />
        <Text style={tailwind`mt-5`}>Accepted</Text>
      </View>
<Button
        title="Go to test"
        onPress={() => navigation.navigate('LogoutScreen')}
      />
    </View>
  );
};

export default HomeScreen;
