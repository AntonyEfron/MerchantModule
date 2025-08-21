import React, { useState } from 'react';
import { Plus, X, ChevronDown, ChevronUp, Image as ImageIcon, Minus } from 'lucide-react';
import VariantForm from './VariantForm';
import ImageGallery from './ImageGallery';
import { getStockStatus } from './utils/stockUtils';
import './styles/AddVariantSection.css';
import AddSizeInput from './AddSizeInput'; // ✅ correct path

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
  updateProducts,
  
}) => {

// console.log(variants);

  const [showImageGallery, setShowImageGallery] = useState(false);
  const [showAddSize, setShowAddSize] = useState(false); // ✅ local toggle

  const toggleAddVariant = () => {
    setAddingVariant(!isAddingVariant);
  };

  const handleVariantSubmit = (updatedProduct) => {
    onVariantUpdate(updatedProduct.variants);
    updateProducts(updatedProduct);
    setAddingVariant(false);
  };

  // console.log(variants[0]._id);
  

  

  return (
    <div className="add-variant-section">
      <div className="variant-actions">
        {variants.length > 1 ? (
          <button className="show-variants-btn" onClick={onToggleShowVariants}>
            {showVariants ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{showVariants ? 'Hide Variants' : 'Show Variants'}</span>
            <span className="variant-count">({variants.length})</span>
          </button>
        ) : (
          <button 
            className="show-variants-btn" 
            onClick={() => setShowImageGallery(!showImageGallery)}
          >
            <ImageIcon size={16} />
            <span>Images & Stock Update</span>
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

      {/* Show Image Gallery + Sizes Grid */}
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

          <div className="sizes-grid-wrapper">
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
                      onClick={() => onUpdateStock(0, sizeIndex, -1)}
                      disabled={sizeData.stock === 0}
                    >
                      <Minus size={12} />
                    </button>
                    <button 
                      className="stock-btn increase"
                      onClick={() => onUpdateStock(0, sizeIndex, 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Toggle Button for DynamicSizesInput */}
            <button 
              className="add-size-toggle-btn"
              onClick={() => setShowAddSize((prev) => !prev)}
            >
              {showAddSize ? <X size={16} /> : <Plus size={16} />}
              <span>{showAddSize ? 'Close' : 'Add Size'}</span>
            </button>
          </div>

          {/* Show DynamicSizesInput under grid */}
        {showAddSize && (
          <AddSizeInput
            productId={productId}
            variantId={variants[0]._id}   // ✅ correct variant id
            onSuccess={(updatedVariants) => {
              onVariantUpdate(updatedVariants);
              setShowAddSize(false); // close after add
            }}
          />
        )}
        </>
      )}
    </div>
  );
};

export default AddVariantSection;
