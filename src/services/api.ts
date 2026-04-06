const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

export interface Transaction {
  transaction_id: string;
  vendor_id: string;
  amount: number;
  risk_score: number;
  decision: string;
  decision_reason: string;
  ml_anomaly: boolean;
  signal_count: number;
  risk_breakdown: Record<string, number>;
}

export interface Summary {
  total: number;
  manual: number;
  escalated: number;
  avg_risk: number;
}

export interface Alert {
  transaction_id: string;
  vendor_id: string;
  amount: number;
  risk_score: number;
  ml_anomaly: boolean;
  decision: string;
}

export interface TransactionFilters {
  decision?: string;
  min_risk?: number;
  max_risk?: number;
  vendor_id?: string;
  page?: number;
  limit?: number;
}

export const api = {
  async getTransactions(filters: TransactionFilters = {}): Promise<Transaction[]> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    const url = `${API_URL}/transactions${params.toString() ? '?' + params.toString() : ''}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch transactions');
    return response.json();
  },

  async getSummary(): Promise<Summary> {
    const response = await fetch(`${API_URL}/summary`);
    if (!response.ok) throw new Error('Failed to fetch summary');
    return response.json();
  },

  async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${API_URL}/alerts`);
    if (!response.ok) throw new Error('Failed to fetch alerts');
    return response.json();
  },

  async generateData(): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/generate`, { method: 'POST' });
    if (!response.ok) throw new Error('Failed to generate data');
    return response.json();
  },
};
