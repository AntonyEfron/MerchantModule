// components/ProductPage/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { Package, Tag, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProductsByMerchantId, uploadImage, saveProductDetails } from '../../api/products';
import ProductItem from './ProductItem';
import './styles/ProductPage.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);

  // console.log(products,'productsproductsproducts');
  

  // Fetch products for merchant
  useEffect(() => {
    const merchantData = localStorage.getItem('merchant');
    if (!merchantData) {
      console.error('No merchant data found in localStorage');
      setLoading(false);
      return;
    }
    const merchant = JSON.parse(merchantData);
    const loadProducts = async () => {
      try {
        const data = await fetchProductsByMerchantId(merchant.id);
        // console.log(merchant.id, 'merchant.idmerchant.idmerchant.id');
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ✅ saveProductChanges function
  const saveProductChanges = async (product, tempProductData) => {
    try {
      const changedData = {};

      if (tempProductData.name !== undefined && tempProductData.name !== product.name) {
        changedData.name = tempProductData.name;
      }
      if (tempProductData.description !== undefined && tempProductData.description !== product.description) {
        changedData.description = tempProductData.description;
      }

      if (Object.keys(changedData).length > 0) {
        // Use the correct product ID (either _id or id)
        const productId = product._id || product.id;
        const updatedProduct = await saveProductDetails(productId, changedData);
        updateProducts(updatedProduct.product);
        return { success: true, updatedProduct };
      }

      return { success: true, updatedProduct: product };
    } catch (error) {
      console.error('Error saving product changes:', error);
      throw error;
    }
  };

  const handleImageUpload = async (file, productId, variantIndex) => {
    console.log(file,'filefilefile');
    
    try {
      const uploadedImageResponse = await uploadImage(file, productId, variantIndex);
      setProducts(prevProducts =>
        prevProducts.map(p => {
          const pId = p._id || p.id;
          return pId === productId
            ? {
                ...p,
                variants: p.variants.map((v, i) =>
                  i === variantIndex ? { ...v, images: uploadedImageResponse.images } : v
                ),
              }
            : p;
        })
      );
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed. Please try again.");
    }
  };

  const handleRemoveImage = (productId, variantIndex, imageIndex) => {
    setProducts(prevProducts =>
      prevProducts.map(product => {
        const pId = product._id || product.id;
        return pId === productId
          ? {
              ...product,
              variants: product.variants.map((variant, idx) =>
                idx === variantIndex
                  ? {
                      ...variant,
                      images: variant.images.filter((_, i) => i !== imageIndex)
                    }
                  : variant
              )
            }
          : product;
      })
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prevProducts => 
      prevProducts.filter(product => {
        const pId = product._id || product.id;
        return pId !== productId;
      })
    );
  };

  // ✅ CORRECTED: Fixed updateProducts function
  const updateProducts = (updatedProduct) => {
    // console.log('Updating product:', updatedProduct);
    
    setProducts(prevProducts =>
      prevProducts.map(p => {
        // Handle both _id and id formats
        const productId = p._id || p.id;
        const updatedId = updatedProduct._id || updatedProduct.id;
        
        if (productId === updatedId) {
          // console.log('Replacing product:', p, 'with:', updatedProduct);
          return updatedProduct; // Return the updated product directly
        }
        return p;
      })
    );
  };

  const getTotalStock = (variants) => {
    return variants.reduce((total, variant) =>
      total + variant.sizes.reduce((variantTotal, size) => variantTotal + size.stock, 0), 0
    );
  };


  // Filter products based on search term
const filteredProducts = products.filter(product =>
  product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  (product.brand?.toLowerCase?.() || product.brandId?.name?.toLowerCase?.() || '').includes(searchTerm.toLowerCase()) ||
  (product.category?.toLowerCase?.() || product.categoryId?.name?.toLowerCase?.() || '').includes(searchTerm.toLowerCase())
);


  // console.log(filteredProducts[0]);
  

  const clearSearch = () => setSearchTerm('');

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="merchant-container">
      {/* Header Section */}
      <div className="header-section">
        <Link to="/add-product" className="action-card new-product">
          <div className="card-icon">
            <Package size={24} />
          </div>
          <div className="card-content">
            <h3>NEW PRODUCT</h3>
            <p>Add new items to inventory</p>
          </div>
          <div className="card-arrow">→</div>
        </Link>

        <Link to="/add-brand" className="action-card new-brand">
          <div className="card-icon">
            <Tag size={24} />
          </div>
          <div className="card-content">
            <h3>NEW BRAND</h3>
            <p>Register new brand</p>
          </div>
          <div className="card-arrow">→</div>
        </Link>
      </div>

      {/* Inventory Section */}
      <div className="inventory-section">
        <div className="section-header">
          <h2>INVENTORY</h2>

          {/* Search */}
          <div className={`search-container ${isSearchFocused ? 'focused' : ''}`}>
            <div className="search-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Search products by name, brand, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="search-input"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="clear-search-btn"
                  type="button"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="search-underline"></div>
          </div>

          <div className="inventory-stats">
            <span className="total-products">{filteredProducts.length} Products</span>
            <span className="total-stock">
              {filteredProducts.reduce((total, product) => total + getTotalStock(product.variants), 0)} Total Units
            </span>
          </div>
        </div>

        <div className="products-list">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <ProductItem
                key={product._id || product.id} // ✅ Handle both ID formats
                product={product}
                index={index}
                onImageUpload={handleImageUpload}
                onRemoveImage={handleRemoveImage}
                updateProducts={updateProducts}
                onDelete={deleteProduct}
                onSaveProductChanges={saveProductChanges}
              />
            ))
          ) : (
            <div className="no-results">
              <Search size={48} className="no-results-icon" />
              <h3>No products found</h3>
              <p>Try adjusting your search terms or add new products to your inventory.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
