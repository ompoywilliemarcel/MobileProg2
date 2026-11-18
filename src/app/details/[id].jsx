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
import { products as catalogProducts } from '../../data/products';

export default function ProductDetailsScreen() {
  const { id, audience, name } = useLocalSearchParams();
  const productId = Array.isArray(id) ? id[0] : id;
  const isCustomer = audience === 'customer';
  const product = [...store.products, ...catalogProducts].find((item) => item.id === Number(productId));
  const isAccessory = product && /accessor/i.test(product.category || '');
  const hasSizes = product && (product.hasSizes ?? (!isAccessory && !/lanyard/i.test(product.name)));
  const sizes = hasSizes ? (product.sizes || ['S', 'M', 'L', 'XL']) : [];
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isWide = width >= 760;
  const wideImageHeight = Math.min(610, width * 0.36);
  const router = useRouter();
  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.navigationRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Back to products"
          >
            <Text style={styles.backButtonText}>&lt;  Back to products</Text>
          </TouchableOpacity>
          {product && <View style={styles.badge}><Text style={styles.badgeText}>MERCH DROP</Text></View>}
        </View>

        {product ? (
          <View style={[styles.productLayout, isWide && styles.productLayoutWide]}>
            <View style={[styles.productImage, isWide && styles.productImageWide, isWide && { height: wideImageHeight }]}>
              <Image source={product.image} style={styles.productImageFile} resizeMode="contain" />
            </View>

            <View style={styles.productInfo}>
              <Text style={styles.category}>{product.category.toUpperCase()}</Text>
              <Text style={styles.title}>{product.name}</Text>
              <Text style={styles.description}>
                {product.description || 'Made for everyday comfort and school spirit. Bring a little USTP pride to wherever the day takes you.'}
              </Text>

              <View style={styles.priceRow}>
                <Text style={styles.price}>{product.price}</Text>
                <TouchableOpacity
                  style={styles.detailsLink}
                  onPress={() => setDetailsOpen(!detailsOpen)}
                  accessibilityRole="button"
                  accessibilityLabel={detailsOpen ? 'Hide product options' : 'Show product options'}
                >
                  <Text style={styles.detailsText}>{detailsOpen ? 'Hide options  <' : 'Details  >'}</Text>
                </TouchableOpacity>
              </View>

              {detailsOpen && (
                <View style={styles.detailsPanel}>
                  <View style={styles.colorRow}>
                    <View style={[styles.colorSwatch, { backgroundColor: product.color }]} />
                    <Text style={styles.colorName}>{product.colorName || 'Official Collection'}</Text>
                  </View>
                  {hasSizes && (
                    <View style={styles.sizeSection}>
                      <Text style={styles.sectionLabel}>Choose a size</Text>
                      <View style={styles.sizeRow}>
                        {sizes.map((size) => (
                          <TouchableOpacity
                            key={size}
                            onPress={() => setSelectedSize(size)}
                            style={[styles.sizeChip, selectedSize === size && styles.sizeChipSelected]}
                            accessibilityRole="button"
                            accessibilityState={{ selected: selectedSize === size }}
                          >
                            <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextSelected]}>{size}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View>
                  )}
                  <Text style={styles.sku}>MERCH-{String(product.id).padStart(3, '0')}</Text>
                </View>
              )}

              {isCustomer ? (
                <View style={styles.customerActions}>
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => {
                    if (hasSizes && !selectedSize) return;
                    const existing = store.cart.find((item) => item.id === product.id && item.size === selectedSize);
                    if (existing) existing.quantity = (existing.quantity || 1) + 1;
                    else store.cart.push({ ...product, size: selectedSize, quantity: 1 });
                    store.cartNotificationCount += 1;
                    router.push({ pathname: '/student/cart', params: { name: name || 'Student' } });
                    }}
                  >
                    <Text style={styles.addToCartText}>Add to cart</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.customerBuyNowButton}
                    onPress={() => {
                      if (hasSizes && !selectedSize) return;
                      router.push({ pathname: '/student/checkout', params: { name: name || 'Student', productId: String(product.id), size: selectedSize || '' } });
                    }}
                  >
                    <Text style={styles.customerBuyNowText}>Buy now</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.guestActions}>
                  <Link href="/access" asChild>
                    <TouchableOpacity style={styles.addToCartButton} accessibilityRole="button">
                      <Text style={styles.addToCartText}>ADD TO CART</Text>
                    </TouchableOpacity>
                  </Link>
                  <Link href="/access" asChild>
                    <TouchableOpacity style={styles.buyNowButton} accessibilityRole="button">
                      <Text style={styles.buyNowText}>BUY NOW</Text>
                    </TouchableOpacity>
                  </Link>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.notFound}>
            <Text style={styles.title}>Merch item not found</Text>
            <Text style={styles.description}>There is no product with ID {productId || 'unknown'}.</Text>
            <Link href="/" asChild>
              <TouchableOpacity style={styles.addToCartButton}>
                <Text style={styles.addToCartText}>Browse products</Text>
              </TouchableOpacity>
            </Link>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flexGrow: 1, paddingHorizontal: 38, paddingVertical: 28 },
  navigationRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: { alignSelf: 'flex-start', paddingVertical: 9, paddingRight: 12 },
  backButtonText: { color: '#29364A', fontSize: 14, fontWeight: '700' },
  badge: { backgroundColor: '#F1F0EC', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  badgeText: { color: '#273146', fontSize: 10, fontWeight: '700', letterSpacing: 0.3 },
  productLayout: { flexGrow: 1, backgroundColor: '#FFFFFF' },
  productLayoutWide: { flexDirection: 'row', alignItems: 'center', gap: 36, minHeight: 350 },
  productImage: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    height: 340,
    justifyContent: 'center',
    padding: 18,
    shadowColor: '#152238',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 7,
  },
  productImageWide: { flex: 1, minHeight: 0, padding: 28 },
  productImageFile: { width: '100%', height: '100%' },
  productInfo: { flex: 1, justifyContent: 'center', paddingVertical: 18 },
  category: { color: '#81858B', fontSize: 13, fontWeight: '700', letterSpacing: 1.1 },
  title: { color: '#18243A', fontSize: 32, fontWeight: '800', letterSpacing: -1.1, lineHeight: 39, marginTop: 8 },
  description: { color: '#59616C', fontSize: 14, lineHeight: 22, marginTop: 12, maxWidth: 680 },
  priceRow: { alignItems: 'center', flexDirection: 'row', gap: 20, marginTop: 20 },
  price: { color: '#18243A', fontSize: 19, fontWeight: '800' },
  detailsLink: { paddingHorizontal: 2, paddingVertical: 10 },
  detailsText: { color: '#526071', fontSize: 13, fontWeight: '700' },
  detailsPanel: { borderTopColor: '#ECEAE4', borderTopWidth: 1, marginTop: 18, paddingTop: 18 },
  colorRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 18 },
  colorSwatch: { borderColor: '#D9B45B', borderRadius: 999, borderWidth: 2, height: 22, marginRight: 9, width: 22 },
  colorName: { color: '#526579', fontSize: 14, fontWeight: '600' },
  sizeSection: { marginBottom: 18 },
  sectionLabel: { color: '#263246', fontSize: 14, fontWeight: '700', marginBottom: 9 },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeChip: { alignItems: 'center', backgroundColor: '#F8F7F2', borderColor: '#DDD8C9', borderRadius: 9, borderWidth: 1, minWidth: 44, paddingHorizontal: 12, paddingVertical: 9 },
  sizeChipSelected: { backgroundColor: '#E5BD55', borderColor: '#E5BD55' },
  sizeText: { color: '#263246', fontSize: 13, fontWeight: '700' },
  sizeTextSelected: { color: '#18243A' },
  sku: { color: '#777D86', fontSize: 11, fontWeight: '700', letterSpacing: 0.6, marginTop: 4 },
  guestActions: { gap: 12, marginTop: 28, maxWidth: 420 },
  customerActions: { marginTop: 0, maxWidth: 420 },
  addToCartButton: { alignItems: 'center', backgroundColor: '#1D273D', borderRadius: 999, marginTop: 28, maxWidth: 420, paddingVertical: 14 },
  addToCartText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  customerBuyNowButton: { alignItems: 'center', backgroundColor: '#D9B45B', borderRadius: 999, marginTop: 12, maxWidth: 420, paddingVertical: 14 },
  customerBuyNowText: { color: '#111111', fontSize: 14, fontWeight: '600' },
  buyNowButton: { alignItems: 'center', backgroundColor: '#D9B45B', borderRadius: 999, maxWidth: 420, paddingVertical: 14 },
  buyNowText: { color: '#111111', fontSize: 14, fontWeight: '600' },
  notFound: { flex: 1, justifyContent: 'center', paddingVertical: 50 },
});
