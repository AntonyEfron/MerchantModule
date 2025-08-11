import { useEffect, useState, useCallback } from "react";
import { getBaseProductById, addVariant } from "../../../api/products";
import DynamicSizesInput from "../../utils/DynamicSizesInput";
import CropperModal from "../../utils/CropperModal";
import "./AddVariant.css";

function getEmptyVariantForm() {
  return {
    color: { name: "", hex: "#000000" },
    sizes: [{ size: "", stock: 0 }],
    images: [],
    mainImage: { public_id: "", url: "" },
    discount: 0,
    mrp: 0,
    price: 0,
  };
}

const AddVariant = ({ createdProductId }) => {
  let productId = createdProductId;
  const [product, setProduct] = useState(null);
  const [variantForm, setVariantForm] = useState(getEmptyVariantForm());
  const [previewQueue, setPreviewQueue] = useState([]);
  const [showCropper, setShowCropper] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(null);
        // console.log(variantForm,'variantForm');

  

  const setSizes = useCallback((updatedSizes) => {
    setVariantForm((prev) => ({ ...prev, sizes: updatedSizes }));
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getBaseProductById(productId);
        setProduct(res);
        if (res.variants?.length) {
          setSelectedVariantIndex(0);
          setVariantForm(res.variants[0]);
        } else {
          setSelectedVariantIndex(null);
          setVariantForm(getEmptyVariantForm());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProduct();
  }, [productId]);


  const handleSelectVariant = (index) => {
    setSelectedVariantIndex(index);
    setVariantForm(product.variants[index]);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const numericFields = ["mrp", "price", "discount"];
    const parsedValue = numericFields.includes(name) ? Number(value) : value;

    setVariantForm((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));

    if (type === "file") {
      const files = Array.from(e.target.files);
      const previews = files.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });
      Promise.all(previews).then((urls) => {
        setPreviewQueue(urls);
        setShowCropper(true);
      });
    }
  };

  const handleColorChange = (e) => {
    const { name, value } = e.target;
    setVariantForm((prev) => ({
      ...prev,
      color: {
        ...prev.color,
        [name]: value,
      },
    }));
  };

  const handleCropComplete = (blob) => {
    if (!(blob instanceof Blob)) return;

    const objectUrl = URL.createObjectURL(blob);

    setVariantForm((prev) => {
      const updatedImages = [
        ...(prev.images || []),
        {
          url: objectUrl,
          file: blob,
        },
      ];
      return {
        ...prev,
        images: updatedImages,
        mainImage: updatedImages[0],
      };
    });

    setPreviewQueue((prev) => {
      const [, ...rest] = prev;
      if (rest.length === 0) setShowCropper(false);
      return rest;
    });
  };

