// components/ProductPage/VariantsList.jsx
import React, { useState } from 'react';
import VariantItem from './VariantItem';
import './styles/VariantsList.css';

const VariantsList = ({ variants, productId, onVariantUpdate }) => {
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

  // Fixed image upload handler
  const handleImageUpload = async (variantIndex, event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    const updatedVariants = [...variants];
    const currentImages = updatedVariants[variantIndex].images || [];
    const availableSlots = 5 - currentImages.length;
    
    if (availableSlots <= 0) {
      alert('Maximum 5 images allowed per variant');
      return;
    }

    // Process files and create image objects
    const newImagePromises = files.slice(0, availableSlots).map((file) => {
      return new Promise((resolve, reject) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          reject(new Error(`${file.name} is not a valid image file`));
          return;
        }

        // Validate file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          reject(new Error(`${file.name} is too large. Maximum size is 5MB`));
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            url: e.target.result, // Base64 data URL
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            id: Date.now() + Math.random() // Unique ID for the image
          });
        };
        reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
        reader.readAsDataURL(file);
      });
    });

    try {
      const newImages = await Promise.all(newImagePromises);
      updatedVariants[variantIndex].images = [...currentImages, ...newImages];
      onVariantUpdate(updatedVariants);
      
      // Clear the input
      event.target.value = '';
      
      console.log(`Successfully uploaded ${newImages.length} image(s)`);
    } catch (error) {
      console.error('Error uploading images:', error);
      alert(`Error uploading image: ${error.message}`);
      
      // Clear the input even on error
      event.target.value = '';
    }
  };

  const removeImage = (variantIndex, imageIndex) => {
    const updatedVariants = [...variants];
    const imageToRemove = updatedVariants[variantIndex].images[imageIndex];
    
    // If it was a blob URL, revoke it to free memory
    if (imageToRemove.url && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }
    
    updatedVariants[variantIndex].images = updatedVariants[variantIndex].images.filter((_, index) => index !== imageIndex);
    onVariantUpdate(updatedVariants);
  };

  return (
    <div className="variants-container">
      {variants.map((variant, variantIndex) => (
        <VariantItem
          key={variantIndex}
          variant={variant}
          variantIndex={variantIndex}
          productId={productId}
          isExpanded={isVariantExpanded(variantIndex)}
          onToggleExpansion={() => toggleVariantExpansion(variantIndex)}
          onDelete={() => deleteVariant(variantIndex)}
          onUpdateStock={updateStock}
          onImageUpload={handleImageUpload}
          onRemoveImage={removeImage}
        />
      ))}
    </div>
  );
};

export default VariantsList;
