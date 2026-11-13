import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DarkRadialBackground from '../../components/DarkRadialBackground';
import { money, productAmount, store } from '../../data/demoStore';

const pickupTimes = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'];

export default function CartScreen() {
  const router = useRouter();
  const { name: queryName } = useLocalSearchParams();
  const name = Array.isArray(queryName) ? queryName[0] : queryName || 'Student';
  const [cart, setCart] = useState([...store.cart]);
  const [payment, setPayment] = useState('GCash');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const total = useMemo(() => cart.reduce((sum, item) => sum + productAmount(item) * (item.quantity || 1), 0), [cart]);

  const saveCart = (next) => { store.cart = next; setCart(next); };
  const changeQuantity = (index, delta) => {
    const next = cart.map((item, itemIndex) => itemIndex === index ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item);
    saveCart(next);
  };
  const changeSize = (index, size) => saveCart(cart.map((item, itemIndex) => itemIndex === index ? { ...item, size } : item));
  const removeItem = (index) => Alert.alert('Remove product', 'Are you sure you want to remove this in the cart?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Remove', style: 'destructive', onPress: () => saveCart(cart.filter((_, itemIndex) => itemIndex !== index)) },
  ]);
  const reserve = () => {
    if (!pickupDate.trim() || !pickupTimes.includes(pickupTime)) return Alert.alert('Choose pickup details', 'Enter a date and choose a time between 9:00 AM and 5:00 PM.');
    store.reservations.unshift({ customer: name, date: pickupDate.trim(), time: pickupTime, status: 'Reserved' });
    Alert.alert('Reservation saved', `${pickupDate} at ${pickupTime}`);
  };
  const placeOrder = () => {
    if (!cart.length) return Alert.alert('Cart is empty', 'Add merch before checking out.');
    const order = {
      id: `USTP-${Date.now().toString().slice(-5)}`,
      customer: name,
      item: cart.map((item) => `${item.name}${item.size ? ` (${item.size})` : ''} x${item.quantity || 1}`).join(', '),
      total,
      status: 'Received',
      method: payment,
      pickup: pickupDate.trim() ? `${pickupDate.trim()} at ${pickupTime}` : undefined,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-PH', { month: 'short', day: '2-digit' }),
    };
    store.orders.unshift(order);
    saveCart([]);
    router.replace({ pathname: '/student/dashboard', params: { name } });
    if (payment === 'GCash') Alert.alert('Sample GCash receipt', `Receipt ${order.id}\n${order.item}\nTotal ${money(total)}\nPayment: GCash\n\nDemo only - no payment was processed.`);
    else Alert.alert('Order placed', `Order ${order.id} is set for cash payment at pickup.`);
  };
  const goBack = () => router.replace({ pathname: '/student/dashboard', params: { name } });

  return <SafeAreaView style={styles.safe}><DarkRadialBackground/><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><TouchableOpacity onPress={goBack} style={styles.back}><Text style={styles.backText}>&lt;  Shop</Text></TouchableOpacity><Text style={styles.headerTitle}>Your cart</Text><View style={{ width: 54 }}/></View>
    <Text style={styles.greeting}>Ready when you are, {name}.</Text>
    {cart.length ? cart.map((item, index) => {
      const sizes = /lanyard/i.test(item.name) ? [] : (item.sizes || ['S', 'M', 'L', 'XL']);
      return <View key={`${item.id}-${item.size || 'one'}-${index}`} style={styles.itemCard}>
        <Image source={item.image} resizeMode="contain" style={styles.image}/>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
          {sizes.length > 0 && <View style={styles.sizeRow}>{sizes.map((size) => <TouchableOpacity key={size} onPress={() => changeSize(index, size)} style={[styles.sizeChip, item.size === size && styles.sizeSelected]}><Text style={[styles.sizeText, item.size === size && styles.sizeTextSelected]}>{size}</Text></TouchableOpacity>)}</View>}
          <View style={styles.itemActions}><View style={styles.quantity}><TouchableOpacity onPress={() => changeQuantity(index, -1)} style={styles.quantityButton}><Text style={styles.quantityText}>-</Text></TouchableOpacity><Text style={styles.quantityValue}>{item.quantity || 1}</Text><TouchableOpacity onPress={() => changeQuantity(index, 1)} style={styles.quantityButton}><Text style={styles.quantityText}>+</Text></TouchableOpacity></View><TouchableOpacity onPress={() => removeItem(index)}><Text style={styles.remove}>Remove</Text></TouchableOpacity></View>
        </View>
      </View>;
    }) : <View style={styles.empty}><Text style={styles.emptyTitle}>Your cart is empty</Text><Text style={styles.muted}>Browse the collection and add something you love.</Text><TouchableOpacity onPress={goBack} style={styles.primary}><Text style={styles.primaryText}>Browse merch</Text></TouchableOpacity></View>}
    <View style={styles.section}><Text style={styles.sectionTitle}>Pickup reservation</Text><Text style={styles.muted}>Optional - choose a pickup time between 9 AM and 5 PM</Text><TextInput style={styles.input} value={pickupDate} onChangeText={setPickupDate} placeholder="Pickup date" placeholderTextColor="#8290A0"/><View style={styles.timeRow}>{pickupTimes.map((time) => <TouchableOpacity key={time} onPress={() => setPickupTime(time)} style={[styles.timeChip, pickupTime === time && styles.timeSelected]}><Text style={[styles.timeText, pickupTime === time && styles.timeTextSelected]}>{time}</Text></TouchableOpacity>)}</View><TouchableOpacity style={styles.secondary} onPress={reserve}><Text style={styles.secondaryText}>Reserve pickup time</Text></TouchableOpacity></View>
    <View style={styles.section}><View style={styles.totalRow}><Text style={styles.sectionTitle}>Total</Text><Text style={styles.total}>{money(total)}</Text></View><Text style={styles.sectionTitle}>Payment method</Text><View style={styles.paymentRow}>{['GCash', 'Cash at pickup'].map((method) => <TouchableOpacity key={method} onPress={() => setPayment(method === 'GCash' ? 'GCash' : 'Cash')} style={[styles.paymentChoice, (method === 'GCash' ? payment === 'GCash' : payment === 'Cash') && styles.paymentSelected]}><Text style={styles.paymentText}>{method}</Text></TouchableOpacity>)}</View><TouchableOpacity style={[styles.primary, !cart.length && styles.disabled]} onPress={placeOrder}><Text style={styles.primaryText}>Place order</Text></TouchableOpacity><Text style={styles.disclaimer}>GCash checkout displays a sample receipt. No payment is processed.</Text></View>
  </ScrollView></SafeAreaView>;
}

