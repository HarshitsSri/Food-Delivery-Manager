import type { Order, AssignRequest, ApiResponse, OrderStats, AssignResponse } from '@/types/order';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

export const orderApi = {
  getAllOrders: (): Promise<ApiResponse<Order[]>> => {
    return fetchApi<Order[]>('/orders', {
      method: 'GET',
    });
  },

  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Order>> => {
    return fetchApi<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  filterOrders: (params: { isPaid?: boolean; maxDistance?: number }): Promise<ApiResponse<Order[]>> => {
    const queryParams = new URLSearchParams();
    
    if (params.isPaid !== undefined) {
      queryParams.append('isPaid', String(params.isPaid));
    }
    if (params.maxDistance !== undefined) {
      queryParams.append('maxDistance', String(params.maxDistance));
    }
    
    const queryString = queryParams.toString();
    const endpoint = queryString ? `/orders/filter?${queryString}` : '/orders/filter';
    
    return fetchApi<Order[]>(endpoint, {
      method: 'GET',
    });
  },

  assignDelivery: (request: AssignRequest): Promise<AssignResponse> => {
    return fetchApi<Order>('/orders/assign', {
      method: 'POST',
      body: JSON.stringify(request),
    }) as Promise<AssignResponse>;
  },

  getOrderStats: (): Promise<ApiResponse<OrderStats>> => {
    return fetchApi<OrderStats>('/orders/stats', {
      method: 'GET',
    });
  },

  deleteOrder: (orderId: string): Promise<ApiResponse<Order>> => {
    return fetchApi<Order>(`/orders/${orderId}`, {
      method: 'DELETE',
    });
  },
};

export default orderApi;
