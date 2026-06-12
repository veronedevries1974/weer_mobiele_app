import { Routes } from '@angular/router';
import { ParentComponent } from './parent/parent.component';

export const routes: Routes = [
  {
    path: '',
    component: ParentComponent,
    children: [
      // Stuurt de gebruiker bij een lege URL direct door naar het huidige weer
      { path: '', redirectTo: 'child1', pathMatch: 'full' },
      
      // De subsecties worden ingeladen zodra de gebruiker erop klikt (Lazy Loading)
      { 
        path: 'child1', 
        loadComponent: () => import('./child1/child1.component').then(m => m.Child1Component) 
      },
      { 
        path: 'child2', 
        loadComponent: () => import('./child2/child2.component').then(m => m.Child2Component) 
      },
      { 
        path: 'child3', 
        loadComponent: () => import('./child3/child3.component').then(m => m.Child3Component) 
      }
    ]
  },
  // Fallback: onbekende URL's worden teruggestuurd naar het hoofd-dashboard
  { path: '**', redirectTo: '' }
];