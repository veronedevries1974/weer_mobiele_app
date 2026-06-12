import { createAction, createReducer, on, props, createFeatureSelector, createSelector } from '@ngrx/store';

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  winddirection: number;
}

export interface DailyWeather {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
}

export interface LocationState {
  city: string;
  lat: number;
  lon: number;
  current: CurrentWeather | null;
  daily: DailyWeather | null;
  loading: boolean;
}


export const loadLocation = createAction('[Location] Load Location', props<{ cityName: string }>());
export const setLocation = createAction('[Location] Set Location', props<{ city: string; lat: number; lon: number; current: CurrentWeather; daily: DailyWeather }>());
export const loadLocationFailed = createAction('[Location] Load Location Failed');


const initialState: LocationState = {
  city: '',
  lat: 0,
  lon: 0,
  current: null,
  daily: null,
  loading: false
};


export const locationReducer = createReducer(
  initialState,
  on(loadLocation, (state) => ({ ...state, loading: true })),
  on(setLocation, (state, { city, lat, lon, current, daily }) => ({ ...state, city, lat, lon, current, daily, loading: false })),
  on(loadLocationFailed, (state) => ({ ...state, loading: false }))
);


export const selectLocationFeature = createFeatureSelector<LocationState>('location');
export const selectCity = createSelector(selectLocationFeature, (state) => state?.city || '');
export const selectCurrentWeather = createSelector(selectLocationFeature, (state) => state?.current);
export const selectDailyWeather = createSelector(selectLocationFeature, (state) => state?.daily);
export const selectWeatherLoading = createSelector(selectLocationFeature, (state) => state?.loading);