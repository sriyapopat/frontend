const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000';

// -----------------------------
// Types
// -----------------------------

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

// -----------------------------
// Helpers
// -----------------------------

const normalizeDecision = (decision: string) => {
  if (decision === "AUTO_APPROVE") return "approved";
  if (decision === "MANUAL_REVIEW") return "manual_review";
  if (decision === "ESCALATE") return "escalated";
  return decision.toLowerCase();
};

const parseBreakdown = (value: any): Record<string, number> => {
  if (!value) return {};
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value.replace(/'/g, '"'));
  } catch {
    return {};
  }
};

// -----------------------------
// API Calls
// -----------------------------

export const api = {

  // -----------------------------
  // Transactions (with filters + pagination)
  // -----------------------------
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

    const result = await response.json();

    return result.data.map((t: any) => ({
      ...t,
      decision: normalizeDecision(t.decision),
      risk_breakdown: parseBreakdown(t.risk_breakdown),
    }));
  },

  // -----------------------------
  // Summary
  // -----------------------------
  async getSummary(): Promise<Summary> {
    const response = await fetch(`${API_URL}/summary`);
    if (!response.ok) throw new Error('Failed to fetch summary');
    return response.json();
  },

  // -----------------------------
  // Alerts
  // -----------------------------
  async getAlerts(): Promise<Alert[]> {
    const response = await fetch(`${API_URL}/alerts`);
    if (!response.ok) throw new Error('Failed to fetch alerts');

    const data = await response.json();

    return data.map((a: any) => ({
      ...a,
      decision: normalizeDecision(a.decision),
    }));
  },

  // -----------------------------
  // Generate Data
  // -----------------------------
  async generateData(): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/generate`); // FIXED (GET not POST)
    if (!response.ok) throw new Error('Failed to generate data');
    return response.json();
  },
};