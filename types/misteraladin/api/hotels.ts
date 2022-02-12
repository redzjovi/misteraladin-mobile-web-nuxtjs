/* eslint-disable no-use-before-define */
import { Area } from '~/types/misteraladin/api/hotels/areas';
import { Room } from '~/types/misteraladin/api/hotels/searches';

export interface Badge {
  name: string;
  icon: null;
  image: null;
  title: null;
  background_color: null;
  text_color: null;
  description: null;
  value: string;
}

export interface Hotel {
  id: number;
  name: string;
  email: string;
  address: string;
  star_rating: number;
  latitude: string;
  longitude: string;
  thumbnail_url: string;
  original_image_url_resized: string;
  slug: string;
  review: Review;
  cheapest_room: null | Room;
  gift_box: null;
  distance: string;
  share_link: string;
  share_text: string;
  review_apps: ReviewApps;
  additional_values: string[];
  area: Area;
  badges: Badge[];
}

export interface Review {
  score: number;
  count: number;
  description: string;
  highlights: string;
}

export interface ReviewApps {
  score: number;
  count: number;
  description: string;
}
