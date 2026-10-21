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
import DarkRadialBackground from '../../components/DarkRadialBackground';

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
      <DarkRadialBackground />
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
            <View style={[styles.productImage, { backgroundColor: product.color }]}>
              <View style={styles.artGlow} />
              <View style={styles.productShadow} />
              <View style={styles.productStage} />
              <Text style={styles.productEmoji}>{product.emoji}</Text>
              <Text style={styles.imageLabel}>OFFICIAL MERCH</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.category}</Text>
            </View>
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>{product.price}</Text>

            <View style={styles.divider} />
            <Text style={styles.sectionLabel}>Product details</Text>
            <Text style={styles.description}>{product.description}</Text>

            <Text style={styles.sectionLabel}>Color</Text>
            <View style={styles.colorRow}>
              <View style={[styles.colorSwatch, { backgroundColor: product.color }]} />
              <Text style={styles.colorName}>{product.colorName}</Text>
            </View>

            <Text style={styles.sectionLabel}>Available sizes</Text>
            <View style={styles.sizeRow}>
              {product.sizes.map((size) => (
                <View key={size} style={styles.sizeChip}>
                  <Text style={styles.sizeText}>{size}</Text>
                </View>
              ))}
            </View>

            <View style={styles.idPanel}>
              <Text style={styles.idLabel}>MERCH SKU</Text>
              <Text style={styles.idValue}>
                MERCH-{product.id.padStart(3, '0')}
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.title}>Merch item not found</Text>
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
    backgroundColor: '#061525',
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
    padding: 18,
  },
  productImage: {
    alignItems: 'center',
    borderRadius: 18,
    height: 220,
    justifyContent: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  artGlow: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 150,
    height: 300,
    position: 'absolute',
    right: -65,
    top: -155,
    width: 300,
  },
  productShadow: {
    backgroundColor: 'rgba(3,13,24,0.4)',
    borderRadius: 100,
    bottom: 42,
    height: 24,
    position: 'absolute',
    width: 145,
  },
  productStage: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderColor: 'rgba(255,255,255,0.22)',
    borderRadius: 999,
    borderWidth: 1,
    bottom: 42,
    height: 16,
    position: 'absolute',
    width: 166,
  },
  productEmoji: {
    fontSize: 106,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 3, height: 12 },
    textShadowRadius: 12,
    transform: [{ perspective: 700 }, { rotateY: '-8deg' }, { translateY: -12 }],
  },
  imageLabel: {
    bottom: 12,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    position: 'absolute',
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
    marginBottom: 20,
  },
  colorRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 20,
  },
  colorSwatch: {
    borderColor: '#D9B45B',
    borderRadius: 999,
    borderWidth: 2,
    height: 24,
    marginRight: 9,
    width: 24,
  },
  colorName: {
    color: '#526579',
    fontSize: 14,
    fontWeight: '600',
  },
  sizeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sizeChip: {
    alignItems: 'center',
    backgroundColor: '#F8F7F2',
    borderColor: '#D9B45B',
    borderRadius: 9,
    borderWidth: 1,
    minWidth: 44,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  sizeText: {
    color: '#0B1F33',
    fontSize: 13,
    fontWeight: '700',
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
