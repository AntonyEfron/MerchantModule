// components/ProductPage/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { Package, Tag, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchProductsByMerchantId,uploadImage } from '../../api/products';
import ProductItem from './ProductItem';
import './styles/ProductPage.css';

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch products for merchant
  useEffect(() => {
    const merchantData = localStorage.getItem('merchant');
    if (!merchantData) {
      console.error('No merchant data found in localStorage');
      setLoading(false);
      return;
    }

    const merchant = JSON.parse(merchantData);
    console.log(merchant.id,'merchantmerchantmerchantmerchant');
    

    const loadProducts = async () => {
      try {
        const data = await fetchProductsByMerchantId(merchant.id);
        console.log(data,'datadatadatadatadata');
        setProducts(data);   // ✅ set products into state
        
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  const handleImageUpload = async (file, productId, variantIndex) => {
  // console.log(file, productId, variantIndex,'file, productId, variantIndex');
  try {
    const uploadedImageResponse = await uploadImage(file, productId, variantIndex);
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId
          ? {
              ...p,
              variants: p.variants.map((v, i) =>
                i === variantIndex ? { ...v, images: uploadedImageResponse.images } : v
              ),
            }
          : p
      )
    );
  } catch (err) {
    console.error("Image upload failed:", err);
    alert("Image upload failed. Please try again.");
  }
};

const handleRemoveImage = (productId, variantIndex, imageIndex) => {
  setProducts(prevProducts =>
    prevProducts.map(product =>
      product.id === productId
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
        : product
    )
  );
};


  const deleteProduct = (productId) => {
    setProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
  };

  const updateProducts = (updatedProducts) => {
    setProducts(updatedProducts);
  };

  const getTotalStock = (variants) => {
    return variants.reduce((total, variant) =>
      total + variant.sizes.reduce((variantTotal, size) => variantTotal + size.stock, 0), 0
    );
  };

  // Filter products based on search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          key={product.id}
          product={product}
          index={index}
          onImageUpload={handleImageUpload}
          onRemoveImage={handleRemoveImage} // ✅ just pass the handler
          updateProducts={updateProducts}
          onDelete={deleteProduct}
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
