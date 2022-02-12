interface Value {
  hotel_count: number;
  id: number;
  latitude: null | number;
  location: string;
  longitude: null | number;
  name: string;
  url: string;
}

interface Autocomplete {
  title: string;
  value: Value[];
}

export interface Data {
  [type: string]: Autocomplete;
}

export enum DataType {
  areas = 'areas',
  cities = 'cities',
  countries = 'countries',
  hotels = 'hotels',
  pois = 'pois'
}
