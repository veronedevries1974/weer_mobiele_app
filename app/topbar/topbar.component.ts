import { Component } from '@angular/core'; 
import { Store } from '@ngrx/store'; 
import { NgForm, FormsModule } from '@angular/forms'; 
import { Observable } from 'rxjs';
import { CommonModule, AsyncPipe } from '@angular/common'; 
import { setLocation, selectCity } from '../location-reducer'; 
import { WeatherService } from '../weather.service'; 

// Angular Material Components
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({ 
  selector: 'app-topbar',
  templateUrl: './topbar.component.html', 
  styleUrls: ['./topbar.component.scss'],
  standalone: true,        
  imports: [
    CommonModule, 
    AsyncPipe,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule
  ]
}) 
export class TopBarComponent { 
  public loc: string = '';
  public cityName$: Observable<string>; 

  constructor(
    private store: Store, 
    private weatherService: WeatherService
  ) { 
    this.cityName$ = this.store.select(selectCity);
  }

  public search(searchForm: NgForm): void { 
    if (searchForm.invalid || !this.loc.trim()) return; 
    
    const gezochteStad = this.loc.trim();

    // DEZE REGEL IS GEFIXED: Geen hardcoded URLs meer op regel 69!
    this.weatherService.getCompleteWeather(gezochteStad).subscribe({
      next: (weatherData) => {
        this.store.dispatch(setLocation({ 
          city: weatherData.name, 
          lat: weatherData.current?.temperature || 0, 
          lon: 0 
        }));
        
        this.loc = '';
        searchForm.resetForm();
      },
      error: (err) => {
        // Hier kwam je foutmelding vandaan:
        console.error('Fout bij ophalen locatie via TopBar:', err);
        alert(`Kon locatie "${gezochteStad}" niet vinden. Probeer het opnieuw.`);
      }
    });
  }
}