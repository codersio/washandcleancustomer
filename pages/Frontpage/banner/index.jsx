import React from 'react';
import { View, Text, Image } from 'react-native';

const Banner = () => {
  return (
    <View > 
      {/* Banner image */}
      <Image 
        source={require('../../../assets/banner.jpg')} // Make sure the path is correct
        style={{ width: '100%', height: 140 }} // Adjust the width and height as needed
        resizeMode="cover" // Adjust the image to cover the entire area
      />

      {/* Red background section */}
      {/* <View style={{ backgroundColor: '#ff0000', height: 50, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Welcome to My App</Text>
      </View> */}
    </View>
  );
}

export default Banner;
