/* eslint-disable no-use-before-define */
export interface RequestBody {
  filter: {
    hotel_id: string;
    category?: string;
  },
  sort?: RequestBodySort;
  page?: number;
  perpage?: number;
}

export enum RequestBodySort {
  Default = '',
  Newest = 'newest',
  RatingLowest = 'lowest',
  RatingHighest = 'highest'
}

export interface ResponseBody {
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
    }
  },
  data: {
    summary: {
      location: number;
      cleanness: number;
      comfort: number;
      services: number;
      facilities: number;
      price: number;
      total_score: number;
      criteria: string;
    },
    reviews: Review[]
  }
}

export interface Review {
  name: string;
  email: string;
  date_stayed: string;
  category: string;
  location: number;
  cleanness: number;
  comfort: number;
  services: number;
  facilities: number;
  price: number;
  total_score: number;
  subject: string;
  pro_comment: string;
  cons_comment: string;
  criteria: string;
}
