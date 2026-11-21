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
import {
  demoAccounts,
  isAccountDisabled,
  loadSavedAccounts,
  recordActivity,
  setAuthenticatedAccount,
  store,
} from "../data/demoStore";

export default function LoginScreen() {
  const router = useRouter();
  const { audience: requestedAudience } = useLocalSearchParams();
  const audience = requestedAudience === "store" ? "store" : "student";
  const isStore = audience === "store";
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const handleLogin = async () => {
    setFieldErrors({});
    const validId = isStore
      ? /^32\d{5}$/.test(idNumber.trim())
      : /^202\d{7}$/.test(idNumber.trim());
    if (!validId) {
      setFieldErrors({
        idNumber: isStore
          ? "Enter a valid Admin ID (32 followed by 5 digits)."
          : "Enter a valid student number (202 followed by 7 digits).",
      });
      return;
    }
    try {
      await loadSavedAccounts();
    } catch {
      return Alert.alert(
        "Unable to load accounts",
        "Please try again. Your saved account data could not be loaded.",
      );
    }
    const account = demoAccounts.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        (item.audience === audience ||
          (audience === "store" && item.role === "admin")),
    );
    if (!account) {
      setFieldErrors({ email: "Incorrect username or email." });
      return;
    }
    if (account.id !== idNumber.trim()) {
      setFieldErrors({
        idNumber: isStore ? "Incorrect Admin ID." : "Incorrect student number.",
      });
      return;
    }
    if (account.password !== password) {
      setFieldErrors({ password: "Incorrect password." });
      return;
    }
    if (await isAccountDisabled(account.email)) {
      setFieldErrors({
        email: "This account is disabled. Contact the administrator.",
      });
      return;
    }
    await setAuthenticatedAccount(account.email);
    if (account.role === "customer") store.currentStudentId = account.id;
    await recordActivity(
      "User Login",
      account.name,
      "Logged into the application.",
    );
    router.replace({
      pathname:
        account.role === "customer"
          ? "/student/dashboard"
          : "/store-owner/dashboard",
      params: { role: account.role, name: account.name, id: account.id },
    });
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
          <View style={styles.header}>
            <Text style={styles.brand}>USTP Wear</Text>
          </View>
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>WELCOME BACK</Text>
            <Text style={styles.title}>
              {isStore ? "Admin login" : "Student login"}
            </Text>
            <Text style={styles.subtitle}>
              {isStore
                ? "Manage merch, orders, and store reports."
                : "Shop merch, reserve pickup, and track your orders."}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>
              {isStore ? "Admin ID" : "Student ID"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={isStore ? "32_ _ _ _ _ " : "202_ _ _ _ _ _ _"}
              placeholderTextColor="#8290A0"
              value={idNumber}
              onChangeText={(value) => {
                setIdNumber(
                  value.replace(/\D/g, "").slice(0, isStore ? 7 : 10),
                );
                setFieldErrors((current) => ({
                  ...current,
                  idNumber: undefined,
                }));
              }}
              keyboardType="number-pad"
              maxLength={isStore ? 7 : 10}
            />
            {fieldErrors.idNumber ? (
              <Text style={styles.fieldError}>{fieldErrors.idNumber}</Text>
            ) : null}
            <Text style={styles.label}>Username or email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username"
              placeholderTextColor="#8290A0"
              value={email}
              onChangeText={(value) => {
                setEmail(value);
                setFieldErrors((current) => ({ ...current, email: undefined }));
              }}
              autoCapitalize="none"
              autoComplete="username"
            />
            {fieldErrors.email ? (
              <Text style={styles.fieldError}>{fieldErrors.email}</Text>
            ) : null}
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter password"
              placeholderTextColor="#8290A0"
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                setFieldErrors((current) => ({
                  ...current,
                  password: undefined,
                }));
              }}
              secureTextEntry
              autoComplete="password"
            />
            {fieldErrors.password ? (
              <Text style={styles.fieldError}>{fieldErrors.password}</Text>
            ) : null}
            <Link
              href={{ pathname: "/forgot-password", params: { audience } }}
              style={styles.forgotPassword}
            >
              Forgot password?
            </Link>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
          {!isStore && (
            <Text style={styles.signup}>
              New here?{" "}
              <Link
                href={{ pathname: "/signup", params: { audience: "student" } }}
                style={styles.link}
              >
                Create an account
              </Link>
            </Text>
          )}
          <Link
            href={{
              pathname: "/login",
              params: { audience: isStore ? "student" : "store" },
            }}
            style={[styles.link, styles.accountSwitch]}
          >
            {isStore ? "Login as Student" : "Log as Admin"}
          </Link>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F6F2" },
  content: { padding: 22, paddingBottom: 36, flexGrow: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 26,
  },
  brand: { color: "#173B5B", fontSize: 24, fontWeight: "800" },
  link: { color: "#173B5B", fontWeight: "700" },
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
    borderColor: "#E7E2D6",
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
  fieldError: {
    color: "#C62828",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
    marginBottom: 10,
    fontWeight: "600",
  },
  forgotPassword: {
    color: "#173B5B",
    fontSize: 13,
    fontWeight: "700",
    alignSelf: "flex-end",
    marginTop: 12,
    paddingVertical: 4,
  },
  button: {
    backgroundColor: "#D9B45B",
    borderRadius: 13,
    alignItems: "center",
    padding: 15,
    marginTop: 18,
  },
  buttonText: { color: "#0B1F33", fontWeight: "800", fontSize: 15 },
  signup: { color: "#647386", textAlign: "center", marginTop: 22 },
  accountSwitch: { alignSelf: "center", marginTop: 16, paddingVertical: 8 },
});
