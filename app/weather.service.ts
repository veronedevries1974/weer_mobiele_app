import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  public getCompleteWeather(loc: string): Observable<any> {
    // Correcte Open-Meteo Geocoding API endpoint
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(loc)}&count=1&language=nl&format=json`;

    return this.http.get<any>(geoUrl).pipe(
      switchMap((geoRes: any) => {
        if (!geoRes || !geoRes.results || geoRes.results.length === 0) {
          return throwError(() => new Error(`Locatie "${loc}" niet gevonden.`));
        }
        
        const city = geoRes.results[0]; // .at(0) vervangen voor bredere browser-ondersteuning
        // Correcte Open-Meteo Forecast API endpoint
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto`;

        return this.http.get<any>(weatherUrl).pipe(
          map((weatherRes: any) => {
            return {
              name: city.name,
              lat: city.latitude,
              lon: city.longitude,
              current: {
                temperature: weatherRes.current?.temperature_2m,
                windspeed: weatherRes.current?.wind_speed_10m,
                winddirection: weatherRes.current?.wind_direction_10m
              },
              daily: {
                time: weatherRes.daily?.time || [],
                temperature_2m_max: weatherRes.daily?.temperature_2m_max || [],
                temperature_2m_min: weatherRes.daily?.temperature_2m_min || [],
                sunrise: weatherRes.daily?.sunrise || [],
                sunset: weatherRes.daily?.sunset || [],
                uv_index_max: weatherRes.daily?.uv_index_max || []
              }
            };
          })
        );
      })
    );
  }
}