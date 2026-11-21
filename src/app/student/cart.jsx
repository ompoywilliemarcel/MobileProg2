import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DarkRadialBackground from "../../components/DarkRadialBackground";
import {
  getProductStock,
  money,
  productAmount,
  store,
} from "../../data/demoStore";

export default function CartScreen() {
  const router = useRouter();
  const { name: rawName } = useLocalSearchParams();
  const name = Array.isArray(rawName) ? rawName[0] : rawName || "Student";
  const [cart, setCart] = useState([...store.cart]);
  const total = useMemo(
    () =>
      cart.reduce(
        (sum, item) => sum + productAmount(item) * (item.quantity || 1),
        0,
      ),
    [cart],
  );
  const save = (next) => {
    store.cart = next;
    setCart(next);
  };
  const updateQuantity = (index, amount) => {
    const item = cart[index];
    const quantity = Math.max(1, (item.quantity || 1) + amount);
    if (quantity > getProductStock(item, item.size))
      return Alert.alert(
        "Stock limit",
        `Only ${getProductStock(item, item.size)} available for ${item.name}${item.size ? `, size ${item.size}` : ""}.`,
      );
    save(
      cart.map((entry, i) => (i === index ? { ...entry, quantity } : entry)),
    );
  };
  const remove = (index) => save(cart.filter((_, i) => i !== index));
  const goBack = () =>
    router.replace({ pathname: "/student/dashboard", params: { name } });

  return (
    <SafeAreaView style={styles.safe}>
      <DarkRadialBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.back}>‹ Shop</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your cart</Text>
          <View style={{ width: 48 }} />
        </View>
        <Text style={styles.subtitle}>Review your items before checkout.</Text>
        {cart.length ? (
          cart.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.card}>
              <Image
                source={item.image}
                resizeMode="contain"
                style={styles.image}
              />
              <View style={styles.info}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.price}>
                  {item.price}
                  {item.size ? `  ·  Size ${item.size}` : ""}
                </Text>
                <View style={styles.actions}>
                  <View style={styles.quantity}>
                    <TouchableOpacity
                      onPress={() => updateQuantity(index, -1)}
                      style={styles.qtyButton}
                    >
                      <Text style={styles.qtyText}>−</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyValue}>{item.quantity || 1}</Text>
                    <TouchableOpacity
                      onPress={() => updateQuantity(index, 1)}
                      style={styles.qtyButton}
                    >
                      <Text style={styles.qtyText}>+</Text>
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    onPress={() => remove(index)}
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${item.name} from cart`}
                    hitSlop={8}
                    style={styles.removeButton}
                  >
                    <Text style={styles.remove}>Remove</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.muted}>
              Browse the collection to find your next favorite.
            </Text>
            <TouchableOpacity style={styles.primary} onPress={goBack}>
              <Text style={styles.primaryText}>Browse merch</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>Cart subtotal</Text>
          <View style={[styles.totalRow, { marginTop: 15 }]}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.total}>{money(total)}</Text>
          </View>
          <TouchableOpacity
            disabled={!cart.length}
            style={[styles.primary, !cart.length && styles.disabled]}
            onPress={() =>
              router.push({ pathname: "/student/checkout", params: { name } })
            }
          >
            <Text style={styles.primaryText}>Continue to checkout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#061525" },
  content: {
    padding: 20,
    paddingBottom: 40,
    maxWidth: 760,
    width: "100%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  back: { color: "#D9B45B", fontWeight: "800", fontSize: 14 },
  title: { color: "#FFF", fontSize: 22, fontWeight: "800" },
  subtitle: { color: "#D4DEE8", fontSize: 13, marginBottom: 17 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 11,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: "#E7E2D6",
  },
  image: {
    width: 84,
    height: 96,
    backgroundColor: "#F1F4F5",
    borderRadius: 11,
  },
  info: { flex: 1, justifyContent: "center" },
  itemName: { color: "#0B1F33", fontSize: 14, fontWeight: "800" },
  price: { color: "#9A741E", fontSize: 13, fontWeight: "800", marginTop: 5 },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  quantity: { flexDirection: "row", alignItems: "center", gap: 10 },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#F8F3E5",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { color: "#80651F", fontSize: 17, fontWeight: "800" },
  qtyValue: { color: "#0B1F33", fontWeight: "800" },
  removeButton: { paddingVertical: 8, paddingHorizontal: 6 },
  remove: { color: "#A43D32", fontWeight: "800", fontSize: 11 },
  summary: {
    backgroundColor: "#FFF",
    borderRadius: 17,
    padding: 16,
    marginTop: 5,
    borderWidth: 1,
    borderColor: "#E7E2D6",
  },
  sectionTitle: {
    color: "#0B1F33",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { color: "#0B1F33", fontSize: 15, fontWeight: "700" },
  total: { color: "#0B1F33", fontSize: 22, fontWeight: "900" },
  muted: { color: "#69798A", fontSize: 12, lineHeight: 18, marginTop: 7 },
  primary: {
    alignItems: "center",
    backgroundColor: "#D9B45B",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 15,
  },
  primaryText: { color: "#0B1F33", fontWeight: "900", fontSize: 14 },
  disabled: { opacity: 0.5 },
  empty: {
    backgroundColor: "#FFF",
    borderRadius: 17,
    padding: 22,
    alignItems: "center",
    marginBottom: 12,
  },
});
