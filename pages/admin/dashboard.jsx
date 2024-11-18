import React from 'react';
import { View, Text } from 'react-native';
import tw from 'twrnc';

import tailwind from 'twrnc';
import Header from '../../component/header';
import HomeScreen from '../home';
import Footer from '../../component/footer';

const Dashboard = ({navigation,handleNavigation}) => {
  return (
    <View style={tailwind ` border h-full w-full`}>
    {/* <Header/> */}
     <HomeScreen navigation={navigation}/>
     <Footer handleNavigation={handleNavigation}/>
    </View>
  );
};

export default Dashboard;
