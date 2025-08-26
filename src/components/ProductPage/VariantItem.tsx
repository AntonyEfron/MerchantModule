// components/ProductPage/VariantItem.jsx
import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Trash2, Plus, Minus, X, Edit3, Save } from 'lucide-react';
import ImageGallery from './ImageGallery';
import { getStockStatus } from './utils/stockUtils';
import { deleteVariantSizes, updatePrice } from '../../api/products';
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
  onVariantUpdate,   // stock updates
  onPriceUpdate      // ✅ price updates
}) => {
  const [showAddSize, setShowAddSize] = useState(false);

  // 🔹 For editing prices
  const [isEditing, setIsEditing] = useState(false);
  const [mrp, setMrp] = useState(variant.mrp || 0);
  const [price, setPrice] = useState(variant.price || 0);
  const [discount, setDiscount] = useState(variant.discount || 0);

  // ✅ Recalculate discount whenever MRP or price changes (while editing)
  useEffect(() => {
    if (mrp > 0 && price >= 0) {
      const calculatedDiscount = Math.round(((mrp - price) / mrp) * 100);
      setDiscount(calculatedDiscount);
    } else {
      setDiscount(0);
    }
  }, [mrp, price]);

  // ✅ Update local state when variant prop changes (but don’t overwrite while editing)
useEffect(() => {
  setMrp(variant.mrp || 0);
  setPrice(variant.price || 0);
  setDiscount(variant.discount || 0);
}, [variant._id, variant.mrp, variant.price, variant.discount]);

  // ✅ Handle price input changes
  const handlePriceChange = (field, value) => {
    const numValue = value === '' ? 0 : parseFloat(value) || 0;
    if (field === 'mrp') {
      setMrp(numValue);
    } else if (field === 'price') {
      setPrice(numValue);
    }
  };

  // ✅ Save updated price
  const handleSavePrice = async () => {
    try {
      setIsEditing(false);

      const updatedProduct = await updatePrice(productId, variant._id, {
        mrp: parseFloat(mrp),
        price: parseFloat(price),
        discount: discount,
      });

      const updatedVariant = updatedProduct.product.variants.find(
        (v) => v._id === variant._id
      );

      // ✅ send single updated variant up (consistent with ProductHeader)
      onPriceUpdate?.(updatedVariant);

      // ✅ sync local state with server values
      setMrp(updatedVariant.mrp);
      setPrice(updatedVariant.price);
      setDiscount(updatedVariant.discount);
    } catch (err) {
      console.error('Price update failed:', err.message);
    }
  };

  // ✅ Helper to format money
  const toMoney = (val) => {
    const n = Number(val);
    return Number.isFinite(n) ? n.toFixed(2) : '0.00';
  };

  // ✅ Use live discount while editing, otherwise show variant discount
  const displayDiscount = isEditing ? discount : (variant.discount || 0);

  return (
    <div className={`variant-item ${isExpanded ? 'expanded' : 'compact'}`}>
      <div className="variant-header">
        <div className="variant-info">
          <div
            className="color-indicator"
            style={{ backgroundColor: variant.color?.hex || variant.color }}
          ></div>
          <span className="variant-color">
            {typeof variant.color === 'object' ? variant.color.name : variant.color}
          </span>
          <span className="variant-stock-summary">
            {variant.sizes.reduce((total, size) => total + size.stock, 0)} units
          </span>

          {/* Pricing Section */}
          <div className="pricing-info">
            {isEditing ? (
              <div className="price-edit-container">
                <input
                  type="number"
                  value={mrp}
                  onChange={(e) => handlePriceChange('mrp', e.target.value)}
                  className="price-input"
                  placeholder="MRP"
                  min="0"
                  step="0.01"
                />
                <input
                  type="number"
                  value={price}
                  onChange={(e) => handlePriceChange('price', e.target.value)}
                  className="price-input"
                  placeholder="Selling Price"
                  min="0"
                  step="0.01"
                />
                <span className="price-badge discount-preview">
                  {discount}% OFF
                </span>
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSavePrice}>
                    <Save size={14} />
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => {
                      setMrp(variant.mrp || 0);
                      setPrice(variant.price || 0);
                      setDiscount(variant.discount || 0);
                      setIsEditing(false);
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
              <span className="price-badge mrp">
                MRP: ${toMoney(mrp)}
              </span>
              <span className="price-badge selling">
                Price: ${toMoney(price)}
              </span>
              <span className="price-badge discount">
                {discount}% OFF
              </span>
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                <Edit3 size={14} />
              </button>
              </>
            )}
          </div>
        </div>

        <div className="variant-actions">
          <button
            className="expand-btn"
            onClick={onToggleExpansion}
            title={isExpanded ? 'Collapse variant' : 'Expand variant'}
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

      {/* Compact sizes view */}
      {!isExpanded && (
        <div className="compact-sizes">
          {variant.sizes.map((sizeData, sizeIndex) => (
            <div
              key={sizeIndex}
              className={`compact-size-item ${getStockStatus(sizeData.stock)}`}
            >
              <span className="size-label">{sizeData.size}</span>
              <span className={`stock-count ${getStockStatus(sizeData.stock)}`}>
                {sizeData.stock}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Expanded content */}
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
                <div
                  key={sizeIndex}
                  className={`size-item ${getStockStatus(sizeData.stock)}`}
                >
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
                        const updatedProduct = await deleteVariantSizes(
                          productId,
                          variant._id,
                          sizeData._id
                        );
                        onVariantUpdate(updatedProduct.product.variants);
                      } catch (err) {
                        console.error(err.message);
                      }
                    }}
                    title="Delete size"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              className="add-size-toggle-btn"
              onClick={() => setShowAddSize((prev) => !prev)}
            >
              {showAddSize ? <X size={16} /> : <Plus size={16} />}
              <span>{showAddSize ? 'Close' : 'Add Size'}</span>
            </button>
          </div>

          {showAddSize && (
            <AddSizeInput
              productId={productId}
              variantId={variant._id}
              onSuccess={(updatedVariants) => {
                onVariantUpdate(updatedVariants);
                setShowAddSize(false);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VariantItem;
