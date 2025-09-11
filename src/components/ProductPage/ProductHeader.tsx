import React, { useEffect, useState } from 'react';
import { Edit3, Trash2, X, Save, Loader, ChevronDown, ChevronUp } from 'lucide-react';
import { getStockStatus } from './utils/stockUtils';
import { updatePrice } from '../../api/products';
import './styles/ProductHeader.css';

type ProductHeaderProps = {
  product: any;
  index: number;
  isEditing: boolean;
  tempData: any;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateTempData: (field: string, value: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
  onSave: () => void;
  error?: string;
  variants: any[];
  onPriceUpdate?: (updatedVariant: any) => void;
};

const toMoney = (val: any) => {
  const n = Number(val);
  return Number.isFinite(n) ? n.toFixed(2) : '0.00';
};

const toNum = (val: any) => {
  // allow empty string while typing; otherwise number
  if (val === '' || val === null || val === undefined) return '';
  const n = Number(val);
  return Number.isFinite(n) ? n : 0;
};

const ProductHeader: React.FC<ProductHeaderProps> = ({
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
  variants,
  onPriceUpdate
}) => {
  const firstVariantImage =
    product?.variants?.[0]?.images?.[0]?.url || product.image || '';

  const [showDetails, setShowDetails] = useState(false);

  // Variant 0 guard
  const v0 = variants?.[0] ?? {};

  // ✅ Local state for editing price (coerced to numbers)
  const [isPriceEditing, setIsPriceEditing] = useState(false);
  const [priceForm, setPriceForm] = useState({
    mrp: Number(v0?.mrp ?? 0),
    price: Number(v0?.price ?? 0),
    discount: Number(v0?.discount ?? 0),
  });
  const [priceLoading, setPriceLoading] = useState(false);

  // keep form in sync if parent updates variant
  useEffect(() => {
    setPriceForm({
      mrp: Number(v0?.mrp ?? 0),
      price: Number(v0?.price ?? 0),
      discount: Number(v0?.discount ?? 0),
    });
  }, [v0?.mrp, v0?.price, v0?.discount, variants?.length]);

const handlePriceChange = (field: 'mrp' | 'price' | 'discount', value: string) => {
  let num = value === '' ? '' : toNum(value);

  setPriceForm(prev => {
    let { mrp, price, discount } = { ...prev };

    if (field === 'mrp') {
      mrp = num;
      // recalc discount if mrp > 0
      if (mrp > 0 && price) {
        discount = Math.round(((mrp - price) / mrp) * 100);
      }
    } else if (field === 'price') {
      price = num;
      if (mrp > 0 && price) {
        discount = Math.round(((mrp - price) / mrp) * 100);
      }
    } else if (field === 'discount') {
      discount = num;
      if (mrp > 0) {
        price = Math.round(mrp - (mrp * discount) / 100);
      }
    }

    return { mrp, price, discount };
  });
};

// console.log(product.subCategory,'product.categoryId?.name');
// console.log(product,'product');


  const handlePriceSave = async () => {
    try {
      setPriceLoading(true);

      // force numbers in payload
      const payload = {
        mrp: Number(priceForm.mrp) || 0,
        price: Number(priceForm.price) || 0,
        discount: Number(priceForm.discount) || 0,
      };

      await updatePrice(product._id ?? product.id, v0._id, payload);

      // ✅ Bubble updated (numeric) variant back to parent
      onPriceUpdate?.({
        ...v0,
        ...payload,
      });

      setIsPriceEditing(false);
    } catch (err: any) {
      console.error('Failed to update price:', err);
      alert(err?.message ?? 'Failed to update price');
    } finally {
      setPriceLoading(false);
    }
  };

  return (
    <div className="product-header">
      {/* ✅ Product Image */}
      <div className="product-image-container">
        {firstVariantImage ? (
          <img src={firstVariantImage} alt={product.name} className="product-thumbnail" />
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
                {product.subCategory ?? product.subCategoryId?.name ?? ""}
              </span>
              <span className="product-category">
                {product.subSubCategory ?? product.subSubCategoryId?.name ?? ""}
              </span>
            </div>

            {Array.isArray(variants) && variants.length === 1 && (
              <button
                className="toggle-btn"
                onClick={() => setShowDetails((prev) => !prev)}
              >
                {showDetails ? <ChevronUp size={16} />  : <ChevronDown size={16} />}  details
              </button> 
            )}
          </div>

          {/* ✅ Variant details */}
          {Array.isArray(variants) && variants.length === 1 && showDetails && (
            <div className="variant-details">
              <div className="pricing-info">
                {isPriceEditing ? (
                  <>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={priceForm.mrp}
                      onChange={(e) => handlePriceChange('mrp', e.target.value)}
                      className="price-input"
                      placeholder="MRP"
                    />
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={priceForm.price}
                      onChange={(e) => handlePriceChange('price', e.target.value)}
                      className="price-input"
                      placeholder="Selling Price"
                    />
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      value={priceForm.discount}
                      onChange={(e) => handlePriceChange('discount', e.target.value)}
                      className="price-input"
                      placeholder="Discount %"
                    />
                  </>
                ) : (
                  <>
                    <span className="price-badge mrp">
                      MRP: ${toMoney(v0.mrp)}
                    </span>
                    <span className="price-badge selling">
                      Price: ${toMoney(v0.price)}
                    </span>
                    <span className="price-badge discount">
                      {Number(v0.discount ?? 0)}% OFF
                    </span>
                  </>
                )}
                              <div className="price-action-buttons">
                {isPriceEditing ? (
                  <>
                    <button className="edit-btn" onClick={handlePriceSave} disabled={priceLoading}>
                      {priceLoading ? (
                        <>
                          <Loader size={16} className="spinner" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                        </>
                      )}
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => setIsPriceEditing(false)}
                      disabled={priceLoading}
                    >
                      <X size={16} />
                    </button>
                  </>
                ) : (
                  <button className="edit-btn" onClick={() => setIsPriceEditing(true)}>
                    <Edit3 size={16} />
                  </button>
                )}
              </div>
              </div>

              {/* ✅ Price action buttons */}


              {/* ✅ Sizes */}
              <div className="compact-sizes">
                {v0?.sizes?.map(
                  (sizeData: any, sizeIndex: number) =>
                    sizeData?.size && (
                      <div
                        key={sizeIndex}
                        className={`compact-size-item ${getStockStatus(sizeData.stock)}`}
                      >
                        <span className="size-label">{sizeData.size}</span>
                        <span className={`stock-count ${getStockStatus(sizeData.stock)}`}>
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

      {/* ✅ Main Product Action Buttons */}
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
            <button className="delete-btn" onClick={onCancel} disabled={isLoading}>
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
