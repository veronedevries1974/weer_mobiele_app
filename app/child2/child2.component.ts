import { Component, OnInit, OnDestroy } from '@angular/core'; 
import { Subscription } from 'rxjs'; 
import { Store } from '@ngrx/store'; 
import { WeatherService } from '../weather.service';
import { ChildService } from '../child.service'; 
import { selectLocationState } from '../location-reducer';
import { CommonModule } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-child2',
  templateUrl: './child2.component.html',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule] 
})
export class Child2Component implements OnInit, OnDestroy { 
  ChildInvoerModel: string = '';
  private storeSub!: Subscription; 
  private weatherSub!: Subscription;
  loc: string = ''; 
  cityName: string = '';
  forecastList: any[] = []; 
  msg: string = '';

  constructor(private childService: ChildService, private weatherService: WeatherService, private store: Store) { }

  ngOnInit(): void {
    this.storeSub = this.store.select(selectLocationState).subscribe({
      next: (loc) => { 
        this.loc = loc; 
        if (loc && loc.trim() !== '') { this.searchForecast(loc); } 
        else { this.forecastList = []; this.cityName = ''; this.msg = 'Voer een locatie in.'; }
      }
    });
  }

  searchForecast(loc: string): void { 
    this.msg = 'Weergegevens laden...'; 
    this.forecastList = []; 
    if (this.weatherSub) this.weatherSub.unsubscribe();

    this.weatherSub = this.weatherService.getCompleteWeather(loc).subscribe({
      next: (res) => { 
        this.cityName = res.name ?? loc;
        if (res.daily && res.daily.time) {
          this.forecastList = res.daily.time.map((timeStr: string, index: number) => ({
            date: new Date(timeStr),
            temp_max: res.daily.temperature_2m_max?.[index],
            temp_min: res.daily.temperature_2m_min?.[index],
            sunrise: res.daily.sunrise?.[index] ? new Date(res.daily.sunrise[index]) : null,
            sunset: res.daily.sunset?.[index] ? new Date(res.daily.sunset[index]) : null,
            uv: res.daily.uv_index_max?.[index] ?? null
          }));
        }
      },
      error: () => this.msg = 'Kon gegevens niet ophalen.'
    });
  }

  resultFound(): boolean { 
    return this.forecastList && this.forecastList.length > 0; 
  }

  onChildInvoer(): void { 
    if (this.ChildInvoerModel.trim()) {
      this.childService.onChildInvoerCreated(this.ChildInvoerModel);
      this.ChildInvoerModel = '';
    }
  }

  ngOnDestroy(): void {
    if (this.storeSub) this.storeSub.unsubscribe();
    if (this.weatherSub) this.weatherSub.unsubscribe();
  }
}