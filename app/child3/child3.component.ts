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
  selector: 'app-child3',
  templateUrl: './child3.component.html', 
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule]
})
export class Child3Component implements OnInit, OnDestroy { 
  ChildInvoerModel: string = '';
  private storeSub!: Subscription; 
  private weatherSub!: Subscription;
  loc: string = ''; 
  cityName: string = '';
  uv: any[] = []; 
  msg: string = '';

  constructor(private childService: ChildService, private weatherService: WeatherService, private store: Store) { }

  ngOnInit(): void {
    this.storeSub = this.store.select(selectLocationState).subscribe({
      next: (loc: string) => { 
        this.loc = loc; 
        if (loc && loc.trim() !== '') { this.getUvData(loc); } 
        else { this.uv = []; this.cityName = ''; this.msg = 'Voer een locatie in.'; }
      }
    });
  }

  getUvData(loc: string): void { 
    this.msg = ''; this.uv = []; 
    if (this.weatherSub) this.weatherSub.unsubscribe();

    this.weatherSub = this.weatherService.getCompleteWeather(loc).subscribe({
      next: (res: any) => { 
        this.cityName = res.name ?? loc;
        if (res.daily && res.daily.uv_index_max) {
          this.uv = res.daily.time.map((timeStr: string, index: number) => ({
            date_iso: new Date(timeStr),
            value: res.daily.uv_index_max[index]
          }));
        }
      },
      error: () => this.msg = 'Kon UV-gegevens niet ophalen.'
    });
  }

  getBadgeClass(value: number): string {
    return value >= 3 ? 'badge-danger' : 'badge-success';
  }

  resultFound(): boolean { 
    return this.uv && this.uv.length > 0; 
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