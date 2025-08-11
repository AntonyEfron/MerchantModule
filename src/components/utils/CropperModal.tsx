// CropperModal.tsx
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./croping/cropImage";
import Modal from "./Modal";
import "./CropperModal.css"; // <-- IMPORT YOUR NEW CSS FILE

const CropperModal = ({ imageSrc, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [aspect, setAspect] = useState(1);

  const handleCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleDone = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
    onCropComplete(croppedBlob);
    onClose();
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
          />
        </div>
        <div className="controls-container">
          <div className="aspect-ratio-label-group">
            <label className="aspect-ratio-label">Aspect Ratio:</label>
            <select
              value={aspect}
              onChange={e => setAspect(Number(e.target.value))}
              className="aspect-ratio-select"
            >
              <option value="1">1:1 (Square)</option>
              <option value="1.3333">4:3</option>
              <option value="1.7778">16:9</option>
              <option value="0.75">3:4 (Portrait)</option>
            </select>
          </div>
          <button onClick={onClose} className="button button-cancel">
            Cancel
          </button>
          <button onClick={handleDone} className="button button-crop">
            Crop
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CropperModal;
