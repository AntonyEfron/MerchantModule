// components/ProductPage/utils/stockUtils.js
export const getStockStatus = (stock) => {
  if (stock === 0) return 'out-of-stock';
  if (stock < 5) return 'low-stock';
  if (stock < 10) return 'medium-stock';
  return 'high-stock';
};
