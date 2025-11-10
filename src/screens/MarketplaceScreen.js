import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../services/api';
import { useCustomAlert } from '../hooks/useCustomAlert';
import CustomAlert from '../components/ui/CustomAlert';

const { width } = Dimensions.get('window');

export default function MarketplaceScreen({ navigation }) {
  const { alertConfig, showAlert, hideAlert, showSuccess, showError } = useCustomAlert();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // API state
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    limit: 20,
    offset: 0,
    hasMore: true
  });

  // Load data on mount
  useEffect(() => {
    loadMarketplaceData();
  }, []);

  // Load marketplace data
  const loadMarketplaceData = async () => {
    try {
      setLoading(true);
      const [categoriesResponse, productsResponse] = await Promise.all([
        apiClient.getCategories(),
        apiClient.getProducts(pagination.limit, pagination.offset, null, searchQuery)
      ]);
      
      // Load categories
      if (categoriesResponse.categories) {
        const allCategory = { name: 'All', icon: 'grid', count: 0, slug: 'all' };
        const formattedCategories = [
          allCategory,
          ...categoriesResponse.categories.map(cat => ({
            name: cat.name,
            icon: cat.icon || 'folder',
            count: cat.product_count || 0,
            slug: cat.slug
          }))
        ];
        setCategories(formattedCategories);
      }
      
      // Load products
      if (productsResponse.products) {
        const formattedProducts = productsResponse.products.map(product => ({
          id: product.id,
          title: product.name,
          price: parseFloat(product.price),
          originalPrice: product.original_price ? parseFloat(product.original_price) : null,
          rating: product.rating_average || 4.0,
          reviews: product.rating_count || 0,
          seller: product.seller_name || 'TLB Diamond',
          supportBonus: product.support_bonus_percentage || 0,
          installments: product.max_installments || 1,
          image: product.image_url ? { uri: product.image_url } : require('../../assets/pic1.jpeg'),
          featured: product.is_featured || false,
          category: product.category_name || 'Other',
          description: product.description || '',
          features: product.features || [],
          specifications: product.specifications || {},
          inStock: product.stock_quantity > 0,
          stockCount: product.stock_quantity || 0,
          shippingInfo: 'Free shipping • Arrives in 2-3 business days',
          warranty: '1 Year Manufacturer Warranty',
          condition: product.condition || 'new',
          brand: product.brand || 'Unknown'
        }));
        setProducts(formattedProducts);
        
        // Update pagination
        setPagination(prev => ({
          ...prev,
          hasMore: formattedProducts.length === pagination.limit
        }));
      }
    } catch (error) {
      console.error('Failed to load marketplace data:', error);
      showError('Error', 'Failed to load marketplace data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    setSelectedProduct(product);
    setShowProductDetail(true);
  };

  const handleAddToCart = () => {
    Alert.alert(
      '🛒 Added to Cart',
      `${selectedProduct?.title} has been added to your cart!`,
      [{ text: 'Continue Shopping', onPress: () => setShowProductDetail(false) }]
    );
  };

  const handleBuyNow = () => {
    Alert.alert(
      '💎 Purchase Initiated',
      `Redirecting to payment for ${selectedProduct?.title}...`,
      [{ text: 'OK', onPress: () => setShowProductDetail(false) }]
    );
  };

  // Load more products (pagination)
  const loadMoreProducts = async () => {
    if (productsLoading || !pagination.hasMore) {
      return; // Don't load if already loading or no more products
    }

    try {
      setProductsLoading(true);
      const nextOffset = pagination.offset + pagination.limit;
      
      const response = await apiClient.getProducts(
        pagination.limit, 
        nextOffset, 
        selectedCategory === 'All' ? null : selectedCategory,
        searchQuery
      );
      
      if (response.products && response.products.length > 0) {
        const formattedNewProducts = response.products.map(product => ({
          id: product.id,
          title: product.name,
          price: parseFloat(product.price),
          originalPrice: product.original_price ? parseFloat(product.original_price) : null,
          rating: product.rating_average || 4.0,
          reviews: product.rating_count || 0,
          seller: product.seller_name || 'TLB Diamond',
          supportBonus: product.support_bonus_percentage || 0,
          installments: product.max_installments || 1,
          image: product.image_url ? { uri: product.image_url } : require('../../assets/pic1.jpeg'),
          featured: product.is_featured || false,
          category: product.category_name || 'Other',
          description: product.description || '',
          features: product.features || [],
          specifications: product.specifications || {},
          inStock: product.stock_quantity > 0,
          stockCount: product.stock_quantity || 0,
          shippingInfo: 'Free shipping • Arrives in 2-3 business days',
          warranty: '1 Year Manufacturer Warranty',
          condition: product.condition || 'new',
          brand: product.brand || 'Unknown'
        }));
        
        // Append new products to existing ones
        setProducts(prev => [...prev, ...formattedNewProducts]);
        
        // Update pagination
        setPagination(prev => ({
          ...prev,
          offset: nextOffset,
          hasMore: formattedNewProducts.length === pagination.limit
        }));
      } else {
        // No more products available
        setPagination(prev => ({ ...prev, hasMore: false }));
      }
    } catch (error) {
      console.error('Failed to load more products:', error);
      showError('Error', 'Failed to load more products. Please try again.');
    } finally {
      setProductsLoading(false);
    }
  };

  const handleLoadMore = () => {
    loadMoreProducts();
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={12} color="#F59E0B" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={12} color="#F59E0B" />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={12} color="#F59E0B" />);
    }
    
    return stars;
  };

  // Products are already filtered by the API
  const filteredProducts = products;

  return (
    <View style={styles.container}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8B4513" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#8B4513"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={20} color="#D4AF37" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>Loading marketplace...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoriesContainer}>
              {categories.map((category, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[
                    styles.categoryCard,
                    selectedCategory === category.name && styles.selectedCategoryCard
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Ionicons 
                    name={category.icon} 
                    size={24} 
                    color={selectedCategory === category.name ? '#FFFFFF' : '#D4AF37'} 
                  />
                  <Text style={[
                    styles.categoryName,
                    selectedCategory === category.name && styles.selectedCategoryName
                  ]}>
                    {category.name}
                  </Text>
                  <Text style={[
                    styles.categoryCount,
                    selectedCategory === category.name && styles.selectedCategoryCount
                  ]}>
                    {category.count}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🔥 Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Sort by ⏬</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.productsGrid}>
            {filteredProducts.map((product) => (
              <TouchableOpacity 
                key={product.id}
                style={styles.productCard}
                onPress={() => handleProductPress(product)}
              >
                {product.featured && (
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredText}>Featured</Text>
                  </View>
                )}
                
                <View style={styles.productImage}>
                  <Image 
                    source={product.image} 
                    style={styles.productImageStyle}
                    resizeMode="cover"
                  />
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={styles.productTitle} numberOfLines={2}>
                    {product.title}
                  </Text>
                  
                  <View style={styles.ratingContainer}>
                    <View style={styles.stars}>
                      {renderStars(product.rating)}
                    </View>
                    <Text style={styles.ratingText}>
                      {product.rating} ({product.reviews})
                    </Text>
                  </View>
                  
                  <Text style={styles.sellerText}>by {product.seller}</Text>
                  
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>💎 {product.price.toFixed(2)} TLB</Text>
                    {product.originalPrice && (
                      <Text style={styles.originalPrice}>
                        💎 {product.originalPrice.toFixed(2)}
                      </Text>
                    )}
                  </View>
                  
                  <View style={styles.features}>
                    <View style={styles.featureTag}>
                      <Text style={styles.featureText}>
                        🎁 {product.supportBonus}% Bonus
                      </Text>
                    </View>
                    <View style={styles.featureTag}>
                      <Text style={styles.featureText}>
                        💳 {product.installments} payments
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Load More */}
        <View style={styles.loadMoreContainer}>
          <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
            <Text style={styles.loadMoreText}>Load More Products</Text>
            <Ionicons name="chevron-down" size={16} color="#D4AF37" />
          </TouchableOpacity>
        </View>
      </ScrollView>
      )}

      {/* Product Detail Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showProductDetail}
        onRequestClose={() => setShowProductDetail(false)}
        statusBarTranslucent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Product Details</Text>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => setShowProductDetail(false)}
              >
                <Ionicons name="close" size={24} color="#8B4513" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {selectedProduct && (
                <>
                  {/* Product Image */}
                  <View style={styles.detailImageContainer}>
                    <Image 
                      source={selectedProduct.image} 
                      style={styles.detailImage}
                      resizeMode="cover"
                    />
                    {selectedProduct.featured && (
                      <View style={styles.detailFeaturedBadge}>
                        <Text style={styles.detailFeaturedText}>Featured</Text>
                      </View>
                    )}
                  </View>

                  {/* Product Info */}
                  <View style={styles.detailProductInfo}>
                    <Text style={styles.detailTitle}>{selectedProduct.title}</Text>
                    <Text style={styles.detailSeller}>by {selectedProduct.seller}</Text>
                    
                    {/* Rating */}
                    <View style={styles.detailRatingContainer}>
                      <View style={styles.detailStars}>
                        {renderStars(selectedProduct.rating)}
                      </View>
                      <Text style={styles.detailRatingText}>
                        {selectedProduct.rating} ({selectedProduct.reviews} reviews)
                      </Text>
                    </View>

                    {/* Price */}
                    <View style={styles.detailPriceContainer}>
                      <Text style={styles.detailPrice}>💎 {selectedProduct.price.toFixed(2)} TLB</Text>
                      {selectedProduct.originalPrice && (
                        <Text style={styles.detailOriginalPrice}>
                          💎 {selectedProduct.originalPrice.toFixed(2)}
                        </Text>
                      )}
                    </View>

                    {/* Features */}
                    <View style={styles.detailFeatures}>
                      <View style={styles.detailFeatureTag}>
                        <Ionicons name="gift" size={16} color="#10B981" />
                        <Text style={styles.detailFeatureText}>
                          {selectedProduct.supportBonus}% Support Bonus
                        </Text>
                      </View>
                      <View style={styles.detailFeatureTag}>
                        <Ionicons name="card" size={16} color="#3B82F6" />
                        <Text style={styles.detailFeatureText}>
                          {selectedProduct.installments} Payment Plan
                        </Text>
                      </View>
                    </View>

                    {/* Stock Status */}
                    <View style={styles.stockContainer}>
                      <View style={[styles.stockIndicator, selectedProduct.inStock ? styles.inStock : styles.outOfStock]}>
                        <Ionicons 
                          name={selectedProduct.inStock ? "checkmark-circle" : "close-circle"} 
                          size={16} 
                          color={selectedProduct.inStock ? "#10B981" : "#EF4444"} 
                        />
                        <Text style={[styles.stockText, selectedProduct.inStock ? styles.inStockText : styles.outOfStockText]}>
                          {selectedProduct.inStock ? `In Stock (${selectedProduct.stockCount} available)` : 'Out of Stock'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Description */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Description</Text>
                    <Text style={styles.detailDescription}>{selectedProduct.description}</Text>
                  </View>

                  {/* Features List */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Key Features</Text>
                    {selectedProduct.features?.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Ionicons name="checkmark" size={16} color="#10B981" />
                        <Text style={styles.featureItemText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Specifications */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Specifications</Text>
                    <View style={styles.specificationsContainer}>
                      {selectedProduct.specifications && Object.entries(selectedProduct.specifications).map(([key, value]) => (
                        <View key={key} style={styles.specificationRow}>
                          <Text style={styles.specificationKey}>{key}:</Text>
                          <Text style={styles.specificationValue}>{value}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Shipping & Warranty */}
                  <View style={styles.detailSection}>
                    <Text style={styles.detailSectionTitle}>Shipping & Warranty</Text>
                    <View style={styles.shippingInfo}>
                      <View style={styles.shippingItem}>
                        <Ionicons name="airplane" size={16} color="#3B82F6" />
                        <Text style={styles.shippingText}>{selectedProduct.shippingInfo}</Text>
                      </View>
                      <View style={styles.shippingItem}>
                        <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                        <Text style={styles.shippingText}>{selectedProduct.warranty}</Text>
                      </View>
                    </View>
                  </View>
                </>
              )}
            </ScrollView>

            {/* Action Buttons */}
            <View style={styles.detailActions}>
              <TouchableOpacity 
                style={styles.addToCartButton}
                onPress={handleAddToCart}
                disabled={!selectedProduct?.inStock}
              >
                <Ionicons name="cart" size={20} color="#FFFFFF" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.buyNowButton, !selectedProduct?.inStock && styles.disabledButton]}
                onPress={handleBuyNow}
                disabled={!selectedProduct?.inStock}
              >
                <Ionicons name="diamond" size={20} color="#FFFFFF" />
                <Text style={styles.buyNowText}>Buy Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Custom Alert */}
      <CustomAlert
        visible={alertConfig.visible}
        onClose={hideAlert}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        type={alertConfig.type}
        icon={alertConfig.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E7',
  },
  searchHeader: {
    flexDirection: 'row',
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#2C1810',
  },
  filterButton: {
    backgroundColor: '#F5E6A3',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C1810',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#D4AF37',
    fontSize: 14,
    fontWeight: '600',
  },
  categoriesContainer: {
    flexDirection: 'row',
  },
  categoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  selectedCategoryCard: {
    backgroundColor: '#D4AF37',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C1810',
    marginTop: 5,
  },
  selectedCategoryName: {
    color: '#FFFFFF',
  },
  categoryCount: {
    fontSize: 10,
    color: '#8B4513',
    marginTop: 2,
  },
  selectedCategoryCount: {
    color: '#FFFFFF',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: (width - 50) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#D4AF37',
    position: 'relative',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#EF4444',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 1,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: 'bold',
  },
  productImage: {
    height: 80,
    backgroundColor: '#F5E6A3',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    overflow: 'hidden',
  },
  productImageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C1810',
    marginBottom: 5,
    lineHeight: 18,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  stars: {
    flexDirection: 'row',
    marginRight: 5,
  },
  ratingText: {
    fontSize: 10,
    color: '#8B4513',
  },
  sellerText: {
    fontSize: 10,
    color: '#8B4513',
    marginBottom: 8,
  },
  priceContainer: {
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D4AF37',
  },
  originalPrice: {
    fontSize: 12,
    color: '#8B4513',
    textDecorationLine: 'line-through',
  },
  features: {
    gap: 3,
  },
  featureTag: {
    backgroundColor: '#F5E6A3',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  featureText: {
    fontSize: 9,
    color: '#8B4513',
    fontWeight: '500',
  },
  loadMoreContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5E6A3',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#D4AF37',
  },
  loadMoreText: {
    color: '#2C1810',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },

  // Product Detail Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
    maxHeight: '90%',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#D4AF37',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#F5E6A3',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.3)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C1810',
    letterSpacing: 0.5,
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(212, 175, 55, 0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  detailImageContainer: {
    height: 200,
    backgroundColor: '#F5E6A3',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  detailFeaturedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  detailFeaturedText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailProductInfo: {
    marginBottom: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 6,
    lineHeight: 30,
  },
  detailSeller: {
    fontSize: 16,
    color: '#8B4513',
    marginBottom: 12,
  },
  detailRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailStars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  detailRatingText: {
    fontSize: 14,
    color: '#8B4513',
  },
  detailPriceContainer: {
    marginBottom: 16,
  },
  detailPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D4AF37',
    marginBottom: 4,
  },
  detailOriginalPrice: {
    fontSize: 18,
    color: '#8B4513',
    textDecorationLine: 'line-through',
  },
  detailFeatures: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  detailFeatureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  detailFeatureText: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '600',
    marginLeft: 6,
  },
  stockContainer: {
    marginBottom: 20,
  },
  stockIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  inStock: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  outOfStock: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  stockText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  inStockText: {
    color: '#065F46',
  },
  outOfStockText: {
    color: '#991B1B',
  },
  detailSection: {
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2C1810',
    marginBottom: 12,
  },
  detailDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureItemText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 8,
  },
  specificationsContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  specificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  specificationKey: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  specificationValue: {
    fontSize: 15,
    color: '#2C1810',
    fontWeight: '600',
  },
  shippingInfo: {
    gap: 12,
  },
  shippingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  shippingText: {
    fontSize: 15,
    color: '#4B5563',
    marginLeft: 8,
    fontWeight: '500',
  },
  detailActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.6)',
    backgroundColor: '#FAFAFA',
  },
  addToCartButton: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    shadowColor: 'rgba(0, 0, 0, 0.05)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  addToCartText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  buyNowButton: {
    flex: 1.5,
    backgroundColor: '#D4AF37',
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#B8860B',
    shadowColor: 'rgba(212, 175, 55, 0.4)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  buyNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.4,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    borderColor: '#6B7280',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8B4513',
    fontWeight: '500',
  },
  loadMoreButton: {
    backgroundColor: '#D4AF37',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#B8860B',
  },
  loadMoreText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});