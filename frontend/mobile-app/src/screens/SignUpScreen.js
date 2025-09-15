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
  Checkbox,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services';

export const SignUpScreen = ({ navigation, onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Check if all fields are filled
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    // Validate password strength
    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        'Weak Password',
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      );
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    // Check terms agreement
    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms of Service and Privacy Policy');
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...signupData } = formData;
      
      const result = await authService.register(signupData);

      if (result.success) {
        Alert.alert(
          'Success', 
          'Account created successfully! Welcome to Gourd Scanner!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Notify AppNavigator that authentication succeeded
                if (onAuthSuccess) {
                  onAuthSuccess();
                }
              }
            }
          ]
        );
      } else {
        Alert.alert('Registration Failed', result.message || 'Unable to create account');
      }
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);

    try {
      const result = await authService.signInWithGoogle();

      if (result.success) {
        Alert.alert(
          'Success', 
          'Google Sign-Up successful! Welcome to Gourd Scanner!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Notify AppNavigator that authentication succeeded
                if (onAuthSuccess) {
                  onAuthSuccess();
                }
              }
            }
          ]
        );
      } else {
        // Show a more detailed error for configuration issues
        const errorMessage = result.message || 'Unable to sign up with Google';
        if (errorMessage.includes('not configured')) {
          Alert.alert(
            'Google Sign-In Setup Required', 
            'Google Sign-In needs to be configured first. Check the console for setup instructions or refer to docs/google-auth-setup.md',
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Google Sign-Up Failed', errorMessage);
        }
      }
    } catch (error) {
      console.error('Google Sign-Up error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const getPasswordStrength = () => {
    const { password } = formData;
    if (password.length === 0) return { text: '', color: '#ccc' };
    if (password.length < 8) return { text: 'Too Short', color: '#f44336' };
    
    let strength = 0;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    
    if (strength === 1) return { text: 'Weak', color: '#ff9800' };
    if (strength === 2) return { text: 'Fair', color: '#ffeb3b' };
    if (strength === 3) return { text: 'Good', color: '#8bc34a' };
    return { text: 'Strong', color: '#4caf50' };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Surface style={styles.surface}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/android-chrome-192x192.png')} 
                style={styles.logo}
              />
              <Title style={styles.title}>Join Gourd Scanner</Title>
              <Paragraph style={styles.subtitle}>
                Create your account to start tracking and analyzing gourds
              </Paragraph>
            </View>

            <Card style={styles.card}>
              <Card.Content>
                <Title style={styles.cardTitle}>Create Account</Title>
                
                <View style={styles.nameContainer}>
                  <TextInput
                    label="First Name"
                    value={formData.firstName}
                    onChangeText={(value) => updateField('firstName', value)}
                    mode="outlined"
                    style={[styles.input, styles.nameInput]}
                    autoCapitalize="words"
                    left={<TextInput.Icon icon="account" />}
                  />
                  
                  <TextInput
                    label="Last Name"
                    value={formData.lastName}
                    onChangeText={(value) => updateField('lastName', value)}
                    mode="outlined"
                    style={[styles.input, styles.nameInput]}
                    autoCapitalize="words"
                  />
                </View>

                <TextInput
                  label="Email"
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  mode="outlined"
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  left={<TextInput.Icon icon="email" />}
                />

                <TextInput
                  label="Password"
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  mode="outlined"
                  secureTextEntry={!showPassword}
                  style={styles.input}
                  autoComplete="password-new"
                  left={<TextInput.Icon icon="lock" />}
                  right={
                    <TextInput.Icon
                      icon={showPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowPassword(!showPassword)}
                    />
                  }
                />
                
                {formData.password.length > 0 && (
                  <View style={styles.passwordStrength}>
                    <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                      Password Strength: {passwordStrength.text}
                    </Text>
                  </View>
                )}

                <TextInput
                  label="Confirm Password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateField('confirmPassword', value)}
                  mode="outlined"
                  secureTextEntry={!showConfirmPassword}
                  style={styles.input}
                  autoComplete="password-new"
                  left={<TextInput.Icon icon="lock-check" />}
                  right={
                    <TextInput.Icon
                      icon={showConfirmPassword ? 'eye-off' : 'eye'}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  }
                />

                <View style={styles.checkboxContainer}>
                  <Checkbox
                    status={agreeToTerms ? 'checked' : 'unchecked'}
                    onPress={() => setAgreeToTerms(!agreeToTerms)}
                  />
                  <Paragraph style={styles.checkboxText}>
                    I agree to the{' '}
                    <Text 
                      style={styles.linkText}
                      onPress={() => Alert.alert('Info', 'Terms of Service coming soon!')}
                    >
                      Terms of Service
                    </Text>
                    {' '}and{' '}
                    <Text 
                      style={styles.linkText}
                      onPress={() => Alert.alert('Info', 'Privacy Policy coming soon!')}
                    >
                      Privacy Policy
                    </Text>
                  </Paragraph>
                </View>

                <Button
                  mode="contained"
                  onPress={handleSignUp}
                  loading={loading}
                  disabled={loading}
                  style={styles.signupButton}
                  contentStyle={styles.buttonContent}
                  buttonColor="#2E7D32"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>

                <View style={styles.dividerContainer}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>or</Text>
                  <View style={styles.dividerLine} />
                </View>

                <Button
                  mode="outlined"
                  onPress={handleGoogleSignUp}
                  style={styles.googleButton}
                  contentStyle={styles.buttonContent}
                  icon="google"
                  textColor="#2E7D32"
                  loading={loading}
                  disabled={loading}
                >
                  Sign up with Google
                </Button>
              </Card.Content>
            </Card>

            <View style={styles.loginContainer}>
              <Paragraph style={styles.loginText}>
                Already have an account?
              </Paragraph>
              <Button
                mode="outlined"
                onPress={navigateToLogin}
                style={styles.loginButton}
              >
                Sign In
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
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
    textAlign: 'center',
    marginBottom: 20,
    color: '#1B5E20',
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nameInput: {
    flex: 0.48,
  },
  input: {
    marginBottom: 16,
  },
  passwordStrength: {
    marginBottom: 16,
    marginTop: -8,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  checkboxText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#2E7D32',
  },
  linkText: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  signupButton: {
    marginTop: 10,
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
  },
  googleButton: {
    marginBottom: 10,
    borderColor: '#2E7D32',
    borderWidth: 1,
  },
  loginContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginText: {
    marginBottom: 10,
    color: '#2E7D32',
  },
  loginButton: {
    minWidth: 200,
    borderColor: '#2E7D32',
  },
});