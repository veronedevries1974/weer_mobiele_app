import { Component, OnInit, inject } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { selectCity, selectDailyWeather } from '../location-reducer';

import { CommonModule, AsyncPipe, DecimalPipe, DatePipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-child2',
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    AsyncPipe, 
    DecimalPipe, 
    DatePipe, 
    MatCardModule
  ] 
})
export class Child2Component implements OnInit { 
  private store = inject(Store);

  public forecastData$: Observable<{ cityName: string; list: any[] } | null> | undefined;
  public loc$: Observable<string> = this.store.select(selectCity); 

  constructor() {}

  ngOnInit(): void {
    this.forecastData$ = combineLatest([
      this.loc$,
      this.store.select(selectDailyWeather)
    ]).pipe(
      map(([city, daily]) => {
        if (!city || !daily || !daily.time) return null;

        const list = daily.time.map((timeStr: string, index: number) => ({
          date: new Date(timeStr), 
          temp_max: daily.temperature_2m_max?.[index],
          temp_min: daily.temperature_2m_min?.[index],
          sunrise: daily.sunrise?.[index] ? new Date(daily.sunrise[index]) : null, 
          sunset: daily.sunset?.[index] ? new Date(daily.sunset[index]) : null,   
          uv: daily.uv_index_max?.[index] ?? null
        }));

        return { cityName: city, list };
      })
    );
  }}