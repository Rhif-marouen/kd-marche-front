import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  template: `
    <h2>Profil Utilisateur</h2>
    <p>Nom : {{ authService.user()?.name }}</p>
    <p>Email : {{ authService.user()?.email }}</p>
  `
})
export class ProfileComponent {
  authService = inject(AuthService);
}