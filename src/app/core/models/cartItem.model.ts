// cart.model.ts
export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    image_url?: string;
  }