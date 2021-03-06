/* eslint-disable no-use-before-define */
import { Hotel } from '~/types/misteraladin/api/hotels';

interface Info {
  non_refundable: boolean;
  photos: string[];
  facilities: string[];
  description: string;
}

export interface RequestBody {
  filter: {
    area_id: number[];
    check_in: string;
    city_id: number[];
    coordinate: string;
    coordinate_radius?: null | number;
    country_id: number[];
    facility: number[];
    hotel_id: number[];
    night: number;
    occupancy: number;
    price: null | {
      from: null | number,
      to: null | number
    },
    review: {
      from: null | number,
      to: null | number
    }[],
    room_quantity: number;
    star_rating: number[];
    type_id: number[];
  };
  page: number;
  sort: RequestBodySort;
}

export enum RequestBodySort {
  Default = '',
  PriceHighest = '-price',
  PriceLowest = 'price',
  StarRatingHighest = '-star_rating',
  StarRatingLowest = 'star_rating'
}

export interface ResponseBody {
  data: Hotel[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {
        next: string;
      };
    };
  };
}

interface Rate {
  check_in: string;
  check_out: string;
  total: number;
  average: number;
  average_room_night: number;
  gimmick: number;
  gimmick_room_night: number;
  currency: string;
  allotment: number;
  badges: string[];
}

export interface Room {
  id: {
    source: string;
    key: string;
    breakfast: string;
    id: string;
  };
  name: string;
  mapping_name: string;
  max_occupancy: number;
  minimum_stay: number;
  cancellation_policy: null | string;
  breakfast: number;
  thumbnail_url: string;
  info: null | Info;
  value_added: null;
  rate: Rate;
}
