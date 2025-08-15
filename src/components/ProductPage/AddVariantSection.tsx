// components/ProductPage/AddVariantSection.jsx
import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp } from 'lucide-react';
import VariantForm from './VariantForm';
import './styles/AddVariantSection.css';

const AddVariantSection = ({ 
  productId, 
  isAddingVariant, 
  setAddingVariant, 
  variants, 
  onVariantUpdate,
  showVariants,
  onToggleShowVariants
}) => {
  const toggleAddVariant = () => {
    setAddingVariant(!isAddingVariant);
  };

  const handleVariantSubmit = (newVariant) => {
    const updatedVariants = [...variants, newVariant];
    onVariantUpdate(updatedVariants);
    setAddingVariant(false);
  };

  return (
    <div className="add-variant-section">
      <div className="variant-actions">
        {/* Show Variants button on the left */}
        <button className="show-variants-btn" onClick={onToggleShowVariants}>
          {showVariants ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span>{showVariants ? 'Hide Variants' : 'Show Variants'}</span>
          <span className="variant-count">({variants.length})</span>
        </button>

        {/* Add New Variant button on the right */}
        <button className="add-variant-btn" onClick={toggleAddVariant}>
          {isAddingVariant ? <X size={16} /> : <Plus size={16} />}
          <span>{isAddingVariant ? 'Cancel' : 'Add New Variant'}</span>
        </button>
      </div>

      {isAddingVariant && (
        <VariantForm
          productId={productId}
          onSubmit={handleVariantSubmit}
          onCancel={() => setAddingVariant(false)}
        />
      )}
    </div>
  );
};

export default AddVariantSection;
