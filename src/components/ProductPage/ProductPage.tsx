// components/ProductPage/ProductPage.jsx
import React, { useState } from 'react';
import { Package, Tag } from 'lucide-react';
import ProductItem from './ProductItem';
import { mockProducts } from './data/mockData';
import './styles/ProductPage.css';

const ProductPage = () => {
  const [products, setProducts] = useState(mockProducts);

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

  return (
    <div className="merchant-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="action-card new-product">
          <div className="card-icon">
            <Package size={24} />
          </div>
          <div className="card-content">
            <h3>NEW PRODUCT</h3>
            <p>Add new items to inventory</p>
          </div>
          <div className="card-arrow">→</div>
        </div>

        <div className="action-card new-brand">
          <div className="card-icon">
            <Tag size={24} />
          </div>
          <div className="card-content">
            <h3>NEW BRAND</h3>
            <p>Register new brand</p>
          </div>
          <div className="card-arrow">→</div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="inventory-section">
        <div className="section-header">
          <h2>INVENTORY</h2>
          <div className="inventory-stats">
            <span className="total-products">{products.length} Products</span>
            <span className="total-stock">
              {products.reduce((total, product) => total + getTotalStock(product.variants), 0)} Total Units
            </span>
          </div>
        </div>

        <div className="products-list">
          {products.map((product, index) => (
            <ProductItem
              key={product.id}
              product={product}
              index={index}
              products={products}
              updateProducts={updateProducts}
              onDelete={deleteProduct}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
