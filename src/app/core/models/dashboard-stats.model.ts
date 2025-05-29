export interface DashboardStats {
  orders: number;
  users: number;
  products: number;
  revenue: number;
}

export interface RevenueStats {
  monthly: MonthlyRevenue[];
  by_product: ProductRevenue[];
}

export interface OrderStats {
  by_status: (StatusCount & { percentage: number; color: string })[];
  trend: OrderTrend[];
}

export interface MonthlyRevenue {
  year: number;
  month: number;
  total: number;
}

export interface ProductRevenue {
  name: string;
  revenue: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface OrderTrend {
  date: string;
  count: number;
}
export interface StatusCount {
  status: string;
  count: number;
  percentage?: number;  // Ajout de la propriété optionnelle
  color?: string;       // Ajout de la propriété optionnelle
}

