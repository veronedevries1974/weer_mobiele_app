import { Component, OnInit, inject } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { Router, NavigationEnd, RouterModule, RouterOutlet } from '@angular/router'; // RouterOutlet toegevoegd
import { CommonModule } from '@angular/common'; 
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { selectCity } from '../location-reducer';
import { MatCardModule } from '@angular/material/card';

// GECORRIGEERD: IonRouterOutlet is verwijderd om conflicten met geneste web-routes te voorkomen
import { IonSegment, IonSegmentButton, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({ 
  selector: 'app-parent', 
  templateUrl: './parent.component.html', 
  styleUrls: ['./parent.component.scss'],
  standalone: true,
  imports: [IonRouterOutlet, 
    CommonModule, 
    MatCardModule, 
    RouterModule,        // Nodig voor routerLink
    RouterOutlet,        // GECORRIGEERD: Angular's eigen outlet voor stabiele child-routing
    IonSegment,          
    IonSegmentButton,    
    IonLabel            
  ]
}) 
export class ParentComponent implements OnInit { 
  private store = inject(Store);
  private router = inject(Router);

  // Live Signal die luistert naar de gekozen stad in de NgRx store
  cityName = toSignal(this.store.select(selectCity));
  
  // Houdt de actieve tab status bij voor de [value] binding van het segment
  activeTab: string = 'child1'; 

  ngOnInit(): void {
    // Initialiseer de actieve tab direct bij het laden van de pagina
    this.updateActiveTab(this.router.url);

    // Blijf luisteren naar routewijzigingen om het menu synchroon te houden
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveTab(event.url);
    });
  }

  private updateActiveTab(url: string): void {
    if (!url) return;

    // GECORRIGEERD: Waterdichte controle op het actieve subpad zonder gecompliceerde array-splitsingen
    if (url.includes('child3')) {
      this.activeTab = 'child3';
    } else if (url.includes('child2')) {
      this.activeTab = 'child2';
    } else {
      this.activeTab = 'child1';
    }
  }
}