import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, PlusCircle, CheckCircle2 } from 'lucide-react';
import type { OrderFormData } from '@/types/order';

interface AddOrderFormProps {
  onSubmit: (data: OrderFormData) => Promise<boolean>;
  loading: boolean;
}

const initialFormData: OrderFormData = {
  orderId: '',
  restaurantName: '',
  itemCount: '',
  isPaid: false,
  deliveryDistance: '',
};

export function AddOrderForm({ onSubmit, loading }: AddOrderFormProps) {
  const [formData, setFormData] = useState<OrderFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.orderId.trim()) {
      newErrors.orderId = 'Order ID is required';
    }

    if (!formData.restaurantName.trim()) {
      newErrors.restaurantName = 'Restaurant name is required';
    }

    if (!formData.itemCount) {
      newErrors.itemCount = 'Item count is required';
    } else {
      const count = parseInt(formData.itemCount, 10);
      if (isNaN(count) || count < 1) {
        newErrors.itemCount = 'Item count must be at least 1';
      }
    }

    if (!formData.deliveryDistance) {
      newErrors.deliveryDistance = 'Delivery distance is required';
    } else {
      const distance = parseFloat(formData.deliveryDistance);
      if (isNaN(distance) || distance < 0) {
        newErrors.deliveryDistance = 'Distance must be a non-negative number';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!validateForm()) {
      return;
    }

    const success = await onSubmit(formData);
    if (success) {
      setSuccessMessage(`Order "${formData.orderId}" created successfully!`);
      setFormData(initialFormData);
      setErrors({});
      
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleChange = (field: keyof OrderFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <PlusCircle className="h-5 w-5 text-primary" />
          Add New Order
        </CardTitle>
        <CardDescription>
          Create a new food delivery order with all required details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderId">
              Order ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="orderId"
              placeholder="e.g., ORD-001"
              value={formData.orderId}
              onChange={(e) => handleChange('orderId', e.target.value)}
              className={errors.orderId ? 'border-destructive' : ''}
              disabled={loading}
            />
            {errors.orderId && (
              <p className="text-sm text-destructive">{errors.orderId}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="restaurantName">
              Restaurant Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="restaurantName"
              placeholder="e.g., Pizza Palace"
              value={formData.restaurantName}
              onChange={(e) => handleChange('restaurantName', e.target.value)}
              className={errors.restaurantName ? 'border-destructive' : ''}
              disabled={loading}
            />
            {errors.restaurantName && (
              <p className="text-sm text-destructive">{errors.restaurantName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="itemCount">
              Item Count <span className="text-destructive">*</span>
            </Label>
            <Input
              id="itemCount"
              type="number"
              min="1"
              placeholder="e.g., 3"
              value={formData.itemCount}
              onChange={(e) => handleChange('itemCount', e.target.value)}
              className={errors.itemCount ? 'border-destructive' : ''}
              disabled={loading}
            />
            {errors.itemCount && (
              <p className="text-sm text-destructive">{errors.itemCount}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deliveryDistance">
              Delivery Distance (KM) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="deliveryDistance"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g., 5.5"
              value={formData.deliveryDistance}
              onChange={(e) => handleChange('deliveryDistance', e.target.value)}
              className={errors.deliveryDistance ? 'border-destructive' : ''}
              disabled={loading}
            />
            {errors.deliveryDistance && (
              <p className="text-sm text-destructive">{errors.deliveryDistance}</p>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="isPaid" className="text-base">
                Payment Status
              </Label>
              <p className="text-sm text-muted-foreground">
                {formData.isPaid ? 'Order is paid' : 'Order is unpaid'}
              </p>
            </div>
            <Switch
              id="isPaid"
              checked={formData.isPaid}
              onCheckedChange={(checked) => handleChange('isPaid', checked)}
              disabled={loading}
            />
          </div>

          {successMessage && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Order...
              </>
            ) : (
              <>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Order
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
