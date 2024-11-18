import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import Footer from '../../component/footer';
import { API_ENDPOINTS } from "../../component/config";
function WalletScreen({handleNavigation,navigation}) {
  const [walletBalance, setWalletBalance] = useState(60); // Static wallet amount
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch data from your backend (assuming the riderWallet function)
    axios.get(API_ENDPOINTS.RIDERWALLET) // Replace with actual API
      .then(response => {
        console.log(response.data.riders.overall_total_delivery_charges)
        setBookings(response.data.riders); // Adjust to fit the response structure
        setWalletBalance(response.data.overall_total_delivery_charges); // Adjust to fit the response structure
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <View style={styles.container}>
      
      {/* Wallet and Request Section */}
      <View style={styles.walletContainer}>
        <View style={styles.walletBox}>
          <Icon name="account-balance-wallet" size={30} color="#ff6b6b" />
          <Text style={styles.walletText}>₹ {walletBalance}</Text>
          <Text style={styles.walletLabel}>wallet</Text>
        </View>
        {/* <View style={styles.walletRequestBox}>
          <Icon name="credit-card" size={30} color="#4b7bec" />
          <Text style={styles.walletLabel}>Wallet Request</Text>
        </View> */}
      </View>

      {/* Booking List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.delivery_boy_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            <Text style={styles.bookingText}>Booking Id: {item.order_number}</Text>
            <Text style={styles.bookingText}>Pickup Date: {item.delivery_date}</Text>
            <Text style={styles.bookingText}>Earning Amount: ₹{item.total_delivery_charges}</Text>
          </View>
        )}
      />

      <Footer handleNavigation={handleNavigation}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  walletBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginRight: 8,
    borderRadius: 10,
    elevation: 3,
  },
  walletRequestBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    marginLeft: 8,
    borderRadius: 10,
    elevation: 3,
  },
  walletText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333',
  },
  walletLabel: {
    fontSize: 16,
    color: '#555',
  },
  bookingCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 10,
    elevation: 3,
  },
  bookingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 4,
  }
});

export default WalletScreen;
