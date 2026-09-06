import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backButtonText}>Back to sign up</Text>
          </TouchableOpacity>
        </Link>
        <Text style={styles.title}>TERMS &amp; CONDITIONS</Text>
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  backButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    borderColor: '#BAE6FD',
    borderRadius: 999,
    borderWidth: 1,
    marginBottom: 24,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  backButtonText: {
    color: '#0284C7',
    fontSize: 13,
    fontWeight: '600',
  },
  title: {
    color: '#0284C7',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 28,
  },
  body: {
    color: '#0F172A',
    fontSize: 15,
    lineHeight: 24,
  },
});
