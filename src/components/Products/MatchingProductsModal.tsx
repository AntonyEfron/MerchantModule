import { useEffect, useState } from "react";
import { X, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { fetchProductsByMerchantId, updateMatchingProducts } from "../../api/products";
import { useAuth } from "../../context/AuthContext";

interface MatchingProductsModalProps {
  productId: string;
  currentProductStyleGroupId: string;
  initialMatchingProducts: string[];
  onClose: () => void;
  onSaveSuccess: (selectedIds: string[]) => void;
}

interface ProductInfo {
  id: string;
  styleGroupId: string;
  name: string;
  coverImageUri: string | null;
}

export default function MatchingProductsModal({
  productId,
  currentProductStyleGroupId,
  initialMatchingProducts,
  onClose,
  onSaveSuccess,
}: MatchingProductsModalProps) {
  const { merchant } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [products, setProducts] = useState<ProductInfo[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([...initialMatchingProducts]);

  useEffect(() => {
    const loadProducts = async () => {
      if (!merchant) return;
      try {
        setLoading(true);
        const merchantId = merchant._id || merchant.id;
        const res = await fetchProductsByMerchantId(merchantId);
        const rawList = Array.isArray(res) ? res : (res as any).products || [];
        
        const formatted: ProductInfo[] = [];
        
        for (const p of rawList) {
          const sgId = p.styleGroupId || p._id || p.id;
          
          // Skip if it's the product we are currently editing
          if (sgId === currentProductStyleGroupId || sgId === productId) continue;
          
          let coverImageUri = null;
          const coverImageObj = p.images?.[0] || p.variants?.[0]?.images?.[0];
          if (coverImageObj) {
            const uri = typeof coverImageObj === "string" ? coverImageObj : coverImageObj.url;
            if (uri) {
              if (uri.startsWith("http")) {
                coverImageUri = uri;
              } else {
                coverImageUri = `${import.meta.env.VITE_BACKEND_URL?.replace("/api", "") || "http://localhost:5000"}/${uri.replace(/^\//, "")}`;
              }
            }
          }

          // Ensure uniqueness by styleGroupId to prevent listing all siblings
          if (!formatted.find((f) => f.styleGroupId === sgId)) {
            formatted.push({
              id: p._id || p.id,
              styleGroupId: sgId,
              name: p.name || "Unnamed Product",
              coverImageUri,
            });
          }
        }
        
        setProducts(formatted);
      } catch (err) {
        console.error("Failed to load products:", err);
        alert("Failed to retrieve products for matching.");
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, [merchant, currentProductStyleGroupId, productId]);

  const handleToggle = (styleGroupId: string) => {
    if (selectedProducts.includes(styleGroupId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== styleGroupId));
    } else {
      if (selectedProducts.length >= 3) {
        alert("You can only select up to 3 matching products.");
        return;
      }
      setSelectedProducts([...selectedProducts, styleGroupId]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateMatchingProducts(productId, selectedProducts);
      onSaveSuccess(selectedProducts);
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update matching products.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "var(--color-surface)",
          width: "90%",
          maxWidth: "500px",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          maxHeight: "85vh",
        }}
      >
        <div style={{ padding: "20px", borderBottom: "1px solid var(--color-border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--color-text)" }}>Select Matching Products</h3>
            <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginTop: "4px" }}>Choose up to 3 products</p>
          </div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-text-secondary)" }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ padding: "20px", overflowY: "auto", flex: 1 }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px 0" }}>
              <Loader2 className="animate-spin" size={32} color="var(--color-text-secondary)" />
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--color-text-secondary)", padding: "40px 0" }}>
              No other products found.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {products.map((p) => {
                const isSelected = selectedProducts.includes(p.styleGroupId);
                return (
                  <div
                    key={p.styleGroupId}
                    onClick={() => handleToggle(p.styleGroupId)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "12px",
                      borderRadius: "var(--radius-md)",
                      border: `1px solid ${isSelected ? "var(--color-primary)" : "var(--color-border)"}`,
                      background: isSelected ? "var(--color-primary-light)" : "var(--color-surface)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <div style={{ width: "50px", height: "50px", borderRadius: "6px", overflow: "hidden", background: "var(--color-bg)", marginRight: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {p.coverImageUri ? (
                        <img src={p.coverImageUri} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <ImageIcon size={20} color="var(--color-text-secondary)" />
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text)", margin: 0 }}>{p.name}</h4>
                      <p style={{ fontSize: "12px", color: "var(--color-text-secondary)", margin: 0, marginTop: "2px" }}>ID: {p.styleGroupId}</p>
                    </div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "4px",
                        border: `1.5px solid ${isSelected ? "var(--color-primary)" : "var(--color-border-hover)"}`,
                        background: isSelected ? "var(--color-primary)" : "transparent",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isSelected && <Check size={14} color="white" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--color-border)", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
          <button onClick={onClose} className="secondary-btn" disabled={saving}>
            Cancel
          </button>
          <button onClick={handleSave} className="primary-btn" disabled={saving || loading} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              "Save Matches"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
