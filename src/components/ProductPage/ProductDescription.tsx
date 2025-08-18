import React from 'react';
import './styles/ProductDescription.css';

const ProductDescription = ({ 
  product, 
  isEditing, 
  tempData, 
  onUpdateTempData, 
  isLoading = false ,
  onSave
}) => (
  <div className="description-section">
    <div className="description-header">
      <h4>Description</h4>
    </div>

    {isEditing ? (
      <textarea
        value={tempData?.description ?? product?.description ?? ''}
        onChange={(e) => onUpdateTempData('description', e.target.value)}
        className="edit-description"
        rows={4}
        placeholder="Product description..."
        disabled={isLoading}
      />
    ) : (
      <div className="description-content">
        <p>{product?.description || 'No description available.'}</p>
      </div>
    )}
  </div>
);

export default ProductDescription;
