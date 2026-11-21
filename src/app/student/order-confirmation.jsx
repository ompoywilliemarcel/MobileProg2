import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DarkRadialBackground from '../../components/DarkRadialBackground';
import { money, store } from '../../data/demoStore';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = Array.isArray(params.name) ? params.name[0] : params.name || 'Student';
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId || '';
  const order = store.orders.find((item) => item.id === orderId);
  const method = order?.method || 'GCash';
  const total = order?.total || 0;
  return <SafeAreaView style={styles.safe}><DarkRadialBackground/><ScrollView contentContainerStyle={styles.content}>
    <View style={styles.header}><Text style={styles.brand}>USTP STORE</Text><Text style={styles.step}>PURCHASE RECEIPT</Text></View>
    <View style={styles.card}><View style={styles.check}><Text style={styles.checkText}>✓</Text></View><Text style={styles.title}>Thanks, {name}!</Text><Text style={styles.subtitle}>Your order has been received.</Text><View style={styles.rule}/>
      <Text style={styles.section}>PURCHASED ITEMS</Text>
      {(order?.items || []).map((item,index)=><View key={`${item.name}-${index}`} style={styles.item}><Text style={styles.itemName}>{item.name}{item.size?` · ${item.size}`:''} × {item.quantity}</Text><Text style={styles.itemPrice}>{money(item.price*item.quantity)}</Text></View>)}
      <View style={styles.row}><Text style={styles.label}>Total</Text><Text style={styles.value}>{money(total)}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Purchased reference</Text><Text style={styles.value}>{orderId}</Text></View>
      {method==='GCash'&&<View style={styles.row}><Text style={styles.label}>Sample GCash reference</Text><Text style={styles.value}>{order?.gcashReference}</Text></View>}
      <Text style={styles.note}>{method==='GCash'?'Sample GCash receipt only. No payment was processed.':'Payment: Pay on shop.'}</Text>
      <View style={styles.barcode}>{Array.from({length:32},(_,i)=><View key={i} style={{width:[2,4,3,1,5,2,1][i%7],height:38,backgroundColor:'#0B1F33',marginRight:2}}/>)}</View><Text style={styles.barcodeText}>{orderId}</Text>
      <Text style={styles.screenshot}>Please screenshot this receipt as proof of purchase.</Text>
      <TouchableOpacity style={styles.primary} onPress={()=>router.replace({pathname:'/student/dashboard',params:{name}})}><Text style={styles.primaryText}>Back to shop</Text></TouchableOpacity>
    </View>
  </ScrollView></SafeAreaView>;
}

const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#061525'},content:{flexGrow:1,justifyContent:'center',padding:20,maxWidth:660,width:'100%',alignSelf:'center'},header:{flexDirection:'row',justifyContent:'space-between',marginBottom:15},brand:{color:'#FFF',fontSize:13,fontWeight:'900',letterSpacing:1.2},step:{color:'#D9B45B',fontSize:11,fontWeight:'800',letterSpacing:1},card:{backgroundColor:'#FFF',borderRadius:20,padding:24,alignItems:'center',borderWidth:1,borderColor:'#E7E2D6'},check:{width:58,height:58,borderRadius:99,backgroundColor:'#F8F3E5',alignItems:'center',justifyContent:'center'},checkText:{fontSize:30,color:'#80651F',fontWeight:'900'},title:{color:'#0B1F33',fontSize:24,fontWeight:'900',marginTop:15},subtitle:{color:'#69798A',fontSize:13,marginTop:5},rule:{height:1,backgroundColor:'#E7EAF0',alignSelf:'stretch',marginVertical:20},section:{alignSelf:'stretch',color:'#80651F',fontWeight:'900',fontSize:11,letterSpacing:1,marginBottom:10},item:{alignSelf:'stretch',flexDirection:'row',justifyContent:'space-between',gap:8,marginBottom:9},itemName:{flex:1,color:'#0B1F33',fontSize:13,fontWeight:'700'},itemPrice:{color:'#0B1F33',fontSize:13,fontWeight:'800'},row:{alignSelf:'stretch',flexDirection:'row',justifyContent:'space-between',gap:8,marginBottom:12},label:{color:'#69798A',fontSize:12,flexShrink:1},value:{color:'#0B1F33',fontSize:12,fontWeight:'800',textAlign:'right'},note:{alignSelf:'stretch',color:'#69798A',fontSize:12,lineHeight:18,marginTop:3},barcode:{height:44,flexDirection:'row',justifyContent:'center',alignItems:'center',marginTop:18},barcodeText:{color:'#69798A',fontSize:10,letterSpacing:2,marginTop:3},screenshot:{color:'#80651F',fontSize:12,fontWeight:'800',textAlign:'center',marginTop:14},primary:{alignSelf:'stretch',alignItems:'center',backgroundColor:'#D9B45B',borderRadius:12,paddingVertical:14,marginTop:18},primaryText:{color:'#0B1F33',fontSize:14,fontWeight:'900'}});
