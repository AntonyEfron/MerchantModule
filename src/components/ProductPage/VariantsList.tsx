// components/ProductPage/VariantsList.jsx
import React, { useState } from 'react';
import VariantItem from './VariantItem';
import './styles/VariantsList.css';

const VariantsList = ({ variants, productId, onVariantUpdate, onImageUpload, onRemoveImage}) => {
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

  const deleteVariant = (variantIndex) => {
    const updatedVariants = variants.filter((_, index) => index !== variantIndex);
    onVariantUpdate(updatedVariants);
  };

  const updateStock = (variantIndex, sizeIndex, increment) => {
    const updatedVariants = [...variants];
    const currentStock = updatedVariants[variantIndex].sizes[sizeIndex].stock;
    const newStock = Math.max(0, currentStock + increment);
    updatedVariants[variantIndex].sizes[sizeIndex].stock = newStock;
    onVariantUpdate(updatedVariants);
  };

  // ✅ Updated to handle the full images array from API response
    const handleImageUpload = (variantIndex, uploadedImages) => {
      const updatedVariants = variants.map((variant, index) =>
        index === variantIndex
          ? { ...variant, images: uploadedImages } // ✅ use directly
          : variant
      );
      onVariantUpdate(updatedVariants);
    };

  // ✅ Fixed remove image handler
  const removeImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants];
    const imageToRemove = updatedVariants[variantIndex].images[imageIndex];

    // If it was a blob URL, revoke it to free memory
    if (imageToRemove?.url && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // Remove the image from the array
    updatedVariants[variantIndex].images = 
      updatedVariants[variantIndex].images.filter((_, index) => index !== imageIndex);

    onVariantUpdate(updatedVariants);
  };

  return (
    <div className="variants-container">
      {variants.map((variant, variantIndex) => (
        <VariantItem
          key={`${productId}-variant-${variantIndex}-${variant.color || variantIndex}`}
          variant={variant}
          variantIndex={variantIndex}
          productId={productId}
          isExpanded={isVariantExpanded(variantIndex)}
          onToggleExpansion={() => toggleVariantExpansion(variantIndex)}
          onDelete={() => deleteVariant(variantIndex)}
          onUpdateStock={updateStock}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
        />
      ))}
    </div>
  );
};

export default VariantsList;