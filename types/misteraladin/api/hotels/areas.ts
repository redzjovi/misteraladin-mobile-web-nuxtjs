import { City } from '~/types/misteraladin/api/hotels/cities';

export interface Area {
  id: number;
  name: string;
  slug: string;
  latitude: number;
  longitude: number;
  zipcode: number;
  category: string;
  city: City;
}
