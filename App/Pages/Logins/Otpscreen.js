import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { CountryPicker } from 'react-native-country-codes-picker';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';

const LoginScreenOTP = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('+1');
  const [showPicker, setShowPicker] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeAnalytics = async () => {
      if (await analytics().isSupported()) {
        await analytics().setAnalyticsCollectionEnabled(true);
      }
    };
    initializeAnalytics().catch(console.error);
  }, []);

  const handleSendOTP = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number');
      return;
    }
    setLoading(true);
    try {
      const fullNumber = countryCode + phoneNumber;
      const result = await auth().signInWithPhoneNumber(fullNumber);
      setConfirmation(result);
      setOtpSent(true);
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP');
      return;
    }
    if (!confirmation) {
      Alert.alert('Error', 'Please request OTP first');
      return;
    }
    setLoading(true);
    try {
      await confirmation.confirm(otp);
      // OTP verified successfully, navigate to HomePage
      navigation.navigate('HomePage');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Diana Academy</Text>
      <Text style={styles.subtitle}>Login or create New Account</Text>
      
      {!otpSent ? (
        <>
          <View style={styles.inputContainer}>
            <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.countryPicker}>
              <Text>{countryCode}</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <Text style={styles.securityNote}>
            Securing your personal information is our priority.
          </Text>
          <TouchableOpacity style={styles.nextButton} onPress={handleSendOTP} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.nextButtonText}>Next</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
          />
          <TouchableOpacity style={styles.nextButton} onPress={handleVerifyOTP} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.nextButtonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>
        </>
      )}

      <CountryPicker
        show={showPicker}
        style={{
          modal: {
            height: '75%',
            width: '100%',
          },
        }}
        pickerButtonOnPress={(country) => {
          setCountryCode(country.dial_code);
          setShowPicker(false);
        }}
        onBackdropPress={() => setShowPicker(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    paddingTop: 100,
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    width: '100%',
  },
  countryPicker: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  securityNote: {
    fontSize: 12,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#6366f1',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginScreenOTP;