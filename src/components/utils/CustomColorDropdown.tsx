import { useState, useRef, useEffect } from "react";
import { ChevronDown, Search } from "lucide-react";

export interface ColorOption {
  name: string;
  hex: string;
  family?: string;
}

interface CustomColorDropdownProps {
  options: ColorOption[];
  value: { name: string; hex: string };
  onChange: (color: { name: string; hex: string }) => void;
}

export default function CustomColorDropdown({ options, value, onChange }: CustomColorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.family && c.family.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Group filtered options by family
  const groupedFilteredOptions = filteredOptions.reduce((acc, c) => {
    const family = c.family || "General Colors";
    if (!acc[family]) acc[family] = [];
    acc[family].push(c);
    return acc;
  }, {} as Record<string, ColorOption[]>);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} style={{ position: "relative", flex: 1, minWidth: "220px" }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid var(--color-border, #cbd5e1)",
          background: "var(--color-surface, #fff)",
          color: "var(--color-text, #000)",
          cursor: "pointer",
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {value.hex ? (
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                backgroundColor: value.hex,
                border: "1px solid rgba(0,0,0,0.15)",
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)"
              }}
            />
          ) : (
            <div style={{ width: "18px", height: "18px", borderRadius: "50%", border: "2px dashed #94a3b8" }} />
          )}
          <span style={{ fontWeight: 600, fontSize: "14px" }}>{value.name || "-- Select Color --"}</span>
        </div>
        <ChevronDown size={16} style={{ color: "#64748b" }} />
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: "6px",
            background: "var(--color-surface, #fff)",
            border: "1px solid var(--color-border, #cbd5e1)",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden"
          }}
        >
          <div style={{ padding: "10px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "8px", background: "#fafafa" }}>
             <Search size={16} style={{ color: "#94a3b8" }} />
             <input 
               type="text" 
               placeholder="Search color name or family..." 
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               onClick={(e) => e.stopPropagation()}
               style={{ flex: 1, border: "none", outline: "none", background: "transparent", color: "var(--color-text, #000)", fontSize: "13px", fontWeight: 500 }}
             />
          </div>
          <div style={{ maxHeight: "260px", overflowY: "auto" }}>
            {Object.keys(groupedFilteredOptions).length > 0 ? (
              Object.entries(groupedFilteredOptions).map(([familyName, familyColors]) => (
                <div key={familyName}>
                  <div
                    style={{
                      padding: "6px 14px",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "#64748b",
                      background: "#f8fafc",
                      borderTop: "1px solid #f1f5f9",
                      position: "sticky",
                      top: 0,
                      zIndex: 5
                    }}
                  >
                    {familyName} ({familyColors.length})
                  </div>
                  {familyColors.map((c) => (
                    <div
                      key={`${c.name}_${c.hex}`}
                      onClick={() => {
                        onChange({ name: c.name, hex: c.hex });
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "9px 14px",
                        cursor: "pointer",
                        transition: "background-color 0.15s ease",
                        borderBottom: "1px solid #f8fafc"
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f1f5f9")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            backgroundColor: c.hex,
                            border: "1px solid rgba(0,0,0,0.15)",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                            flexShrink: 0
                          }}
                        />
                        <span style={{ color: "#0f172a", fontWeight: 600, fontSize: "13px" }}>{c.name}</span>
                      </div>
                      <span style={{ fontSize: "11px", color: "#94a3b8", fontFamily: "monospace" }}>{c.hex}</span>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <div style={{ padding: "14px", color: "#64748b", fontSize: "13px", textAlign: "center" }}>No matching colors found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
