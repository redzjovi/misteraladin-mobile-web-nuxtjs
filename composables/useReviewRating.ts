import { OptionRange as HotelSearchFilterOptionRange } from '~/types/misteraladin/api/hotels/searches/filters'

export interface ReviewRating {
  code: string;
  name: string;
}

export default () => {
  const hotelSearchFilterOptionRangeToReviewRating = (o: HotelSearchFilterOptionRange): ReviewRating => {
    return {
      code: String(o.from + '-' + o.to),
      name: o.label
    }
  }

  return {
    hotelSearchFilterOptionRangeToReviewRating
  }
}
