import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- Remplacer provideAnimationsAsync()
import { MatDialogModule } from '@angular/material/dialog';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideNativeDateAdapter } from '@angular/material/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimations(),
    provideNativeDateAdapter(),
    importProvidersFrom(MatDialogModule,OverlayModule, CommonModule )
    
  ]
};