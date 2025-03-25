// product.model.ts
import { Category } from "./category.model";

// Interface de base commune
export interface BaseProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  quality: string;
  category_id: number;
  stock: number;
  image_url: string;
  created_at: string;
  updated_at: string;
}

// Interface pour le public (sans données sensibles)
export interface PublicProduct extends BaseProduct {
  category: string;
  stock_status: string;
}

// Interface admin étendue
export interface AdminProduct extends BaseProduct {
  quality: string;
  category: Category; // Objet complet de catégorie
  stock_history?: StockHistory[];
}

// Interface pour la réponse paginée
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
}

// Interface pour l'historique du stock
export interface StockHistory {
  type: 'in' | 'out';
  quantity: number;
  created_at: string;
  product_id?: number;
}

// Classe concrète pour l'instanciation
export class Product implements AdminProduct {
  constructor(
    public id: number = 0,
    public name: string = '',
    public description: string = '',
    public price: number = 0,
    public category_id: number = 0,
    public stock: number = 0,
    public image_url: string = '',
    public created_at: string = new Date().toISOString(),
    public updated_at: string = new Date().toISOString(),
    public quality: string = 'A',
    public category: Category = { id: 0, name: '' },
    public stock_history?: StockHistory[]
  ) {}
}