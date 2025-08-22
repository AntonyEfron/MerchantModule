import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, Minus, X } from 'lucide-react';
import ImageGallery from './ImageGallery';
import { getStockStatus } from './utils/stockUtils';
import {deleteVariantSizes} from '../../api/products'
import './styles/VariantItem.css';
import AddSizeInput from './AddSizeInput';

const VariantItem = ({
  variant,
  variantIndex,
  productId,
  isExpanded,
  onToggleExpansion,
  onDelete,
  onUpdateStock,
  onImageUpload,
  onRemoveImage,
  onVariantUpdate // ✅ need this to update sizes
}) => {
  const [showAddSize, setShowAddSize] = useState(false);
console.log(productId);

  return (
    <div className={`variant-item ${isExpanded ? 'expanded' : 'compact'}`}>
      <div className="variant-header">
        <div className="variant-info">
          <div 
            className="color-indicator" 
            style={{backgroundColor: variant.color?.hex || variant.color}}
          ></div>
          <span className="variant-color">
            {typeof variant.color === "object" ? variant.color.name : variant.color}
          </span>
          <span className="variant-stock-summary">
            {variant.sizes.reduce((total, size) => total + size.stock, 0)} units
          </span>
          <div className="pricing-info">
            <span className="price-badge mrp">MRP: ${variant.mrp?.toFixed(2) || '0.00'}</span>
            <span className="price-badge selling">Price: ${variant.price?.toFixed(2) || '0.00'}</span>
            <span className="price-badge discount">{variant.discount || 0}% OFF</span>
          </div>
        </div>
        <div className="variant-actions">
          <button 
            className="expand-btn"
            onClick={onToggleExpansion}
            title={isExpanded ? "Collapse variant" : "Expand variant"}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            <span>{isExpanded ? 'Collapse' : 'Images & Stock Update'}</span>
          </button>
          <button 
            className="variant-delete-btn"
            onClick={onDelete}
            title="Delete variant"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Compact view */}
      {!isExpanded && (
        <div className="compact-sizes">
          {variant.sizes.map((sizeData, sizeIndex) => (
            <div key={sizeIndex} className={`compact-size-item ${getStockStatus(sizeData.stock)}`}>
              <span className="size-label">{sizeData.size}</span>
              <span className={`stock-count ${getStockStatus(sizeData.stock)}`}>
                {sizeData.stock}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Expanded view */}
      {isExpanded && (
        <>
          <ImageGallery
            images={variant.images}
            productId={productId}
            variantIndex={variantIndex}
            variantColor={variant.color?.name || variant.color}
            onImageUpload={onImageUpload}
            onRemoveImage={onRemoveImage}
          />
          
          <div className="sizes-grid-wrapper">
            <div className="sizes-grid">
              {variant.sizes.map((sizeData, sizeIndex) => (
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
                      onClick={() => onUpdateStock(variantIndex, sizeIndex, -1)}
                      disabled={sizeData.stock === 0}
                    >
                      <Minus size={12} />
                    </button>
                    <button 
                      className="stock-btn increase"
                      onClick={() => onUpdateStock(variantIndex, sizeIndex, 1)}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
            <button
              className="sizes-grid-delete-btn"
              onClick={async () => {
                try {
                  const updatedProduct = await deleteVariantSizes(productId, variant._id, sizeData._id );
                  onVariantUpdate(updatedProduct.product.variants); // refresh UI with new variants
                } catch (err) {
                  console.error(err.message);
                }
              }}
              title="Delete all sizes"
            >
              <Trash2 size={14} />
            </button>
                </div>
              ))}

            </div>

            {/* Toggle Add Size Button */}
            <button 
              className="add-size-toggle-btn"
              onClick={() => setShowAddSize((prev) => !prev)}
            >
              {showAddSize ? <X size={16} /> : <Plus size={16} />}
              <span>{showAddSize ? 'Close' : 'Add Size'}</span>
            </button>
          </div>

          {/* Show DynamicSizesInput below */}
          {showAddSize && (
            <AddSizeInput
              productId={productId}
              variantId={variant._id}   // ✅ correct way
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

export default VariantItem;
