import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function AppButton({ title, onPress, disabled = false, style }) {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.button, disabled && styles.disabledButton, style]}
    >
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#0284C7',
    borderRadius: 14,
    justifyContent: 'center',
    paddingVertical: 16,
  },
  disabledButton: {
    backgroundColor: '#94A3B8',
    opacity: 0.65,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
