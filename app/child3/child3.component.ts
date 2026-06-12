import { Component, OnInit, inject } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectCity, selectDailyWeather } from '../location-reducer';

import { CommonModule, AsyncPipe, DecimalPipe, DatePipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-child3',
  templateUrl: './child3.component.html', 
  styleUrls: ['./child3.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    AsyncPipe, 
    DecimalPipe, 
    DatePipe, 
    MatCardModule
  ]
})
export class Child3Component implements OnInit { 
  private store = inject(Store);

  public uvData$: Observable<{ cityName: string; list: any[] } | null> | undefined;
  public loc$: Observable<string> = this.store.select(selectCity); 

  constructor() {}

  ngOnInit(): void {
    this.uvData$ = combineLatest([
      this.loc$,
      this.store.select(selectDailyWeather)
    ]).pipe(
      map(([city, daily]) => {
        if (!city || !daily || !daily.time || !daily.uv_index_max) return null;

        const list = daily.time.map((timeStr: string, index: number) => ({
          date: new Date(timeStr),
          value: daily.uv_index_max[index]
        }));

        return { cityName: city, list };
      })
    );
  }

  public getBadgeClass(value: number): string {
    if (value <= 2) return 'badge-success';
    if (value <= 5) return 'badge-warning';
    return 'badge-danger';
  }
}