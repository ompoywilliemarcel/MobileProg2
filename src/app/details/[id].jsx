import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { products } from '../../data/products';

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const product = products.find((item) => item.id === productId);
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={goBack}
          accessibilityRole="button"
          accessibilityLabel="Back to products"
        >
          <Text style={styles.backButtonText}>‹  Back to products</Text>
        </TouchableOpacity>

        {product ? (
          <View style={styles.card}>
            <View style={styles.productNumber}>
              <Text style={styles.productNumberText}>{product.id}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.category}</Text>
            </View>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>

            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>Product details</Text>
            <Text style={styles.description}>{product.description}</Text>

            <View style={styles.idPanel}>
              <Text style={styles.idLabel}>PRODUCT ID</Text>
              <Text style={styles.idValue}>{product.id}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>Product not found</Text>
            <Text style={styles.description}>
              There is no product with ID {productId || 'unknown'}.
            </Text>
            <Link href="/" asChild>
              <TouchableOpacity style={styles.homeButton}>
                <Text style={styles.homeButtonText}>Browse products</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0B1F33',
  },
  content: {
    flexGrow: 1,
    padding: 22,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 9,
    paddingRight: 12,
    marginBottom: 19,
  },
  backButtonText: {
    color: '#D9B45B',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D9B45B',
    borderRadius: 24,
    borderWidth: 1,
    padding: 23,
  },
  productNumber: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#D9B45B',
    borderRadius: 18,
    height: 68,
    justifyContent: 'center',
    marginBottom: 22,
    width: 68,
  },
  productNumberText: {
    color: '#0B1F33',
    fontSize: 26,
    fontWeight: '800',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D9B45B',
    borderRadius: 999,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#0B1F33',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  title: {
    color: '#0B1F33',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 7,
  },
  price: {
    color: '#9A741E',
    fontSize: 19,
    fontWeight: '700',
    marginTop: 10,
  },
  divider: {
    backgroundColor: '#E7E2D6',
    height: 1,
    marginVertical: 23,
  },
  sectionLabel: {
    color: '#0B1F33',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  description: {
    color: '#526579',
    fontSize: 15,
    lineHeight: 23,
  },
  idPanel: {
    backgroundColor: '#F8F7F2',
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 27,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  idLabel: {
    color: '#526579',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  idValue: {
    color: '#0B1F33',
    fontSize: 13,
    fontWeight: '800',
  },
  homeButton: {
    alignItems: 'center',
    backgroundColor: '#D9B45B',
    borderRadius: 12,
    marginTop: 20,
    paddingVertical: 13,
  },
  homeButtonText: {
    color: '#0B1F33',
    fontSize: 14,
    fontWeight: '700',
  },
});
