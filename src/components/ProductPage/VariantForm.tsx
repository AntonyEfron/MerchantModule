// components/ProductPage/VariantForm.jsx
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import DynamicSizesInput from './DynamicSizesInput';
import ImageCropper from './ImageCropper';
import './styles/VariantForm.css';

const VariantForm = ({ productId, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    color: { name: '', hex: '#000000' },
    sizes: [{ size: '', stock: 0 }],
    mrp: '',
    price: '',
    discount: '',
    images: []
  });
  const [cropImage, setCropImage] = useState(null);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleColorChange = (e) => {
    const hex = e.target.value;
    setFormData(prev => ({
      ...prev,
      color: { ...prev.color, hex }
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCropImage({
          src: e.target.result,
          file: file
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const onCropComplete = (croppedImageUrl) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { url: croppedImageUrl }]
    }));
    setCropImage(null);
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.color.name || !formData.price) {
      alert('Please fill in required fields');
      return;
    }

    const newVariant = {
      color: formData.color,
      sizes: formData.sizes.filter(s => s.size && s.stock >= 0),
      mrp: parseFloat(formData.mrp) || 0,
      price: parseFloat(formData.price) || 0,
      discount: parseInt(formData.discount) || 0,
      images: formData.images
    };

    onSubmit(newVariant);
  };

  return (
    <>
      {cropImage && (
        <ImageCropper
          src={cropImage.src}
          onCropComplete={onCropComplete}
          onCancel={() => setCropImage(null)}
        />
      )}

      <div className="variant-form-container">
        <form onSubmit={handleSubmit} className="variant-form">
          <div className="form-grid">
            {/* Color Section */}
            <div className="form-group">
              <label className="form-label">Color Information</label>
              <div className="color-inputs">
                <input
                  type="text"
                  value={formData.color.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      color: { ...formData.color, name: e.target.value },
                    })
                  }
                  placeholder="Color Name"
                  className="color-name-input"
                  required
                />
                <input
                  type="color"
                  value={formData.color.hex}
                  onChange={handleColorChange}
                  className="color-preview"
                  title="Select color"
                />
              </div>
            </div>

            <DynamicSizesInput 
              sizes={formData.sizes} 
              setSizes={(sizes) => handleFormChange('sizes', sizes)} 
            />

            {/* Pricing Information */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Maximum Retail Price (MRP)</label>
                <input
                  type="number"
                  value={formData.mrp}
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
                  value={formData.price}
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
                  value={formData.discount}
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
            {formData.images?.length > 0 && (
              <div className="image-preview-grid">
                {formData.images.map((img, i) => (
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

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              className="btn-primary"
              disabled={!formData.price || !formData.color.name}
            >
              <Save size={16} />
              Add Product Variant
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default VariantForm;
