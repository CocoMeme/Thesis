import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  TextInput as RNTextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services';
import { theme } from '../styles';
import { CustomAlert } from '../components';

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
  const [alert, setAlert] = useState({ visible: false, type: 'info', title: '', message: '', buttons: [] });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, password, confirmPassword } = formData;

    // Check if all fields are filled
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password || !confirmPassword) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Missing Information',
        message: 'Please fill in all fields to continue.',
        buttons: [],
      });
      return false;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid email address.',
        buttons: [],
      });
      return false;
    }

    // Validate password strength
    if (password.length < 8) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Password Too Short',
        message: 'Password must be at least 8 characters long.',
        buttons: [],
      });
      return false;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Weak Password',
        message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
        buttons: [],
      });
      return false;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'Password Mismatch',
        message: 'Passwords do not match. Please try again.',
        buttons: [],
      });
      return false;
    }

    // Check terms agreement
    if (!agreeToTerms) {
      setAlert({
        visible: true,
        type: 'warning',
        title: 'Terms Required',
        message: 'Please agree to the Terms of Service and Privacy Policy to continue.',
        buttons: [],
      });
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
        setAlert({
          visible: true,
          type: 'success',
          title: 'Welcome to eGourd!',
          message: 'Account created successfully! Start scanning your gourds now.',
          buttons: [
            {
              text: 'Get Started',
              onPress: () => {
                // Notify AppNavigator that authentication succeeded
                if (onAuthSuccess) {
                  onAuthSuccess();
                }
              }
            }
          ],
        });
      } else {
        setAlert({
          visible: true,
          type: 'error',
          title: 'Registration Failed',
          message: result.message || 'Unable to create account. Please try again.',
          buttons: [],
        });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setAlert({
        visible: true,
        type: 'error',
        title: 'Connection Error',
        message: 'Network error. Please check your connection and try again.',
        buttons: [],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);

    try {
      const result = await authService.signInWithGoogle();

      if (result.success) {
        setAlert({
          visible: true,
          type: 'success',
          title: 'Welcome to eGourd!',
          message: 'Google Sign-Up successful! Start scanning your gourds now.',
          buttons: [
            {
              text: 'Get Started',
              onPress: () => {
                // Notify AppNavigator that authentication succeeded
                if (onAuthSuccess) {
                  onAuthSuccess();
                }
              }
            }
          ],
        });
      } else {
        // Show a more detailed error for configuration issues
        const errorMessage = result.message || 'Unable to sign up with Google';
        if (errorMessage.includes('not configured')) {
          setAlert({
            visible: true,
            type: 'info',
            title: 'Setup Required',
            message: 'Google Sign-Up is running in demo mode. To enable real Google authentication, please follow the setup guide.',
            buttons: [
              { text: 'Use Demo Mode', onPress: () => handleGoogleSignUp() },
              { text: 'Cancel', style: 'cancel' }
            ],
          });
        } else {
          setAlert({
            visible: true,
            type: 'error',
            title: 'Sign-Up Failed',
            message: errorMessage,
            buttons: [],
          });
        }
      }
    } catch (error) {
      console.error('Google Sign-Up error:', error);
      setAlert({
        visible: true,
        type: 'error',
        title: 'Connection Error',
        message: 'Network error. Please check your connection and try again.',
        buttons: [],
      });
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
      <LinearGradient
        colors={[theme.colors.gradient.start, theme.colors.gradient.end]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Logo Section */}
            <View style={styles.logoContainer}>
              <Image 
                source={require('../../assets/logo/egourd-high-resolution-logo-white-transparent.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.title}>Join eGourd</Text>
              <Text style={styles.subtitle}>
                Create your account to start tracking and analyzing gourds
              </Text>
            </View>

            {/* Sign Up Form Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Create Account</Text>
              
              {/* Name Inputs */}
              <View style={styles.nameRow}>
                <View style={[styles.inputContainer, styles.nameInput]}>
                  <MaterialCommunityIcons 
                    name="account-outline" 
                    size={20} 
                    color={theme.colors.text.secondary} 
                    style={styles.inputIcon}
                  />
                  <RNTextInput
                    placeholder="First Name"
                    placeholderTextColor={theme.colors.text.secondary}
                    value={formData.firstName}
                    onChangeText={(value) => updateField('firstName', value)}
                    style={styles.input}
                    autoCapitalize="words"
                  />
                </View>
                
                <View style={[styles.inputContainer, styles.nameInput]}>
                  <RNTextInput
                    placeholder="Last Name"
                    placeholderTextColor={theme.colors.text.secondary}
                    value={formData.lastName}
                    onChangeText={(value) => updateField('lastName', value)}
                    style={styles.input}
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Email Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons 
                  name="email-outline" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                  style={styles.inputIcon}
                />
                <RNTextInput
                  placeholder="Email"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={formData.email}
                  onChangeText={(value) => updateField('email', value)}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons 
                  name="lock-outline" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                  style={styles.inputIcon}
                />
                <RNTextInput
                  placeholder="Password"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={formData.password}
                  onChangeText={(value) => updateField('password', value)}
                  style={styles.input}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons 
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
              </View>

              {/* Password Strength */}
              {formData.password.length > 0 && (
                <View style={styles.passwordStrength}>
                  <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                    Password Strength: {passwordStrength.text}
                  </Text>
                </View>
              )}

              {/* Confirm Password Input */}
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons 
                  name="lock-check-outline" 
                  size={20} 
                  color={theme.colors.text.secondary} 
                  style={styles.inputIcon}
                />
                <RNTextInput
                  placeholder="Confirm Password"
                  placeholderTextColor={theme.colors.text.secondary}
                  value={formData.confirmPassword}
                  onChangeText={(value) => updateField('confirmPassword', value)}
                  style={styles.input}
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialCommunityIcons 
                    name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} 
                    size={20} 
                    color={theme.colors.text.secondary} 
                  />
                </TouchableOpacity>
              </View>

              {/* Terms Checkbox */}
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setAgreeToTerms(!agreeToTerms)}
              >
                <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                  {agreeToTerms && (
                    <MaterialCommunityIcons name="check" size={16} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.checkboxText}>
                  I agree to the{' '}
                  <Text style={styles.linkText}>Terms of Service</Text>
                  {' '}and{' '}
                  <Text style={styles.linkText}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              {/* Sign Up Button */}
              <TouchableOpacity
                onPress={handleSignUp}
                disabled={loading}
                style={[styles.signupButton, loading && styles.buttonDisabled]}
              >
                <LinearGradient
                  colors={[theme.colors.primary, '#4a8a3f']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signupButtonGradient}
                >
                  {loading ? (
                    <Text style={styles.buttonText}>Creating Account...</Text>
                  ) : (
                    <Text style={styles.buttonText}>Create Account</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or sign up with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Sign Up Button */}
              <TouchableOpacity
                onPress={handleGoogleSignUp}
                disabled={loading}
                style={[styles.googleButton, loading && styles.buttonDisabled]}
              >
                <MaterialCommunityIcons 
                  name="google" 
                  size={20} 
                  color={theme.colors.primary} 
                  style={styles.googleIcon}
                />
                <Text style={styles.googleButtonText}>Sign up with Google</Text>
              </TouchableOpacity>
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>

      {/* Custom Alert */}
      <CustomAlert
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttons={alert.buttons}
        onClose={() => setAlert({ ...alert, visible: false })}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: theme.spacing.md,
  },
  title: {
    fontSize: 32,
    fontFamily: theme.fonts.bold,
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.borderRadius.large,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    color: theme.colors.text.primary,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  nameInput: {
    flex: 0.48,
    marginBottom: 0,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.secondary,
    borderRadius: theme.borderRadius.medium,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.background.secondary,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.primary,
  },
  eyeIcon: {
    padding: theme.spacing.xs,
  },
  passwordStrength: {
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.md,
    paddingLeft: theme.spacing.sm,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: theme.fonts.semiBold,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: theme.colors.primary,
  },
  checkboxText: {
    flex: 1,
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.text.secondary,
    lineHeight: 18,
  },
  linkText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.semiBold,
  },
  signupButton: {
    borderRadius: theme.borderRadius.medium,
    overflow: 'hidden',
    marginBottom: theme.spacing.lg,
  },
  signupButtonGradient: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.background.secondary,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    color: theme.colors.text.secondary,
    fontSize: 14,
    fontFamily: theme.fonts.regular,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.medium,
    paddingVertical: theme.spacing.md,
  },
  googleIcon: {
    marginRight: theme.spacing.sm,
  },
  googleButtonText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  loginText: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
});