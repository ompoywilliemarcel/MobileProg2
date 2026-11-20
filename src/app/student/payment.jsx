import { useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DarkRadialBackground from '../../components/DarkRadialBackground';
import { money, productAmount, recordActivity, store } from '../../data/demoStore';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = Array.isArray(params.name) ? params.name[0] : params.name || 'Student';
  const [method, setMethod] = useState(store.checkoutMethod || 'GCash');
  const items = store.checkoutItems || [];
  const total = useMemo(() => items.reduce((sum,item)=>sum+productAmount(item)*(item.quantity||1),0),[items]);
  const placeOrder = async () => {
    if (!items.length) return Alert.alert('Order unavailable', 'Please return to checkout and try again.');
    const order = { id:`USTP-${Date.now().toString().slice(-5)}`, customer:name, item:items.map((item)=>`${item.name}${item.size?` (${item.size})`:''} x${item.quantity||1}`).join(', '), total, status:'Received', method, pickup:store.checkoutPickup||undefined, createdAt:new Date().toISOString(), date:new Date().toLocaleDateString('en-PH',{month:'short',day:'2-digit'}) };
    store.orders.unshift(order);
    await recordActivity('Order Activity', name, `Placed order ${order.id} for ${money(total)}.`);
    if (!store.checkoutDirect) { store.cart = []; store.cartNotificationCount = 0; }
    store.checkoutItems = []; store.checkoutPickup = ''; store.checkoutPickupTime = '10 AM'; store.checkoutDirect = false; store.checkoutMethod = 'GCash';
    router.replace({ pathname:'/student/order-confirmation', params:{ name, orderId:order.id, total:String(total), method } });
  };
  return <SafeAreaView style={styles.safe}><DarkRadialBackground/><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><TouchableOpacity onPress={()=>router.back()}><Text style={styles.back}>‹  Checkout</Text></TouchableOpacity><Text style={styles.title}>Payment</Text><View style={{width:60}}/></View>
    <Text style={styles.subtitle}>Choose how you’d like to pay.</Text>
    <View style={styles.card}><Text style={styles.sectionTitle}>Payment method</Text>
      {[['GCash','Pay with GCash'],['Pay on shop','Pay when you pick up']].map(([value,label])=><TouchableOpacity key={value} onPress={()=>{setMethod(value);store.checkoutMethod=value;}} style={[styles.choice,method===value&&styles.choiceSelected]}><View style={[styles.radio,method===value&&styles.radioSelected]}><View style={method===value&&styles.radioDot}/></View><View style={{flex:1}}><Text style={styles.choiceTitle}>{value}</Text><Text style={styles.muted}>{value==='GCash'?'Demo payment only; no payment is processed.':label}</Text></View></TouchableOpacity>)}
    </View>
    <View style={styles.card}><View style={styles.totalRow}><Text style={styles.totalLabel}>Order total</Text><Text style={styles.total}>{money(total)}</Text></View><Text style={styles.muted}>{store.checkoutPickup?`Pickup: ${store.checkoutPickup}`:'Pickup details can be arranged after placing your order.'}</Text></View>
    <TouchableOpacity style={styles.primary} onPress={placeOrder}><Text style={styles.primaryText}>Place order</Text></TouchableOpacity>
  </ScrollView></SafeAreaView>;
}

const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#061525'},content:{padding:20,paddingBottom:40,maxWidth:760,width:'100%',alignSelf:'center'},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:12},back:{color:'#D9B45B',fontSize:14,fontWeight:'800'},title:{color:'#FFF',fontSize:22,fontWeight:'800'},subtitle:{color:'#D4DEE8',fontSize:13,marginBottom:17},card:{backgroundColor:'#FFF',borderRadius:17,padding:16,marginBottom:12,borderWidth:1,borderColor:'#E7E2D6'},sectionTitle:{color:'#0B1F33',fontSize:16,fontWeight:'800',marginBottom:8},choice:{flexDirection:'row',alignItems:'center',gap:12,borderWidth:1,borderColor:'#E3E5E8',borderRadius:12,padding:13,marginTop:9},choiceSelected:{borderColor:'#D9B45B',backgroundColor:'#FFFCF4'},radio:{width:20,height:20,borderWidth:1.5,borderColor:'#AAB2BC',borderRadius:99,alignItems:'center',justifyContent:'center'},radioSelected:{borderColor:'#9A741E'},radioDot:{width:10,height:10,borderRadius:99,backgroundColor:'#D9B45B'},choiceTitle:{color:'#0B1F33',fontSize:13,fontWeight:'800'},muted:{color:'#69798A',fontSize:12,lineHeight:18,marginTop:4},totalRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},totalLabel:{color:'#0B1F33',fontWeight:'800',fontSize:15},total:{color:'#0B1F33',fontSize:22,fontWeight:'900'},primary:{alignItems:'center',backgroundColor:'#D9B45B',borderRadius:12,paddingVertical:14,marginTop:3},primaryText:{color:'#0B1F33',fontWeight:'900',fontSize:14}});
