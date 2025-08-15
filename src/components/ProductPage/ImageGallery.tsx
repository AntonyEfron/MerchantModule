// components/ProductPage/ImageGallery.jsx
import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import CropperModal from '../../components/utils/CropperModal'; // Adjust path as needed
import './styles/ImageGallery.css';

const ImageGallery = ({ 
  images, 
  productId, 
  variantIndex, 
  variantColor, 
  onImageUpload, 
  onRemoveImage 
}) => {
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Validate total number of files
      const currentImageCount = images?.length || 0;
      const newFileCount = files.length;
      const totalCount = currentImageCount + newFileCount;
      
      if (totalCount > 5) {
        alert(`You can only upload ${5 - currentImageCount} more image(s). Maximum 5 images per variant.`);
        e.target.value = ''; // Clear the input
        return;
      }
      
      // Convert files to array and start cropping process
      const filesArray = Array.from(files);
      setPendingFiles(filesArray);
      setCurrentFileIndex(0);
      
      // Create object URL for the first file to crop
      const firstFile = filesArray[0];
      const imageUrl = URL.createObjectURL(firstFile);
      setImageToCrop(imageUrl);
      setShowCropper(true);
    }
    
    // Clear the input
    e.target.value = '';
  };

  const handleCropComplete = async (croppedBlob) => {
    // Create a file from the cropped blob
    const originalFile = pendingFiles[currentFileIndex];
    const croppedFile = new File(
      [croppedBlob], 
      originalFile.name, 
      { type: originalFile.type }
    );
    
    // Create a mock event object for the cropped file
    const mockEvent = {
      target: {
        files: [croppedFile]
      }
    };
    
    // Upload the cropped image
    await onImageUpload(variantIndex, mockEvent);
    
    // Clean up the current image URL
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    
    // Check if there are more files to crop
    const nextIndex = currentFileIndex + 1;
    if (nextIndex < pendingFiles.length) {
      // Set up next file for cropping
      setCurrentFileIndex(nextIndex);
      const nextFile = pendingFiles[nextIndex];
      const nextImageUrl = URL.createObjectURL(nextFile);
      setImageToCrop(nextImageUrl);
    } else {
      // All files processed, close cropper
      handleCloseCropper();
    }
  };

  const handleCloseCropper = () => {
    // Clean up object URLs
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    
    // Reset state
    setShowCropper(false);
    setImageToCrop(null);
    setPendingFiles([]);
    setCurrentFileIndex(0);
  };

  return (
    <>
      <div className="image-gallery-section">
        <div className="gallery-header">
          <h4>Product Images</h4>
          <span className="image-count">{images?.length || 0}/5</span>
        </div>
        
        <div className="image-gallery">
          {images?.map((image, imageIndex) => (
            <div key={imageIndex} className="image-item">
              <img 
                src={image.url} 
                alt={`${variantColor} variant ${imageIndex + 1}`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.error('Failed to load image:', image.url);
                }}
              />
              <button 
                className="remove-image-btn"
                onClick={() => onRemoveImage(variantIndex, imageIndex)}
                title="Remove image"
              >
                <X size={12} />
              </button>
              {image.name && (
                <div className="image-info">
                  <span className="image-name" title={image.name}>
                    {image.name.length > 15 ? `${image.name.substring(0, 15)}...` : image.name}
                  </span>
                </div>
              )}
            </div>
          ))}
          
          {(!images || images.length < 5) && (
            <div className="upload-slot">
              <input
                type="file"
                id={`upload-${productId}-${variantIndex}`}
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <label 
                htmlFor={`upload-${productId}-${variantIndex}`}
                className="upload-label"
                title="Upload images (max 5MB each)"
              >
                <Upload size={20} />
                <span>Upload</span>
                <small>Max 5MB</small>
              </label>
            </div>
          )}
          
          {Array.from({ length: Math.max(0, 5 - (images?.length || 0) - 1) }, (_, index) => (
            <div key={`empty-${index}`} className="empty-slot">
              <ImageIcon size={20} />
            </div>
          ))}
        </div>
        
        {(!images || images.length === 0) && (
          <div className="no-images-message">
            <AlertCircle size={16} />
            <span>No images uploaded for this variant</span>
          </div>
        )}
      </div>

      {/* Cropper Modal */}
      {showCropper && imageToCrop && (
        <CropperModal
          imageSrc={imageToCrop}
          onClose={handleCloseCropper}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
};

export default ImageGallery;
