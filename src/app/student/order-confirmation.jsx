import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import DarkRadialBackground from '../../components/DarkRadialBackground';
import { money } from '../../data/demoStore';

export default function OrderConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const name = Array.isArray(params.name) ? params.name[0] : params.name || 'Student';
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId || '';
  const method = Array.isArray(params.method) ? params.method[0] : params.method || 'GCash';
  const total = Array.isArray(params.total) ? params.total[0] : params.total || '0';
  return <SafeAreaView style={styles.safe}><DarkRadialBackground/><ScrollView contentContainerStyle={styles.content}><View style={styles.header}><Text style={styles.brand}>USTP WEAR</Text><Text style={styles.step}>ORDER COMPLETE</Text></View><View style={styles.card}><View style={styles.check}><Text style={styles.checkText}>✓</Text></View><Text style={styles.title}>Thanks, {name}!</Text><Text style={styles.subtitle}>Your order has been received.</Text><View style={styles.rule}/><View style={styles.row}><Text style={styles.label}>Order number</Text><Text style={styles.value}>{orderId}</Text></View><View style={styles.row}><Text style={styles.label}>Total</Text><Text style={styles.value}>{money(Number(total))}</Text></View><View style={styles.row}><Text style={styles.label}>Payment</Text><Text style={styles.value}>{method==='Pay on shop'||method==='Cash'?'Pay on shop':'GCash demo'}</Text></View><Text style={styles.note}>{method==='GCash'?'This is a demo checkout. No payment was processed.':'Pay when you pick up your order.'}</Text><TouchableOpacity style={styles.primary} onPress={()=>router.replace({pathname:'/student/dashboard',params:{name}})}><Text style={styles.primaryText}>Back to shop</Text></TouchableOpacity></View></ScrollView></SafeAreaView>;
}

const styles=StyleSheet.create({safe:{flex:1,backgroundColor:'#061525'},content:{flexGrow:1,justifyContent:'center',padding:20,maxWidth:660,width:'100%',alignSelf:'center'},header:{flexDirection:'row',justifyContent:'space-between',marginBottom:15},brand:{color:'#FFF',fontSize:13,fontWeight:'900',letterSpacing:1.2},step:{color:'#D9B45B',fontSize:11,fontWeight:'800',letterSpacing:1},card:{backgroundColor:'#FFF',borderRadius:20,padding:24,alignItems:'center',borderWidth:1,borderColor:'#E7E2D6'},check:{width:58,height:58,borderRadius:99,backgroundColor:'#F8F3E5',alignItems:'center',justifyContent:'center'},checkText:{fontSize:30,color:'#80651F',fontWeight:'900'},title:{color:'#0B1F33',fontSize:24,fontWeight:'900',marginTop:15},subtitle:{color:'#69798A',fontSize:13,marginTop:5},rule:{height:1,backgroundColor:'#E7EAF0',alignSelf:'stretch',marginVertical:20},row:{alignSelf:'stretch',flexDirection:'row',justifyContent:'space-between',marginBottom:12},label:{color:'#69798A',fontSize:13},value:{color:'#0B1F33',fontSize:13,fontWeight:'800'},note:{alignSelf:'stretch',color:'#69798A',fontSize:12,lineHeight:18,marginTop:3},primary:{alignSelf:'stretch',alignItems:'center',backgroundColor:'#D9B45B',borderRadius:12,paddingVertical:14,marginTop:18},primaryText:{color:'#0B1F33',fontSize:14,fontWeight:'900'}});
