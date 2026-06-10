import { createAction, createReducer, on, props, createFeatureSelector, createSelector } from '@ngrx/store';

export const setLocation = createAction(
  '[Location] Set Location',
  props<{ city: string; lat: number; lon: number }>()
);

export interface LocationState {
  city: string;
  lat: number;
  lon: number;
}

const initialState: LocationState = {
  city: '', // Begint leeg voor het welkomscherm
  lat: 0,
  lon: 0
};

export const locationReducer = createReducer(
  initialState,
  on(setLocation, (state, { city, lat, lon }) => ({ ...state, city, lat, lon }))
);

export const selectLocationFeature = createFeatureSelector<LocationState>('location');

export const selectCity = createSelector(
  selectLocationFeature,
  (state: LocationState) => state?.city || ''
);