import React from 'react';
import { Edit3, Trash2, X, Save, Loader } from 'lucide-react';
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
  variants = [] // 👈 use variants prop
}) => {

  console.log(product,'productproduct');
  
  return (
    <div className="product-header">
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
            <span className="product-category">{product.subCategory || ''}</span>
            <span className="product-category">{product.subSubCategory || '0.00'}</span>
            {/* <span className="product-meta">{variant.discount || 0}% OFF</span> */}
          </div>

            {/* ✅ Compact sizes from variants */}
            {variants.length === 1 && (
              <div className="compact-sizes">
                {variants[0].sizes?.map((sizeData, sizeIndex) =>
                  sizeData.size ? (
                    <div
                      key={sizeIndex}
                      className={`compact-size-item ${getStockStatus(sizeData.stock)}`}
                    >
                      <span className="size-label">{sizeData.size}</span>
                      <span
                        className={`stock-count ${getStockStatus(sizeData.stock)}`}
                      >
                        {sizeData.stock}
                      </span>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        {isEditing ? (
          <>
            <button
              className="save-btn"
              onClick={onSave}
              disabled={isLoading}
            >
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
              className="cancel-btn"
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
