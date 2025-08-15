// CropperModal.tsx
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./croping/cropImage";
import Modal from "./Modal";
import "./CropperModal.css";

const CropperModal = ({ imageSrc, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  // Fixed aspect ratio to 9:16 (portrait)
  const [aspect, setAspect] = useState(9 / 16); // This equals 0.5625
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    if (!imageSrc || !croppedAreaPixels || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (error) {
      console.error('Error cropping image:', error);
      alert('Error cropping image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="cropper-modal-content">
        <div className="cropper-container">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            showGrid={true}
          />
        </div>
        <div className="controls-container">
          <button 
            onClick={onClose} 
            className="button button-cancel"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            onClick={handleDone} 
            className="button button-crop"
            disabled={isProcessing || !croppedAreaPixels}
          >
            {isProcessing ? 'Processing...' : 'Crop'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CropperModal;
