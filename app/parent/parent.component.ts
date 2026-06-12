import { Component, OnInit, inject } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { selectCity } from '../location-reducer';
import { MatCardModule } from '@angular/material/card';

// CRUCIAAL: Importeer de Ionic-elementen die in de HTML worden gebruikt
import { IonSegment, IonSegmentButton, IonLabel, IonRouterOutlet } from '@ionic/angular/standalone';

@Component({ 
  selector: 'app-parent', 
  templateUrl: './parent.component.html', 
  styleUrls: ['./parent.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    RouterModule,        // Nodig voor routerLink en router-outlet
    IonSegment,          // Nodig voor de menubalk
    IonSegmentButton,    // Nodig voor de menuknoppen
    IonLabel,            // Nodig voor de tekst binnen de knoppen
    IonRouterOutlet      // Nodig om de child-componenten binnen deze pagina te renderen
  ]
}) 
export class ParentComponent implements OnInit { 
  private store = inject(Store);
  private router = inject(Router);

  // Signal die live luistert naar de stadsnaam in de store
  cityName = toSignal(this.store.select(selectCity));
  
  // Houdt bij welke tab momenteel actief is (matched met de ion-segment value)
  activeTab: string = 'child1'; 

  ngOnInit(): void {
    // Initialiseer de actieve tab op basis van de huidige URL bij het opstarten
    this.updateActiveTab(this.router.url);

    // Luister naar toekomstige routewijzigingen om de segmentknop synchroon te houden
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveTab(event.url);
    });
  }

  private updateActiveTab(url: string): void {
    if (!url) return;

    // GECORRIGEERD: Haal veilig queryparameters (?) en hashes (#) weg
    const urlWithoutParams = url.split('?')[0];
    const urlWithoutHash = urlWithoutParams.split('#')[0];
    
    // Splits de overgebleven schone URL op in segmenten
    const segments = urlWithoutHash.split('/');
    
    // Pak het allerlaatste segment (bijv. 'child1', 'child2' of 'child3')
    this.activeTab = segments[segments.length - 1] || 'child1';
  }
}