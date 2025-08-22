import React, { useState } from 'react';
import { Edit3, Trash2, X, Save, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { getStockStatus } from './utils/stockUtils';
import './styles/ProductHeader.css';

const ProductHeader = ({
  product,
  index,
  isEditing,
  tempData,
  onEdit,
  onDelete,
  onUpdateTempData,
  onCancel,
  isLoading = false,
  onSave,
  error = '',
  variants
}) => {
  // ✅ First product image (from variant[0] or fallback product.image)
  const firstVariantImage =
    product?.variants?.[0]?.images?.[0]?.url || product.image || '';

  // ✅ Toggle state
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="product-header">
      {/* ✅ Product Image */}
      <div className="product-image-container">
        {firstVariantImage ? (
          <img
            src={firstVariantImage}
            alt={product.name}
            className="product-thumbnail"
          />
        ) : (
          <div className="product-thumbnail placeholder">No Image</div>
        )}
      </div>

      {/* ✅ Product Info */}
      <div className="product-info">
        <span className="product-number">{index + 1}.</span>
        <div className="product-details">
          {isEditing ? (
            <input
              type="text"
              value={tempData.name || ''}
              onChange={(e) => onUpdateTempData('name', e.target.value)}
              className="edit-product-name"
              disabled={isLoading}
              placeholder="Product name"
              required
            />
          ) : (
            <h3 className="product-name">{product.name}</h3>
          )}

          <div className="product-meta">
            <span className="product-brand">
              {product.brand || product.brandId?.name}
            </span>
            <span className="product-category">
              {product.category || product.categoryId?.name}
            </span>

            <div className="pricing-info">
              <span className="product-category">
                {product.subCategory || ''}
              </span>
              <span className="product-category">
                {product.subSubCategory || '0.00'}
              </span>
            </div>

            {/* ✅ Toggle Btn only, aligned right */}
            {variants.length === 1 && (
              <button
                className="toggle-btn"
                onClick={() => setShowDetails((prev) => !prev)}
              >
                {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            )}
          </div>

          {/* ✅ Variant details BELOW product-meta */}
          {variants.length === 1 && showDetails && (
            <div className="variant-details">
              <div className="pricing-info">
                <span className="price-badge mrp">
                  MRP: ${variants[0].mrp?.toFixed(2) || '0.00'}
                </span>
                <span className="price-badge selling">
                  Selling Price: ${variants[0].price?.toFixed(2) || '0.00'}
                </span>
                <span className="price-badge discount">
                  {variants[0].discount || 0}% OFF
                </span>
              </div>

              <div className="compact-sizes">
                {variants[0].sizes?.map(
                  (sizeData, sizeIndex) =>
                    sizeData.size && (
                      <div
                        key={sizeIndex}
                        className={`compact-size-item ${getStockStatus(
                          sizeData.stock
                        )}`}
                      >
                        <span className="size-label">{sizeData.size}</span>
                        <span
                          className={`stock-count ${getStockStatus(
                            sizeData.stock
                          )}`}
                        >
                          {sizeData.stock}
                        </span>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Action Buttons */}
      <div className="action-buttons">
        {isEditing ? (
          <>
            <button className="edit-btn" onClick={onSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader size={16} className="spinner" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save</span>
                </>
              )}
            </button>
            <button
              className="delete-btn"
              onClick={onCancel}
              disabled={isLoading}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          </>
        ) : (
          <>
            <button className="edit-btn" onClick={onEdit}>
              <Edit3 size={16} />
              <span>Edit</span>
            </button>
            <button className="delete-btn" onClick={onDelete}>
              <Trash2 size={16} />
              <span>Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductHeader;
