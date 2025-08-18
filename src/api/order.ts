import axiosInstance from '../utils/axiosInstance'


export const fetchMerchantOrders = async () => {
  const response = await axiosInstance.get('merchant/getOrders', { withCredentials: true });
  // Optional: convert dates to Date objects here if needed
  return response.data.orders.map((order: any) => ({
    ...order,
    timestamp: new Date(order.timestamp),
    acceptedAt: order.acceptedAt ? new Date(order.acceptedAt) : undefined,
    transitAt: order.transitAt ? new Date(order.transitAt) : undefined,
    completedAt: order.completedAt ? new Date(order.completedAt) : undefined,
    returnedAt: order.returnedAt ? new Date(order.returnedAt) : undefined,
  }));
};
