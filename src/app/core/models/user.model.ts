// src/app/core/models/user.model.ts
export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    is_active: boolean;
    payment_date?: Date;
    created_at?: Date;
    updated_at?: Date;
  }