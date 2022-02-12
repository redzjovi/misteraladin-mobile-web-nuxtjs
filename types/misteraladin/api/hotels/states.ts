import { Country } from '~/types/misteraladin/api/hotels/countries';

export interface State {
  id: number;
  name: string;
  slug: string;
  timezone: string;
  country: Country;
}
