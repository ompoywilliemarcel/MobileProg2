import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { store } from '../../data/demoStore';

export default function ProductDetailsScreen() {
  const { id, audience, name } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const isCustomer = audience === 'customer';
  const product = store.products.find((item) => item.id === Number(productId));
  const isAccessory = product && /accessor/i.test(product.category || '');
  const hasSizes = product && (product.hasSizes ?? (!isAccessory && !/lanyard/i.test(product.name)));
  const sizes = hasSizes ? (product.sizes || ['S', 'M', 'L', 'XL']) : [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isWide = width >= 700;
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
          <View style={[styles.card, isWide && styles.cardWide]}>
            <View style={[styles.productImage, isWide && styles.productImageWide, { backgroundColor: product.color }]}>
              <View style={styles.artGlow} />
              <View style={styles.productShadow} />
              <View style={styles.productStage} />
              <Image
                source={product.image}
                style={styles.productImageFile}
                resizeMode="contain"
              />
            </View>

            <View style={[styles.productInfo, isWide && styles.productInfoWide]}>
              <View style={styles.topLine}>
                <View style={styles.badge}><Text style={styles.badgeText}>MERCH DROP</Text></View>
                <Text style={styles.sparkle}>✧</Text>
              </View>
              <Text style={styles.category}>{product.category.toUpperCase()}</Text>
              <Text style={styles.title}>{product.name}</Text>
              <View style={isWide ? styles.infoSpacer : styles.mobileSpacer} />
              <Text style={styles.price}>{product.price}</Text>
              <TouchableOpacity style={styles.detailsLink} onPress={() => setDetailsOpen(!detailsOpen)} accessibilityRole="button">
                <Text style={styles.detailsText}>{detailsOpen ? 'Hide details' : 'Details'}  ›</Text>
              </TouchableOpacity>
              {detailsOpen && <View style={styles.detailsPanel}>
                <Text style={styles.description}>{product.description || 'Premium quality official merchandise. Comfortable, stylish, and made to last.'}</Text>
                <View style={styles.colorRow}><View style={[styles.colorSwatch, { backgroundColor: product.color }]} /><Text style={styles.colorName}>{product.colorName || 'Official Collection'}</Text></View>
                {hasSizes && <><Text style={styles.sectionLabel}>Choose a size</Text><View style={styles.sizeRow}>{sizes.map((size) => <TouchableOpacity key={size} onPress={() => setSelectedSize(size)} style={[styles.sizeChip, selectedSize === size && styles.sizeChipSelected]}><Text style={[styles.sizeText, selectedSize === size && styles.sizeTextSelected]}>{size}</Text></TouchableOpacity>)}</View></>}
                <Text style={styles.idValue}>MERCH-{String(product.id).padStart(3, '0')}</Text>
              </View>}
            {isCustomer && <TouchableOpacity style={styles.addToCartButton} onPress={() => {
              if (hasSizes && !selectedSize) return;
              const existing = store.cart.find((item) => item.id === product.id && item.size === selectedSize);
              if (existing) existing.quantity = (existing.quantity || 1) + 1;
              else store.cart.push({ ...product, size: selectedSize, quantity: 1 });
              store.cartNotificationCount += 1;
              router.replace({ pathname: '/student/dashboard', params: { name: name || 'Student' } });
            }}><Text style={styles.addToCartText}>Add to cart</Text></TouchableOpacity>}
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
    backgroundColor: '#F7F7F3',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: 9,
    paddingRight: 12,
    marginBottom: 19,
  },
  backButtonText: {
    color: '#263246',
    fontSize: 14,
    fontWeight: '700',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#EEEDE7',
    borderRadius: 22,
    borderWidth: 1,
    padding: 12,
    elevation: 5,
    shadowColor: '#182033',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  cardWide: {
    flexDirection: 'row',
    alignItems: 'stretch',
    padding: 12,
    minHeight: 310,
    gap: 12,
  },
  productInfo: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  productInfoWide: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  productImage: {
    alignItems: 'center',
    borderRadius: 18,
    height: 290,
    justifyContent: 'center',
    marginBottom: 0,
    overflow: 'hidden',
    position: 'relative',
    minWidth: 220,
  },
  productImageWide: { flex: 1 },
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
  productImageFile: {
    width: '82%',
    height: '82%',
    position: 'absolute',
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
    backgroundColor: '#F1F0EC',
    borderRadius: 999,
    marginBottom: 0,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: '#273146',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  title: {
    color: '#18243A',
    fontSize: 25,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 5,
  },
  price: {
    color: '#18243A',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 4,
  },
  topLine: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  sparkle: { color: '#29344A', fontSize: 22, fontWeight: '700', paddingRight: 4 },
  category: { color: '#8B8D92', fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  infoSpacer: { flex: 1, minHeight: 22 },
  mobileSpacer: { height: 24 },
  detailsLink: { alignSelf: 'flex-end', paddingVertical: 10 },
  detailsText: { color: '#515C6D', fontSize: 12, fontWeight: '700' },
  detailsPanel: { borderTopColor: '#EEEDE7', borderTopWidth: 1, paddingTop: 14, marginTop: 2 },
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
  sizeChipSelected: {
    backgroundColor: '#D9B45B',
    borderColor: '#D9B45B',
  },
  sizeText: {
    color: '#0B1F33',
    fontSize: 13,
    fontWeight: '700',
  },
  sizeTextSelected: {
    color: '#0B1F33',
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
  addToCartButton: {
    alignItems: 'center',
    backgroundColor: '#D9B45B',
    borderRadius: 13,
    marginTop: 2,
    paddingVertical: 13,
    backgroundColor: '#E5BD55',
  },
  addToCartText: {
    color: '#0B1F33',
    fontSize: 15,
    fontWeight: '800',
  },
});