const handleSubmit = async (e) => { 
  e.preventDefault();

  try {
    console.log("📦 Submitting Variant Form State:", JSON.stringify(variantForm, null, 2));

    const formData = new FormData();
    
    // ✅ match backend expectations
    formData.append("color", JSON.stringify(variantForm.color));
    formData.append("sizes", JSON.stringify(variantForm.sizes));
    formData.append("mrp", Number(variantForm.mrp));
    formData.append("price", Number(variantForm.price));
    formData.append("discount", Number(variantForm.discount));

    // Append images array
    variantForm.images.forEach((imgObj, idx) => {
      if (imgObj.file instanceof Blob) {
        console.log(`📂 Adding image ${idx + 1}:`, imgObj.file.name || "(blob)");
        formData.append("images", imgObj.file);
      } else {
        console.warn(`⚠️ Invalid image file at index ${idx}`, imgObj);
      }
    });

    // If main image is separate, append it too
    if (variantForm.mainImage?.file instanceof Blob) {
      console.log("🌟 Adding main image:", variantForm.mainImage.file.name || "(blob)");
      formData.append("images", variantForm.mainImage.file); // still goes under 'images'
    }

    await addVariant(product._id, formData);

    alert("✅ Variant added successfully!");
    setVariantForm(getEmptyVariantForm());
    setPreviewQueue([]);
    setShowCropper(false);

  } catch (err) {
    console.error("❌ Error while submitting variant:", err);
    alert("Failed to add variant.");
  }
};


  if (!product) return <div className="loading">Loading...</div>;

  return (
    <div className="add-variant-container fade-in-up">
      {/* Header Section */}
      <div className="page-header">
        <h1 className="page-title">
          Add New Variant for:{" "}
          <span className="product-name">{product.name || "Product"}</span>
        </h1>
      </div>

      {/* Product Information Card */}
      <div className="product-info">
        <div className="product-info-grid">
          <div className="product-info-item">
            <div className="info-label">Product Name</div>
            <div className="info-value">{product.name || "Not specified"}</div>
          </div>
          <div className="product-info-item">
            <div className="info-label">Gender</div>
            <div className="info-value">
              {product.gender
                ? product.gender.charAt(0).toUpperCase() +
                  product.gender.slice(1)
                : "Not specified"}
            </div>
          </div>
          <div className="product-info-item">
            <div className="info-label">Description</div>
            <div className="info-value">
              {product.description || "No description available"}
            </div>
          </div>
          <div className="product-info-item">
            <div className="info-label">Tags</div>
            <div className="info-value">
              {product.tags && product.tags.length > 0
                ? product.tags.join(", ")
                : "No tags available"}
            </div>
          </div>
          <div className="product-info-item">
            <div className="info-label">Features</div>
            <div className="info-value">
              {product.features && Object.keys(product.features).length > 0
                ? Object.entries(product.features)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(", ")
                : "No features specified"}
            </div>
          </div>
          <div className="product-info-item">
            <div className="info-label">Triable</div>
            <div className="info-value">{product.isTriable ? "Yes" : "No"}</div>
          </div>
          <div className="product-info-item">
            <div className="info-label">Status</div>
            <div
              className="info-value"
              style={{
                color: product.isActive ? "#10b981" : "#ef4444",
                fontWeight: "600",
              }}
            >
              {product.isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
      </div>

      {/* variants selector and edit */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-grow">
          <label className="block text-sm font-medium mb-1">
            Select Variant
          </label>
          <select
            className="border px-3 py-2 rounded w-full"
            onChange={(e) => handleSelectVariant(Number(e.target.value))}
            value={selectedVariantIndex ?? ""}
          >
            <option value="">-- Select Existing Variant --</option>
            {product.variants.map((variant, i) => (
              <option key={i} value={i}>
                {variant.color.name || `Variant ${i + 1}`}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          className="text-blue-600 hover:underline text-sm mt-1"
          onClick={() => {
            setSelectedVariantIndex(null);
            setVariantForm(getEmptyVariantForm());
          }}
        >
          + Add New Variant
        </button>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Color Section */}
          <div className="form-group">
            <label className="form-label">Color Information</label>
            <div className="color-inputs">
              <input
                type="color"
                name="hex"
                value={variantForm.color.hex}
                onChange={handleColorChange}
                className="color-preview"
                title="Select color"
              />
            </div>
          </div>

          {/* Dynamic Sizes Input */}
          <DynamicSizesInput sizes={variantForm.sizes} setSizes={setSizes} />

          {/* Pricing Information */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Maximum Retail Price (MRP)</label>
              <input
                type="number"
                name="mrp"
                value={variantForm.mrp}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter MRP"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Selling Price</label>
              <input
                type="number"
                name="price"
                value={variantForm.price}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter selling price"
                min="0"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Discount Percentage</label>
              <input
                type="number"
                name="discount"
                value={variantForm.discount}
                onChange={handleChange}
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
                name="image"
                multiple
                onChange={handleChange}
                className="file-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="file-input-label">
                <span className="file-input-icon">📸</span>
                <div>Click to upload images or drag and drop</div>
                <div
                  style={{
                    fontSize: "0.875rem",
                    opacity: 0.7,
                    marginTop: "0.5rem",
                  }}
                >
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
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={!variantForm.price}
        >
          Add Product Variant
        </button>
      </form>

      {/* Cropper Modal */}
      {showCropper && previewQueue.length > 0 && (
        <CropperModal
          imageSrc={previewQueue[0]}
          onClose={() => {
            setShowCropper(false);
            setPreviewQueue([]);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
};

export default AddVariant;
