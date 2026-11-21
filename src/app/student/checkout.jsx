import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
import { products as catalogProducts } from "../../data/products";

const times = [
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
];

export default function CheckoutScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = Array.isArray(params.name)
    ? params.name[0]
    : params.name || "Student";
  const productId = Array.isArray(params.productId)
    ? params.productId[0]
    : params.productId;
  const size = Array.isArray(params.size) ? params.size[0] : params.size;
  const directProduct = productId
    ? [...store.products, ...catalogProducts].find(
        (item) => item.id === Number(productId),
      )
    : null;
  const [items, setItems] = useState(
    directProduct
      ? [{ ...directProduct, size: size || null, quantity: 1 }]
      : [...store.cart],
  );
  const [paymentMethod, setPaymentMethod] = useState(
    store.checkoutMethod || "GCash",
  );
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState(
    store.checkoutPickupTime || "10 AM",
  );
  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + productAmount(item) * (item.quantity || 1),
        0,
      ),
    [items],
  );
  const changeQuantity = (index, delta) => {
    const item = items[index];
    const quantity = Math.max(1, (item.quantity || 1) + delta);
    if (quantity > getProductStock(item, item.size))
      return Alert.alert(
        "Stock limit",
        `Only ${getProductStock(item, item.size)} available for ${item.name}${item.size ? `, size ${item.size}` : ""}.`,
      );
    const next = items.map((entry, itemIndex) =>
      itemIndex === index ? { ...entry, quantity } : entry,
    );
    setItems(next);
    if (!directProduct) store.cart = next;
  };
  const removeItem = (index) => {
    const next = items.filter((_, itemIndex) => itemIndex !== index);
    setItems(next);
    if (!directProduct) store.cart = next;
  };
  const reviewOrder = () => {
    if (!items.length)
      return router.replace({ pathname: "/student/cart", params: { name } });
    store.checkoutItems = items.map((item) => ({ ...item }));
    store.checkoutMethod = paymentMethod;
    store.checkoutPickupTime = pickupTime;
    store.checkoutPickup = pickupDate.trim()
      ? `${pickupDate.trim()} at ${pickupTime}`
      : `at ${pickupTime}`;
    store.checkoutDirect = Boolean(directProduct);
    router.push({ pathname: "/student/payment", params: { name } });
  };
  const back = () => router.back();

  return (
    <SafeAreaView style={styles.safe}>
      <DarkRadialBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={back}>
            <Text style={styles.back}>‹ Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Checkout</Text>
          <View style={{ width: 48 }} />
        </View>
        <Text style={styles.subtitle}>
          Hi {name}, confirm your order and pickup details.
        </Text>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order summary</Text>
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
                  {item.size ? `Size ${item.size} · ` : ""}Qty{" "}
                  {item.quantity || 1}
                </Text>
                <View style={styles.quantity}>
                  <TouchableOpacity
                    onPress={() => changeQuantity(index, -1)}
                    style={styles.qtyButton}
                  >
                    <Text style={styles.qtyText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity || 1}</Text>
                  <TouchableOpacity
                    onPress={() => changeQuantity(index, 1)}
                    style={styles.qtyButton}
                  >
                    <Text style={styles.qtyText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => removeItem(index)}>
                    <Text style={styles.remove}>Remove</Text>
                  </TouchableOpacity>
                </View>
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
          <Text style={styles.sectionTitle}>Payment method</Text>
          {[
            ["GCash", "Demo payment; no payment is processed."],
            ["Pay on shop", "Pay when you pick up your order."],
          ].map(([method, description]) => (
            <TouchableOpacity
              key={method}
              onPress={() => {
                setPaymentMethod(method);
                store.checkoutMethod = method;
              }}
              style={[
                styles.paymentChoice,
                paymentMethod === method && styles.selected,
              ]}
            >
              <Text style={styles.choiceTitle}>
                {paymentMethod === method ? "◉" : "○"} {method}
              </Text>
              <Text style={styles.muted}>{description}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Pickup details</Text>
          <Text style={styles.muted}>
            Optional. Choose a date and pickup time, or leave blank to arrange
            later.
          </Text>
          <TextInput
            value={pickupDate}
            onChangeText={setPickupDate}
            placeholder="Pickup date (e.g. Nov 25)"
            placeholderTextColor="#8290A0"
            style={styles.input}
          />
          <View style={styles.timeRow}>
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                onPress={() => setPickupTime(time)}
                style={[
                  styles.timeChip,
                  pickupTime === time && styles.selected,
                ]}
              >
                <Text style={styles.timeText}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity style={styles.primary} onPress={reviewOrder}>
          <Text style={styles.primaryText}>Review order details</Text>
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
    marginBottom: 12,
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
  muted: { color: "#69798A", fontSize: 12, lineHeight: 18, marginTop: 4 },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 8,
  },
  qtyButton: {
    width: 25,
    height: 25,
    borderRadius: 7,
    backgroundColor: "#F8F3E5",
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { color: "#80651F", fontWeight: "900", fontSize: 16 },
  qtyValue: { color: "#0B1F33", fontWeight: "800" },
  remove: { color: "#A43D32", fontWeight: "800", fontSize: 11 },
  paymentChoice: {
    borderWidth: 1,
    borderColor: "#E3E5E8",
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  choiceTitle: { color: "#0B1F33", fontWeight: "800", fontSize: 13 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  totalLabel: { color: "#0B1F33", fontSize: 15, fontWeight: "800" },
  total: { color: "#0B1F33", fontSize: 21, fontWeight: "900" },
  input: {
    borderWidth: 1,
    borderColor: "#D8D2C5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginTop: 13,
    color: "#0B1F33",
    backgroundColor: "#F8F7F2",
  },
  timeRow: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginTop: 11 },
  timeChip: {
    borderWidth: 1,
    borderColor: "#D8D2C5",
    borderRadius: 99,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  selected: { backgroundColor: "#F8F3E5", borderColor: "#D9B45B" },
  timeText: { color: "#0B1F33", fontSize: 11, fontWeight: "700" },
  primary: {
    alignItems: "center",
    backgroundColor: "#D9B45B",
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 3,
  },
  primaryText: { color: "#0B1F33", fontWeight: "900", fontSize: 14 },
});
