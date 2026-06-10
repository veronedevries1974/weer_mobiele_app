import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMap, tap, distinctUntilChanged } from 'rxjs/operators';
import { selectCity } from '../location-reducer';
import { WeatherService } from '../weather.service';
import { ChildService } from '../child.service'; 

// Angular Material & Core Imports
import { CommonModule, AsyncPipe, DecimalPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

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
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    FormsModule
  ] 
})
export class Child1Component implements OnInit {
  weatherData$: Observable<any> | undefined;
  loc$: Observable<string>; 
  ChildInvoerModel: string = '';
  actieveStad: string = '';

  constructor(private store: Store, private weatherService: WeatherService, private childService: ChildService) {
    this.loc$ = this.store.select(selectCity);
  }

  ngOnInit(): void {
    this.weatherData$ = this.loc$.pipe(
      filter(city => !!city && city.trim() !== ''),
      distinctUntilChanged(),
      tap(city => this.actieveStad = city),
      switchMap(city => this.weatherService.getCompleteWeather(city))
    );
  }

  onChildInvoer(): void {
    if (this.ChildInvoerModel.trim()) {
      this.childService.onChildInvoerCreated(this.ChildInvoerModel);
      this.ChildInvoerModel = '';
    }
  }

  parseDate(dateStr: string): Date {
    return dateStr ? new Date(dateStr) : new Date();
  }
}