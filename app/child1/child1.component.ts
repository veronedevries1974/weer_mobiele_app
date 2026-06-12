import { Component, OnInit, inject } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectCity, selectCurrentWeather, selectDailyWeather } from '../location-reducer';

import { CommonModule, AsyncPipe, DecimalPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-child1',
  templateUrl: './child1.component.html',
  styleUrls: ['./child1.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    AsyncPipe, 
    DecimalPipe, 
    DatePipe, 
    MatCardModule
  ] 
})
export class Child1Component implements OnInit {
  private store = inject(Store);

  public weatherData$: Observable<any> | undefined;
  public loc$: Observable<string> = this.store.select(selectCity); 

  constructor() {}

  ngOnInit(): void {
    this.weatherData$ = combineLatest([
      this.loc$,
      this.store.select(selectCurrentWeather),
      this.store.select(selectDailyWeather)
    ]).pipe(
      map(([name, current, daily]) => {
        if (!name || !current || !daily) return null;
        return { name, current, daily };
      })
    );
  }

  public parseDate(dateStr: string): Date {
    return dateStr ? new Date(dateStr) : new Date();
  }
}