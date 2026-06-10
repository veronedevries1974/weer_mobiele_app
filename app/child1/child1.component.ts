import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, switchMap, map } from 'rxjs/operators';
import { selectLocationState } from '../location-reducer';
import { WeatherService } from '../weather.service';
import { ChildService } from '../child.service'; 
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-child1',
  templateUrl: './child1.component.html',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule] 
})
export class Child1Component implements OnInit {
  weatherData$: Observable<any> | undefined;
  ChildInvoerModel: string = '';
  actieveStad: string = '';

  constructor(private store: Store, private weatherService: WeatherService, private childService: ChildService) {}

  ngOnInit(): void {
    this.weatherData$ = this.store.select(selectLocationState).pipe(
      filter(location => !!location),
      map(location => { this.actieveStad = location; return location; }),
      switchMap(location => this.weatherService.getCompleteWeather(location))
    );
  }

  onChildInvoer(): void {
    if (this.ChildInvoerModel.trim()) {
      this.childService.onChildInvoerCreated(this.ChildInvoerModel);
      this.ChildInvoerModel = '';
    }
  }
}