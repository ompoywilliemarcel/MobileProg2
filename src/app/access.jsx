import { Link, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const accountTypes = [
  { audience: "student", label: "Student" },
  { audience: "store", label: "Store Owner" },
];

export default function AccessScreen() {
  const { mode } = useLocalSearchParams();
  const isSignup = mode === "signup";
  const destination = isSignup ? "/signup" : "/login";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>Choose your account type</Text>
        <Text style={styles.subtitle}>
          {isSignup
            ? "Select the account you want to create."
            : "Select the account you want to sign in to."}
        </Text>
        <View style={styles.options}>
          {accountTypes.map((account) => (
            <Link
              key={account.audience}
              href={{ pathname: destination, params: { audience: account.audience } }}
              asChild
            >
              <TouchableOpacity style={styles.optionButton} accessibilityRole="button">
                <Text style={styles.optionButtonText}>{account.label}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F6F2" },
  content: { flex: 1, justifyContent: "center", width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 24 },
  title: { color: "#173B5B", fontSize: 28, lineHeight: 34, fontWeight: "800", textAlign: "center", letterSpacing: -0.5 },
  subtitle: { color: "#647386", fontSize: 14, lineHeight: 21, textAlign: "center", marginTop: 9, marginBottom: 26 },
  options: { gap: 13 },
  optionButton: { alignItems: "center", justifyContent: "center", minHeight: 56, backgroundColor: "#D9B45B", borderRadius: 14, paddingHorizontal: 20 },
  optionButtonText: { color: "#0B1F33", fontSize: 16, fontWeight: "800" },
});
