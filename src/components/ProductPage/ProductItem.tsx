// components/ProductPage/ProductItem.jsx
import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import ProductHeader from './ProductHeader';
import { deleteProduct, updateStock } from '../../api/products'; 
import ProductDescription from './ProductDescription';
import VariantsList from './VariantsList';
import AddVariantSection from './AddVariantSection';
import { useConfirmDialog } from "../../context/ConfirmDialogContext";
import './styles/ProductItem.css';

const ProductItem = ({ 
  product, 
  index, 
  updateProducts, 
  onDelete, 
  onImageUpload, 
  onRemoveImage, 
  onSaveProductChanges 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempProductData, setTempProductData] = useState({});
  const [addingVariant, setAddingVariant] = useState(false);
  const [showVariants, setShowVariants] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [hasStockChanges, setHasStockChanges] = useState(false);
  const [tempVariants, setTempVariants] = useState(product.variants);

   const { openConfirm } = useConfirmDialog();

  // ✅ track only changed stocks
  const [changedStocks, setChangedStocks] = useState([]);

  useEffect(() => {
    setTempVariants(product.variants);
    setChangedStocks([]); // reset changes if product updates
  }, [product]);

  // ✅ Save only changed stocks
const saveStockChanges = async () => {
  if (changedStocks.length === 0) return;

  try {
    setIsLoading(true);
    setError("");

    for (const change of changedStocks) {
      if (!change.size) continue; // ✅ skip empty rows
      const { variantId, size, stock } = change;
      await updateStock(product._id || product.id, variantId, size, stock);
    }

    const updatedProduct = { ...product, variants: tempVariants };
    updateProducts(updatedProduct);

    setHasStockChanges(false);
    setChangedStocks([]);

  } catch (err) {
    console.error("Error updating stock:", err);
    setError(err.message || "Failed to update stock");
  } finally {
    setIsLoading(false);
  }
};


  const handleDeleteProduct = async () => {
    try {
      setIsLoading(true);
      await deleteProduct(product._id || product.id);
      if (onDelete) {
        onDelete(product._id || product.id);
      }
    } catch (err) {
      console.error("Failed to delete product:", err);
      setError("Failed to delete product");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleProductEdit = () => {
    if (isEditing) return;
    setTempProductData({
      name: product.name,
      description: product.description
    });
    setIsEditing(true);
    setError('');
  };

  const saveProductChanges = async () => {
    setIsLoading(true);
    setError('');
   
    try {
      const result = await onSaveProductChanges(product, tempProductData);
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
    setChangedStocks([]);
  };

  // ✅ Track changed stock
  const handleStockUpdate = (variantIndex, sizeIndex, increment) => {
    const updatedVariants = [...tempVariants];
    const currentStock = updatedVariants[variantIndex].sizes[sizeIndex].stock;
    const newStock = Math.max(0, currentStock + increment);

    updatedVariants[variantIndex].sizes[sizeIndex].stock = newStock;
    setTempVariants(updatedVariants);

    const variantId = updatedVariants[variantIndex]._id;
    const size = updatedVariants[variantIndex].sizes[sizeIndex].size;

    // ✅ Add to changedStocks (replace if already exists)
    setChangedStocks(prev => {
      const filtered = prev.filter(c => !(c.variantId === variantId && c.size === size));
      return [...filtered, { variantId, size, stock: newStock }];
    });

    setHasStockChanges(true);
  };

const handleSizesChanged = (updatedVariants) => {
  setTempVariants(updatedVariants);

  // Collect changes from *all variants*, not just the first
  const allChanges = updatedVariants.flatMap(variant =>
    variant.sizes.map(sizeObj => ({
      variantId: variant._id,
      size: sizeObj.size,
      stock: sizeObj.stock
    }))
  );

  setChangedStocks(allChanges);
  setHasStockChanges(true);
};

  const cancelStockChanges = () => {
    setTempVariants(product.variants);
    setHasStockChanges(false);
    setChangedStocks([]);
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
  // console.log(product.variants[0]._id,'productIdproductId');


  return (
    <div className="product-item">
        <ProductHeader
          product={product}
          index={index}
          isEditing={isEditing}
          tempData={tempProductData}
          totalStock={getTotalStock(hasStockChanges ? tempVariants : product.variants)}
          onEdit={toggleProductEdit}
          onSave={saveProductChanges}
          onDelete={() =>
            openConfirm({
              title: "Confirm Deletion",
              message: `Are you sure you want to delete "${product.name}"?`,
              onConfirm: handleDeleteProduct,
            })
          }
          onUpdateTempData={updateTempProductData}
          onCancel={cancelEdit}
          isLoading={isLoading}
          error={error}
          variants={product.variants}
        />

      
      {error && (
        <div className="error-message">
          <span className="error-text">⚠️ {error}</span>
        </div>
      )}

      <AddVariantSection
        productId={product.id || product._id }
        isAddingVariant={addingVariant}
        setAddingVariant={setAddingVariant}
        variants={product.variants}
        onVariantUpdate={handleVariantUpdate}
        onUpdateStock={handleStockUpdate}
        showVariants={showVariants}
        onToggleShowVariants={toggleShowVariants}
        onImageUpload={onImageUpload}
        onRemoveImage={onRemoveImage}
        updateProducts={updateProducts}
        
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

      {hasStockChanges && (
        <div className="stock-update-controls">
          <div className="stock-update-message">
            <span>You have unsaved stock changes</span>
          </div>
          <div className="stock-update-buttons">
            <button 
              className="save-stock-btn"
              onClick={saveStockChanges}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update Stock"}
            </button>
            <button 
              className="cancel-stock-btn"
              onClick={cancelStockChanges}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div> 
  );
};

export default ProductItem;
