import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { WeatherService } from './weather.service'; 
import { loadLocation, setLocation, loadLocationFailed } from './location-reducer'; 
import { map, switchMap, catchError, of } from 'rxjs';
import { ToastController } from '@ionic/angular/standalone'; // Ionic import toegevoegd

@Injectable()
export class LocationEffects {
  private actions$ = inject(Actions);
  private weatherService = inject(WeatherService);
  private toastController = inject(ToastController); // ToastController geïnjecteerd

  loadLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLocation),
      switchMap(action =>
        this.weatherService.getCompleteWeather(action.cityName).pipe(
          map(weatherData => setLocation({ 
            city: weatherData.name, 
            lat: weatherData.lat, 
            lon: weatherData.lon,
            current: weatherData.current,
            daily: weatherData.daily
          })),
          catchError(error => {
            console.error('Fout tijdens ophalen weerdata:', error);
            
            // Ionic Toast tonen in plaats van de storende alert
            this.showErrorToast(action.cityName);

            return of(loadLocationFailed());
          })
        )
      )
    )
  );

  // Hulpmethode voor een vloeiende Ionic melding
  private async showErrorToast(cityName: string) {
    const toast = await this.toastController.create({
      message: `Locatie "${cityName}" kon niet worden gevonden.`,
      duration: 3000,
      position: 'bottom',
      color: 'danger' // Kleurt de toast rood, passend bij je CSS
    });
    await toast.present();
  }
}