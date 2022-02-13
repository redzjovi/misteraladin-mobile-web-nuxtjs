import { Review as HotelReviewSearchReview } from '~/types/misteraladin/api/hotel-review/search'
export interface Review {
  code: string;
  content: string;
  date: string;
  from: null | {
    email: string;
    name: string;
  },
  score: number;
  typeName: string;
}

export default () => {
  const hotelReviewSearchReviewToReview = (hrsr: HotelReviewSearchReview): Review => {
    return {
      code: '',
      content: hrsr.pro_comment,
      date: hrsr.date_stayed,
      from: {
        email: hrsr.email,
        name: hrsr.name
      },
      score: hrsr.total_score,
      typeName: hrsr.category
    }
  }

  return {
    hotelReviewSearchReviewToReview
  }
}
