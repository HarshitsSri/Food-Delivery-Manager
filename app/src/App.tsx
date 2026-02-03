import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { useOrders } from '@/hooks/useOrders';
import { AddOrderForm, OrdersTable, FilterPanel, AssignDelivery, StatsPanel } from '@/components/orders';
import { UtensilsCrossed, ListFilter, Truck, AlertCircle } from 'lucide-react';
import './App.css';

function App() {
  const {
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
    clearError,
  } = useOrders();

  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleCreateOrder = async (formData: Parameters<typeof createOrder>[0]) => {
    const success = await createOrder(formData);
    if (success) {
      toast.success('Order created successfully!');
      fetchStats();
      return true;
    }
    return false;
  };

  const handleFilter = (criteria: Parameters<typeof filterOrders>[0]) => {
    filterOrders(criteria);
  };

  const handleResetFilter = () => {
    fetchOrders();
  };

  const handleAssignDelivery = async (maxDistance: number) => {
    const result = await assignDelivery(maxDistance);
    if (result) {
      toast.success(`Delivery assigned to order ${result.orderId}!`);
    }
    return result;
  };

  const handleDeleteOrder = async (orderId: string) => {
    const success = await deleteOrder(orderId);
    if (success) {
      toast.success('Order deleted successfully!');
      fetchStats();
      return true;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <UtensilsCrossed className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Food Delivery Order Manager
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage orders and assign deliveries efficiently
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <section className="mb-8">
          <StatsPanel stats={stats} />
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="add" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              <span className="hidden sm:inline">Add Order</span>
            </TabsTrigger>
            <TabsTrigger value="assign" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Assign</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-1">
                <FilterPanel
                  onFilter={handleFilter}
                  onReset={handleResetFilter}
                  loading={loading}
                />
              </div>
              <div className="lg:col-span-3">
                <OrdersTable
                  orders={orders}
                  loading={loading}
                  onDelete={handleDeleteOrder}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="add" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <AddOrderForm
                onSubmit={handleCreateOrder}
                loading={loading}
              />
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Tips</h3>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">1</span>
                      <span>Enter a unique Order ID for each order</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">2</span>
                      <span>Specify the restaurant name clearly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">3</span>
                      <span>Set the delivery distance in kilometers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">4</span>
                      <span>Toggle payment status based on order state</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-lg border bg-amber-50 border-amber-200 p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-800 mb-1">About Delivery Assignment</h4>
                      <p className="text-sm text-amber-700">
                        When assigning deliveries, the system automatically selects the <strong>nearest unpaid order</strong> within your specified maximum distance. This ensures efficient delivery routing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="assign" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <AssignDelivery
                onAssign={handleAssignDelivery}
                loading={loading}
              />
              <div className="space-y-4">
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">How It Works</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Enter Maximum Distance</p>
                        <p className="text-sm text-muted-foreground">
                          Set how far you're willing to travel for a delivery
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        2
                      </div>
                      <div>
                        <p className="font-medium">System Filters Orders</p>
                        <p className="text-sm text-muted-foreground">
                          Only unpaid orders within your range are considered
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium flex-shrink-0">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Nearest Order Selected</p>
                        <p className="text-sm text-muted-foreground">
                          The system picks the closest order to minimize travel time
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Queue</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Unpaid Orders</span>
                      <span className="font-bold text-2xl">{stats?.unpaidOrders || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Paid Orders</span>
                      <span className="font-medium text-green-600">{stats?.paidOrders || 0}</span>
                    </div>
                    <div className="h-px bg-border my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Orders</span>
                      <span className="font-medium">{stats?.totalOrders || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>Food Delivery Order Manager v1.0</p>
            <p>Built with React, Express & MongoDB</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
