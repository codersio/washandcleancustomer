import React from 'react'
import { View,Text } from 'react-native'
import tailwind from 'twrnc';

const Header =()=>{
    return (
        <View style={tailwind `bg-[#183153] p-4 flex text-white`}>
       <Text style={tailwind ` text-white `}>Wash And Clean</Text>
    </View>
    )
}

export default Header;