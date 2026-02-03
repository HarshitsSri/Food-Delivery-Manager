import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Truck, Loader2, MapPin, Store, Package, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import type { Order } from '@/types/order';

interface AssignDeliveryProps {
  onAssign: (maxDistance: number) => Promise<Order | null>;
  loading: boolean;
}

export function AssignDelivery({ onAssign, loading }: AssignDeliveryProps) {
  const [maxDistance, setMaxDistance] = useState('');
  const [assignedOrder, setAssignedOrder] = useState<Order | null>(null);
  const [noOrderMessage, setNoOrderMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAssign = async () => {
    setAssignedOrder(null);
    setNoOrderMessage(null);
    setValidationError(null);

    const distance = parseFloat(maxDistance);
    if (isNaN(distance) || distance < 0) {
      setValidationError('Please enter a valid non-negative distance');
      return;
    }

    const result = await onAssign(distance);
    
    if (result) {
      setAssignedOrder(result);
    } else {
      setNoOrderMessage('No order available');
    }
  };

  const handleInputChange = (value: string) => {
    setMaxDistance(value);
    if (validationError) setValidationError(null);
    if (noOrderMessage) setNoOrderMessage(null);
    if (assignedOrder) setAssignedOrder(null);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Truck className="h-5 w-5 text-primary" />
          Assign Delivery
        </CardTitle>
        <CardDescription>
          Automatically assign delivery to the nearest unpaid order
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Alert className="bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              This will find the <strong>nearest unpaid order</strong> within your specified maximum distance.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="assign-maxDistance">
              Maximum Distance (KM) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="assign-maxDistance"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g., 15"
              value={maxDistance}
              onChange={(e) => handleInputChange(e.target.value)}
              disabled={loading}
              className={validationError ? 'border-destructive' : ''}
            />
            <p className="text-xs text-muted-foreground">
              Only unpaid orders within this distance will be considered
            </p>
            {validationError && (
              <p className="text-sm text-destructive">{validationError}</p>
            )}
          </div>

          <Button
            onClick={handleAssign}
            disabled={loading || !maxDistance}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Truck className="mr-2 h-4 w-4" />
                Assign Delivery
              </>
            )}
          </Button>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Assignment Result
            </h4>

            {assignedOrder && (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 space-y-3">
                <div className="flex items-center gap-2 text-green-800">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-semibold">Delivery Assigned!</span>
                </div>
                
                <div className="space-y-2 bg-white rounded-md p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Order ID</span>
                    <Badge variant="secondary" className="font-mono">
                      {assignedOrder.orderId}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{assignedOrder.restaurantName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-muted-foreground" />
                    <span>{assignedOrder.itemCount} items</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono">{assignedOrder.deliveryDistance} km</span>
                    <Badge variant="outline" className="text-xs">Nearest</Badge>
                  </div>
                </div>
              </div>
            )}

            {noOrderMessage && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 text-amber-800">
                  <AlertCircle className="h-5 w-5" />
                  <span className="font-semibold">{noOrderMessage}</span>
                </div>
                <p className="text-sm text-amber-700 mt-2">
                  No unpaid orders found within {maxDistance} km. Try increasing the maximum distance or add more orders.
                </p>
              </div>
            )}

            {!assignedOrder && !noOrderMessage && (
              <div className="rounded-lg border border-dashed border-muted-foreground/25 p-6 text-center">
                <Truck className="h-10 w-10 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Enter a maximum distance and click "Assign Delivery" to find the nearest unpaid order
                </p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
