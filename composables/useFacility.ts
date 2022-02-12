import { OptionExact as HotelSearchFilterOptionExact } from '~/types/misteraladin/api/hotels/searches/filters'

export interface Facility {
  code: string;
  name: string;
}

export default () => {
  const hotelSearchFilterOptionExactToFacility = (o: HotelSearchFilterOptionExact): Facility => {
    return {
      code: String(o.value),
      name: o.label
    }
  }

  return {
    hotelSearchFilterOptionExactToFacility
  }
}
