import { Link } from 'expo-router';
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
import { products } from '../data/products';

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const compact = width < 600;
  const wideHero = width >= 760;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.brandRow}>
            <Image
              source={require('../../assets/products/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.brand}>USTP Wear</Text>
              <Text style={styles.eyebrow}>OFFICIAL COLLECTION</Text>
            </View>
          </View>
           
          <Link href="/access" asChild>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.heroCard}>
          {wideHero && (
            <Image
              source={require('../../assets/products/center.jpg')}
              style={styles.heroImage}
              resizeMode="cover"
              accessibilityLabel="USTP Display Center"
            />
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Fresh arrivals</Text>
          </View>
          <Text style={styles.heroTitle}>Wear your pride, love what you represent.</Text>
          <Text style={styles.heroSubtitle}>
            Apparel & accessories made for our school family.
          </Text>
        </View>

        <View style={styles.sectionHeading}>
          <View>
          <Text style={styles.sectionTitle}>The merch drop</Text>
            <Text style={styles.sectionSubtitle}>
              Fresh favorites, made to wear
            </Text>
          </View>
          <Text style={styles.itemCount}>{products.length} items</Text>
        </View>

        <View style={styles.productList}>
          {products.map((product) => (
            <View key={product.id} style={[styles.productCard, compact && styles.productCardCompact]}>
              <Link
                href={{ pathname: '/details/[id]', params: { id: product.id } }}
                asChild
              >
              <TouchableOpacity
                style={styles.productImageLink}
                accessibilityRole="button"
                accessibilityLabel={`View ${product.name}, ${product.price}`}
              >
                <View
                  style={[
                    styles.productImage,
                    compact && styles.productImageCompact,
                    { backgroundColor: '#F8F7F3' },
                  ]}
                >
                  <View style={styles.artGlow} />
                  <View style={styles.productShadow} />
                  <View style={styles.productStage} />
                  <Image
                    source={product.image}
                    style={styles.productImageFile}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.productInfo}>
                  <View style={styles.productTag}>
                    <Text style={styles.productTagText}>MERCH DROP</Text>
                  </View>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <Text style={styles.productDescription} numberOfLines={2}>
                    {product.description}
                  </Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{product.price}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              </Link>
              <View style={styles.productActions}>
                <Link href={{ pathname: '/access', params: { mode: 'signup' } }} asChild>
                  <TouchableOpacity style={styles.addCartButton} accessibilityRole="button" accessibilityLabel={`Add ${product.name} to cart`}>
                    <Text style={styles.addCartText}>Add to cart</Text>
                  </TouchableOpacity>
                </Link>
                <Link href={{ pathname: '/access', params: { mode: 'signup' } }} asChild>
                  <TouchableOpacity style={styles.buyNowButton} accessibilityRole="button" accessibilityLabel={`Buy ${product.name} now`}>
                    <Text style={styles.buyNowText}>Buy now</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          ))}
        </View>

        <Link href={{ pathname: "/access", params: { mode: "signup" } }} asChild>
          <TouchableOpacity style={styles.signupLink}>
            <Text style={styles.signupLinkText}>Create an account</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F6F2',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 22,
  },
  brand: {
    color: '#173B5B',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  eyebrow: {
    color: '#647386',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: 3,
  },
  headerButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#DCE2E7',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  headerButtonText: {
    color: '#173B5B',
    fontSize: 13,
    fontWeight: '700',
  },
  heroCard: {
    backgroundColor: '#183653',
    borderRadius: 28,
    justifyContent: 'center',
    minHeight: 180,
    padding: 24,
    marginBottom: 22,
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    left: 0,
    top: -332,
    width: '100%',
    aspectRatio: 1.75,
    opacity: 0.52,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#D9B45B',
    borderRadius: 999,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: '#0B1F33',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  heroTitle: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  heroSubtitle: {
    color: '#E2E8F0',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  sectionTitle: {
    color: '#173B5B',
    fontSize: 22,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#647386',
    fontSize: 12,
    marginTop: 3,
  },
  itemCount: {
    color: '#173B5B',
    fontSize: 12,
    fontWeight: '600',
  },
  productList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },
  productCard: {
    flexDirection: 'row',
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderColor: '#D9B45B',
    borderRadius: 16,
    borderWidth: 2,
    overflow: 'hidden',
    width: '48%',
    minHeight: 310,
    shadowColor: '#0B1F33',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 7,
  },
  productCardCompact: { width: '100%', minHeight: 170
   },
  productImageLink: { flex: 1, flexDirection: 'row' },
  productImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: '100%',
    minHeight: 310,
    backgroundColor: '#F2F1ED',
    overflow: 'hidden',
    position: 'relative',
  },
  productImageCompact: { minHeight: 190 },
  artGlow: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 90,
    height: 180,
    position: 'absolute',
    right: -48,
    top: -94,
    width: 180,
  },
  productShadow: {
    backgroundColor: 'rgba(3,13,24,0.35)',
    borderRadius: 60,
    bottom: 22,
    height: 17,
    position: 'absolute',
    width: 82,
  },
  productStage: {
    backgroundColor: 'rgba(255,255,255,0.11)',
    borderColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    borderWidth: 1,
    bottom: 22,
    height: 11,
    position: 'absolute',
    width: 94,
  },
  productImageFile: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  productTag: {
    backgroundColor: '#F1F0EC',
    borderRadius: 999,
    alignSelf: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  productTagText: {
    color: '#0B1F33',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 14,
    paddingBottom: 88,
  },
  productCategory: {
    color: '#526579',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  productName: {
    color: '#0B1F33',
    fontSize: 23,
    fontWeight: '800',
    lineHeight: 27,
    marginTop: 5,
    minHeight: 0,
  },
  productDescription: { color: '#303640', fontSize: 10, fontStyle: 'italic', lineHeight: 13, marginTop: 8 },
  productFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
    paddingTop: 0,
  },
  productPrice: {
    color: '#0B1F33',
    fontSize: 22,
    fontWeight: '800',
  },
  productActions: { position: 'absolute', right: 10, bottom: 8, left: '53%', flexDirection: 'column', gap: 6 },
  addCartButton: { alignItems: 'center', backgroundColor: '#1D273D', borderRadius: 999, paddingVertical: 9 },
  buyNowButton: { alignItems: 'center', backgroundColor: '#D9B45B', borderRadius: 999, paddingVertical: 9 },
  addCartText: { color: '#FFFFFF', fontSize: 12, fontWeight: '800' },
  buyNowText: { color: '#0B1F33', fontSize: 12, fontWeight: '800' },
  signupLink: { alignItems: 'center', backgroundColor: '#D9B45B', borderRadius: 14, paddingVertical: 16, marginTop: 20, marginBottom: 12 },
  signupLinkText: {
    color: '#0B1F33',
    fontSize: 15,
    fontWeight: '800',
  },
   
  brandRow: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10, 
  },

  logo: {
  width: 50,
  height: 50,
  },
});
