// components/ProductPage/ProductItem.jsx
import React, { useState } from 'react';
import { Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ProductHeader from './ProductHeader';
import ProductDescription from './ProductDescription';
import VariantsList from './VariantsList';
import AddVariantSection from './AddVariantSection';
import './styles/ProductItem.css';

const ProductItem = ({ product, index, products, updateProducts, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProductData, setTempProductData] = useState({});
  const [addingVariant, setAddingVariant] = useState(false);
  const [showVariants, setShowVariants] = useState(false); // New state for showing variants

  const toggleProductEdit = () => {
    if (isEditing) {
      if (tempProductData && Object.keys(tempProductData).length > 0) {
        const updatedProducts = products.map(p => {
          if (p.id === product.id) {
            return { ...p, ...tempProductData };
          }
          return p;
        });
        updateProducts(updatedProducts);
      }
      setIsEditing(false);
      setTempProductData({});
    } else {
      setTempProductData({
        name: product.name,
        category: product.category,
        brand: product.brand,
        description: product.description
      });
      setIsEditing(true);
    }
  };

  const updateTempProductData = (field, value) => {
    setTempProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTotalStock = (variants) => {
    return variants.reduce((total, variant) => 
      total + variant.sizes.reduce((variantTotal, size) => variantTotal + size.stock, 0), 0
    );
  };

  const handleVariantUpdate = (updatedVariants) => {
    const updatedProducts = products.map(p => {
      if (p.id === product.id) {
        return { ...p, variants: updatedVariants };
      }
      return p;
    });
    updateProducts(updatedProducts);
  };

  const toggleShowVariants = () => {
    setShowVariants(!showVariants);
  };

  return (
    <div className="product-item">
      <ProductHeader
        product={product}
        index={index}
        isEditing={isEditing}
        tempData={tempProductData}
        totalStock={getTotalStock(product.variants)}
        onEdit={toggleProductEdit}
        onDelete={() => onDelete(product.id)}
        onUpdateTempData={updateTempProductData}
      />

      {/* Show description only when variants are shown or when editing */}
      {(showVariants || isEditing) && (
        <ProductDescription
          product={product}
          isEditing={isEditing}
          tempData={tempProductData}
          onUpdateTempData={updateTempProductData}
        />
      )}

      {/* Show variants only when showVariants is true */}
      {showVariants && (
        <VariantsList
          variants={product.variants}
          productId={product.id}
          onVariantUpdate={handleVariantUpdate}
        />
      )}

      {/* Modified AddVariantSection with Show Variants button */}
      <AddVariantSection
        productId={product.id}
        isAddingVariant={addingVariant}
        setAddingVariant={setAddingVariant}
        variants={product.variants}
        onVariantUpdate={handleVariantUpdate}
        showVariants={showVariants}
        onToggleShowVariants={toggleShowVariants}
      />
    </div> 
  );
};

export default ProductItem;
