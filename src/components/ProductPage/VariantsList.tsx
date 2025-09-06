// components/ProductPage/VariantsList.jsx
import React, { useState } from 'react';
import VariantItem from './VariantItem';
import { deleteVariant as deleteVariantAPI } from '../../api/products';
import './styles/VariantsList.css';

const VariantsList = ({
  variants,
  productId,
  onVariantUpdate,
  onUpdateStock,
  onImageUpload,
  onRemoveImage,
  onPriceUpdate,
}) => {
  const [expandedVariants, setExpandedVariants] = useState({});

  const toggleVariantExpansion = (variantIndex) => {
    const key = `${productId}-${variantIndex}`;
    setExpandedVariants((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const isVariantExpanded = (variantIndex) => {
    const key = `${productId}-${variantIndex}`;
    return expandedVariants[key] || false;
  };

  // ✅ Delete variant using API
  const handleDeleteVariant = async (variantId) => {
    try {
      const res = await deleteVariantAPI(productId, variantId);
      onVariantUpdate(res.product.variants);
    } catch (err) {
      console.error('Delete variant failed:', err);
    }
  };

  return (
    <div className="variants-container">
      {variants.map((variant, variantIndex) => (
        <VariantItem
          key={`${productId}-variant-${variant._id}`}
          variant={variant}
          variantIndex={variantIndex}
          productId={productId}
          isExpanded={isVariantExpanded(variantIndex)}
          onToggleExpansion={() => toggleVariantExpansion(variantIndex)}
          onDelete={(variantId) => handleDeleteVariant(variantId)} // ✅ confirm handled in child
          onUpdateStock={onUpdateStock}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
          onVariantUpdate={onVariantUpdate}
          onPriceUpdate={onPriceUpdate}
        />
      ))}
    </div>
  );
};

export default VariantsList;
