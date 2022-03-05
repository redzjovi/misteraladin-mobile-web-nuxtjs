import {
  Review as HotelReviewSearchReview,
  RequestBodySort as HotelReviewSearchRequestBodySort
} from '~/types/misteraladin/api/hotel-review/search'
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

export enum Sort {
  Default = '',
  Latest = '-date',
  ScoreHighest = '-score',
  ScoreLowest = 'score'
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

  const sortToHotelReviewSearchRequestBodySort = (sort: Sort): HotelReviewSearchRequestBodySort => {
    let newSort = HotelReviewSearchRequestBodySort.Default
    if (sort === Sort.Default) {
      newSort = HotelReviewSearchRequestBodySort.Default
    } else if (sort === Sort.Latest) {
      newSort = HotelReviewSearchRequestBodySort.Newest
    } else if (sort === Sort.ScoreHighest) {
      newSort = HotelReviewSearchRequestBodySort.RatingHighest
    } else if (sort === Sort.ScoreLowest) {
      newSort = HotelReviewSearchRequestBodySort.RatingLowest
    }
    return newSort
  }

  return {
    hotelReviewSearchReviewToReview,
    sortToHotelReviewSearchRequestBodySort
  }
}
