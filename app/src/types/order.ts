export interface Order {
  id?: string;
  orderId: string;
  restaurantName: string;
  itemCount: number;
  isPaid: boolean;
  deliveryDistance: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderFormData {
  orderId: string;
  restaurantName: string;
  itemCount: string;
  isPaid: boolean;
  deliveryDistance: string;
}

export interface FilterCriteria {
  isPaid: string;
  maxDistance: string;
}

export interface AssignRequest {
  maxDistance: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: string[];
  error?: string;
}

export interface OrderStats {
  totalOrders: number;
  paidOrders: number;
  unpaidOrders: number;
  avgDistance: number;
  totalItems: number;
}

export interface AssignmentDetails {
  assignedOrderId: string;
  restaurant: string;
  distance: number;
  itemCount: number;
}

export interface AssignResponse {
  success: boolean;
  message: string;
  data: Order | null;
  assignmentDetails?: AssignmentDetails;
  explanation?: string;
}
