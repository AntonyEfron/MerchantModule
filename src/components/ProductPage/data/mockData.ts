// components/ProductPage/data/mockData.js
export const mockProducts = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    category: "Clothing",
    brand: "StyleCo",
    description: "Ultra-soft premium cotton t-shirt with modern fit. Made from 100% organic cotton, perfect for casual wear and layering. Features reinforced seams and pre-shrunk fabric for long-lasting comfort.",
    variants: [
      { 
        color: { name: "Black", hex: "#000000" }, 
        sizes: [{ size: "S", stock: 15 }, { size: "M", stock: 23 }, { size: "L", stock: 8 }],
        mrp: 50.00,
        price: 40.00,
        discount: 20,
        images: [
          { url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop" },
          { url: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=200&h=200&fit=crop" }
        ]
      },
      { 
        color: { name: "White", hex: "#FFFFFF" }, 
        sizes: [{ size: "S", stock: 12 }, { size: "M", stock: 18 }, { size: "L", stock: 5 }],
        mrp: 50.00,
        price: 42.00,
        discount: 16,
        images: [
          { url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=200&h=200&fit=crop" },
          { url: "https://images.unsplash.com/photo-1576566588028-4147f3842f2?w=200&h=200&fit=crop" }
        ]
      }
    ]
  },
  {
    id: 2,
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    brand: "TechSound",
    description: "High-quality wireless Bluetooth headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music, calls, and gaming.",
    variants: [
      { 
        color: { name: "Black", hex: "#000000" }, 
        sizes: [{ size: "One Size", stock: 25 }],
        mrp: 150.00,
        price: 120.00,
        discount: 20,
        images: [
          { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop" },
          { url: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200&h=200&fit=crop" }
        ]
      },
      { 
        color: { name: "Silver", hex: "#C0C0C0" }, 
        sizes: [{ size: "One Size", stock: 18 }],
        mrp: 150.00,
        price: 125.00,
        discount: 17,
        images: [
          { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop" }
        ]
      }
    ]
  }
];
