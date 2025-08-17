import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Image as ImageIcon } from 'lucide-react';
import VariantForm from './VariantForm';
import ImageGallery from './ImageGallery';
import './styles/AddVariantSection.css';

const AddVariantSection = ({ 
  productId, 
  isAddingVariant, 
  setAddingVariant, 
  variants, 
  onVariantUpdate,
  showVariants,
  onToggleShowVariants,
  onImageUpload,
  onRemoveImage
}) => {
  const [showImageGallery, setShowImageGallery] = useState(false);

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
        {/* Show Variants button only if more than 1 variant */}
        {variants.length > 1 ? (
          <button className="show-variants-btn" onClick={onToggleShowVariants}>
            {showVariants ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{showVariants ? 'Hide Variants' : 'Show Variants'}</span>
            <span className="variant-count">({variants.length})</span>
          </button>
        ) : (
          /* If only 1 variant → Show Image button */
          <button 
            className="show-variants-btn" 
            onClick={() => setShowImageGallery(!showImageGallery)}
          >
            <ImageIcon size={16} />
            <span>{showImageGallery ? 'Hide Images' : 'Show Image'}</span>
          </button>
        )}

        {/* Add New Variant button */}
        <button className="add-variant-btn" onClick={toggleAddVariant}>
          {isAddingVariant ? <X size={16} /> : <Plus size={16} />}
          <span>{isAddingVariant ? 'Cancel' : 'Add New Variant'}</span>
        </button>
      </div>

      {/* Variant form */}
      {isAddingVariant && (
        <VariantForm
          productId={productId}
          onSubmit={handleVariantSubmit}
          onCancel={() => setAddingVariant(false)}
        />
      )}

      {/* Show Image Gallery if toggled and only 1 variant */}
      {showImageGallery && variants.length === 1 && (
        <ImageGallery
          images={variants[0].images || []}
          productId={productId}
          variantIndex={0}
          variantColor={variants[0].color || 'Default'}
            onImageUpload={onImageUpload}
            onRemoveImage={onRemoveImage}
        />
      )}
    </div>
  );
};

export default AddVariantSection;
