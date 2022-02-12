import { City as HotelCity } from '~/types/misteraladin/api/hotels/cities'

export interface City {
  code: string;
  name: string;
}

export default () => {
  const hotelCityToCity = (c: HotelCity): City => {
    return {
      code: String(c.id),
      name: c.name
    }
  }

  return {
    hotelCityToCity
  }
}
