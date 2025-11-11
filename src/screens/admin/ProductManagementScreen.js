import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Modal,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import sharedDataService from '../../services/sharedDataService';
import AdminAlert from '../../components/admin/AdminAlert';
import { useAdminAlert } from '../../hooks/useAdminAlert';

export default function ProductManagementScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const { alertConfig, hideAlert, showSuccess, showError, showDestructiveConfirm } = useAdminAlert();

  // New product form state
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'diamond',
    stock_quantity: '',
    image_url: ''
  });

  const categories = ['all', 'diamond', 'gold', 'jewelry', 'accessories', 'special'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Load products from shared data service to ensure consistency
      const sharedProducts = await sharedDataService.getProducts();
      setProducts(sharedProducts);
      console.log(`Loaded ${sharedProducts.length} products from shared data service`);
    } catch (error) {
      console.error('Error loading products:', error);
      showError('Error', 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleProductAction = (action, product) => {
    setSelectedProduct(product);
    
    switch (action) {
      case 'view':
        setShowProductDetails(true);
        break;
      case 'edit':
        setNewProduct({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          stock_quantity: product.stock_quantity.toString(),
          image_url: product.image_url
        });
        setShowAddProduct(true);
        break;
      case 'toggle_status':
        toggleProductStatus(product.id, product.status);
        break;
      case 'delete':
        showDestructiveConfirm(
          'Delete Product',
          `Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`,
          () => deleteProduct(product.id),
          null,
          'Delete'
        );
        break;
      case 'restock':
        Alert.prompt(
          'Restock Product',
          `Enter the quantity to add to ${product.name}:`,
          (text) => {
            const quantity = parseInt(text);
            if (!isNaN(quantity) && quantity > 0) {
              restockProduct(product.id, quantity);
            }
          },
          'plain-text',
          '',
          'numeric'
        );
        break;
    }
  };

  const toggleProductStatus = async (productId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await sharedDataService.updateProduct(productId, { status: newStatus });
      
      // Reload products to ensure consistency
      const updatedProducts = await sharedDataService.getProducts();
      setProducts(updatedProducts);
      
      showSuccess('Success', 'Product status updated successfully.');
    } catch (error) {
      showError('Error', 'Failed to update product status. Please try again.');
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await sharedDataService.deleteProduct(productId);
      
      // Reload products to ensure consistency
      const updatedProducts = await sharedDataService.getProducts();
      setProducts(updatedProducts);
      
      showSuccess('Success', 'Product has been deleted successfully.');
    } catch (error) {
      showError('Error', 'Failed to delete product. Please try again.');
    }
  };

  const restockProduct = async (productId, quantity) => {
    try {
      const currentProduct = products.find(p => p.id === productId);
      await sharedDataService.updateProduct(productId, { 
        stock_quantity: currentProduct.stock_quantity + quantity,
        status: 'active'
      });
      
      // Reload products to ensure consistency
      const updatedProducts = await sharedDataService.getProducts();
      setProducts(updatedProducts);
      
      showSuccess('Success', `Product restocked with ${quantity} items.`);
    } catch (error) {
      showError('Error', 'Failed to restock product. Please try again.');
    }
  };

  const saveProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.price || !newProduct.stock_quantity) {
        showError('Error', 'Please fill in all required fields.');
        return;
      }

      const productData = {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock_quantity: parseInt(newProduct.stock_quantity)
      };

      if (selectedProduct) {
        // Update existing product
        await sharedDataService.updateProduct(selectedProduct.id, productData);
        showSuccess('Success', 'Product updated successfully.');
      } else {
        // Add new product
        await sharedDataService.addProduct(productData);
        showSuccess('Success', 'Product added successfully.');
      }

      // Reload products to ensure consistency
      const updatedProducts = await sharedDataService.getProducts();
      setProducts(updatedProducts);

      setShowAddProduct(false);
      setSelectedProduct(null);
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: 'diamond',
        stock_quantity: '',
        image_url: ''
      });
    } catch (error) {
      showError('Error', 'Failed to save product. Please try again.');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStatusColor = (status, stockQuantity) => {
    if (stockQuantity === 0) return '#EF4444';
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#6B7280';
      default: return '#F59E0B';
    }
  };

  const getStatusText = (status, stockQuantity) => {
    if (stockQuantity === 0) return 'Out of Stock';
    switch (status) {
      case 'active': return 'Active';
      case 'inactive': return 'Inactive';
      default: return 'Unknown';
    }
  };

  const ProductCard = ({ product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleProductAction('view', product)}
      activeOpacity={0.8}
    >
      <View style={styles.productHeader}>
        <Image source={{ uri: product.image_url }} style={styles.productImage} />
        
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
          <Text style={styles.productCategory}>{product.category.toUpperCase()}</Text>
          
          <View style={styles.productMeta}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(product.status, product.stock_quantity) + '20' }]}>
              <Text style={[styles.statusText, { color: getStatusColor(product.status, product.stock_quantity) }]}>
                {getStatusText(product.status, product.stock_quantity)}
              </Text>
            </View>
            <Text style={styles.stockText}>Stock: {product.stock_quantity}</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.productActions}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleProductAction('view', product)}
        >
          <Ionicons name="eye" size={18} color="#D4AF37" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => handleProductAction('edit', product)}
        >
          <Ionicons name="create" size={18} color="#3B82F6" />
        </TouchableOpacity>
        
        {product.stock_quantity === 0 && (
          <TouchableOpacity 
            style={[styles.actionButton, styles.restockButton]}
            onPress={() => handleProductAction('restock', product)}
          >
            <Ionicons name="add-circle" size={18} color="#10B981" />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, product.status === 'active' ? styles.deactivateButton : styles.activateButton]}
          onPress={() => handleProductAction('toggle_status', product)}
        >
          <Ionicons name={product.status === 'active' ? 'pause-circle' : 'play-circle'} size={18} color={product.status === 'active' ? '#F59E0B' : '#10B981'} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleProductAction('delete', product)}
        >
          <Ionicons name="trash" size={18} color="#EF4444" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productFooter}>
        <View style={styles.productStat}>
          <Ionicons name="bag" size={14} color="#9CA3AF" />
          <Text style={styles.statText}>{product.sales_count} sold</Text>
        </View>
        <View style={styles.productStat}>
          <Ionicons name="time" size={14} color="#9CA3AF" />
          <Text style={styles.statText}>Added {new Date(product.created_at).toLocaleDateString()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const CategoryButton = ({ category, label, active }) => (
    <TouchableOpacity
      style={[styles.categoryButton, active && styles.activeCategoryButton]}
      onPress={() => setFilterCategory(category)}
    >
      <Text style={[styles.categoryButtonText, active && styles.activeCategoryButtonText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D4AF37" />
        <Text style={styles.loadingText}>Loading products...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryContainer}
        >
          <CategoryButton category="all" label="All" active={filterCategory === 'all'} />
          <CategoryButton category="diamond" label="Diamond" active={filterCategory === 'diamond'} />
          <CategoryButton category="gold" label="Gold" active={filterCategory === 'gold'} />
          <CategoryButton category="jewelry" label="Jewelry" active={filterCategory === 'jewelry'} />
          <CategoryButton category="accessories" label="Accessories" active={filterCategory === 'accessories'} />
          <CategoryButton category="special" label="Special" active={filterCategory === 'special'} />
        </ScrollView>
        
        {/* Add Product Button */}
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddProduct(true)}>
          <Ionicons name="add" size={24} color="#1a1a1a" />
          <Text style={styles.addButtonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ProductCard product={item} />}
        style={styles.productList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="cube-outline" size={64} color="#6B7280" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery ? 'Try adjusting your search criteria' : 'Add your first product to get started'}
            </Text>
          </View>
        )}
      />

      {/* Product Details Modal */}
      <Modal
        visible={showProductDetails}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        {selectedProduct && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Product Details</Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => {
                  console.log('Product details modal close button pressed');
                  setShowProductDetails(false);
                  setSelectedProduct(null);
                }}
                activeOpacity={0.7}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#D4AF37" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <Image source={{ uri: selectedProduct.image_url }} style={styles.modalProductImage} />
              
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Product Information</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.name}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Price:</Text>
                  <Text style={styles.detailValue}>{formatPrice(selectedProduct.price)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Category:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.category}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Stock:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.stock_quantity}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <Text style={[styles.detailValue, { color: getStatusColor(selectedProduct.status, selectedProduct.stock_quantity) }]}>
                    {getStatusText(selectedProduct.status, selectedProduct.stock_quantity)}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Sales:</Text>
                  <Text style={styles.detailValue}>{selectedProduct.sales_count} sold</Text>
                </View>
              </View>
              
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Description</Text>
                <Text style={styles.descriptionText}>{selectedProduct.description}</Text>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>

      {/* Add/Edit Product Modal */}
      <Modal
        visible={showAddProduct}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{selectedProduct ? 'Edit Product' : 'Add New Product'}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => {
                console.log('Add product modal close button pressed');
                setShowAddProduct(false);
                setSelectedProduct(null);
                setNewProduct({
                  name: '',
                  description: '',
                  price: '',
                  category: 'diamond',
                  stock_quantity: '',
                  image_url: ''
                });
              }}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close" size={24} color="#D4AF37" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Product Details</Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Product Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newProduct.name}
                  onChangeText={(text) => setNewProduct(prev => ({ ...prev, name: text }))}
                  placeholder="Enter product name"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Price *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newProduct.price}
                  onChangeText={(text) => setNewProduct(prev => ({ ...prev, price: text }))}
                  placeholder="0.00"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Category</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categorySelector}>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categorySelectButton,
                        newProduct.category === category && styles.selectedCategoryButton
                      ]}
                      onPress={() => setNewProduct(prev => ({ ...prev, category }))}
                    >
                      <Text style={[
                        styles.categorySelectText,
                        newProduct.category === category && styles.selectedCategoryText
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Stock Quantity *</Text>
                <TextInput
                  style={styles.textInput}
                  value={newProduct.stock_quantity}
                  onChangeText={(text) => setNewProduct(prev => ({ ...prev, stock_quantity: text }))}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Image URL</Text>
                <TextInput
                  style={styles.textInput}
                  value={newProduct.image_url}
                  onChangeText={(text) => setNewProduct(prev => ({ ...prev, image_url: text }))}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={newProduct.description}
                  onChangeText={(text) => setNewProduct(prev => ({ ...prev, description: text }))}
                  placeholder="Enter product description"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
            
            <TouchableOpacity style={styles.saveButton} onPress={saveProduct}>
              <Text style={styles.saveButtonText}>{selectedProduct ? 'Update Product' : 'Add Product'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* Admin Alert */}
      <AdminAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onClose={hideAlert}
        icon={alertConfig.icon}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#9CA3AF',
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    backgroundColor: '#2d2d2d',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3d3d3d',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
    marginLeft: 8,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: '#3d3d3d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: '#D4AF37',
  },
  categoryButtonText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: '#1a1a1a',
  },
  addButton: {
    backgroundColor: '#D4AF37',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  productList: {
    flex: 1,
    padding: 16,
  },
  productCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#3d3d3d',
  },
  productHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#3d3d3d',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    color: '#D4AF37',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productCategory: {
    color: '#9CA3AF',
    fontSize: 12,
    marginBottom: 8,
  },
  productMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  stockText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  productActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  restockButton: {
    backgroundColor: '#10B981' + '20',
  },
  activateButton: {
    backgroundColor: '#10B981' + '20',
  },
  deactivateButton: {
    backgroundColor: '#F59E0B' + '20',
  },
  deleteButton: {
    backgroundColor: '#EF4444' + '20',
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3d3d3d',
  },
  productStat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#9CA3AF',
    fontSize: 12,
    marginLeft: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalProductImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#3d3d3d',
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#D4AF37',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3d3d3d',
  },
  detailLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'right',
    flex: 1,
    marginLeft: 16,
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#3d3d3d',
    color: '#FFFFFF',
    fontSize: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4d4d4d',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categorySelector: {
    flexDirection: 'row',
  },
  categorySelectButton: {
    backgroundColor: '#3d3d3d',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#D4AF37',
  },
  categorySelectText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  selectedCategoryText: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#D4AF37',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
});