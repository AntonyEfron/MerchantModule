// components/ProductPage/VariantForm.jsx
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import DynamicSizesInput from './DynamicSizesInput';
import { addVariant, updateVariant } from "../../api/products";
import CropperModal from '../../components/utils/CropperModal';
import './styles/VariantForm.css';

const VariantForm = ({ productId, onSubmit, onCancel, product, selectedVariantIndex, fetchProduct }) => {
  const [variantForm, setVariantForm] = useState({
    color: { name: '', hex: '#000000' },
    sizes: [{ size: '', stock: 0 }],
    mrp: '',
    price: '',
    discount: '',
    images: []
  });
  const [previewQueue, setPreviewQueue] = useState([]);
  const [showCropper, setShowCropper] = useState(false);

  console.log(productId,'productIdproductIdproductId');
  

  const handleFormChange = (field, value) => {
    setVariantForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorChange = (e) => {
    const hex = e.target.value;
    setVariantForm(prev => ({
      ...prev,
      color: { ...prev.color, hex }
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Add to preview queue instead of setting cropImage directly
        setPreviewQueue(prev => [...prev, {
          src: e.target.result,
          file: file
        }]);
        
        // Show cropper if not already showing
        if (!showCropper) {
          setShowCropper(true);
        }
      };
      reader.readAsDataURL(file);
    });
  };

const handleCropComplete = (blob) => {
  if (!(blob instanceof Blob)) return;

  // Create a File from the blob
  const file = new File([blob], `variant-${Date.now()}.jpg`, { type: "image/jpeg" });
  const objectUrl = URL.createObjectURL(file);

  setVariantForm((prev) => {
    const updatedImages = [
      ...(prev.images || []),
      {
        url: objectUrl,
        file: file, // now it's a File, not just a Blob
      },
    ];
    return {
      ...prev,
      images: updatedImages,
      mainImage: updatedImages[0],
    };
  });

  // Remove the first item from preview queue
  setPreviewQueue((prev) => {
    const [, ...rest] = prev;
    if (rest.length === 0) {
      setShowCropper(false);
    }
    return rest;
  });
};

  const handleCropperClose = () => {
    setShowCropper(false);
    setPreviewQueue([]);
  };

  const removeImage = (index) => {
    setVariantForm(prev => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return {
        ...prev,
        images: updatedImages,
        mainImage: updatedImages[0] || null,
      };
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("color", JSON.stringify(variantForm.color));
    formData.append("sizes", JSON.stringify(variantForm.sizes));
    formData.append("mrp", Number(variantForm.mrp));
    formData.append("price", Number(variantForm.price));
    formData.append("discount", Number(variantForm.discount));

    variantForm.images.forEach((imgObj) => {
      if (imgObj.file instanceof Blob) {
        formData.append("images", imgObj.file);
      }
    });

    let response;
    if (selectedVariantIndex !== null) {
      // ✅ add new variant
      response = await addVariant(productId, formData);
    } else {
      // later can add updateVariant(productId, variantId, formData)
    }

    if (response?.product) {
      alert("✅ Variant added successfully!");

      // 🔑 Pass the updated product to parent
      if (onSubmit) onSubmit(response.product);

      // Reset form + disable
      setVariantForm({
        color: { name: '', hex: '#000000' },
        sizes: [{ size: '', stock: 0 }],
        mrp: '',
        price: '',
        discount: '',
        images: []
      });
      setPreviewQueue([]);
      setShowCropper(false);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Failed to save variant.");
  }
};



  return (
    <>

      <div className="variant-form-container">
        <form onSubmit={handleSubmit} className="variant-form">
          <div className="form-grid">
            {/* Color Section */}
            <div className="form-group">
              <label className="form-label">Color Information</label>
              <div className="color-inputs">
                <input
                  type="text"
                  value={variantForm.color.name}
                  onChange={(e) =>
                    setVariantForm({
                      ...variantForm,
                      color: { ...variantForm.color, name: e.target.value },
                    })
                  }
                  placeholder="Color Name"
                  className="color-name-input"
                  required
                />
                <input
                  type="color"
                  value={variantForm.color.hex}
                  onChange={handleColorChange}
                  className="color-preview"
                  title="Select color"
                />
              </div>
            </div>

            <DynamicSizesInput 
              sizes={variantForm.sizes} 
              setSizes={(sizes) => handleFormChange('sizes', sizes)} 
            />

            {/* Pricing Information */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Maximum Retail Price (MRP)</label>
                <input
                  type="number"
                  value={variantForm.mrp}
                  onChange={(e) => handleFormChange('mrp', e.target.value)}
                  className="form-input"
                  placeholder="Enter MRP"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Selling Price *</label>
                <input
                  type="number"
                  value={variantForm.price}
                  onChange={(e) => handleFormChange('price', e.target.value)}
                  className="form-input"
                  placeholder="Enter selling price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discount Percentage</label>
                <input
                  type="number"
                  value={variantForm.discount}
                  onChange={(e) => handleFormChange('discount', e.target.value)}
                  className="form-input"
                  placeholder="Enter discount %"
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="form-group">
              <label className="form-label">Product Images</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="file-input"
                  id={`image-upload-${productId}`}
                />
                <label htmlFor={`image-upload-${productId}`} className="file-input-label">
                  <span className="file-input-icon">📸</span>
                  <div>Click to upload images or drag and drop</div>
                  <div className="file-input-subtitle">
                    PNG, JPG, GIF up to 10MB each
                  </div>
                </label>
              </div>
            </div>

            {/* Image Preview Grid */}
            {variantForm.images?.length > 0 && (
              <div className="image-preview-grid">
                {variantForm.images.map((img, i) => (
                  <div key={i} className="image-preview-item">
                    <img
                      src={img.url}
                      alt={`Variant ${i + 1}`}
                      className="preview-image"
                    />
                    {i === 0 && <div className="main-image-badge">Main</div>}
                    <div className="image-label">
                      {i === 0 ? "Main Image" : `Image ${i + 1}`}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="remove-preview-btn"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {showCropper && previewQueue.length > 0 && (
        <CropperModal
          imageSrc={previewQueue[0].src}
          onClose={handleCropperClose}
          onCropComplete={handleCropComplete}
        />
      )}

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={!variantForm.price || !variantForm.color.name}
            >
              <Save size={16} />
              {selectedVariantIndex !== null ? "Update Product Variant" : "Add Product Variant"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VariantForm;
