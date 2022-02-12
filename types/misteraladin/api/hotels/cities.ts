/* eslint-disable no-use-before-define */
import { State } from '~/types/misteraladin/api/hotels/states';

export interface City {
  id: number;
  name: string;
  slug: string;
  description: null | string;
  images: Image | null;
  state: State;
}

export interface Image {
  ls: string;
}
