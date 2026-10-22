import { Link } from 'expo-router';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DarkRadialBackground from '../components/DarkRadialBackground';
import { products } from '../data/products';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <DarkRadialBackground />
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
           
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Login</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.heroCard}>
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
            <Link
              key={product.id}
              href={{ pathname: '/details/[id]', params: { id: product.id } }}
              asChild
            >
              <TouchableOpacity
                style={styles.productCard}
                accessibilityRole="button"
                accessibilityLabel={`View ${product.name}, ${product.price}`}
              >
                <View
                  style={[
                    styles.productImage,
                    { backgroundColor: product.color },
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
                  <View style={styles.productTag}>
                    <Text style={styles.productTagText}>MERCH DROP</Text>
                  </View>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productCategory}>{product.category}</Text>
                  <Text style={styles.productName} numberOfLines={2}>
                    {product.name}
                  </Text>
                  <View style={styles.productFooter}>
                    <Text style={styles.productPrice}>{product.price}</Text>
                    <View style={styles.addButton}>
                      <Text style={styles.addButtonText}>›</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          ))}
        </View>

        <Link href="/signup" asChild>
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
    backgroundColor: '#061525',
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
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.8,
  },
  eyebrow: {
    color: '#D9B45B',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.4,
    marginTop: 3,
  },
  headerButton: {
    backgroundColor: '#D9B45B',
    borderColor: '#E7C875',
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  headerButtonText: {
    color: '#0B1F33',
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
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  sectionSubtitle: {
    color: '#C4D0DC',
    fontSize: 12,
    marginTop: 3,
  },
  itemCount: {
    color: '#D9B45B',
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
    backgroundColor: '#FFFFFF',
    borderColor: '#D9B45B',
    borderRadius: 18,
    borderWidth: 1,
    overflow: 'hidden',
    width: '48%',
    shadowColor: '#0B1F33',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 7,
  },
  productImage: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 145,
    overflow: 'hidden',
    position: 'relative',
  },
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
    width: '80%',
    height: '80%',
    position: 'absolute',
  },
  productTag: {
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderRadius: 999,
    bottom: 9,
    left: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: 'absolute',
  },
  productTagText: {
    color: '#0B1F33',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  productInfo: {
    padding: 11,
  },
  productCategory: {
    color: '#526579',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  productName: {
    color: '#0B1F33',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 18,
    marginTop: 5,
    minHeight: 36,
  },
  productFooter: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  productPrice: {
    color: '#0B1F33',
    fontSize: 17,
    fontWeight: '800',
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: '#D9B45B',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  addButtonText: {
    color: '#0B1F33',
    fontSize: 22,
    fontWeight: '600',
    lineHeight: 25,
  },
  signupLink: {
    alignSelf: 'center',
    padding: 14,
    marginTop: 12,
  },
  signupLinkText: {
    color: '#D9B45B',
    fontSize: 13,
    fontWeight: '700',
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
