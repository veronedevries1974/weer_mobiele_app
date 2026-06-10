import { Component, OnInit, Signal } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { ChildService } from '../child.service'; 
import { selectCity } from '../location-reducer';
import { MatCardModule } from '@angular/material/card';
import { IonRouterOutlet, IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';

@Component ({ 
  selector: 'app-parent', 
  templateUrl: './parent.component.html', 
  styleUrls: ['./parent.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, IonRouterOutlet, IonSegment, IonSegmentButton, IonLabel, RouterModule]
}) 
export class ParentComponent implements OnInit { 
  cityName = toSignal(this.store.select(selectCity));
  invoerWaarde: Signal<string[]>; 
  invoer: Signal<string>; 
  activeTab: string = 'child1'; 

  constructor(private store: Store, private childService: ChildService, private router: Router) { 
    this.invoerWaarde = this.childService.invoerLijst;
    this.invoer = this.childService.laatsteInvoer;
  }

  ngOnInit(): void {
    this.updateActiveTab(this.router.url);
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => this.updateActiveTab(event.url));
  }

  private updateActiveTab(url: string): void {
    const segments = url.split('/');
    this.activeTab = segments[segments.length - 1] || 'child1';
  }

  onChildInvoerDeleted(index: number): void {
    this.childService.onChildInvoerDeleted(index);
  }
}