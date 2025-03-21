import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getUsers() {
    return this.http.get<User[]>(`admin/users`);
  }

  updateUser(id: number, userData: Partial<User>) {
    return this.http.put<User>(`admin/users/${id}`, userData);
  }
}