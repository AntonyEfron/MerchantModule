import { useState, useEffect } from "react";
import "./DynamicSizesInput.css";

export default function DynamicSizesInput({ sizes, setSizes }) {
  const [entries, setEntries] = useState(
    sizes && sizes.length ? sizes : [{ size: "", stock: "" }]
  );

  useEffect(() => {
    setEntries(sizes && sizes.length ? sizes : [{ size: "", stock: "" }]);
  }, [sizes]);

  useEffect(() => {
    setSizes(entries);
  }, [entries, setSizes]);

  const handleChange = (index, field, value) => {
    const updated = [...entries];
    updated[index][field] = value;
    setEntries(updated);
  };

  const addSize = () => {
    setEntries([...entries, { size: "", stock: "" }]);
  };

  const removeSize = (index) => {
    const updated = entries.filter((_, i) => i !== index);
    setEntries(updated);
  };

  return (
    <div className="dynsizes-root">
      <h3 className="dynsizes-title">Size and Stock</h3>
      {entries.map((entry, index) => (
        <div key={index} className="dynsizes-row">
          <input
            type="text"
            placeholder="Size (e.g. M or 32)"
            value={entry.size}
            onChange={(e) => handleChange(index, "size", e.target.value)}
            className="dynsizes-input"
          />
          <input
            type="number"
            placeholder="Stock"
            value={entry.stock}
            onChange={(e) => handleChange(index, "stock", e.target.value)}
            className="dynsizes-input"
            min={0}
          />
          <button
            type="button"
            onClick={() => removeSize(index)}
            className="dynsizes-remove"
            aria-label="Remove size"
          >
            ×
          </button>
        </div>
      ))}
      <button type="button" onClick={addSize} className="dynsizes-add">
        + Add Size
      </button>
    </div>
  );
}
