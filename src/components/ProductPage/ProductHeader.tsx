// components/ProductPage/ProductHeader.jsx
import React from 'react';
import { Edit3, Trash2 } from 'lucide-react';
import './styles/ProductHeader.css';

const ProductHeader = ({ 
  product,
  index,
  isEditing,
  tempData,
  totalStock,
  onEdit,
  onDelete,
  onUpdateTempData 
}) => {
  return (
    <div className="product-header">
      <div className="product-info">
        <span className="product-number">{index + 1}.</span>
        <div className="product-details">
          {isEditing ? (
            <input
              type="text"
              value={tempData.name || product.name}
              onChange={(e) => onUpdateTempData('name', e.target.value)}
              className="edit-product-name"
            />
          ) : (
            <h3 className="product-name">{product.name}</h3>
          )}
          <div className="product-meta">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={tempData.category || product.category}
                  onChange={(e) => onUpdateTempData('category', e.target.value)}
                  className="edit-category"
                  placeholder="Category"
                />
                <input
                  type="text"
                  value={tempData.brand || product.brand}
                  onChange={(e) => onUpdateTempData('brand', e.target.value)}
                  className="edit-brand"
                  placeholder="Brand"
                />
              </>
            ) : (
              <>
                <span className="product-category">{product.category}</span>
                <span className="product-brand">{product.brand}</span>
              </>
            )}
            <span className="total-stock-badge">
              {totalStock} units total
            </span>
          </div>
        </div>
      </div>
      <div className="action-buttons">
        <button className="edit-btn" onClick={onEdit}>
          <Edit3 size={16} />
          <span>{isEditing ? 'Save' : 'Edit'}</span>
        </button>
        <button className="delete-btn" onClick={onDelete}>
          <Trash2 size={16} />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ProductHeader;