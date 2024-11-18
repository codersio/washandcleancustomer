import React, { useState, useEffect } from "react";
import axios from "axios";
import { Text, View, ScrollView, Image, TouchableOpacity, Modal, Button } from "react-native";
import tailwind from "twrnc";
import Icon from "react-native-vector-icons/Ionicons";
import { API_ENDPOINTS } from "../../../component/config";
import CheckBox from "@react-native-community/checkbox";

export const CartDisplay = ({navigation,handleNavigation}) => {
  const [carts, setCarts] = useState([]);
  const [overallTotalPrice, setOverallTotalPrice] = useState(0); // State to store overall total price
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);

  useEffect(() => {
    axios
      .post(API_ENDPOINTS.CART) // Use your actual API endpoint here
      .then((response) => {
        setCarts(Object.values(response.data.cart_items)); // Ensure carts is an array
        setOverallTotalPrice(response.data.overall_total_price);
      })
      .catch((error) => {
        console.error("Error fetching cart data:", error);
      });
  }, []);


  const handleRemoveItem = (id) => {
    axios
      .delete(`/api/cart/${id}`)
      .then(() => {
        setCarts(carts.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Error removing item:", error);
      });
  };

  const handleIncreaseQty = (index) => {
    const updatedCarts = [...carts];
    updatedCarts[index].quantity += 1;
    setCarts(updatedCarts);
  };

  const handleDecreaseQty = (index) => {
    const updatedCarts = [...carts];
    if (updatedCarts[index].quantity > 1) {
      updatedCarts[index].quantity -= 1;
      setCarts(updatedCarts);
    }
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    const existingAddonsInCart = carts.find((cartItem) => cartItem.id === item.id)?.addons;
    const initialSelectedAddons = existingAddonsInCart?.map((addon) => addon.addon_name) || [];
    setSelectedAddons(initialSelectedAddons);
    setModalVisible(true);
  };

  const handleToggleAddon = (addonName) => {
    setSelectedAddons((prevState) =>
      prevState.includes(addonName)
        ? prevState.filter((name) => name !== addonName)
        : [...prevState, addonName]
    );
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  return (
    <View style={tailwind`flex-1`}>
      <ScrollView style={tailwind`h-[24rem]`} showsVerticalScrollIndicator={false}>
        <View style={tailwind`gap-2`}>
          {carts.length > 0 ? (
            carts.map((cartItem, index) => (
              <View key={index} style={tailwind`flex shadow p-4 bg-white`}>
              <View style={tailwind`flex-row items-center gap-2`}><Image
                    source={{ uri: `http://192.168.0.105:8080/assets/img/service-icons/${cartItem.icon}` }}
                    style={{ width: 50, height: 50 }}
                    resizeMode="cover"
                  />
                 <View style={tailwind `flex-1`}>
                   <Text style={tailwind`text-sm text-blue-800`}>{cartItem.service_name}</Text>
                    <Text style={tailwind`text-sm text-red-800`}>₹{cartItem.price}</Text>
                    </View>
                       <TouchableOpacity onPress={() => handleRemoveItem(cartItem.id)} style={tailwind`flex-row items-center`}>
                    <Icon name="trash-outline" size={20} color="red" />
                  </TouchableOpacity>
                 </View>

                <View style={tailwind`flex-row items-center`}>
                  
                  <View style={tailwind`flex-1 ml-3`}>
                    
                 <View style={tailwind `flex-row gap-2`}>
                   <TouchableOpacity
                      onPress={() => handleOpenModal(cartItem)}
                      style={tailwind`mt-3 text-center p-1 bg-blue-500 rounded h-[1.5rem]`}
                    >
                      <Text style={tailwind`text-white text-[0.6rem] text-center`}>{cartItem.service_type_name},addons x{cartItem.addons && cartItem.addons.length}</Text>
                    </TouchableOpacity>
                     <View style={tailwind`flex-row items-center mt-2`}>
                     
                      <TouchableOpacity
                        onPress={() => handleDecreaseQty(index)}
                        style={tailwind`p-1 border border-gray-300 rounded-full`}
                      >
                        <Icon name="remove-circle-outline" size={20} color="gray" />
                      </TouchableOpacity>
                      <Text style={tailwind`mx-2`}>{cartItem.quantity}</Text>
                      <TouchableOpacity
                        onPress={() => handleIncreaseQty(index)}
                        style={tailwind`p-1 border border-gray-300 rounded-full`}
                      >
                        <Icon name="add-circle-outline" size={20} color="gray" />
                      </TouchableOpacity>
                    </View>
                  
                 </View>
                  </View>
               
                </View>

               

                {/* Total Price */}
                {/* <Text style={tailwind`text-right mt-2 text-green-800 font-bold`}>
                  Total Price: ₹{cartItem.total_price}
                </Text> */}
              </View>
            ))
          ) : (
            <Text style={tailwind`text-gray-400`}>No items in cart</Text>
          )}
        </View>
      </ScrollView>

      {/* Display Overall Total */}
      {carts.length > 0 && (
        <View style={tailwind`mt-4 p-4 bg-gray-100 absolute flex-row justify-between bottom-0 shadow right-0 left-0`}>
           <Text style={tailwind`text-left text-lg font-bold text-green-800`}>
           ₹{overallTotalPrice}
          </Text>
      <TouchableOpacity
                        onPress={() => handleNavigation('Checkout')}
                        style={tailwind`p-1 border border-red-300 bg-red-500  rounded-full h-8 w-8`}
                      >
                        <Icon name="arrow-forward-outline" size={20} color="white" />
                      </TouchableOpacity>
       
        </View>
      )}

      {/* Modal for Add-ons */}
      <Modal visible={modalVisible} animationType="slide" transparent={true} onRequestClose={handleCloseModal}>
        <View style={tailwind`flex-1 justify-end bg-black bg-opacity-50`}>
          <View style={tailwind`bg-white p-5 rounded-t-lg`}>
            <View style={tailwind`flex-row justify-between items-center`}>
              <Text style={tailwind`text-lg font-bold`}>Add-ons for {selectedItem?.service_name}</Text>
              <TouchableOpacity onPress={handleCloseModal}>
                <Icon name="close-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={tailwind`mt-4`}>
              {selectedItem?.addons && selectedItem.addons.length > 0 ? (
                selectedItem.addons.map((addon, index) => (
                  <View key={index} style={tailwind`flex-row justify-between items-center mb-2`}>
                    <Text style={tailwind`text-gray-700`}>{addon.addon_name}</Text>
                    <Text style={tailwind`text-gray-500`}>₹{addon.addon_price}</Text>
                    <CheckBox
                      value={selectedAddons.includes(addon.addon_name)}
                      onValueChange={() => handleToggleAddon(addon.addon_name)}
                    />
                  </View>
                ))
              ) : (
                <Text style={tailwind`text-gray-500`}>No add-ons available for this product.</Text>
              )}
              <Button title="Update Cart" onPress={handleCloseModal} color="#28a745" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
