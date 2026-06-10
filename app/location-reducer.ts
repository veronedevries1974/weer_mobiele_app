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
  city: 'Amsterdam',
  lat: 52.3676,
  lon: 4.9041
};

export const locationReducer = createReducer(
  initialState,
  on(setLocation, (state, { city, lat, lon }) => ({ ...state, city, lat, lon }))
);

export const selectLocationFeature = createFeatureSelector<LocationState>('location');

export const selectLocationState = createSelector(
  selectLocationFeature,
  (state: LocationState) => state ? state.city : ''
);