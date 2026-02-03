import { useState, useCallback } from 'react';
import { orderApi } from '@/services/api';
import type { Order, OrderFormData, FilterCriteria, AssignRequest, OrderStats } from '@/types/order';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<OrderStats | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.getAllOrders();
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.message || 'Failed to fetch orders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrder = useCallback(async (formData: OrderFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const orderData = {
        orderId: formData.orderId.trim(),
        restaurantName: formData.restaurantName.trim(),
        itemCount: parseInt(formData.itemCount, 10),
        isPaid: formData.isPaid,
        deliveryDistance: parseFloat(formData.deliveryDistance)
      };

      const response = await orderApi.createOrder(orderData);
      if (response.success) {
        setOrders(prev => [response.data, ...prev]);
        return true;
      } else {
        setError(response.message || 'Failed to create order');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const filterOrders = useCallback(async (criteria: FilterCriteria) => {
    setLoading(true);
    setError(null);
    try {
      const params: { isPaid?: boolean; maxDistance?: number } = {};
      
      if (criteria.isPaid !== 'all') {
        params.isPaid = criteria.isPaid === 'true';
      }
      
      if (criteria.maxDistance && criteria.maxDistance.trim() !== '') {
        params.maxDistance = parseFloat(criteria.maxDistance);
      }

      const response = await orderApi.filterOrders(params);
      if (response.success) {
        setOrders(response.data);
      } else {
        setError(response.message || 'Failed to filter orders');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const assignDelivery = useCallback(async (maxDistance: number): Promise<Order | null> => {
    setLoading(true);
    setError(null);
    try {
      const request: AssignRequest = { maxDistance };
      const response = await orderApi.assignDelivery(request);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Failed to assign delivery');
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteOrder = useCallback(async (orderId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.deleteOrder(orderId);
      if (response.success) {
        setOrders(prev => prev.filter(order => order.orderId !== orderId));
        return true;
      } else {
        setError(response.message || 'Failed to delete order');
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await orderApi.getOrderStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    orders,
    loading,
    error,
    stats,
    fetchOrders,
    createOrder,
    filterOrders,
    assignDelivery,
    deleteOrder,
    fetchStats,
    clearError
  };
};
