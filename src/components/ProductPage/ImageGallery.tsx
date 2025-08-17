// components/ProductPage/ImageGallery.jsx
import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import {deleteImage  } from "../../api/products";
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
  const [isUploading, setIsUploading] = useState(false);

const handleRemoveImageClick = async (imageIndex) => {
  try {
    const imageToDelete = images[imageIndex];
    if (!imageToDelete?._id) return;

    await deleteImage(imageToDelete._id);

    // Pass productId, variantIndex, and imageIndex to parent
    if (onRemoveImage) {
      onRemoveImage(productId, variantIndex, imageIndex);
    }

  } catch (error) {
    console.error("Failed to delete image:", error);
    alert("Failed to delete image. Please try again.");
  }
};


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
  try {
    setIsUploading(true);
    const originalFile = pendingFiles[currentFileIndex];
    const croppedFile = new File(
      [croppedBlob],
      originalFile.name.replace(/\.[^/.]+$/, "") + ".png",
      { type: croppedBlob.type || "image/png" }
    );

    // ✅ Send cropped file to parent for upload
    await onImageUpload(croppedFile, productId, variantIndex);
  console.log(croppedFile, productId, variantIndex,'file, productId, variantIndex');


    // Continue with next file if available
    const nextFileIndex = currentFileIndex + 1;
    if (nextFileIndex < pendingFiles.length) {
      const nextFile = pendingFiles[nextFileIndex];
      const nextImageUrl = URL.createObjectURL(nextFile);
      if (imageToCrop) URL.revokeObjectURL(imageToCrop);

      setCurrentFileIndex(nextFileIndex);
      setImageToCrop(nextImageUrl);
    } else {
      handleCloseCropper();
    }
  } catch (error) {
    console.error("Upload failed:", error);
    alert(`Image upload failed: ${error.message}`);
    handleCloseCropper();
  } finally {
    setIsUploading(false);
  }
};

  const handleCloseCropper = () => {
    // Clean up object URLs
    if (imageToCrop) {
      URL.revokeObjectURL(imageToCrop);
    }
    
    // Clean up any remaining pending file URLs
    pendingFiles.forEach((file, index) => {
      if (index > currentFileIndex) {
        const url = URL.createObjectURL(file);
        URL.revokeObjectURL(url);
      }
    });
    
    // Reset state
    setShowCropper(false);
    setImageToCrop(null);
    setPendingFiles([]);
    setCurrentFileIndex(0);
    setIsUploading(false);
  };

  // Calculate how many empty slots to show
  const currentImageCount = images?.length || 0;
  const showUploadSlot = currentImageCount < 5;
  const emptySlotCount = Math.max(0, 5 - currentImageCount - (showUploadSlot ? 1 : 0));

  return (
    <>
      <div className="image-gallery-section">
        <div className="gallery-header">
          <h4>Product Images</h4>
          <span className="image-count">{currentImageCount}/5</span>
        </div>
        
        <div className="image-gallery">
          {/* Render existing images */}
          {images?.map((image, imageIndex) => (
            <div key={`${image._id || imageIndex}-${variantIndex}`} className="image-item">
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
              onClick={() => handleRemoveImageClick(imageIndex)}
              title="Remove image"
              disabled={isUploading}
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
          
          {/* Upload slot - only show if under 5 images */}
          {(!images || images.length < 5) && (
            <div className="upload-slot">
              <input
                type="file"
                id={`upload-${productId}-${variantIndex}`}
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={isUploading}
              />
              <label 
                htmlFor={`upload-${productId}-${variantIndex}`}
                className={`upload-label ${isUploading ? 'uploading' : ''}`}
                title={isUploading ? "Uploading..." : "Upload images (max 5MB each)"}
              >
                {isUploading ? (
                  <>
                    <div className="upload-spinner" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    <span>Upload</span>
                    <small>Max 5MB</small>
                  </>
                )}
              </label>
            </div>
          )}
          
          {/* Empty slots */}
          {Array.from({ length: Math.max(0, 5 - (images?.length || 0) - ((!images || images.length < 5) ? 1 : 0)) }, (_, index) => (
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
        
        {images && images.length === 5 && (
          <div className="max-images-message">
            <AlertCircle size={16} />
            <span>Maximum images reached (5/5)</span>
          </div>
        )}
      </div>

      {/* Cropper Modal */}
      {showCropper && imageToCrop && (
        <CropperModal
          imageSrc={imageToCrop}
          onClose={handleCloseCropper}
          onCropComplete={handleCropComplete}
          isUploading={isUploading}
        />
      )}
    </>
  );
};

export default ImageGallery;