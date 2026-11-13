import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { money, productAmount, store } from "../../data/demoStore";

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
  if (onPress)
    return (
      <TouchableOpacity onPress={onPress} style={[styles.panel, style]}>
        {children}
      </TouchableOpacity>
    );
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

export default function DashboardScreen({ fixedRole, fixedName } = {}) {
  const params = useLocalSearchParams();
  const router = useRouter();
  const routeRole = Array.isArray(params.role) ? params.role[0] : params.role;
  const routeName = Array.isArray(params.name) ? params.name[0] : params.name;
  const role = fixedRole || (["customer", "user", "admin"].includes(routeRole)
    ? routeRole
    : "customer");
  const name =
    fixedName || routeName ||
    (role === "admin"
      ? "USTP Admin"
      : role === "user"
        ? "Store Manager"
        : "Student");
  const [tab, setTab] = useState(tabsFor[role][0]);
  const [shopQuery, setShopQuery] = useState("");
  const [shopCategory, setShopCategory] = useState("All");
  const [refresh, setRefresh] = useState(0);
  const [cart, setCart] = useState(store.cart);
  const [cartCount, setCartCount] = useState(store.cartNotificationCount || 0);
  useFocusEffect(
    useCallback(() => {
      setCartCount(store.cartNotificationCount || 0);
    }, []),
  );
  const [payment, setPayment] = useState("GCash");
  const [reservationDate, setReservationDate] = useState("Nov 12, 2026");
  const [reservationTime, setReservationTime] = useState("10:00 AM");
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSizes, setNewSizes] = useState("");
  const [newHasSizes, setNewHasSizes] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productDraft, setProductDraft] = useState(null);
  const [period, setPeriod] = useState("Month");
  const [reportDate, setReportDate] = useState(() => new Date());
  const [calendarDate, setCalendarDate] = useState(() => new Date());
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [newImage, setNewImage] = useState(null);
  const products = store.products;
  const orders = store.orders;
  const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
  const getOrderDate = (order) => {
    if (order.createdAt) return new Date(order.createdAt);
    const parsed = new Date(`${order.date}, ${new Date().getFullYear()}`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };
  const matchesReportPeriod = (order) => {
    const date = getOrderDate(order);
    if (!date || Number.isNaN(date.getTime())) return false;
    if (period === "Day") return date.toDateString() === reportDate.toDateString();
    if (period === "Month") return date.getMonth() === reportDate.getMonth() && date.getFullYear() === reportDate.getFullYear();
    return date.getFullYear() === reportDate.getFullYear();
  };
  const reportOrders = orders.filter(matchesReportPeriod);
  const reportSales = reportOrders.reduce((sum, item) => sum + item.total, 0);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + productAmount(item), 0),
    [cart, refresh],
  );
  const bump = () => setRefresh((n) => n + 1);
  const pickProductImage = async (onPicked) => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert("Photo access needed", "Allow access to your photo library to choose a product picture.");
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });
      if (!result.canceled) onPicked(result.assets[0].uri);
    } catch {
      Alert.alert("Could not open photos", "Please try choosing the product picture again.");
    }
  };
  const shiftCalendarMonth = (amount) => {
    setCalendarDate((date) => new Date(date.getFullYear(), date.getMonth() + amount, 1));
  };
  const selectCalendarDay = (day) => {
    setReportDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day));
    setCalendarVisible(false);
  };
  const parseSizes = (value) =>
    value
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);
  const resetNewProduct = () => {
    setNewName("");
    setNewPrice("");
    setNewCategory("");
    setNewDescription("");
    setNewSizes("");
    setNewHasSizes(false);
    setNewImage(null);
  };
  const imageSource = (image) =>
    typeof image === "string" ? { uri: image } : image;
  const addProduct = () => {
    const amount = Number(newPrice.replace(/[^0-9.]/g, ""));
    const sizes = parseSizes(newSizes);
    if (!newName.trim() || !amount || (newHasSizes && sizes.length === 0))
      return Alert.alert(
        "Product details needed",
        newHasSizes && sizes.length === 0
          ? "Enter at least one size, separated by commas, or turn off size options."
          : "Enter a product name and a valid price.",
      );
    const product = {
      id: Date.now(),
      name: newName.trim(),
      category: newCategory.trim() || "Campus merch",
      price: money(amount),
      description: newDescription.trim(),
      hasSizes: newHasSizes,
      sizes: newHasSizes ? sizes : [],
      color: "#183653",
      image: newImage || require("../../../assets/products/lanyard.jpg"),
    };
    const productSummary = [
      `Category: ${product.category}`,
      `Price: ${product.price}`,
      `Sizes: ${product.hasSizes ? product.sizes.join(", ") : "Not applicable"}`,
      `Details: ${product.description || "None provided"}`,
    ].join("\n");
    Alert.alert(
      "Add this product?",
      `Add “${product.name}” to the customer catalog?\n\n${productSummary}`,
      [
        { text: "Review details", style: "cancel" },
        {
          text: "Add product",
          onPress: () => {
            products.push(product);
            resetNewProduct();
            bump();
            Alert.alert(
              "Product added",
              `${product.name} is now in the catalog.`,
            );
          },
        },
      ],
    );
  };
  const startProductEdit = (product) => {
    setEditingProductId(product.id);
    setProductDraft({
      name: product.name,
      price: String(product.price).replace(/[^0-9.]/g, ""),
      category: product.category || "Campus merch",
      description: product.description || "",
      image: product.image,
      hasSizes: product.hasSizes ?? !/lanyard/i.test(product.name),
      sizes: (
        product.sizes ||
        (product.hasSizes === false || /lanyard/i.test(product.name)
          ? []
          : ["S", "M", "L", "XL"])
      ).join(", "),
    });
  };
  const saveProductEdit = (product) => {
    const amount = Number(String(productDraft.price).replace(/[^0-9.]/g, ""));
    const sizes = parseSizes(productDraft.sizes);
    if (
      !productDraft.name.trim() ||
      !amount ||
      (productDraft.hasSizes && sizes.length === 0)
    )
      return Alert.alert(
        "Product details needed",
        "Enter a name, valid price, and at least one size when size options are enabled.",
      );
    const updated = {
      ...product,
      name: productDraft.name.trim(),
      price: money(amount),
      category: productDraft.category.trim() || "Campus merch",
      description: productDraft.description.trim(),
      image: productDraft.image,
      hasSizes: productDraft.hasSizes,
      sizes: productDraft.hasSizes ? sizes : [],
    };
    const productSummary = [
      `Name: ${updated.name}`,
      `Category: ${updated.category}`,
      `Price: ${updated.price}`,
      `Sizes: ${updated.hasSizes ? updated.sizes.join(", ") : "Not applicable"}`,
      `Details: ${updated.description || "None provided"}`,
    ].join("\n");
    Alert.alert(
      "Save product changes?",
      `Review the updated product details:\n\n${productSummary}`,
      [
        { text: "Keep editing", style: "cancel" },
        {
          text: "Save changes",
          onPress: () => {
            Object.assign(product, updated);
            setEditingProductId(null);
            setProductDraft(null);
            bump();
            Alert.alert("Product updated", `${updated.name} has been updated.`);
          },
        },
      ],
    );
  };
  const removeProduct = (product) => {
    Alert.alert(
      "Remove this product?",
      `“${product.name}” will no longer appear in the customer catalog.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove product",
          style: "destructive",
          onPress: () => {
            const index = products.findIndex((item) => item.id === product.id);
            if (index >= 0) products.splice(index, 1);
            if (editingProductId === product.id) {
              setEditingProductId(null);
              setProductDraft(null);
            }
            bump();
            Alert.alert(
              "Product removed",
              `${product.name} has been removed from the catalog.`,
            );
          },
        },
      ],
    );
  };
  const placeOrder = () => {
    if (cart.length === 0)
      return Alert.alert("Cart is empty", "Add merch before checking out.");
    const order = {
      id: `USTP-${Date.now().toString().slice(-5)}`,
      customer: name,
      item: cart
        .map((p) => `${p.name}${p.size ? ` (${p.size})` : ""}`)
        .join(", "),
      total: cartTotal,
      status: "Received",
      method: payment,
    createdAt: new Date().toISOString(),
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
        `Receipt ${order.id}\n${order.item}\nTotal ${money(order.total)}\nPayment: GCash\n\nDemo only  -  no payment was processed.`,
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
    if (order.status === "Completed") return;
    const states = ["Received", "Preparing", "Ready for pickup", "Completed"];
    const statusIndex = states.indexOf(order.status);
    order.status = states[statusIndex < 0 ? 0 : Math.min(statusIndex + 1, states.length - 1)];
    bump();
  };
  const openCart = () => {
    store.cartNotificationCount = 0;
    setCartCount(0);
    router.push({ pathname: "/student/cart", params: { name } });
  };
  const signOut = () =>
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => router.replace({ pathname: "/login", params: { audience: role === "customer" ? "student" : "store" } }),
      },
    ]);

  const studentCategories = [
    "All",
    ...new Set(products.map((product) => product.category || "Campus merch")),
  ];
  const visibleProducts =
    role === "customer"
      ? products.filter(
          (product) =>
            (shopCategory === "All" || product.category === shopCategory) &&
            product.name.toLowerCase().includes(shopQuery.trim().toLowerCase()),
        )
      : products;

  const renderProducts = (editable) => (
    <>
      {editable && (
        <Panel>
          <Heading
            title="Add a product"
            detail="Add the information customers will see"
          />
          <Text style={styles.fieldLabel}>Product picture</Text>
          <Image
            source={imageSource(newImage || require("../../../assets/products/lanyard.jpg"))}
            resizeMode="contain"
            style={styles.productPicturePreview}
          />
          <TouchableOpacity style={styles.pictureButton} onPress={() => pickProductImage(setNewImage)} accessibilityRole="button">
            <Text style={styles.pictureButtonText}>{newImage ? "Change picture" : "Choose picture"}</Text>
          </TouchableOpacity>
          <Text style={styles.fieldLabel}>Product name</Text>
          <TextInput
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="e.g. Trailblazer hoodie"
            placeholderTextColor="#8995A2"
          />
          <Text style={styles.fieldLabel}>Price</Text>
          <TextInput
            style={styles.input}
            value={newPrice}
            onChangeText={setNewPrice}
            placeholder="Price (PHP)"
            keyboardType="numeric"
            placeholderTextColor="#8995A2"
          />
          <Text style={styles.fieldLabel}>Category</Text>
          <TextInput
            style={styles.input}
            value={newCategory}
            onChangeText={setNewCategory}
            placeholder="e.g. Apparel (optional)"
            placeholderTextColor="#8995A2"
          />
          <View style={styles.fieldHeading}>
            <Text style={styles.fieldLabel}>Size options</Text>
            <TouchableOpacity
              onPress={() => setNewHasSizes((enabled) => !enabled)}
              style={[
                styles.optionalToggle,
                newHasSizes && styles.optionalToggleActive,
              ]}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: newHasSizes }}
            >
              <Text
                style={[
                  styles.optionalToggleText,
                  newHasSizes && styles.optionalToggleTextActive,
                ]}
              >
                {newHasSizes ? "Enabled" : "No sizes"}
              </Text>
            </TouchableOpacity>
          </View>
          {newHasSizes && (
            <TextInput
              style={styles.input}
              value={newSizes}
              onChangeText={setNewSizes}
              placeholder="Sizes, separated by commas (S, M, L, XL)"
              placeholderTextColor="#8995A2"
            />
          )}
          <Text style={styles.fieldLabel}>Product details</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={newDescription}
            onChangeText={setNewDescription}
            placeholder="Describe the product for customers"
            placeholderTextColor="#8995A2"
            multiline
            textAlignVertical="top"
          />
          <Action title="Add product" onPress={addProduct} />
        </Panel>
      )}
      <View
        style={[
          styles.productGrid,
          role === "customer" && styles.studentProductGrid,
        ]}
      >
        {visibleProducts.map((p) => (
          <Panel
            key={p.id}
            style={[
              styles.productCard,
              editable && styles.editableProductCard,
              role === "customer" && styles.studentProductCard,
            ]}
            onPress={
              !editable
                ? () =>
                    router.push({
                      pathname: "/details/[id]",
                      params: { id: p.id, audience: "customer", name },
                    })
                : undefined
            }
          >
            <Image
              source={imageSource(editable && editingProductId === p.id ? productDraft.image : p.image)}
              resizeMode="contain"
              style={[
                styles.productImage,
                role === "customer" && styles.studentProductImage,
              ]}
            />
            {editable && editingProductId === p.id ? (
              <>
                <Text style={styles.fieldLabel}>Product picture</Text>
                <TouchableOpacity style={styles.pictureButton} onPress={() => pickProductImage((image) => setProductDraft((draft) => ({ ...draft, image })))} accessibilityRole="button">
                  <Text style={styles.pictureButtonText}>Change picture</Text>
                </TouchableOpacity>
                <Text style={styles.fieldLabel}>Product name</Text>
                <TextInput
                  style={styles.input}
                  value={productDraft.name}
                  onChangeText={(value) =>
                    setProductDraft({ ...productDraft, name: value })
                  }
                  placeholder="Product name"
                  placeholderTextColor="#8995A2"
                />
                <Text style={styles.fieldLabel}>Price</Text>
                <TextInput
                  style={styles.input}
                  value={productDraft.price}
                  onChangeText={(value) =>
                    setProductDraft({ ...productDraft, price: value })
                  }
                  keyboardType="decimal-pad"
                  placeholder="Price (PHP)"
                  placeholderTextColor="#8995A2"
                />
                <Text style={styles.fieldLabel}>Category</Text>
                <TextInput
                  style={styles.input}
                  value={productDraft.category}
                  onChangeText={(value) =>
                    setProductDraft({ ...productDraft, category: value })
                  }
                  placeholder="Category"
                  placeholderTextColor="#8995A2"
                />
                <View style={styles.fieldHeading}>
                  <Text style={styles.fieldLabel}>Size options</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setProductDraft({
                        ...productDraft,
                        hasSizes: !productDraft.hasSizes,
                      })
                    }
                    style={[
                      styles.optionalToggle,
                      productDraft.hasSizes && styles.optionalToggleActive,
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: productDraft.hasSizes }}
                  >
                    <Text
                      style={[
                        styles.optionalToggleText,
                        productDraft.hasSizes &&
                          styles.optionalToggleTextActive,
                      ]}
                    >
                      {productDraft.hasSizes ? "Enabled" : "No sizes"}
                    </Text>
                  </TouchableOpacity>
                </View>
                {productDraft.hasSizes && (
                  <TextInput
                    style={styles.input}
                    value={productDraft.sizes}
                    onChangeText={(value) =>
                      setProductDraft({ ...productDraft, sizes: value })
                    }
                    placeholder="Sizes, separated by commas"
                    placeholderTextColor="#8995A2"
                  />
                )}
                <Text style={styles.fieldLabel}>Product details</Text>
                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  value={productDraft.description}
                  onChangeText={(value) =>
                    setProductDraft({ ...productDraft, description: value })
                  }
                  placeholder="Describe the product for customers"
                  placeholderTextColor="#8995A2"
                  multiline
                  textAlignVertical="top"
                />
                <Action
                  title="Save changes"
                  onPress={() => saveProductEdit(p)}
                />
                <Action
                  title="Cancel editing"
                  secondary
                  onPress={() => {
                    setEditingProductId(null);
                    setProductDraft(null);
                  }}
                />
              </>
            ) : (
              <>
                <Text style={styles.productCategory}>
                  {p.category || "Campus merch"}
                </Text>
                <Text style={styles.productName}>{p.name}</Text>
                <Text style={styles.editPrice}>{p.price}</Text>
                {editable && (
                  <Text style={styles.productSummary} numberOfLines={3}>
                    {p.description || "No product details have been added yet."}
                  </Text>
                )}
                {editable && (p.hasSizes ?? !/lanyard/i.test(p.name)) && (
                  <Text style={styles.productSummary}>
                    Sizes: {(p.sizes || ["S", "M", "L", "XL"]).join(", ")}
                  </Text>
                )}
              </>
            )}
            {editable && editingProductId !== p.id ? (
              <>
                <Action
                  title="Update product"
                  onPress={() => startProductEdit(p)}
                />
                <Action
                  title="Delete product"
                  secondary
                  onPress={() => removeProduct(p)}
                />
              </>
            ) : !editable ? (
              <Action
                title={role === "customer" ? "View details" : "Choose size"}
                onPress={() =>
                  router.push({
                    pathname: "/details/[id]",
                    params: { id: p.id, audience: "customer", name },
                  })
                }
              />
            ) : null}
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
      <Panel
        key={o.id}
        style={[
          styles.rowPanel,
          role === "customer" && styles.studentOrderCard,
        ]}
      >
        <View style={{ flex: 1 }}>
          <Text style={styles.orderId}>
            {o.id} | {o.date}
          </Text>
          <Text style={styles.orderItem}>{o.item}</Text>
          <Text style={styles.muted}>
            {o.customer} | {o.method} | {money(o.total)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() =>
            role === "customer"
              ? Alert.alert("Order status", `${o.id}: ${o.status}`)
              : cycleOrder(o)
          }
          disabled={role !== "customer" && o.status === "Completed"}
          style={styles.status}
        >
          <Text style={styles.statusText}>{o.status}</Text>
        </TouchableOpacity>
      </Panel>
    ));
  const calendarOffset = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth(),
    1,
  ).getDay();
  const calendarMonthLength = new Date(
    calendarDate.getFullYear(),
    calendarDate.getMonth() + 1,
    0,
  ).getDate();
  const calendarCells = [
    ...Array(calendarOffset).fill(null),
    ...Array.from({ length: calendarMonthLength }, (_, index) => index + 1),
  ];
  const reportTitle = period === "Year"
    ? `${reportDate.getFullYear()} SUMMARY`
    : period === "Month"
      ? reportDate.toLocaleDateString("en-PH", { month: "long", year: "numeric" }).toUpperCase()
      : reportDate.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" }).toUpperCase();
  const renderReports = () => (
    <>
      <View style={styles.switchRow}>
        {["Day", "Month", "Year"].map((p) => (
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
              {p === "Day" ? "Daily" : p === "Month" ? "Monthly" : "Yearly"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.reportDateButton}
        onPress={() => {
          setCalendarDate(new Date(reportDate.getFullYear(), reportDate.getMonth(), 1));
          setCalendarVisible(true);
        }}
        accessibilityRole="button"
        accessibilityLabel={`Choose report date, ${reportDate.toDateString()}`}
      >
        <Text style={styles.reportDateIcon}>▦</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.reportDateLabel}>REPORT DATE</Text>
          <Text style={styles.reportDateValue}>{reportDate.toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" })}</Text>
        </View>
        <Text style={styles.reportDateChange}>Choose</Text>
      </TouchableOpacity>
      <Panel>
        <Text style={styles.reportLabel}>{reportTitle}</Text>
        <Text style={styles.reportValue}>{money(reportSales)}</Text>
        <Text style={styles.muted}>
          Recorded sales | {reportOrders.length} orders
        </Text>
        <View style={styles.divider} />
        <View style={styles.statsRow}>
          <View>
            <Text style={styles.statValue}>{products.length}</Text>
            <Text style={styles.muted}>Products</Text>
          </View>
          <View>
            <Text style={styles.statValue}>
              {reportOrders.filter((o) => o.status !== "Completed").length}
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
      {reportOrders.slice(0, 6).map((o) => (
        <Panel key={o.id} style={styles.rowPanel}>
          <Text style={styles.orderItem}>
            {o.date} | {o.item}
          </Text>
          <Text style={styles.orderId}>{money(o.total)}</Text>
        </Panel>
      ))}
      {reportOrders.length === 0 && (
        <Panel style={styles.emptyReport}>
          <Text style={styles.orderItem}>No orders for this period</Text>
          <Text style={styles.muted}>Choose another date or reporting period.</Text>
        </Panel>
      )}
      <Modal transparent visible={calendarVisible} animationType="fade" onRequestClose={() => setCalendarVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.calendarCard}>
            <View style={styles.calendarHeader}>
              <View>
                <Text style={styles.reportDateLabel}>REPORT CALENDAR</Text>
                <Text style={styles.calendarTitle}>{calendarDate.toLocaleDateString("en-PH", { month: "long", year: "numeric" })}</Text>
              </View>
              <TouchableOpacity onPress={() => setCalendarVisible(false)} accessibilityRole="button" accessibilityLabel="Close calendar">
                <Text style={styles.calendarClose}>×</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.calendarControls}>
              <TouchableOpacity style={styles.calendarArrow} onPress={() => shiftCalendarMonth(-1)}><Text style={styles.calendarArrowText}>‹</Text></TouchableOpacity>
              <TouchableOpacity style={styles.calendarToday} onPress={() => { const today = new Date(); setCalendarDate(today); setReportDate(today); setCalendarVisible(false); }}><Text style={styles.calendarTodayText}>Today</Text></TouchableOpacity>
              <TouchableOpacity style={styles.calendarArrow} onPress={() => shiftCalendarMonth(1)}><Text style={styles.calendarArrowText}>›</Text></TouchableOpacity>
            </View>
            <View style={styles.calendarGrid}>
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => <Text key={`${day}-${index}`} style={styles.calendarWeekday}>{day}</Text>)}
              {calendarCells.map((day, index) => {
                if (day === null) return <View key={`blank-${index}`} style={styles.calendarDay} />;
                const selected = day === reportDate.getDate() && calendarDate.getMonth() === reportDate.getMonth() && calendarDate.getFullYear() === reportDate.getFullYear();
                const today = day === new Date().getDate() && calendarDate.getMonth() === new Date().getMonth() && calendarDate.getFullYear() === new Date().getFullYear();
                return <TouchableOpacity key={day} onPress={() => selectCalendarDay(day)} style={[styles.calendarDay, selected && styles.calendarDaySelected, today && !selected && styles.calendarDayToday]}><Text style={[styles.calendarDayText, selected && styles.calendarDayTextSelected]}>{day}</Text></TouchableOpacity>;
              })}
            </View>
            <Text style={styles.calendarHint}>Select a day, then choose daily, monthly, or yearly totals.</Text>
          </View>
        </View>
      </Modal>
    </>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={[styles.content, styles.studentContent]}
      >
        <View
          style={[styles.topBar, role === "customer" && styles.studentTopBar]}
        >
          <View>
            <Text style={[styles.brand, styles.studentBrand]}>USTP Wear</Text>
            <Text style={[styles.eyebrow, styles.studentEyebrow]}>
              {role === "customer" ? "OFFICIAL CAMPUS STORE" : labelFor[role]}
            </Text>
          </View>
          <View style={styles.headerActions}>
            {role === "customer" && (
              <TouchableOpacity
                onPress={openCart}
                style={[
                  styles.cartButton,
                  role === "customer" && styles.studentCartButton,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Open cart, ${cartCount} new items`}
              >
                <View style={styles.cartIcon}>
                  <View style={styles.bagHandle} />
                  <View style={styles.bagBody} />
                </View>
                {cartCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={signOut}
              style={[styles.signOut, styles.studentSignOut]}
            >
              <Text style={[styles.signOutText, styles.studentSignOutText]}>
                Log out
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={[styles.welcome, role === "customer" && styles.studentWelcome]}
        >
          {role === "customer" && <View style={styles.studentHeroGlow} />}
          <Text style={styles.welcomeSmall}>
            {role === "customer"
              ? `HELLO, ${String(name).split(" ")[0].toUpperCase()}`
              : `GOOD DAY, ${String(name).toUpperCase()}`}
          </Text>
          <Text
            style={[
              styles.welcomeTitle,
              role === "customer" && styles.studentWelcomeTitle,
            ]}
          >
            {role === "customer"
              ? "Find your campus fit."
              : role === "admin"
                ? "Store at a glance."
                : "Your store, in one place."}
          </Text>
          <Text
            style={[
              styles.welcomeBody,
              role === "customer" && styles.studentWelcomeBody,
            ]}
          >
            {role === "customer"
              ? "Shop official merch, reserve pickup, and track your orders."
              : role === "admin"
                ? "Manage the catalog, keep an eye on orders, and review activity."
                : "Manage products, follow orders, and review sales."}
          </Text>
          {role === "customer" && (
            <TouchableOpacity
              onPress={() => setTab("Shop")}
              style={styles.studentHeroButton}
            >
              <Text style={styles.studentHeroButtonText}>
                Explore the collection
              </Text>
            </TouchableOpacity>
          )}
        </View>
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
            {store.reservations.length > 0 && (
              <Panel>
                <Heading title="Pickup reservations" />
                {store.reservations.map((r, i) => (
                  <Text style={styles.orderItem} key={`${r.customer}-${i}`}>
                    {r.customer} | {r.date} | {r.time}
                  </Text>
                ))}
              </Panel>
            )}
          </>
        )}
        {tab === "Shop" && (
          <>
            <View style={styles.shopHeadingRow}>
              <View>
                <Text style={styles.studentSectionEyebrow}>
                  MADE FOR TRAILBLAZERS
                </Text>
                <Text style={[styles.sectionTitle, styles.studentSectionTitle]}>
                  Campus collection
                </Text>
                <Text style={styles.muted}>
                  {visibleProducts.length} pieces to represent your school
                </Text>
              </View>
              <Text style={styles.collectionMark}>USTP</Text>
            </View>
            <View style={[styles.searchBox, styles.studentSearchBox]}>
              <View style={styles.searchIcon}>
                <View style={[styles.searchLens, styles.studentSearchLens]} />
                <View
                  style={[styles.searchHandle, styles.studentSearchHandle]}
                />
              </View>
              <TextInput
                value={shopQuery}
                onChangeText={setShopQuery}
                placeholder="Search the collection"
                placeholderTextColor="#8290A0"
                style={styles.searchInput}
                returnKeyType="search"
              />
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {studentCategories.map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setShopCategory(category)}
                  style={[
                    styles.categoryChip,
                    styles.studentCategoryChip,
                    shopCategory === category && styles.categoryChipActive,
                    shopCategory === category &&
                      styles.studentCategoryChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryChipText,
                      styles.studentCategoryChipText,
                      shopCategory === category &&
                        styles.categoryChipTextActive,
                      shopCategory === category &&
                        styles.studentCategoryChipTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {visibleProducts.length ? (
              renderProducts(false)
            ) : (
              <Panel style={styles.emptySearch}>
                <Text style={styles.orderItem}>No pieces found</Text>
                <Text style={styles.muted}>
                  Try another search or choose a different category.
                </Text>
              </Panel>
            )}
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
                    <Text style={styles.orderItem}>
                      {p.name}
                      {p.size ? ` - Size ${p.size}` : ""}
                    </Text>
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
                    {u.email} | joined {u.joined}
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
      <View
        style={[styles.bottomNav, role !== "customer" && styles.staffBottomNav]}
      >
        {(role === "customer"
          ? [
              { label: "Shop", icon: "\u2302" },
              { label: "Orders", icon: "\u25A4" },
              { label: "Cart", icon: "\u25B1", badge: cart.length },
            ]
          : tabsFor[role].map((label) => ({
              label,
              icon: {
                Overview: "\u25A6",
                Products: "\u25A3",
                Orders: "\u25A4",
                People: "\u2637",
                Reports: "\u25A5",
              }[label],
            }))
        ).map((item) => {
          const active = item.label === tab;
          const onPress =
            item.label === "Cart" ? openCart : () => setTab(item.label);
          return (
            <TouchableOpacity
              key={item.label}
              onPress={onPress}
              style={styles.bottomNavItem}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <View style={styles.bottomNavIconWrap}>
                <Text
                  style={[
                    styles.bottomNavIcon,
                    active && styles.bottomNavIconActive,
                  ]}
                >
                  {item.icon}
                </Text>
                {item.badge > 0 && (
                  <View style={styles.bottomNavBadge}>
                    <Text style={styles.bottomNavBadgeText}>{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.bottomNavLabel,
                  active && styles.bottomNavLabelActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F7F6F2" },
  content: { padding: 20, paddingBottom: 42 },
  studentContent: { paddingHorizontal: 18, paddingTop: 12, paddingBottom: 28 },
  productPicturePreview: { height: 150, width: "100%", alignSelf: "center", backgroundColor: "#F1F4F5", borderRadius: 14, marginBottom: 8 },
  pictureButton: { alignItems: "center", backgroundColor: "#F2F5F7", borderColor: "#DCE2E7", borderWidth: 1, borderRadius: 11, paddingVertical: 12, marginBottom: 12 },
  pictureButtonText: { color: "#173B5B", fontSize: 12, fontWeight: "800" },
  reportDateButton: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14, marginBottom: 12, borderRadius: 15, borderWidth: 1, borderColor: "#E1E4E7", backgroundColor: "#FFFFFF" },
  reportDateIcon: { color: "#173B5B", fontSize: 24, fontWeight: "700" },
  reportDateLabel: { color: "#718091", fontSize: 9, fontWeight: "800", letterSpacing: 1 },
  reportDateValue: { color: "#173B5B", fontSize: 14, fontWeight: "800", marginTop: 3 },
  reportDateChange: { color: "#173B5B", fontSize: 12, fontWeight: "800" },
  emptyReport: { alignItems: "center", paddingVertical: 22 },
  modalBackdrop: { flex: 1, justifyContent: "center", padding: 22, backgroundColor: "rgba(10,24,38,0.48)" },
  calendarCard: { padding: 18, borderRadius: 22, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E7E2D6" },
  calendarHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  calendarTitle: { color: "#173B5B", fontSize: 20, fontWeight: "800", marginTop: 4 },
  calendarClose: { color: "#718091", fontSize: 28, lineHeight: 30, paddingHorizontal: 5 },
  calendarControls: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  calendarArrow: { width: 42, height: 38, alignItems: "center", justifyContent: "center", backgroundColor: "#F2F5F7", borderRadius: 10 },
  calendarArrowText: { color: "#173B5B", fontSize: 25, lineHeight: 28, fontWeight: "700" },
  calendarToday: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 99, backgroundColor: "#EAF0F4" },
  calendarTodayText: { color: "#173B5B", fontSize: 12, fontWeight: "800" },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap" },
  calendarWeekday: { width: "14.285%", textAlign: "center", color: "#718091", fontSize: 11, fontWeight: "800", paddingVertical: 8 },
  calendarDay: { width: "14.285%", height: 42, alignItems: "center", justifyContent: "center", borderRadius: 11 },
  calendarDaySelected: { backgroundColor: "#173B5B" },
  calendarDayToday: { backgroundColor: "#EAF0F4", borderWidth: 1, borderColor: "#B9C8D4" },
  calendarDayText: { color: "#25384B", fontSize: 13, fontWeight: "600" },
  calendarDayTextSelected: { color: "#FFFFFF", fontWeight: "800" },
  calendarHint: { color: "#718091", fontSize: 11, lineHeight: 17, marginTop: 12 },
  staffBottomNav: { paddingHorizontal: 6, paddingTop: 10, paddingBottom: 8 },
  emptySearch: { alignItems: "center", paddingVertical: 28 },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E9E7E1",
    paddingTop: 9,
    paddingBottom: 7,
    paddingHorizontal: 18,
  },
  bottomNavItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    gap: 3,
    paddingHorizontal: 2,
  },
  bottomNavIconWrap: {
    position: "relative",
    minWidth: 28,
    alignItems: "center",
  },
  bottomNavIcon: {
    color: "#7A8490",
    fontSize: 21,
    lineHeight: 24,
    fontWeight: "700",
  },
  bottomNavIconActive: { color: "#173B5B" },
  bottomNavLabel: {
    color: "#78818B",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
  },
  bottomNavLabelActive: { color: "#173B5B", fontWeight: "800" },
  bottomNavBadge: {
    position: "absolute",
    top: -4,
    right: -11,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#B7473E",
  },
  bottomNavBadgeText: { color: "#FFFFFF", fontSize: 9, fontWeight: "800" },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  studentTopBar: { marginBottom: 16 },
  studentBrand: { color: "#173B5B", fontSize: 25, letterSpacing: -0.8 },
  studentEyebrow: { color: "#647386", fontSize: 9, letterSpacing: 1.15 },
  studentSectionTitle: { color: "#173B5B", fontSize: 20 },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 9 },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#183653",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#38536B",
  },
  studentCartButton: { backgroundColor: "#FFFFFF", borderColor: "#E3E5E7" },
  cartIcon: {
    width: 21,
    height: 22,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 2,
  },
  bagHandle: {
    position: "absolute",
    top: 0,
    width: 9,
    height: 8,
    borderWidth: 2,
    borderColor: "#D9B45B",
    borderBottomWidth: 0,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  bagBody: {
    width: 19,
    height: 15,
    borderWidth: 2,
    borderColor: "#D9B45B",
    borderRadius: 4,
    backgroundColor: "#183653",
  },
  cartBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#061525",
    paddingHorizontal: 4,
  },
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
  studentSignOut: { borderColor: "#DCE0E3", backgroundColor: "#FFFFFF" },
  studentSignOutText: { color: "#445365" },
  signOutText: { color: "#E2E8F0", fontWeight: "700", fontSize: 12 },
  welcome: {
    backgroundColor: "#183653",
    borderRadius: 23,
    padding: 22,
    marginBottom: 17,
  },
  studentWelcome: {
    minHeight: 216,
    justifyContent: "center",
    padding: 25,
    borderWidth: 1,
    borderColor: "#173B5B",
    overflow: "hidden",
    position: "relative",
  },
  studentHeroGlow: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    right: -86,
    top: -80,
    backgroundColor: "rgba(217,180,91,0.13)",
    borderWidth: 1,
    borderColor: "rgba(217,180,91,0.2)",
  },
  studentWelcomeTitle: { fontSize: 32, lineHeight: 37, maxWidth: 300 },
  studentWelcomeBody: { maxWidth: 290, fontSize: 14, lineHeight: 21 },
  studentHeroButton: {
    alignSelf: "flex-start",
    marginTop: 20,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#D9B45B",
  },
  studentHeroButtonText: {
    color: "#0B1F33",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 0.55,
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
  shopHeadingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 14,
  },
  studentSectionEyebrow: {
    color: "#D9B45B",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.35,
    marginBottom: 5,
  },
  collectionMark: {
    color: "#D9B45B",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 1.5,
    borderWidth: 1,
    borderColor: "#38536B",
    borderRadius: 12,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10283F",
    borderWidth: 1,
    borderColor: "#28425A",
    borderRadius: 13,
    paddingHorizontal: 13,
    marginBottom: 13,
  },
  studentSearchBox: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E4E7",
    borderRadius: 14,
  },
  studentSearchLens: { borderColor: "#718091" },
  studentSearchHandle: { backgroundColor: "#718091" },
  studentCategoryChip: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E1E4E7",
    paddingVertical: 9,
  },
  studentCategoryChipActive: {
    backgroundColor: "#173B5B",
    borderColor: "#173B5B",
  },
  studentCategoryChipText: { color: "#485768" },
  studentCategoryChipTextActive: { color: "#FFFFFF" },
  searchIcon: { width: 20, height: 20, marginRight: 10, position: "relative" },
  searchLens: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: "#D9B45B",
  },
  searchHandle: {
    position: "absolute",
    left: 11,
    top: 13,
    width: 8,
    height: 2,
    backgroundColor: "#D9B45B",
    transform: [{ rotate: "45deg" }],
  },
  searchInput: { flex: 1, minHeight: 46, color: "#FFFFFF", fontSize: 13 },
  categoryList: { gap: 8, paddingBottom: 15 },
  categoryChip: {
    borderRadius: 99,
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: "#10283F",
    borderWidth: 1,
    borderColor: "#28425A",
  },
  categoryChipActive: { backgroundColor: "#D9B45B", borderColor: "#E7C875" },
  categoryChipText: { color: "#D7E0E8", fontSize: 11, fontWeight: "700" },
  categoryChipTextActive: { color: "#0B1F33" },
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
  studentProductGrid: { rowGap: 12 },
  studentProductCard: {
    borderRadius: 17,
    borderColor: "#E7E2D6",
    padding: 10,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  studentProductImage: {
    height: 132,
    borderRadius: 13,
    backgroundColor: "#F1F4F5",
  },
  studentOrderCard: {
    borderRadius: 15,
    borderColor: "#E7E2D6",
    marginBottom: 10,
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
  detailsLink: {
    color: "#9A741E",
    fontSize: 11,
    fontWeight: "800",
    marginTop: 7,
  },
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
  fieldLabel: {
    color: "#33465A",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 5,
    marginBottom: 5,
  },
  fieldHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    marginBottom: 7,
  },
  optionalToggle: {
    borderWidth: 1,
    borderColor: "#D8D2C5",
    borderRadius: 99,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: "#F8F7F2",
  },
  optionalToggleActive: { backgroundColor: "#E8F1EA", borderColor: "#9DBBA5" },
  optionalToggleText: { color: "#59697A", fontSize: 11, fontWeight: "700" },
  optionalToggleTextActive: { color: "#356346" },
  descriptionInput: { minHeight: 96, paddingTop: 11 },
  editableProductCard: { width: "100%", padding: 14 },
  productSummary: {
    color: "#637284",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
  switchRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  switch: {
    borderRadius: 99,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E1E4E7",
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  switchActive: { backgroundColor: "#D9B45B" },
  switchText: { color: "#536476", fontWeight: "700", fontSize: 12 },
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
