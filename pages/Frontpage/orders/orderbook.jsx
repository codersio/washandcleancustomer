import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { API_ENDPOINTS } from "../../../component/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Footer from '../footer';
import tailwind from 'twrnc';

const OrdersScreen = () => {
    const [orders, setOrders] = useState([]); // State to hold the orders
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (token) {
                    const response = await axios.post(API_ENDPOINTS.ORDERGET, {}, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Accept': 'application/json',
                        },
                    });
                    // Assuming response contains the orders data
                    setOrders(response.data.orders);
                } else {
                    setError("No token found.");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                setError("Failed to fetch orders. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    if (orders.length === 0) {
        return (
            <View style={styles.container}>
                <Text>No orders found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <Text style={styles.header}>Orders in Process</Text>
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <OrderItem item={item} />}
                />
            </View>
            <Footer style={styles.footer} />
        </View>
    );
};

const OrderItem = ({ item }) => {
    return (
        <View style={styles.card}>
            <View style={styles.orderDetails}>
                <Text style={styles.serviceName}>{item.service_name}</Text>
                <Text style={styles.orderNo}>Order No - #{item.id}</Text>
                <Text style={styles.price}>${item.total}</Text>
                {/* <Text style={styles.status}>{item.status}</Text> */}
            </View>
            <View style={styles.statusIcons}>
                <Icon name="checkbox-marked-circle-outline" size={24} color={item.status === 1 ? 'red' : 'gray'} />
                <Icon name="truck-outline" size={24} color={item.status === 2 ? 'blue' : 'gray'} />
                <Icon name="progress-clock" size={24} color={item.status === 3 ? 'orange' : 'gray'} />
                <Icon name="home-outline" size={24} color={item.status === 4 ? 'purple' : 'gray'} />
                <Icon name="check-circle-outline" size={24} color={item.status === 5 ? 'gold' : 'gray'} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        justifyContent: 'space-between', // Ensures the footer is pushed to the bottom
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 2,
    },
    orderDetails: {
        marginBottom: 10,
    },
    serviceName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    orderNo: {
        color: 'gray',
    },
    price: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    status: {
        fontSize: 16,
        fontWeight: '600',
        color: 'blue',
    },
    statusIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footer: {
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderColor: '#eaeaea',
    },
});

export default OrdersScreen;
