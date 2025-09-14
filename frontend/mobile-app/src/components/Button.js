import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const Button = ({ 
  title, 
  onPress, 
  variant = 'primary', 
  disabled = false,
  style,
  ...props 
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        disabled && styles.disabled,
        style
      ]}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Text style={[styles.text, styles[`${variant}Text`], disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primary: {
    backgroundColor: '#4CAF50',
  },
  secondary: {
    backgroundColor: '#FFC107',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  disabled: {
    backgroundColor: '#E0E0E0',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: '#FFFFFF',
  },
  secondaryText: {
    color: '#000000',
  },
  outlineText: {
    color: '#4CAF50',
  },
  disabledText: {
    color: '#9E9E9E',
  },
});