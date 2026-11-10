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
import DarkRadialBackground from "../components/DarkRadialBackground";
import { demoAccounts } from "../data/demoStore";

export default function LoginScreen() {
  const router = useRouter();
  const { audience: requestedAudience } = useLocalSearchParams();
  const audience = requestedAudience === "store" ? "store" : "student";
  const isStore = audience === "store";
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    const validId = isStore
      ? /^32\d{5}$/.test(idNumber.trim())
      : /^202\d{7}$/.test(idNumber.trim());
    if (!validId)
      return Alert.alert(
        "Incomplete ID number",
        isStore
          ? "Enter your complete store ID (32 followed by 5 digits)."
          : "Enter your complete student ID (202 followed by 7 digits).",
      );
    const account = demoAccounts.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password &&
        item.id === idNumber.trim() &&
        (item.audience === audience ||
          (audience === "store" && item.role === "admin")),
    );
    if (!account)
      return Alert.alert(
        "Login failed",
        "Check the username, ID number, and password, then try again.",
      );
    router.replace({
      pathname: "/dashboard",
      params: { role: account.role, name: account.name },
    });
  };
  return (
    <SafeAreaView style={styles.safe}>
      <DarkRadialBackground />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.brand}>USTP Wear</Text>
            <Link href="/access" style={styles.link}>
              Change account type
            </Link>
          </View>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>WELCOME BACK</Text>
            <Text style={styles.title}>
              {isStore ? "USTP Store login" : "Student login"}
            </Text>
            <Text style={styles.subtitle}>
              {isStore
                ? "Manage merch, orders, and store reports."
                : "Shop merch, reserve pickup, and track your orders."}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>
              {isStore ? "USTP Store ID" : "Student ID"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={isStore ? "32_ _ _ _ _ " : "202_ _ _ _ _ _ _"}
              placeholderTextColor="#8290A0"
              value={idNumber}
              onChangeText={(value) =>
                setIdNumber(value.replace(/\D/g, "").slice(0, isStore ? 7 : 10))
              }
              keyboardType="number-pad"
              maxLength={isStore ? 7 : 10}
            />
            <Text style={styles.label}>Username or email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#8290A0"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoComplete="username"
            />
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#8290A0"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.signup}>
            New here?{" "}
            <Link
              href={{ pathname: "/signup", params: { audience } }}
              style={styles.link}
            >
              Create an account
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#061525" },
  content: { padding: 22, paddingBottom: 36, flexGrow: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },
  brand: { color: "#FFF", fontSize: 24, fontWeight: "800" },
  link: { color: "#9A741E", fontWeight: "700" },
  hero: {
    backgroundColor: "#183653",
    borderRadius: 24,
    padding: 23,
    marginBottom: 18,
  },
  eyebrow: {
    color: "#D9B45B",
    fontWeight: "800",
    fontSize: 11,
    letterSpacing: 1.4,
  },
  title: {
    color: "#FFF",
    fontSize: 29,
    lineHeight: 35,
    fontWeight: "800",
    marginTop: 12,
  },
  subtitle: { color: "#D4DEE8", fontSize: 14, lineHeight: 21, marginTop: 9 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#D9B45B",
  },
  label: {
    color: "#0B1F33",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 12,
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#F8F7F2",
    borderWidth: 1,
    borderColor: "#D8D2C5",
    borderRadius: 12,
    padding: 14,
    color: "#0B1F33",
    fontSize: 15,
  },
  button: {
    backgroundColor: "#D9B45B",
    borderRadius: 13,
    alignItems: "center",
    padding: 15,
    marginTop: 18,
  },
  buttonText: { color: "#0B1F33", fontWeight: "800", fontSize: 15 },
  signup: { color: "#E2E8F0", textAlign: "center", marginTop: 22 },
});
