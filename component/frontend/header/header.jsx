import React from 'react'
import Icon from 'react-native-vector-icons/MaterialIcons';
import { View,Text } from 'react-native';
export const Headerfront=({navigation})=>{
    return (
       <View style={{ flexDirection: 'row', marginLeft: 15 }}>
              <Icon 
                name="notifications" 
                size={24} 
                color="blue" 
                style={{ marginRight: 15 }} 
                onPress={() => {
                  // Define notification button action here
                }} 
              />
              <Icon 
                name="shopping-cart" 
                size={24} 
                color="blue" 
                onPress={() => {
                  navigation.navigate('CartDisplay')
                }} 
              />
            </View>
    )
}