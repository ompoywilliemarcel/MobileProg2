import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
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
  deductOrderStock,
  money,
  productAmount,
  recordActivity,
  store,
} from "../../data/demoStore";

export default function OrderDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = Array.isArray(params.name)
    ? params.name[0]
    : params.name || "Student";
  const items = store.checkoutItems || [];
  const method = store.checkoutMethod || "GCash";
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + productAmount(item) * (item.quantity || 1),
        0,
      ),
    [items],
  );
  const placeOrder = async () => {
    if (!items.length)
      return Alert.alert(
        "Order unavailable",
        "Please return to checkout and try again.",
      );
    try {
      deductOrderStock(items);
    } catch (error) {
      return Alert.alert("Stock changed", error.message);
    }
    const order = {
      id: `USTP-${Date.now().toString().slice(-5)}`,
      customer: name,
      items: items.map((item) => ({
        name: item.name,
        size: item.size || null,
        quantity: item.quantity || 1,
        price: productAmount(item),
      })),
      item: items
        .map(
          (item) =>
            `${item.name}${item.size ? ` (${item.size})` : ""} x${item.quantity || 1}`,
        )
        .join(", "),
      total,
      status: "Received",
      method,
      gcashReference:
        method === "GCash"
          ? `GC-${Math.random().toString(10).slice(2, 12)}`
          : undefined,
      pickup: store.checkoutPickup || undefined,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
      }),
    };
    store.orders.unshift(order);
    await recordActivity(
      "Order Activity",
      name,
      `Placed order ${order.id} for ${money(total)}.`,
    );
    if (!store.checkoutDirect) {
      store.cart = [];
      store.cartNotificationCount = 0;
    }
    store.checkoutItems = [];
    store.checkoutPickup = "";
    store.checkoutPickupTime = "10 AM";
    store.checkoutDirect = false;
    store.checkoutMethod = "GCash";
    router.replace({
      pathname: "/student/order-confirmation",
      params: { name, orderId: order.id },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <DarkRadialBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>‹ Checkout</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Order details</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={styles.subtitle}>
          Hi {name}, review your order before placing it.
        </Text>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Items</Text>
          {items.map((item, index) => (
            <View key={`${item.id}-${index}`} style={styles.itemRow}>
              <Image
                source={item.image}
                resizeMode="contain"
                style={styles.image}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.muted}>
                  {item.size ? `Size ${item.size} · ` : ""}Quantity $
                  {item.quantity || 1}
                </Text>
              </View>
              <Text style={styles.itemPrice}>
                {money(productAmount(item) * (item.quantity || 1))}
              </Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.total}>{money(total)}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment and pickup</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Payment method</Text>
            <Text style={styles.value}>{method}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Pickup</Text>
            <Text style={styles.value}>
              {store.checkoutPickup || "Arrange later"}
            </Text>
          </View>
          <Text style={styles.muted}>
            {method === "GCash"
              ? "Demo GCash selection; no payment is processed."
              : "Pay on shop when you pick up your order."}
          </Text>
        </View>
        <TouchableOpacity style={styles.primary} onPress={placeOrder}>
          <Text style={styles.primaryText}>Place order</Text>
        </TouchableOpacity>
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
  back: { color: "#D9B45B", fontSize: 14, fontWeight: "800" },
  title: { color: "#FFF", fontSize: 22, fontWeight: "800" },
  subtitle: { color: "#D4DEE8", fontSize: 13, marginBottom: 17 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 17,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E7E2D6",
  },
  sectionTitle: {
    color: "#0B1F33",
    fontSize: 16,
    fontWeight: "800",
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: "#EEF0F2",
  },
  image: { width: 54, height: 58, backgroundColor: "#F1F4F5", borderRadius: 9 },
  itemInfo: { flex: 1 },
  itemName: { color: "#0B1F33", fontWeight: "800", fontSize: 13 },
  itemPrice: { color: "#80651F", fontWeight: "800" },
  muted: { color: "#69798A", fontSize: 12, lineHeight: 18, marginTop: 5 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  totalLabel: { color: "#0B1F33", fontSize: 15, fontWeight: "800" },
  total: { color: "#0B1F33", fontSize: 21, fontWeight: "900" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 8,
  },
  label: { color: "#69798A", fontSize: 13 },
  value: {
    color: "#0B1F33",
    fontWeight: "800",
    fontSize: 13,
    textAlign: "right",
    flex: 1,
  },
  primary: {
    alignItems: "center",
    backgroundColor: "#D9B45B",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 3,
  },
  primaryText: { color: "#0B1F33", fontWeight: "900", fontSize: 14 },
});
