import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { AuthContext } from '../Context/AuthContext';
import Services from '../Shared/Services';
import Colors from '../Shared/Colors';
import { auth, db } from '../../firebase.config';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const [accessToken, setAccessToken] = useState();
  const [userInfo, setUserInfo] = useState();
  const { userData, setUserData } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '133537517881-4nrfab29k0mfaqdfvqqitnhpgd84codd.apps.googleusercontent.com',
    expoClientId: '133537517881-qcrptltqo3q52e665e0mdsh4q5vc8pu4.apps.googleusercontent.com'
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setAccessToken(response.authentication.accessToken);
      getUserData(response.authentication.accessToken);
    }
  }, [response]);

  const getUserData = async (token) => {
    try {
      setIsLoading(true);
      const resp = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await resp.json();
      console.log("user Details", user);
      setUserInfo(user);
      setUserData(user);
      await Services.setUserAuth(user);

      // Sign in to Firebase with Google credential
      const credential = GoogleAuthProvider.credential(null, token);
      await signInWithCredential(auth, credential);

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.id), {
        email: user.email,
        name: user.name,
        picture: user.picture,
        // Add any other fields you want to store
      });

    } catch (error) {
      console.error("Error during Google Sign In:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEmailLogin = async () => {
    try {
      setIsLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        // Add any other fields you want to store
      });

      setUserData(user);
      await Services.setUserAuth(user);
    } catch (error) {
      console.error("Login failed:", error);
      // Handle login error (e.g., show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  }

  const handleOTPLogin = () => {
    navigation.navigate('LoginScreenOTP');
  }

  return (
    <View style={styles.mainContainer}>
      <Image source={require('./../Assets/Images/login.png')} style={styles.image} />
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome to Diana App</Text>
        <Text style={styles.loginText}>Login/Signup</Text>
        <TextInput
          style={[styles.input, isEmailFocused && styles.inputFocused]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          onFocus={() => setIsEmailFocused(true)}
          onBlur={() => setIsEmailFocused(false)}
        />
        <TextInput
          style={[styles.input, isPasswordFocused && styles.inputFocused]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />
        <TouchableOpacity style={styles.button} onPress={handleEmailLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => promptAsync()} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <View style={styles.googleButtonContent}>
              <Ionicons name="logo-google" size={24} color="white" style={styles.googleIcon} />
              <Text style={styles.buttonText}>Continue with Google</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleOTPLogin} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <View style={styles.googleButtonContent}>
              <Ionicons name="phone-portrait-outline" size={24} color="white" style={styles.googleIcon} />
              <Text style={styles.buttonText}>Login with OTP</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  image: {
    width: '100%',
    height: '40%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: 40,
    backgroundColor: Colors.white,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    marginTop: -25,
  },
  welcomeText: {
    fontSize: 35,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  loginText: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ededed',
    borderWidth: 1,
    marginHorizontal: 30,
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 15,
    fontSize: 16,
    
  },
  inputFocused: {
    borderColor: Colors.primary,
    borderWidth: 1,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    marginHorizontal: 30,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
});