/* eslint-disable no-use-before-define */
export interface Filter {
  key: Key;
  method: Method;
  options: OptionExact[] | OptionRange[];
}

export enum Key {
  Area = 'area',
  Facility = 'facility',
  Price = 'price',
  PriceRange = 'price_range',
  Review = 'review',
  StarRating = 'star_rating',
  Tag = 'tag',
  Type = 'type'
}

export enum Method {
  Exact = 'exact',
  Range = 'range'
}

export interface OptionExact {
  label: string;
  count: number;
  value: number;
}

export interface OptionRange {
  label: string;
  count: number;
  from: null | number;
  to: null | number;
}

export interface RequestBody {
  filter: {
    area_id: number[];
    check_in: string;
    city_id: number[];
    country_id: number[];
    night: number;
    coordinate: string
    coordinate_radius?: null | number;
    occupancy: number;
    room_quantity: number
  };
}

export interface ResponseBody {
  data: Filter[];
}
