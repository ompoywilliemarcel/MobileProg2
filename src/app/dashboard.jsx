import { Link, useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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
import DarkRadialBackground from "../components/DarkRadialBackground";
import { money, productAmount, store } from "../data/demoStore";

const tabsFor = {
  customer: ["Shop", "Orders"],
  user: ["Overview", "Products", "Orders", "Reports"],
  admin: ["Overview", "Products", "Orders", "People", "Reports"],
};
const labelFor = {
  customer: "STUDENT SHOP",
  user: "STORE WORKSPACE",
  admin: "ADMIN CONSOLE",
};

function Action({ title, onPress, secondary = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.action, secondary && styles.secondaryAction]}
    >
      <Text style={[styles.actionText, secondary && styles.secondaryText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}
function Panel({ children, style, onPress }) {
  if (onPress) return <TouchableOpacity onPress={onPress} style={[styles.panel, style]}>{children}</TouchableOpacity>;
  return <View style={[styles.panel, style]}>{children}</View>;
}
function Heading({ title, detail }) {
  return (
    <View style={styles.sectionHeading}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {detail ? <Text style={styles.muted}>{detail}</Text> : null}
    </View>
  );
}

export default function DashboardScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const role = ["customer", "user", "admin"].includes(params.role)
    ? params.role
    : "customer";
  const name =
    params.name ||
    (role === "admin"
      ? "USTP Admin"
      : role === "user"
        ? "Store Manager"
        : "Student");
  const [tab, setTab] = useState(tabsFor[role][0]);
  const [refresh, setRefresh] = useState(0);
  const [cart, setCart] = useState(store.cart);
  const [cartCount, setCartCount] = useState(store.cartNotificationCount || 0);
  useFocusEffect(useCallback(() => {
    setCartCount(store.cartNotificationCount || 0);
  }, []));
  const [payment, setPayment] = useState("GCash");
  const [reservationDate, setReservationDate] = useState("Nov 12, 2026");
  const [reservationTime, setReservationTime] = useState("10:00 AM");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [period, setPeriod] = useState("Month");
  const products = store.products;
  const orders = store.orders;
  const totalSales = orders.reduce((sum, item) => sum + item.total, 0);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + productAmount(item), 0),
    [cart, refresh],
  );
  const bump = () => setRefresh((n) => n + 1);
  const updateProduct = (id, key, value) => {
    const p = products.find((x) => x.id === id);
    if (p)
      p[key] =
        key === "price" && !String(value).startsWith("₱") ? `₱${value}` : value;
    bump();
  };
  const addProduct = () => {
    const amount = Number(newPrice);
    if (!newName.trim() || !amount)
      return Alert.alert(
        "Product details needed",
        "Enter a product name and price.",
      );
    products.push({
      id: Date.now(),
      name: newName.trim(),
      category: "New merch",
      price: money(amount),
      color: "#183653",
      image: require("../../assets/products/lanyard.jpg"),
    });
    setNewName("");
    setNewPrice("");
    bump();
  };
  const removeProduct = (id) => {
    const i = products.findIndex((p) => p.id === id);
    if (i >= 0) products.splice(i, 1);
    bump();
  };
  const placeOrder = () => {
    if (cart.length === 0)
      return Alert.alert("Cart is empty", "Add merch before checking out.");
    const order = {
      id: `USTP-${Date.now().toString().slice(-5)}`,
      customer: name,
      item: cart.map((p) => `${p.name}${p.size ? ` (${p.size})` : ""}`).join(", "),
      total: cartTotal,
      status: "Received",
      method: payment,
      date: new Date().toLocaleDateString("en-PH", {
        month: "short",
        day: "2-digit",
      }),
    };
    orders.unshift(order);
    store.cart = [];
    setCart([]);
    bump();
    setTab("Orders");
    if (payment === "GCash")
      Alert.alert(
        "Sample GCash receipt",
        `Receipt ${order.id}\n${order.item}\nTotal ${money(order.total)}\nPayment: GCash\n\nDemo only — no payment was processed.`,
      );
    else
      Alert.alert(
        "Order reserved",
        `Order ${order.id} is set for cash payment at pickup.`,
      );
  };
  const reserve = () => {
    if (
      !reservationDate.trim() ||
      ![
        "9:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "1:00 PM",
        "2:00 PM",
        "3:00 PM",
        "4:00 PM",
        "5:00 PM",
      ].includes(reservationTime)
    )
      return Alert.alert(
        "Choose a pickup time",
        "Reservations are available from 9:00 AM to 5:00 PM.",
      );
    store.reservations.unshift({
      customer: name,
      date: reservationDate,
      time: reservationTime,
      status: "Reserved",
    });
    Alert.alert(
      "Reservation saved",
      `${reservationDate} at ${reservationTime}`,
    );
    bump();
  };
  const cycleOrder = (order) => {
    const states = ["Received", "Preparing", "Ready for pickup", "Completed"];
    order.status = states[(states.indexOf(order.status) + 1) % states.length];
    bump();
  };
  const openCart = () => {
    store.cartNotificationCount = 0;
    setCartCount(0);
    router.push({ pathname: "/cart", params: { name } });
  };
  const signOut = () => Alert.alert("Log out", "Are you sure you want to log out?", [
    { text: "Cancel", style: "cancel" },
    { text: "Log out", style: "destructive", onPress: () => router.replace("/login") },
  ]);

  const renderProducts = (editable) => (
    <>
      {editable && (
        <Panel>
          <Heading
            title="Add a product"
            detail="Add merch to the live catalog"
          />
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Product name"
            placeholderTextColor="#8995A2"
          />
          <TextInput
            style={styles.input}
            value={newPrice}
            onChangeText={setNewPrice}
            placeholder="Price (PHP)"
            keyboardType="numeric"
            placeholderTextColor="#8995A2"
          />
          <Action title="＋  Add product" onPress={addProduct} />
        </Panel>
      )}
      <View style={styles.productGrid}>
        {products.map((p) => (
          <Panel key={p.id} style={styles.productCard} onPress={!editable ? () => router.push({ pathname: "/details/[id]", params: { id: p.id, audience: "customer", name } }) : undefined}>
            <Image
              source={p.image}
              resizeMode="contain"
              style={styles.productImage}
            />
            <Text style={styles.productCategory}>
              {p.category || "Campus merch"}
            </Text>
            {editable ? (
              <TextInput
                style={styles.editName}
                value={p.name}
                onChangeText={(v) => updateProduct(p.id, "name", v)}
              />
            ) : (
              <Text style={styles.productName}>{p.name}</Text>
            )}
            {!editable && <Text style={styles.detailsLink}>Tap for details</Text>}
            {editable ? (
              <TextInput style={styles.editPrice} value={String(p.price).replace("₱", "")} onChangeText={(v) => updateProduct(p.id, "price", v)} />
            ) : (
              <Text style={styles.editPrice}>{p.price}</Text>
            )}
            {editable ? (
              <Action
                title="Delete product"
                secondary
                onPress={() => removeProduct(p.id)}
              />
            ) : (
              <Action title="Choose size" onPress={() => router.push({ pathname: "/details/[id]", params: { id: p.id, audience: "customer", name } })} />
            )}
          </Panel>
        ))}
      </View>
    </>
  );
  const renderOrders = () =>
    (role === "customer"
      ? orders.filter((o) => o.customer === name)
      : orders
    ).map((o) => (
      <Panel key={o.id} style={styles.rowPanel}>
        <View style={{ flex: 1 }}>
          <Text style={styles.orderId}>
            {o.id} · {o.date}
          </Text>
          <Text style={styles.orderItem}>{o.item}</Text>
          <Text style={styles.muted}>
            {o.customer} · {o.method} · {money(o.total)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            role === "customer"
              ? Alert.alert("Order status", `${o.id}: ${o.status}`)
              : cycleOrder(o)
          }
          style={styles.status}
        >
          <Text style={styles.statusText}>{o.status}</Text>
        </TouchableOpacity>
      </Panel>
    ));
  const renderReports = () => (
    <>
      <View style={styles.switchRow}>
        {["Month", "Year"].map((p) => (
          <TouchableOpacity
            key={p}
            onPress={() => setPeriod(p)}
            style={[styles.switch, period === p && styles.switchActive]}
          >
            <Text
              style={[
                styles.switchText,
                period === p && styles.switchTextActive,
              ]}
            >
              {p}ly report
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Panel>
        <Text style={styles.reportLabel}>
          {period === "Month" ? "NOVEMBER 2026" : "2026 SUMMARY"}
        </Text>
        <Text style={styles.reportValue}>{money(totalSales)}</Text>
        <Text style={styles.muted}>
          Recorded sales · {orders.length} orders
        </Text>
        <View style={styles.divider} />
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.muted}>Products</Text>
          </View>
          <View>
            <Text style={styles.statValue}>
              {orders.filter((o) => o.status !== "Completed").length}
            </Text>
            <Text style={styles.muted}>Open orders</Text>
          </View>
          <View>
            <Text style={styles.statValue}>{store.reservations.length}</Text>
            <Text style={styles.muted}>Reservations</Text>
          </View>
        </View>
      </Panel>
      <Heading title="Recent activity" />
      <Text style={styles.muted}>
        Sales are calculated from demo orders in this session.
      </Text>
      {orders.slice(0, 6).map((o) => (
        <Panel key={o.id} style={styles.rowPanel}>
          <Text style={styles.orderItem}>
            {o.date} · {o.item}
          </Text>
          <Text style={styles.orderId}>{money(o.total)}</Text>
        </Panel>
      ))}
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <DarkRadialBackground />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.brand}>USTP Wear</Text>
            <Text style={styles.eyebrow}>{labelFor[role]}</Text>
          </View>
          <View style={styles.headerActions}>
            {role === "customer" && <TouchableOpacity onPress={openCart} style={styles.cartButton} accessibilityRole="button" accessibilityLabel={`Open cart, ${cartCount} new items`}>
              <Text style={styles.cartIcon}>🛒</Text>
              {cartCount > 0 && <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>}
            </TouchableOpacity>}
            <TouchableOpacity onPress={signOut} style={styles.signOut}><Text style={styles.signOutText}>Log out</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.welcome}>
          <Text style={styles.welcomeSmall}>
            GOOD DAY, {String(name).toUpperCase()}
          </Text>
          <Text style={styles.welcomeTitle}>
            {role === "customer"
              ? "Find your campus fit."
              : role === "admin"
                ? "Store at a glance."
                : "Your store, in one place."}
          </Text>
          <Text style={styles.welcomeBody}>
            {role === "customer"
              ? "Shop official merch, reserve pickup, and track your orders."
              : role === "admin"
                ? "Manage the catalog, keep an eye on orders, and review activity."
                : "Manage products, follow orders, and review sales."}
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabs}
        >
          {tabsFor[role].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setTab(item)}
              style={[styles.tab, tab === item && styles.tabActive]}
            >
              <Text
                style={[styles.tabText, tab === item && styles.tabTextActive]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {tab === "Overview" && (
          <>
            <View style={styles.statsRow}>
              <Panel style={styles.metric}>
                <Text style={styles.metricLabel}>SALES</Text>
                <Text style={styles.metricValue}>{money(totalSales)}</Text>
                <Text style={styles.muted}>All recorded orders</Text>
              </Panel>
              <Panel style={styles.metric}>
                <Text style={styles.metricLabel}>OPEN ORDERS</Text>
                <Text style={styles.metricValue}>
                  {orders.filter((o) => o.status !== "Completed").length}
                </Text>
                <Text style={styles.muted}>Need attention</Text>
              </Panel>
            </View>
            <Panel>
              <Heading
                title="Latest orders"
                detail="Tap a status to advance it"
              />
              {renderOrders().slice(0, 3)}
            </Panel>
            <Heading title="Manage your store" />
            <View style={styles.quickActions}>
              <Action title="Products" onPress={() => setTab("Products")} />
              <Action
                title="Reports"
                onPress={() => setTab("Reports")}
                secondary
              />
            </View>
            {store.reservations.length > 0 && (
              <Panel>
                <Heading title="Pickup reservations" />
                {store.reservations.map((r, i) => (
                  <Text style={styles.orderItem} key={`${r.customer}-${i}`}>
                    {r.customer} · {r.date} · {r.time}
                  </Text>
                ))}
              </Panel>
            )}
          </>
        )}
        {tab === "Shop" && (
          <>
            <Heading
              title="The merch drop"
              detail={`${products.length} campus essentials`}
            />
            {renderProducts(false)}
          </>
        )}
        {tab === "Products" && renderProducts(true)}
        {tab === "Cart" && (
          <>
            <Heading
              title="Your cart"
              detail={`${cart.length} item${cart.length === 1 ? "" : "s"}`}
            />
            {cart.length ? (
              cart.map((p, i) => (
                <Panel key={`${p.id}-${i}`} style={styles.rowPanel}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.orderItem}>{p.name}{p.size ? ` · Size ${p.size}` : ""}</Text>
                    <Text style={styles.muted}>{p.category}</Text>
                  </View>
                  <Text style={styles.orderId}>{p.price}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      const nextCart = cart.filter((_, index) => index !== i);
                      store.cart = nextCart;
                      setCart(nextCart);
                    }}
                  >
                    <Text style={styles.remove}>Remove</Text>
                  </TouchableOpacity>
                </Panel>
              ))
            ) : (
              <Panel>
                <Text style={styles.muted}>
                  Your cart is waiting for something good.
                </Text>
              </Panel>
            )}
            <Panel>
              <View style={styles.totalRow}>
                <Text style={styles.orderItem}>Total</Text>
                <Text style={styles.reportValue}>{money(cartTotal)}</Text>
              </View>
              <Heading
                title="Payment method"
                detail="Choose how you will pay"
              />
              <View style={styles.quickActions}>
                {["GCash", "Cash at pickup"].map((m) => (
                  <TouchableOpacity
                    key={m}
                    onPress={() => setPayment(m === "GCash" ? "GCash" : "Cash")}
                    style={[
                      styles.paymentChoice,
                      (m === "GCash"
                        ? payment === "GCash"
                        : payment === "Cash") && styles.paymentSelected,
                    ]}
                  >
                    <Text style={styles.paymentText}>{m}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Action title="Place order" onPress={placeOrder} />
              <Text style={styles.disclaimer}>
                GCash checkout displays a sample receipt. No payment is
                processed.
              </Text>
            </Panel>
          </>
        )}
        {tab === "Orders" && (
          <>
            <Heading
              title={role === "customer" ? "Your orders" : "Order management"}
              detail="Current and past orders"
            />
            {renderOrders()}
          </>
        )}
        {tab === "People" && (
          <>
            <Heading
              title="Registered people"
              detail={`${store.users.length} demo accounts`}
            />
            {store.users.map((u) => (
              <Panel key={u.email} style={styles.rowPanel}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {u.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")
                      .slice(0, 2)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderItem}>{u.name}</Text>
                  <Text style={styles.muted}>
                    {u.email} · joined {u.joined}
                  </Text>
                </View>
                <Text style={styles.rolePill}>{u.role}</Text>
              </Panel>
            ))}
            <Text style={styles.disclaimer}>
              This demo list includes seeded users. New signups are stored only
              during this session.
            </Text>
          </>
        )}
        {tab === "Reports" && renderReports()}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#061525" },
  content: { padding: 20, paddingBottom: 42 },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 9 },
  cartButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: "#183653", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#38536B" },
  cartIcon: { fontSize: 19 },
  cartBadge: { position: "absolute", top: -5, right: -5, minWidth: 19, height: 19, borderRadius: 10, backgroundColor: "#E53935", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "#061525", paddingHorizontal: 4 },
  cartBadgeText: { color: "#FFF", fontSize: 10, fontWeight: "900" },
  brand: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  eyebrow: {
    color: "#D9B45B",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 3,
  },
  signOut: {
    borderWidth: 1,
    borderColor: "#38536B",
    borderRadius: 99,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  signOutText: { color: "#E2E8F0", fontWeight: "700", fontSize: 12 },
  welcome: {
    backgroundColor: "#183653",
    borderRadius: 23,
    padding: 22,
    marginBottom: 17,
  },
  welcomeSmall: {
    color: "#D9B45B",
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 1.3,
  },
  welcomeTitle: {
    color: "#FFF",
    fontSize: 27,
    fontWeight: "800",
    marginTop: 9,
    letterSpacing: -0.5,
  },
  welcomeBody: { color: "#D4DEE8", fontSize: 13, lineHeight: 20, marginTop: 7 },
  tabs: { gap: 8, paddingBottom: 18 },
  tab: {
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#10283F",
    borderWidth: 1,
    borderColor: "#28425A",
  },
  tabActive: { backgroundColor: "#D9B45B", borderColor: "#E7C875" },
  tabText: { color: "#D7E0E8", fontWeight: "700", fontSize: 12 },
  tabTextActive: { color: "#0B1F33" },
  panel: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E7E2D6",
    marginBottom: 12,
  },
  sectionHeading: { marginBottom: 12 },
  sectionTitle: { color: "#0B1F33", fontSize: 18, fontWeight: "800" },
  muted: { color: "#69798A", fontSize: 12, lineHeight: 18, marginTop: 3 },
  statsRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  metric: { flex: 1, marginBottom: 0, padding: 14 },
  metricLabel: {
    color: "#69798A",
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: "800",
  },
  metricValue: {
    color: "#0B1F33",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 8,
  },
  rowPanel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 13,
  },
  orderId: { color: "#9A741E", fontSize: 12, fontWeight: "800" },
  orderItem: {
    color: "#0B1F33",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 3,
  },
  status: {
    backgroundColor: "#F8F3E5",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 7,
    maxWidth: 120,
  },
  statusText: {
    color: "#80651F",
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },
  quickActions: { flexDirection: "row", gap: 10, marginBottom: 12 },
  action: {
    alignItems: "center",
    backgroundColor: "#D9B45B",
    borderRadius: 11,
    paddingHorizontal: 14,
    paddingVertical: 11,
    marginTop: 8,
  },
  actionText: { color: "#0B1F33", fontSize: 12, fontWeight: "800" },
  secondaryAction: {
    backgroundColor: "#F8F7F2",
    borderWidth: 1,
    borderColor: "#D8D2C5",
  },
  secondaryText: { color: "#0B1F33" },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productCard: { width: "48.5%", padding: 11 },
  productImage: {
    width: "100%",
    height: 112,
    backgroundColor: "#F1F4F5",
    borderRadius: 12,
    marginBottom: 9,
  },
  productCategory: {
    color: "#758393",
    textTransform: "uppercase",
    fontSize: 9,
    letterSpacing: 0.7,
    fontWeight: "800",
  },
  productName: {
    color: "#0B1F33",
    fontWeight: "800",
    fontSize: 13,
    minHeight: 34,
    marginTop: 4,
  },
  detailsLink: { color: "#9A741E", fontSize: 11, fontWeight: "800", marginTop: 7 },
  editName: {
    color: "#0B1F33",
    fontWeight: "800",
    fontSize: 13,
    borderBottomWidth: 1,
    borderColor: "#D8D2C5",
    minHeight: 34,
    marginTop: 3,
    paddingVertical: 2,
  },
  editPrice: {
    color: "#9A741E",
    fontWeight: "800",
    fontSize: 14,
    borderBottomWidth: 1,
    borderColor: "#D8D2C5",
    paddingVertical: 3,
    marginVertical: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#D8D2C5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 8,
    color: "#0B1F33",
    backgroundColor: "#F8F7F2",
  },
  switchRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  switch: {
    borderRadius: 99,
    backgroundColor: "#10283F",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  switchActive: { backgroundColor: "#D9B45B" },
  switchText: { color: "#DCE5ED", fontWeight: "700", fontSize: 12 },
  switchTextActive: { color: "#0B1F33" },
  reportLabel: {
    color: "#69798A",
    fontWeight: "800",
    fontSize: 10,
    letterSpacing: 1,
  },
  reportValue: {
    color: "#0B1F33",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 6,
  },
  divider: { height: 1, backgroundColor: "#E8E5DD", marginVertical: 16 },
  statValue: { color: "#0B1F33", fontSize: 20, fontWeight: "800" },
  timeRow: { flexDirection: "row", flexWrap: "wrap", gap: 7, marginBottom: 8 },
  timeChip: {
    borderWidth: 1,
    borderColor: "#D8D2C5",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  timeSelected: { backgroundColor: "#D9B45B", borderColor: "#D9B45B" },
  timeText: { color: "#0B1F33", fontSize: 10, fontWeight: "700" },
  timeTextSelected: { color: "#0B1F33" },
  paymentChoice: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D8D2C5",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  paymentSelected: { backgroundColor: "#F8F3E5", borderColor: "#D9B45B" },
  paymentText: { color: "#0B1F33", fontSize: 12, fontWeight: "700" },
  totalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  remove: { color: "#A43D32", fontSize: 11, fontWeight: "700" },
  disclaimer: { color: "#718092", fontSize: 11, lineHeight: 16, marginTop: 8 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F8F3E5",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#80651F", fontWeight: "800" },
  rolePill: {
    color: "#80651F",
    backgroundColor: "#F8F3E5",
    overflow: "hidden",
    borderRadius: 99,
    paddingHorizontal: 9,
    paddingVertical: 5,
    fontSize: 10,
    fontWeight: "800",
  },
});
