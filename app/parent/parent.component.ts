import { Component, OnInit, inject, ViewChild, ElementRef } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { Router, NavigationEnd, RouterModule, RouterOutlet } from '@angular/router'; 
import { CommonModule } from '@angular/common'; 
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { selectCity } from '../location-reducer';
import { MatCardModule } from '@angular/material/card';
import { IonSegment, IonSegmentButton, IonLabel } from '@ionic/angular/standalone';

@Component({ 
  selector: 'app-parent', 
  templateUrl: './parent.component.html', 
  styleUrls: ['./parent.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    RouterModule,        
    RouterOutlet,        
    IonSegment,          
    IonSegmentButton,    
    IonLabel            
  ]
}) 
export class ParentComponent implements OnInit { 
  private store = inject(Store);
  private router = inject(Router);

  // Grijpt de buitenkant van de parent-component vast in de HTML
  @ViewChild('scrollTarget', { static: false }) scrollTarget!: ElementRef;

  cityName = toSignal(this.store.select(selectCity));
  activeTab: string = 'child1'; 

  ngOnInit(): void {
    this.updateActiveTab(this.router.url);

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.updateActiveTab(event.url);
      
      // FUNCTIE: Zodra de tab wisselt, scrolt de parent-container direct soepel in beeld
      setTimeout(() => {
        if (this.scrollTarget) {
          this.scrollTarget.nativeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 50); // Kleine micro-timeout om de nieuwe child-DOM de tijd te geven om te laden
    });
  }

  private updateActiveTab(url: string): void {
    if (!url) return;
    if (url.includes('child3')) {
      this.activeTab = 'child3';
    } else if (url.includes('child2')) {
      this.activeTab = 'child2';
    } else {
      this.activeTab = 'child1';
    }
  }
}