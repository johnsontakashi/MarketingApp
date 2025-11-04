import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Image,
  StyleSheet,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MarketplaceScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { name: 'All', icon: 'grid', count: 150 },
    { name: 'Electronics', icon: 'phone-portrait', count: 45 },
    { name: 'Fashion', icon: 'shirt', count: 38 },
    { name: 'Home', icon: 'home', count: 29 },
    { name: 'Sports', icon: 'football', count: 22 },
    { name: 'Books', icon: 'book', count: 16 },
  ];

  const products = [
    {
      id: 1,
      title: 'Premium Wireless Headphones',
      price: 200.00,
      originalPrice: 250.00,
      rating: 4.8,
      reviews: 127,
      seller: 'TechStore',
      supportBonus: 50,
      installments: 4,
      image: require('../../assets/pic1.jpeg'),
      featured: true
    },
    {
      id: 2,
      title: 'Smart Fitness Watch',
      price: 150.00,
      rating: 4.6,
      reviews: 89,
      seller: 'FitGear',
      supportBonus: 50,
      installments: 3,
      image: require('../../assets/pic2.jpeg'),
      featured: false
    },
    {
      id: 3,
      title: 'Gaming Mouse Pro',
      price: 75.00,
      rating: 4.9,
      reviews: 203,
      seller: 'GameHub',
      supportBonus: 40,
      installments: 2,
      image: require('../../assets/pic3.jpeg'),
      featured: true
    },
    {
      id: 4,
      title: 'Bluetooth Speaker',
      price: 85.00,
      rating: 4.5,
      reviews: 156,
      seller: 'AudioMax',
      supportBonus: 45,
      installments: 2,
      image: require('../../assets/pic4.jpeg'),
      featured: false
    }
  ];

  const handleProductPress = (product) => {
    // Navigate to product detail screen
    console.log('Product pressed:', product.title);
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
            {products.map((product) => (
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
          <TouchableOpacity style={styles.loadMoreButton}>
            <Text style={styles.loadMoreText}>Load More Products</Text>
            <Ionicons name="chevron-down" size={16} color="#D4AF37" />
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});