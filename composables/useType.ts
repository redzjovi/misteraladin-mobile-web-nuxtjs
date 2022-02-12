import { OptionExact as HotelSearchFilterOptionExact } from '~/types/misteraladin/api/hotels/searches/filters'

export interface Type {
  code: string;
  name: string;
}

export default () => {
  const hotelSearchFilterOptionExactToType = (o: HotelSearchFilterOptionExact): Type => {
    return {
      code: String(o.value),
      name: o.label
    }
  }

  return {
    hotelSearchFilterOptionExactToType
  }
}
