
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

export interface PublicProduct {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  stock_status: string;
}

// Interface admin étendue
export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string;
  category: string;
  price: number;
  category_id: number;
  quality: string;
  stock: number; // Ajouter le stock numérique
  created_at: string;
  updated_at: string;
  stock_history?: StockHistory[];
}

// Interface pour l'historique du stock
export interface StockHistory {
  type: 'in' | 'out';
  quantity: number;
  created_at: string;
  product_id?: number; // Référence optionnelle
}
