import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Image, Button, Alert, Modal, TouchableOpacity } from 'react-native';
import CheckBox from '@react-native-community/checkbox'; // Updated import
import tailwind from 'twrnc';
import { API_ENDPOINTS } from "../../../component/config";
import axios from 'axios';
import Footer from '../footer';
import Icon from 'react-native-vector-icons/Ionicons';

const ProductList = ({ route, navigation }) => {
  const { categoryId } = route.params; 
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false); 
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addons, setAddons] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);

  useEffect(() => {
    axios.post(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`)
      .then((response) => {
        console.log('Products:', response.data);
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error.response ? error.response.data : error.message);
      });
  }, [categoryId]);

  const handleAddToCart = () => {
    const cartItem = {
      user_id: 1, 
      product_id: selectedProduct.id,
      quantity: 1,
      price: selectedProduct.service_price,
      addons: selectedAddons 
    };

    axios.post(API_ENDPOINTS.ADD_TO_CART, cartItem)
      .then((response) => {
        console.log('Added to cart:', response.data);
        Alert.alert('Success', `${selectedProduct.service_name} and selected add-ons have been added to the cart.`);
      })
      .catch((error) => {
        console.error('Error adding to cart:', error.message);
        Alert.alert('Error', error.response?.data?.message || 'Failed to add the product to the cart.');
      });
  };

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);

    axios.post(`${API_ENDPOINTS.GET_ADDONS}/${product.id}`)
      .then((response) => {
        console.log('Add-ons and service details:', response.data);
        setAddons(response.data.addons);
      })
      .catch((error) => {
        console.error('Error fetching add-ons:', error.response ? error.response.data : error.message);
      });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
    setAddons([]);
    setSelectedAddons([]);
  };

  const toggleAddonSelection = (addon) => {
    if (selectedAddons.includes(addon.id)) {
      setSelectedAddons(selectedAddons.filter((id) => id !== addon.id));
    } else {
      setSelectedAddons([...selectedAddons, addon.id]);
    }
  };

  return (
    <View style={tailwind`flex-1`}>
      <ScrollView>
        <View style={tailwind`gap-2 px-3`}>
          {products.map((product) => (
            <View style={tailwind`p-4 relative bg-white flex-row shadow rounded gap-4`} key={product.id}>
              <Image
                source={{ uri: `http://192.168.0.105:8080/assets/img/service-icons/${product.icon}` }}
                style={{ width: 50, height: 50 }}
                resizeMode="cover"
              />
              <View style={tailwind`flex-row justify-between`}>
                <View>
                  <Text style={tailwind`text-center text-[0.9rem] text-blue-700`}>
                    {product.service_name} ({product.service_type_name})
                  </Text>
                  <Text style={tailwind`text-[0.9rem] mt-1`}>
                    ₹{product.service_price}
                  </Text>
                </View>
              </View>
              <View style={tailwind`absolute right-5 bottom-5`}>
                <Button 
                  title="Add" 
                  onPress={() => handleOpenModal(product)} 
                  color="#007BFF"
                />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal for Add-ons and Cart */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={tailwind`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tailwind`bg-white p-5 rounded-t-lg`}>
            <View style={tailwind`flex-row justify-between items-center`}>
              <Text style={tailwind`text-lg font-bold`}>Add-ons for {selectedProduct?.service_name}</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name="close-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <View style={tailwind`mt-4`}>
              {addons.length > 0 ? (
                addons.map((addon) => (
                  <View key={addon.id} style={tailwind`flex-row justify-between items-center mb-2`}>
                    <Text style={tailwind`text-gray-700`}>{addon.addon_name}</Text>
                    <Text style={tailwind`text-gray-500`}>₹{addon.addon_price}</Text>
                    <CheckBox
                      value={selectedAddons.includes(addon.id)}
                      onValueChange={() => toggleAddonSelection(addon)}
                    />
                  </View>
                ))
              ) : (
                <Text style={tailwind`text-gray-500`}>No add-ons available for this product.</Text>
              )}

              <Button
                title="Add to Cart"
                onPress={() => {
                  handleAddToCart();
                  handleCloseModal();
                }}
                color="#28a745"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Footer navigation={navigation} /> 
    </View>
  );
};

export default ProductList;
