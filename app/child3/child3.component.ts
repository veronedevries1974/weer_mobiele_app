import { Component, OnInit } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { Observable, of } from 'rxjs';
import { filter, switchMap, map, catchError, tap, distinctUntilChanged } from 'rxjs/operators';
import { WeatherService } from '../weather.service';
import { ChildService } from '../child.service'; 
import { selectCity } from '../location-reducer';

// Angular Core, Pipes & Materials Imports (Essentieel voor standalone)
import { CommonModule, AsyncPipe, DecimalPipe, DatePipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

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
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    FormsModule
  ]
})
export class Child3Component implements OnInit { 
  // Al deze variabelen moeten exact zo overgenomen worden voor de HTML-koppeling
  public ChildInvoerModel: string = '';
  public uvData$: Observable<{ cityName: string; list: any[]; msg: string }> | undefined;
  public loc$: Observable<string>; 
  public actieveStad: string = '';

  constructor(
    private childService: ChildService, 
    private weatherService: WeatherService, 
    private store: Store
  ) { 
    // GEFIXED: Koppel loc$ direct aan de store-selector
    this.loc$ = this.store.select(selectCity);
  }

  ngOnInit(): void {
    // GEFIXED: Hier wordt uvData$ opgebouwd en gevuld met cityName, list en msg
    this.uvData$ = this.loc$.pipe(
      filter(city => !!city && city.trim() !== ''),
      distinctUntilChanged(),
      tap(city => this.actieveStad = city),
      switchMap(city => 
        this.weatherService.getCompleteWeather(city).pipe(
          map(res => {
            let list: any[] = [];
            if (res.daily && res.daily.uv_index_max) {
              list = res.daily.time.map((timeStr: string, index: number) => ({
                date_iso: new Date(timeStr),
                value: res.daily.uv_index_max[index]
              }));
            }
            return { cityName: res.name ?? city, list, msg: '' };
          }),
          catchError(() => of({ cityName: city, list: [], msg: 'Kon UV-gegevens niet ophalen.' }))
        )
      )
    );
  }

  public getBadgeClass(value: number): string {
    if (value <= 2) return 'badge-success';
    if (value > 2 && value <= 5) return 'badge-warning';
    return 'badge-danger';
  }

  public onChildInvoer(): void { 
    if (this.ChildInvoerModel.trim()) {
      this.childService.onChildInvoerCreated(this.ChildInvoerModel);
      this.ChildInvoerModel = '';
    }
  }
}