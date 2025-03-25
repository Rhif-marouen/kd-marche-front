import { Component } from '@angular/core';
import { HeaderComponent } from './shared/components/header/header.component';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root', 
  standalone: true,
  imports: [HeaderComponent, RouterOutlet,],
  template: `
    <app-header></app-header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {}