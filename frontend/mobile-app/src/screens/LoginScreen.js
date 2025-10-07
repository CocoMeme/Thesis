import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator,
  Surface,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services';

export const LoginScreen = ({ navigation, onAuthSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const result = await authService.login(email, password);

      if (result.success) {
        Alert.alert('Success', 'Login successful!', [
          {
            text: 'OK',
            onPress: () => {
              // Notify AppNavigator that authentication succeeded
              if (onAuthSuccess) {
                onAuthSuccess();
              }
            }
          }
        ]);
      } else {
        Alert.alert('Login Failed', result.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    try {
      // Check Google Auth configuration status
      const authStatus = authService.getGoogleAuthStatus();
      console.log('🔍 Google Auth Status:', authStatus);

      const result = await authService.signInWithGoogle();

      if (result.success) {
        const mode = authStatus.isDemoMode ? ' (Demo Mode)' : '';
        Alert.alert('Success', `Google Sign-In successful!${mode}`, [
          {
            text: 'OK',
            onPress: () => {
              // Notify AppNavigator that authentication succeeded
              if (onAuthSuccess) {
                onAuthSuccess();
              }
            }
          }
        ]);
      } else {
        // Show a more detailed error for configuration issues
        const errorMessage = result.message || 'Unable to sign in with Google';
        if (errorMessage.includes('not configured')) {
          Alert.alert(
            'Google Sign-In Setup Required', 
            'Google Sign-In is running in demo mode. To enable real Google authentication, please follow the setup guide in docs/google-oauth-complete-setup.md',
            [
              { text: 'Use Demo Mode', onPress: () => handleGoogleSignIn() },
              { text: 'OK' }
            ]
          );
        } else {
          Alert.alert('Google Sign-In Failed', errorMessage);
        }
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Surface style={styles.surface}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/android-chrome-192x192.png')} 
                style={styles.logo}
              />
              <Title style={styles.title}>Gourd Scanner</Title>
              <Paragraph style={styles.subtitle}>
                Sign in to continue scanning and tracking your gourds
              </Paragraph>
            </View>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Welcome Back</Title>
                
                <TextInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  left={<TextInput.Icon icon="email" />}
                />

                <TextInput
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  autoComplete="password"
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />

                <Button
                  mode="contained"
                  onPress={handleLogin}
                  loading={loading}
                  disabled={loading}
                  style={styles.loginButton}
                  contentStyle={styles.buttonContent}
                  buttonColor="#2E7D32"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Button
                  mode="outlined"
                  onPress={handleGoogleSignIn}
                  style={styles.googleButton}
                  contentStyle={styles.buttonContent}
                  icon="google"
                  textColor="#2E7D32"
                  loading={loading}
                  disabled={loading}
                >
                  Continue with Google
                </Button>

                <Button
                  mode="text"
                  onPress={() => Alert.alert('Info', 'Forgot password feature coming soon!')}
                  style={styles.forgotButton}
                  textColor="#43A047"
                >
                  Forgot Password?
                </Button>
              </Card.Content>
            </Card>

            <View style={styles.signupContainer}>
              <Paragraph style={styles.signupText}>
                Don't have an account?
              </Paragraph>
              <Button
                mode="outlined"
                onPress={navigateToSignUp}
                style={styles.signupButton}
              >
                Create Account
              </Button>
            </View>
          </Surface>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E8',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  surface: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Poppins_700Bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    color: '#2E7D32',
    paddingHorizontal: 20,
  },
  card: {
    marginBottom: 20,
    elevation: 4,
    backgroundColor: '#FFFFFF',
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1B5E20',
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: '#2E7D32',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#C8E6C9',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#66BB6A',
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
  googleButton: {
    marginBottom: 10,
    borderColor: '#2E7D32',
    borderWidth: 1,
  },
  forgotButton: {
    marginTop: 5,
  },
  signupContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signupText: {
    marginBottom: 10,
    color: '#2E7D32',
  },
  signupButton: {
    minWidth: 200,
    borderColor: '#2E7D32',
  },
});