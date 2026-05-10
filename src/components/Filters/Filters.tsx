import { Search, X } from 'lucide-react';
import { TransactionFilters } from '../../services/api';

interface FiltersProps {
  filters: TransactionFilters;
  onFilterChange: (filters: TransactionFilters) => void;
  onReset: () => void;
}

export const Filters = ({ filters, onFilterChange, onReset }: FiltersProps) => {
  const handleChange = (key: keyof TransactionFilters, value: string | number) => {
    onFilterChange({ ...filters, [key]: value === '' ? undefined : value });
  };

  const hasActiveFilters =
    filters.decision ||
    filters.min_risk !== undefined ||
    filters.max_risk !== undefined ||
    filters.vendor_id;

  return (
    <div className="bg-surface border border-borderLight rounded-lg p-4">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-primaryText">Filters</h3>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-sm text-secondaryText hover:text-primary transition-colors"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      {/* FILTER FIELDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Decision */}
        <div>
          <label className="block text-sm font-medium text-secondaryText mb-2">
            Decision
          </label>
          <select
            value={filters.decision || ''}
            onChange={(e) => handleChange('decision', e.target.value)}
            className="w-full bg-white border border-borderLight text-primaryText rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="manual_review">Manual Review</option>
            <option value="escalated">Escalated</option>
          </select>
        </div>

        {/* Min Risk */}
        <div>
          <label className="block text-sm font-medium text-secondaryText mb-2">
            Min Risk Score
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={filters.min_risk ?? ''}
            onChange={(e) =>
              handleChange('min_risk', e.target.value ? Number(e.target.value) : '')
            }
            placeholder="0"
            className="w-full bg-white border border-borderLight text-primaryText rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Max Risk */}
        <div>
          <label className="block text-sm font-medium text-secondaryText mb-2">
            Max Risk Score
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="1"
            value={filters.max_risk ?? ''}
            onChange={(e) =>
              handleChange('max_risk', e.target.value ? Number(e.target.value) : '')
            }
            placeholder="100"
            className="w-full bg-white border border-borderLight text-primaryText rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Vendor */}
        <div>
          <label className="block text-sm font-medium text-secondaryText mb-2">
            Vendor ID
          </label>
          <input
            type="text"
            value={filters.vendor_id || ''}
            onChange={(e) => handleChange('vendor_id', e.target.value)}
            placeholder="Enter vendor ID"
            className="w-full bg-white border border-borderLight text-primaryText rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
};