const styles = StyleSheet.create({ safe: { flex: 1, backgroundColor: '#061525' }, content: { padding: 20, paddingBottom: 40 }, header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }, back: { width: 62 }, backText: { color: '#D9B45B', fontWeight: '800' }, headerTitle: { color: '#FFF', fontSize: 21, fontWeight: '800' }, greeting: { color: '#D4DEE8', fontSize: 13, marginBottom: 15 }, itemCard: { backgroundColor: '#FFF', borderRadius: 17, padding: 12, marginBottom: 11, flexDirection: 'row', gap: 12, borderWidth: 1, borderColor: '#E7E2D6' }, image: { width: 88, height: 104, backgroundColor: '#F1F4F5', borderRadius: 12 }, itemInfo: { flex: 1, justifyContent: 'center' }, itemName: { color: '#0B1F33', fontSize: 14, fontWeight: '800' }, price: { color: '#9A741E', fontWeight: '800', fontSize: 13, marginTop: 3 }, sizeRow: { flexDirection: 'row', gap: 6, marginTop: 9 }, sizeChip: { minWidth: 30, alignItems: 'center', borderRadius: 7, borderWidth: 1, borderColor: '#D8D2C5', paddingHorizontal: 7, paddingVertical: 5 }, sizeSelected: { backgroundColor: '#D9B45B', borderColor: '#D9B45B' }, sizeText: { color: '#0B1F33', fontSize: 10, fontWeight: '700' }, sizeTextSelected: { color: '#0B1F33' }, itemActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }, quantity: { flexDirection: 'row', alignItems: 'center', gap: 9 }, quantityButton: { width: 26, height: 26, borderRadius: 8, backgroundColor: '#F8F3E5', alignItems: 'center', justifyContent: 'center' }, quantityText: { color: '#80651F', fontSize: 16, fontWeight: '800' }, quantityValue: { color: '#0B1F33', fontSize: 13, fontWeight: '800' }, remove: { color: '#A43D32', fontSize: 11, fontWeight: '800' }, section: { backgroundColor: '#FFF', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E7E2D6', marginTop: 5, marginBottom: 12 }, sectionTitle: { color: '#0B1F33', fontSize: 17, fontWeight: '800' }, muted: { color: '#69798A', fontSize: 12, lineHeight: 18, marginTop: 4 }, input: { borderWidth: 1, borderColor: '#D8D2C5', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 11, marginTop: 12, color: '#0B1F33', backgroundColor: '#F8F7F2' }, timeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }, timeChip: { borderWidth: 1, borderColor: '#D8D2C5', borderRadius: 99, paddingHorizontal: 8, paddingVertical: 7 }, timeSelected: { backgroundColor: '#D9B45B', borderColor: '#D9B45B' }, timeText: { color: '#0B1F33', fontSize: 9, fontWeight: '700' }, timeTextSelected: { color: '#0B1F33' }, secondary: { alignItems: 'center', borderWidth: 1, borderColor: '#D9B45B', backgroundColor: '#F8F3E5', borderRadius: 11, paddingVertical: 12, marginTop: 12 }, secondaryText: { color: '#80651F', fontWeight: '800', fontSize: 12 }, totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 }, total: { color: '#0B1F33', fontSize: 22, fontWeight: '900' }, paymentRow: { flexDirection: 'row', gap: 9, marginTop: 10 }, paymentChoice: { flex: 1, alignItems: 'center', borderWidth: 1, borderColor: '#D8D2C5', borderRadius: 10, padding: 12 }, paymentSelected: { backgroundColor: '#F8F3E5', borderColor: '#D9B45B' }, paymentText: { color: '#0B1F33', fontWeight: '700', fontSize: 12 }, primary: { alignItems: 'center', backgroundColor: '#D9B45B', borderRadius: 12, paddingVertical: 14, marginTop: 13 }, primaryText: { color: '#0B1F33', fontWeight: '900', fontSize: 14 }, disabled: { opacity: 0.5 }, disclaimer: { color: '#718092', fontSize: 11, lineHeight: 16, marginTop: 8 }, empty: { backgroundColor: '#FFF', borderRadius: 18, padding: 22, alignItems: 'center', borderWidth: 1, borderColor: '#E7E2D6', marginBottom: 14 }, emptyTitle: { color: '#0B1F33', fontSize: 17, fontWeight: '800' } });
