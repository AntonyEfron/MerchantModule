// components/ProductPage/ProductItem.jsx
import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ProductHeader from './ProductHeader';
import ProductDescription from './ProductDescription';
import VariantsList from './VariantsList';
import AddVariantSection from './AddVariantSection';
import './styles/ProductItem.css';

const ProductItem = ({ 
  product, 
  index, 
  updateProducts, 
  onDelete, 
  onImageUpload, 
  onRemoveImage, 
  onSaveProductChanges // ✅ Receive the function from parent
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProductData, setTempProductData] = useState({});
  const [addingVariant, setAddingVariant] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // New state for tracking stock changes
  const [hasStockChanges, setHasStockChanges] = useState(false);
  const [tempVariants, setTempVariants] = useState(product.variants);

  useEffect(() => {
    setTempVariants(product.variants);
  }, [product]);

  const toggleProductEdit = () => {
    if (isEditing) return; // if already editing, do nothing

    // load initial values into temp state
    setTempProductData({
      name: product.name,
      description: product.description
    });
    setIsEditing(true);
    setError('');
  };

  // ✅ Modified to use parent function
  const saveProductChanges = async () => {
    setIsLoading(true);
    setError('');
   
    try {
      const result = await onSaveProductChanges(product, tempProductData);
      console.log();
      
      if (result.success) {
        setTempProductData({});
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving product changes:', error);
      setError(error.message || 'Failed to save product changes');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setTempProductData({});
    setError('');
  };

const handleVariantUpdate = (updatedVariants) => {
  const updatedProduct = { ...product, variants: updatedVariants };
  updateProducts(updatedProduct);
  setTempVariants(updatedVariants);
  setHasStockChanges(false);
};

  // New function to handle stock updates temporarily
  const handleStockUpdate = (variantIndex, sizeIndex, increment) => {
    const updatedVariants = [...tempVariants];
    const currentStock = updatedVariants[variantIndex].sizes[sizeIndex].stock;
    const newStock = Math.max(0, currentStock + increment);
    updatedVariants[variantIndex].sizes[sizeIndex].stock = newStock;
    
    setTempVariants(updatedVariants);
    setHasStockChanges(true);
  };

  // Function to save stock changes
  const saveStockChanges = () => {
    const updatedProduct = { ...product, variants: tempVariants };
    updateProducts(updatedProduct);
    setHasStockChanges(false);
  };

  // Function to cancel stock changes
  const cancelStockChanges = () => {
    setTempVariants(product.variants);
    setHasStockChanges(false);
  };

  const updateTempProductData = (field, value) => {
    setTempProductData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getTotalStock = (variants) => {
    return variants.reduce((total, variant) => 
      total + variant.sizes.reduce((variantTotal, size) => variantTotal + size.stock, 0), 0
    );
  };

  const toggleShowVariants = () => {
    setShowVariants(!showVariants);
  };

  return (
    <div className="product-item">
      <ProductHeader
        product={product}
        index={index}
        isEditing={isEditing}
        tempData={tempProductData}
        totalStock={getTotalStock(hasStockChanges ? tempVariants : product.variants)}
        onEdit={toggleProductEdit}
        onSave={saveProductChanges} // ✅ Uses the modified function
        onDelete={() => onDelete(product.id)}
        onUpdateTempData={updateTempProductData}
        onCancel={cancelEdit}
        isLoading={isLoading}
        error={error}
      />
      
      {/* Error message display */}
      {error && (
        <div className="error-message">
          <span className="error-text">⚠️ {error}</span>
        </div>
      )}

      {/* Stock Update Controls - Show when there are unsaved stock changes */}
      {hasStockChanges && (
        <div className="stock-update-controls">
          <div className="stock-update-message">
            <span>⚠️ You have unsaved stock changes</span>
          </div>
          <div className="stock-update-buttons">
            <button 
              className="save-stock-btn"
              onClick={saveStockChanges}
            >
              Update Stock
            </button>
            <button 
              className="cancel-stock-btn"
              onClick={cancelStockChanges}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Show description only when variants are shown or when editing */}



      {/* Modified AddVariantSection with Show Variants button */}
          <AddVariantSection
            productId={product.id ||product._id }
            isAddingVariant={addingVariant}
            setAddingVariant={setAddingVariant}
            variants={hasStockChanges ? tempVariants : product.variants}
            onVariantUpdate={handleVariantUpdate}
            onUpdateStock={handleStockUpdate}
            showVariants={showVariants}
            onToggleShowVariants={toggleShowVariants}
            onImageUpload={onImageUpload}
            onRemoveImage={onRemoveImage}
            updateProducts={updateProducts} // ✅ pass this down
          />
          
            {(showVariants || isEditing) && (
        <ProductDescription
          product={product}
          isEditing={isEditing}
          tempData={tempProductData}
          onUpdateTempData={updateTempProductData}
          onSave={saveProductChanges}
        />
      )}


            {/* Show variants only when showVariants is true */}
      {showVariants && (
        <VariantsList
          variants={hasStockChanges ? tempVariants : product.variants}
          productId={product.id}
          onVariantUpdate={handleVariantUpdate}
          onUpdateStock={handleStockUpdate}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
        />
      )}
    </div> 
  );
};

export default ProductItem;
