import React, { useState } from "react";
import { Check } from "lucide-react";
import { updateSize } from "../../api/products"; // ✅ import API
import "./styles/AddSizeInput.css";

const AddSizeInput = ({ productId, variantId, onSuccess }) => {
  const [size, setSize] = useState("");
  const [stock, setStock] = useState(0);
  const [loading, setLoading] = useState(false);

const handleAdd = async () => {
  if (size.trim() === "") return;

  try {
    setLoading(true);

    // ✅ Always call API only here
    const res = await updateSize(productId, variantId, {
      size,   // new size name
      stock   // initial stock
    });

    if (onSuccess) {
      onSuccess(res.product); // backend returns updated product
    }

    // clear form
    setSize("");
    setStock(0);
  } catch (err) {
    console.error("Error adding size:", err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="add-size-input">
      <input
        type="text"
        value={size}
        onChange={(e) => setSize(e.target.value)}
        placeholder="Size (e.g., S, M, L)"
        className="size-input"
        disabled={loading}
      />
      <input
        type="number"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        placeholder="Stock"
        min="0"
        className="stock-input"
        disabled={loading}
      />
      <button
        type="button"
        onClick={handleAdd}
        className="confirm-size-btn"
        disabled={loading}
      >
        <Check size={20} />
      </button>
    </div>
  );
};

export default AddSizeInput;
