import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import Banner from '../banner';
import tailwind from 'twrnc';
import { API_ENDPOINTS } from "../../../component/config";
import axios from 'axios';
import Footer from '../footer';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Carousel from 'react-native-snap-carousel';
const Frontpagesetting = ({ navigation, handleNavigation }) => {
  const [category, setCategory] = useState([]);
  const [nearbyStores, setNearbyStores] = useState([]);
  const [userPincode, setUserPincode] = useState(700008); // Replace with actual user pincode retrieval

  // Fetch data from API for categories
  useEffect(() => {
    axios.post(API_ENDPOINTS.CATEGORY)
      .then((response) => {
        setCategory(response.data);
      })
      .catch((error) => {
        console.error('There was an error making the request:', error.message);
      });
  }, []);

  // Fetch nearby stores based on user pincode
  useEffect(() => {
    const fetchNearbyStores = async () => {
      try {
        // Retrieve token from AsyncStorage
        const token = await AsyncStorage.getItem('userToken');
        console.log(token)
        if (userPincode) {
          axios.get(`${API_ENDPOINTS.NEARBY_STORES}/radius=500`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include token in request headers
            },
          })
            .then((response) => {
              setNearbyStores(response.data);
            })
            .catch((error) => {
              console.error('There was an error fetching nearby stores:', error.message);
            });
        }
      } catch (error) {
        console.error('Error retrieving token from AsyncStorage:', error.message);
      }
    };

    fetchNearbyStores();
  }, [userPincode]);

  // Handle category click
  const handleCategoryClick = (categoryId) => {
    navigation.navigate('ProductList', { categoryId });
  };

  return (
    <View style={tailwind`flex-1`}>
      <Banner />
      <View style={tailwind`flex-row justify-between px-5 mt-5`}>
        <Text>Category</Text>
        <Text style={tailwind`underline`}>View all ({category.length})</Text>
      </View>

      <ScrollView style={tailwind`mt-5 px-5 h-[5rem]`}>
        {/* Categories Section */}
        <View style={tailwind`flex-row flex-wrap gap-2`}>
          {category.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={tailwind`p-4 bg-white shadow rounded`}
              onPress={() => handleCategoryClick(item.id)}
            >
              <Image
                source={{ uri: `http://192.168.0.105:8080/uploads/${item.image}` }}
                style={{ width: 69, height: 50 }}
                resizeMode="cover"
              />
              <Text style={tailwind`text-center mt-1.5`}>
                {item.category_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby Stores Section */}
        <View style={tailwind`mt-5 px-1`}>
          <Text style={tailwind`text-xl font-bold mb-3`}>Nearby Stores</Text>
          
          {nearbyStores.length > 0 ? (
            
            <View style={tailwind `flex-row gap-1`}>
              {nearbyStores.map((store) => (
                <View key={store.id} style={tailwind`mb-4 p-4 w-1/2 bg-white shadow rounded`}>
                 <Image
                source={{ uri: `http://192.168.0.105:8000/uploads/${store.image}` }}
                style={{  height: 50 }}
                resizeMode="cover"
              />
                  <Text style={tailwind`text-lg font-semibold`}>
                    {store.name}
                  </Text>
                  <Text>
                     {store.applican_name} 
                  </Text><Text>
                    Distance: {store.distance.toFixed(2)} km
                  </Text>
                  <Text>
                    {/* Pincode: {store.pincode} */}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <Text>No nearby stores found.</Text>
          )}
        </View>
      </ScrollView>

      <Footer handleNavigation={handleNavigation} />
    </View>
  );
};

export default Frontpagesetting;
