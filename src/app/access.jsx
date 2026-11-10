import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DarkRadialBackground from "../components/DarkRadialBackground";

export default function AccessScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <DarkRadialBackground />
      <View style={styles.content}>
        <View style={styles.heading}>
          <Text style={styles.title}>Welcome to USTP Wear</Text>
          <Text style={styles.subtitle}>
            Choose your account type to continue
          </Text>
        </View>
        <View style={styles.actions}>
          <Link
            href={{ pathname: "/login", params: { audience: "student" } }}
            asChild
          >
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Student</Text>
            </TouchableOpacity>
          </Link>
          <Link
            href={{ pathname: "/login", params: { audience: "store" } }}
            asChild
          >
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>USTP Store</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#061525" },
  content: { flex: 1, padding: 24, justifyContent: "space-between" },
  heading: { alignItems: "center", marginTop: 58 },
  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#D4DEE8",
    fontSize: 14,
    marginTop: 9,
    textAlign: "center",
  },
  actions: {
    flex: 1,
    justifyContent: "center",
    gap: 16,
    maxWidth: 440,
    width: "100%",
    alignSelf: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "#D9B45B",
    borderColor: "#E7C875",
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: 19,
  },
  buttonText: { color: "#0B1F33", fontSize: 17, fontWeight: "800" },
});
