import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, RefreshCw, Search } from 'lucide-react';
import type { FilterCriteria } from '@/types/order';

interface FilterPanelProps {
  onFilter: (criteria: FilterCriteria) => void;
  onReset: () => void;
  loading: boolean;
}

const initialCriteria: FilterCriteria = {
  isPaid: 'all',
  maxDistance: '',
};

export function FilterPanel({ onFilter, onReset, loading }: FilterPanelProps) {
  const [criteria, setCriteria] = useState<FilterCriteria>(initialCriteria);
  const [isActive, setIsActive] = useState(false);

  const handleFilter = () => {
    onFilter(criteria);
    setIsActive(true);
  };

  const handleReset = () => {
    setCriteria(initialCriteria);
    setIsActive(false);
    onReset();
  };

  const handleChange = (field: keyof FilterCriteria, value: string) => {
    setCriteria(prev => ({ ...prev, [field]: value }));
    setIsActive(false);
  };

  const hasFilters = criteria.isPaid !== 'all' || criteria.maxDistance !== '';

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Filter className="h-5 w-5 text-primary" />
          Filter Orders
          {isActive && hasFilters && (
            <Badge variant="secondary" className="ml-2">Active</Badge>
          )}
        </CardTitle>
        <CardDescription>
          Filter orders by payment status and maximum distance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filter-isPaid">Payment Status</Label>
            <Select
              value={criteria.isPaid}
              onValueChange={(value) => handleChange('isPaid', value)}
              disabled={loading}
            >
              <SelectTrigger id="filter-isPaid">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="true">Paid Only</SelectItem>
                <SelectItem value="false">Unpaid Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="filter-maxDistance">
              Maximum Distance (KM)
            </Label>
            <Input
              id="filter-maxDistance"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g., 10"
              value={criteria.maxDistance}
              onChange={(e) => handleChange('maxDistance', e.target.value)}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Show orders within this distance
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleFilter}
              disabled={loading}
              className="flex-1"
            >
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Search className="mr-2 h-4 w-4" />
              )}
              Apply Filter
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={loading || (!hasFilters && !isActive)}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
