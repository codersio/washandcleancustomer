import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS } from "../../component/config";
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Logsvg from "../../assets/undraw_web_shopping_re_owap.svg"; // Assuming this is an SVG imported correctly
import tailwind from 'twrnc';

const LoginScreen = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    try {
      const response = await axios.post(API_ENDPOINTS.LOGIN, {
        email,
        password,
      });

      const { access_token } = response.data;

      // Store the token securely
      await AsyncStorage.setItem('userToken', access_token);

      Alert.alert('Login Success', `Welcome ${email}!`);

      // Update login status and navigate to Dashboard
      setIsLoggedIn(true);
      navigation.navigate('HomeScreen'); // Navigate to the Dashboard screen

    } catch (error) {
      Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
      console.error(error); // Log the error for debugging
    }
  };

  return (
    <LinearGradient
      colors={['rgba(91,81,255,1)', 'rgba(91,81,255,1)', 'rgba(0,212,255,1)']}
      style={styles.background}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.container}>
        <View style={tailwind`justify-center items-center`}>
          <Logsvg width={200} height={200} />
        </View>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#ccc"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#ccc"
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#A52A2A',

    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
