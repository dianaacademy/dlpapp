import React, { useContext } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import Services from '../Shared/Services';
import { AuthContext } from '../Context/AuthContext';
import WelcomeHeader from '../Components/WelcomeHeader';
import SearchBar from '../Components/SearchBar';
import Slider from '../Components/Slider';
import VideoCourseList from '../Components/VideoCourseList';
import CourseList from '../Components/CourseList';

export default function Home({ navigation }) {
  const { userData, setUserData } = useContext(AuthContext);

  const handleLogout = async () => {
    await Services.Logout();
    setUserData(null);
    navigation.navigate('Login'); // Navigate back to the login page
  };

  return (
    <ScrollView style={styles.container}>
      <WelcomeHeader />
      <SearchBar />
      <Slider />
      <VideoCourseList />
      <CourseList type={'basic'} />
      <CourseList type={'advance'} />
      <View style={styles.logoutButtonContainer}>
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  logoutButtonContainer: {
    marginVertical: 20,
  },
});
