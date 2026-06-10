import { Component, OnInit } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { Observable, of } from 'rxjs';
import { filter, switchMap, map, catchError, tap, distinctUntilChanged } from 'rxjs/operators';
import { WeatherService } from '../weather.service';
import { ChildService } from '../child.service'; 
import { selectCity } from '../location-reducer';

// Angular Core, Pipes & Materials Imports (GEFIXED: AsyncPipe expliciet toegevoegd)
import { CommonModule, AsyncPipe, DecimalPipe, DatePipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-child2',
  templateUrl: './child2.component.html',
  styleUrls: ['./child2.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    AsyncPipe, // GEFIXED: Essentieel voor loc$ | async in de HTML
    DecimalPipe, 
    DatePipe, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    FormsModule
  ] 
})
export class Child2Component implements OnInit { 
  ChildInvoerModel: string = '';
  forecastData$: Observable<{ cityName: string; list: any[]; msg: string }> | undefined;
  
  // GEFIXED: Publiek toegankelijk gemaakt voor de HTML-template
  public loc$: Observable<string>; 
  actieveStad: string = '';

  constructor(
    private childService: ChildService, 
    private weatherService: WeatherService, 
    private store: Store
  ) { 
    this.loc$ = this.store.select(selectCity);
  }

  ngOnInit(): void {
    this.forecastData$ = this.loc$.pipe(
      filter(city => !!city && city.trim() !== ''),
      distinctUntilChanged(),
      tap(city => this.actieveStad = city),
      switchMap(city => 
        this.weatherService.getCompleteWeather(city).pipe(
          map(res => {
            let list: any[] = [];
            if (res.daily && res.daily.time) {
              list = res.daily.time.map((timeStr: string, index: number) => ({
                date: new Date(timeStr),
                temp_max: res.daily.temperature_2m_max?.[index],
                temp_min: res.daily.temperature_2m_min?.[index],
                sunrise: res.daily.sunrise?.[index] ? new Date(res.daily.sunrise[index]) : null,
                sunset: res.daily.sunset?.[index] ? new Date(res.daily.sunset[index]) : null,
                uv: res.daily.uv_index_max?.[index] ?? null
              }));
            }
            return { cityName: res.name ?? city, list, msg: '' };
          }),
          catchError(() => of({ cityName: city, list: [], msg: 'Kon gegevens niet ophalen.' }))
        )
      )
    );
  }

  onChildInvoer(): void { 
    if (this.ChildInvoerModel.trim()) {
      this.childService.onChildInvoerCreated(this.ChildInvoerModel);
      this.ChildInvoerModel = '';
    }
  }
}