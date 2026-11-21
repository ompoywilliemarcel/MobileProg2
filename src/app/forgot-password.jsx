import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { resetAccountPassword } from "../data/demoStore";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { audience: requestedAudience } = useLocalSearchParams();
  const audience = requestedAudience === "store" ? "store" : "student";
  const isStore = audience === "store";
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleReset = async () => {
    setError("");
    const validId = isStore
      ? /^32\d{5}$/.test(idNumber.trim())
      : /^202\d{7}$/.test(idNumber.trim());
    if (!validId) {
      setError(
        isStore
          ? "Enter a valid Admin ID (32 followed by 5 digits)."
          : "Enter a valid student number (202 followed by 7 digits).",
      );
      return;
    }
    if (!email.trim()) {
      setError("Enter the username or email for your account.");
      return;
    }
    if (password.length < 8) {
      setError("Your new password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      await resetAccountPassword({
        email,
        id: idNumber,
        password,
        audience,
      });
      Alert.alert("Password updated", "You can now log in with your new password.", [
        {
          text: "Go to login",
          onPress: () =>
            router.replace({ pathname: "/login", params: { audience } }),
        },
      ]);
    } catch (resetError) {
      setError(resetError.message || "Unable to reset your password. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.brand}>USTP Wear</Text>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>ACCOUNT RECOVERY</Text>
            <Text style={styles.title}>Forgot password?</Text>
            <Text style={styles.subtitle}>
              Verify your {isStore ? "admin" : "student"} account and choose a
              new password.
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>{isStore ? "Admin ID" : "Student ID"}</Text>
            <TextInput
              style={styles.input}
              placeholder={isStore ? "32_ _ _ _ _" : "202_ _ _ _ _ _ _"}
              placeholderTextColor="#8290A0"
              value={idNumber}
              onChangeText={(value) => setIdNumber(value.replace(/\D/g, "").slice(0, isStore ? 7 : 10))}
              keyboardType="number-pad"
              maxLength={isStore ? 7 : 10}
            />
            <Text style={styles.label}>Username or email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username or email"
              placeholderTextColor="#8290A0"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="username"
            />
            <Text style={styles.label}>New password</Text>
            <TextInput
              style={styles.input}
              placeholder="At least 8 characters"
              placeholderTextColor="#8290A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />
            <Text style={styles.label}>Confirm new password</Text>
            <TextInput
              style={styles.input}
              placeholder="Repeat new password"
              placeholderTextColor="#8290A0"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={{ disabled: saving }}
              disabled={saving}
              style={[styles.button, saving && styles.buttonDisabled]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>
                {saving ? "Updating…" : "Reset password"}
              </Text>
            </TouchableOpacity>
          </View>
          <Link
            href={{ pathname: "/login", params: { audience } }}
            style={styles.backLink}
          >
            Back to login
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F6F2" },
  content: { padding: 22, paddingBottom: 36, flexGrow: 1 },
  brand: { color: "#173B5B", fontSize: 24, fontWeight: "800", marginBottom: 26 },
  hero: { backgroundColor: "#183653", borderRadius: 24, padding: 23, marginBottom: 18 },
  eyebrow: { color: "#D9B45B", fontWeight: "800", fontSize: 11, letterSpacing: 1.4 },
  title: { color: "#FFF", fontSize: 29, lineHeight: 35, fontWeight: "800", marginTop: 12 },
  subtitle: { color: "#D4DEE8", fontSize: 14, lineHeight: 21, marginTop: 9 },
  card: { backgroundColor: "#FFF", borderRadius: 22, padding: 20, borderWidth: 1, borderColor: "#E7E2D6" },
  label: { color: "#0B1F33", fontSize: 13, fontWeight: "700", marginTop: 12, marginBottom: 7 },
  input: { backgroundColor: "#F8F7F2", borderWidth: 1, borderColor: "#D8D2C5", borderRadius: 12, padding: 14, color: "#0B1F33", fontSize: 15 },
  error: { color: "#C62828", fontSize: 12, lineHeight: 17, marginTop: 12, fontWeight: "600" },
  button: { backgroundColor: "#D9B45B", borderRadius: 13, alignItems: "center", padding: 15, marginTop: 18 },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#0B1F33", fontWeight: "800", fontSize: 15 },
  backLink: { color: "#173B5B", fontWeight: "700", alignSelf: "center", marginTop: 20, paddingVertical: 8 },
});
