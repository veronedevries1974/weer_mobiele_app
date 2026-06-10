import { Component } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { Observable } from 'rxjs';
import { ChildService } from '../child.service'; 
import { selectLocationState } from '../location-reducer';
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { IonRouterOutlet, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';
import { RouterModule } from '@angular/router';

@Component ({ 
  selector: 'app-parent', 
  templateUrl: './parent.component.html', 
  standalone: true,
  imports: [CommonModule, MatCardModule, IonRouterOutlet, IonSegment, IonSegmentButton, IonLabel, RouterModule]
}) 
export class ParentComponent { 
  loc$: Observable<string>; 
  invoerWaarde$: Observable<string[]>; 
  invoer$: Observable<string>; 

  constructor(private store: Store, private childService: ChildService) { 
    this.loc$ = this.store.select(selectLocationState); 
    this.invoerWaarde$ = this.childService.invoerLijst$;
    this.invoer$ = this.childService.laatsteInvoer$;
  }

  onChildInvoerDeleted(item: string): void {
    this.childService.onChildInvoerDeleted(item);
  }
}