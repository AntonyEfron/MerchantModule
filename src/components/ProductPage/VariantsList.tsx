import React, { useState } from 'react';
import VariantItem from './VariantItem';
import { deleteVariant as deleteVariantAPI } from '../../api/products';  // ✅ import API
import './styles/VariantsList.css';

const VariantsList = ({ variants, productId, onVariantUpdate, onUpdateStock, onImageUpload, onRemoveImage }) => {
  const [expandedVariants, setExpandedVariants] = useState({});

  const toggleVariantExpansion = (variantIndex) => {
    const key = `${productId}-${variantIndex}`;
    setExpandedVariants(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isVariantExpanded = (variantIndex) => {
    const key = `${productId}-${variantIndex}`;
    return expandedVariants[key] || false;
  };

  // 🔹 New delete variant using API
  const handleDeleteVariant = async (variantId) => {
    console.log(productId, variantId,'productId, variantId)');
    
    try {
      const res = await deleteVariantAPI(productId, variantId);
      onVariantUpdate(res.product.variants); // ✅ update parent with latest product variants
    } catch (err) {
      console.error("Delete variant failed:", err);
    }
  };


  return (
    <div className="variants-container">
      {variants.map((variant, variantIndex) => (
        <VariantItem
          key={`${productId}-variant-${variant._id}`}  // ✅ use DB _id instead of index
          variant={variant}
          variantIndex={variantIndex}
          productId={productId}
          isExpanded={isVariantExpanded(variantIndex)}
          onToggleExpansion={() => toggleVariantExpansion(variantIndex)}
          onDelete={() => handleDeleteVariant(variant._id)}  // ✅ pass _id not index
          onUpdateStock={onUpdateStock}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
        />
      ))}
    </div>
  );
};

export default VariantsList;
