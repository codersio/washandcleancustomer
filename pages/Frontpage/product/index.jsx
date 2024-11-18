import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../component/config';
import { View, Text, Modal, Button, Alert,Image, TouchableOpacity } from 'react-native';
import tailwind from 'twrnc';
import CheckBox from '@react-native-community/checkbox';
import { Picker } from '@react-native-picker/picker';
// import { Image } from '@rneui/base';
import Icon from 'react-native-vector-icons/MaterialIcons';
const ProductList = ({ route }) => {
    const { categoryId } = route.params; 
    const [products, setProducts] = useState([]);
    const [modalVisible, setModalVisible] = useState(false); 
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [serviceTypes, setServiceTypes] = useState([]);
    const [selectedServiceType, setSelectedServiceType] = useState(null); // State for selected service type
    const [addons, setAddons] = useState([]);
    const [selectedAddons, setSelectedAddons] = useState([]);
    const [servicePrices, setServicePrices] = useState({}); // State for storing service prices

    useEffect(() => {
        axios.post(`${API_ENDPOINTS.CATEGORIES}/${categoryId}`)
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error.message);
            });
    }, [categoryId]);

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setModalVisible(true);

        axios.post(`${API_ENDPOINTS.GET_ADDONS}/${product.id}`)
            .then((response) => {
                console.log(response.data.service_types);
                setServiceTypes(response.data.service_types);
                setAddons(response.data.addons);

                // Create a map of service type names to their prices
                const prices = response.data.service_types.reduce((acc, type) => {
                    acc[type.service_type_name] = type.pivot.service_price;
                    return acc;
                }, {});
                setServicePrices(prices);
            })
            .catch((error) => {
                console.error('Error fetching service details:', error.message);
            });
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedProduct(null);
        setServiceTypes([]);
        setSelectedServiceType(null); // Reset selected service type
        setAddons([]);
        setSelectedAddons([]);
        setServicePrices({}); // Clear service prices
    };

    const toggleAddonSelection = (addonId) => {
        setSelectedAddons((prevSelected) => {
            if (prevSelected.includes(addonId)) {
                return prevSelected.filter((id) => id !== addonId);
            } else {
                return [...prevSelected, addonId];
            }
        });
    };

    const handleAddToCart = () => {
        if (!selectedServiceType) {
            Alert.alert('Error', 'Please select a service type.');
            return;
        }

        const cartItem = {
            user_id: 1,
            product_id: selectedProduct.id,
            service_type_name: selectedServiceType,
            quantity: 1,
            price: servicePrices[selectedServiceType], // Get price from servicePrices state
            addons: selectedAddons,
        };

        console.log(cartItem);

        axios.post(API_ENDPOINTS.ADD_TO_CART, cartItem)
            .then((response) => {
                Alert.alert('Success', 'Added to cart successfully!');
                handleCloseModal();
            })
            .catch((error) => {
                Alert.alert('Error', 'Failed to add to cart.');
            });
    };

    return (
        <View style={tailwind`flex-1`}>
            {/* Product List Display */}
       <View style={tailwind`flex-row flex-wrap gap-2 justify-center`}>
                {products.map((product) => (
                    <TouchableOpacity 
                        key={product.id} 
                        style={tailwind`p-4 bg-white shadow rounded `} 
                        onPress={() => handleOpenModal(product)}
                    >
                        <Image
                            source={{ uri: `http://192.168.0.105:8080/assets/img/service-icons/${product.icon}` }}
                            style={tailwind`w-16 h-12`}
                            resizeMode="cover"
                        />
                        <Text style={tailwind`text-center mt-2`}>{product.service_name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Modal for Service Types and Add-ons */}
           <Modal
    visible={modalVisible}
    animationType="slide"
    onRequestClose={handleCloseModal}
>
    <View style={tailwind`flex-1 justify-end bg-black bg-opacity-50`}>
        <View style={tailwind`bg-white p-5 rounded-t-lg`}>
            <View style={tailwind`flex-row justify-between items-center`}>
                <Text style={tailwind`text-lg font-bold`}>{selectedProduct?.service_name}</Text>
                <TouchableOpacity onPress={handleCloseModal}>
                    <Icon name="close" size={24} color="black" />
                </TouchableOpacity>
            </View>

            {/* Display Service Types */}
            {serviceTypes.length > 0 ? (
                <Picker
                    selectedValue={selectedServiceType}
                    onValueChange={(itemValue) => setSelectedServiceType(itemValue)}
                    style={tailwind`bg-gray-100 p-2 my-2 rounded`}
                >
                    <Picker.Item label="Select Service Type" value={null} />
                    {serviceTypes.map((type) => (
                        <Picker.Item key={type.id} label={`${type.service_type_name} - $${type.pivot.service_price}`}  value={type.service_type_name} />
                    ))}
                </Picker>
            ) : (
                <Text>No service types available.</Text>
            )}

            {/* Display Add-ons */}
            {addons.length > 0 ? (
                addons.map((addon) => (
                    <View key={addon.id} style={tailwind`flex-row items-center`}>
                        <Text>{addon.addon_name} - {addon.addon_price}</Text>
                        <CheckBox
                            value={selectedAddons.includes(addon.id)}
                            onValueChange={() => toggleAddonSelection(addon.id)}
                        />
                    </View>
                ))
            ) : (
                <Text>No add-ons available.</Text>
            )}

            <Button title="Add to Cart" onPress={handleAddToCart} />
        </View>
    </View>
</Modal>

        </View>
    );
};

export default ProductList;
