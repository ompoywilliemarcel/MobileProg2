import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.backgroundDecor} pointerEvents="none">
        <View style={styles.orbOne} />
        <View style={styles.orbTwo} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.brand}>OnlineShop</Text>
          <Link href="/" asChild>
            <TouchableOpacity style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Policy</Text>
          </View>
          <Text style={styles.title}>Terms &amp; Conditions</Text>
          <Text style={styles.subtitle}>Please read the details before placing your order.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.body}>
            {'1. Orders — By placing an order, customers agree to the terms and conditions stated below. Please make sure that all order details, including the product, quantity, size/color, shipping address, and contact information, are correct before confirming your order.\n\n'}
            {'2. Product Information — We do our best to provide accurate product descriptions, photos, sizes, and prices. However, slight differences in color or appearance may occur due to lighting, screen settings, or photography.\n\n'}
            {'3. Payment — Orders must be paid using the available payment methods provided by our shop. An order will only be processed once payment has been confirmed.\n\n'}
            {'4. Shipping & Delivery — Delivery times may vary depending on the customer\'s location, courier availability, weather, holidays, and other circumstances beyond our control. Once the parcel has been handed over to the courier, delays caused by the courier are outside the shop\'s control.\n\n'}
            {'5. Order Changes & Cancellation — Customers may request changes or cancellations before the order has been processed or shipped. Once the order has been shipped, changes or cancellations may no longer be possible.\n\n'}
            {'6. Returns & Exchanges — Returns or exchanges are only accepted for eligible cases, such as receiving the wrong item, damaged item, or defective product. Customers must contact us within the specified period and provide clear photos or videos as proof.\n\n'}
            {'7. Damaged or Incorrect Orders — If you receive a damaged, defective, or incorrect item, please contact us immediately. We may request photos or videos of the item and packaging to verify the issue before providing a replacement, refund, or other appropriate resolution.\n\n'}
            {'8. Refunds — Approved refunds will be processed according to our refund policy and the payment method used. Shipping fees may be non-refundable unless the issue was caused by the shop.\n\n'}
            {'9. Customer Responsibility — Customers are responsible for providing accurate delivery information. We are not responsible for parcels that cannot be delivered due to an incorrect or incomplete address provided by the customer.\n\n'}
            {'10. Pricing & Promotions — Prices, discounts, promotions, and product availability may change without prior notice. Promotional offers are subject to their respective terms and validity periods.\n\n'}
            {'11. Privacy — Customer information collected during transactions will only be used for purposes related to order processing, payment, delivery, customer service, and other legitimate business purposes.\n\n'}
            {'12. Agreement — By placing an order with our shop, you confirm that you have read, understood, and agreed to these Terms & Conditions.'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#acd3f2',
  },
  backgroundDecor: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  orbOne: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(255,255,255,0.18)',
    top: -60,
    right: -30,
  },
  orbTwo: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(14,165,233,0.12)',
    bottom: 90,
    left: -40,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.8,
  },
  backButton: {
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backButtonText: {
    color: '#0369A1',
    fontSize: 12,
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: 24,
    marginBottom: 22,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginBottom: 16,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 11,
    letterSpacing: 0.2,
  },
  title: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  subtitle: {
    color: '#CBD5E1',
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  body: {
    color: '#0F172A',
    fontSize: 15,
    lineHeight: 24,
  },
});
