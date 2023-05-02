import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { Button } from 'react-native'
import Services from '../Shared/Services'
import { AuthContext } from '../Context/AuthContext'
import WelcomeHeader from '../Components/WelcomeHeader'
import SearchBar from '../Components/SearchBar'

export default function Home() {
    const {userData,setUserData}=useContext(AuthContext)
  return (
    <View style={{padding:20}}>
        <WelcomeHeader/>
        <SearchBar/>
        
    </View>
  )
}