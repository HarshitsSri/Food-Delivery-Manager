import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2, Trash2, Package, MapPin, Store, Hash } from 'lucide-react';
import type { Order } from '@/types/order';

interface OrdersTableProps {
  orders: Order[];
  loading: boolean;
  onDelete: (orderId: string) => Promise<boolean>;
}

export function OrdersTable({ orders, loading, onDelete }: OrdersTableProps) {
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const handleDelete = async (orderId: string) => {
    setDeletingOrderId(orderId);
    await onDelete(orderId);
    setDeletingOrderId(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  if (loading && orders.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading orders...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Package className="h-5 w-5 text-primary" />
          Orders List
        </CardTitle>
        <CardDescription>
          {orders.length === 0 
            ? 'No orders found. Add some orders to get started.'
            : `Showing ${orders.length} order${orders.length !== 1 ? 's' : ''}`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-muted-foreground">No Orders Yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add your first order using the form on the left
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">
                    <div className="flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      Order ID
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Store className="h-4 w-4" />
                      Restaurant
                    </div>
                  </TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Distance
                    </div>
                  </TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.orderId} className="group">
                    <TableCell className="font-medium">
                      {order.orderId}
                    </TableCell>
                    <TableCell>{order.restaurantName}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="font-mono">
                        {order.itemCount}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {order.isPaid ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Paid
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                          Unpaid
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="font-mono">{order.deliveryDistance} km</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive"
                            disabled={deletingOrderId === order.orderId}
                          >
                            {deletingOrderId === order.orderId ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Order</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete order <strong>{order.orderId}</strong>?
                              This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(order.orderId)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
