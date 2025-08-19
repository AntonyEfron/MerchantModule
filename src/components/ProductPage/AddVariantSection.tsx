import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Image as ImageIcon, Minus } from 'lucide-react';
import VariantForm from './VariantForm';
import ImageGallery from './ImageGallery';
import { getStockStatus } from './utils/stockUtils'; // Import the utility function
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
  onRemoveImage,
  onUpdateStock,
  updateProducts // <-- add here
}) => {
  const [showImageGallery, setShowImageGallery] = useState(false);

  const toggleAddVariant = () => {
    setAddingVariant(!isAddingVariant);
  };

  const handleVariantSubmit = (updatedProduct) => {
    // 🔑 update local state
    onVariantUpdate(updatedProduct.variants);
    // 🔑 update global products list
    updateProducts(updatedProduct);
    // close the form
    setAddingVariant(false);
  };
  // console.log(variants.length,'variantsvariants');
  

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
          selectedVariantIndex={variants.length}
        />
      )}

      {/* Show Image Gallery and Sizes Grid if toggled and only 1 variant */}
      {showImageGallery && variants.length === 1 && (
        <>
          <ImageGallery
            images={variants[0].images || []}
            productId={productId}
            variantIndex={0}
            variantColor={variants[0].color || 'Default'}
            onImageUpload={onImageUpload}
            onRemoveImage={onRemoveImage}
          />
          
          {/* Sizes Grid - copied from VariantItem */}
          <div className="sizes-grid">
            {variants[0].sizes?.map((sizeData, sizeIndex) => (
              <div key={sizeIndex} className={`size-item ${getStockStatus(sizeData.stock)}`}>
                <div className="size-info">
                  <span className="size-label">{sizeData.size}</span>
                  <span className={`stock-count ${getStockStatus(sizeData.stock)}`}>
                    {sizeData.stock}
                  </span>
                </div>
                <div className="stock-controls">
                  <button 
                    className="stock-btn decrease"
                    onClick={() => onUpdateStock(0, sizeIndex, -1)} // variantIndex is 0 since we only have 1 variant
                    disabled={sizeData.stock === 0}
                  >
                    <Minus size={12} />
                  </button>
                  <button 
                    className="stock-btn increase"
                    onClick={() => onUpdateStock(0, sizeIndex, 1)} // variantIndex is 0 since we only have 1 variant
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AddVariantSection;