// components/ProductPage/ImageCropper.jsx
import React, { useState } from 'react';
import './styles/ImageCropper.css';

const ImageCropper = ({ src, onCropComplete, onCancel }) => {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="crop-modal">
      <div className="crop-container">
        <div className="crop-header">
          <h3>Crop Image</h3>
        </div>
        <div className="crop-area">
          <img 
            src={src} 
            alt="Crop preview" 
            style={{
              maxWidth: '300px',
              maxHeight: '300px',
              objectFit: 'contain',
              transform: `scale(${zoom})`, // Apply the zoom transform
              transition: 'transform 0.2s ease' // Smooth zoom transition
            }}
          />
        </div>
        <div className="crop-controls">
          <label>Zoom: </label>
          <input 
            type="range" 
            min={1} 
            max={3} 
            step={0.1} 
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
          />
          <span className="zoom-value">{zoom.toFixed(1)}x</span>
        </div>
        <div className="crop-actions">
          <button onClick={() => onCropComplete(src)} className="btn-primary">
            Crop & Save
          </button>
          <button onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;
