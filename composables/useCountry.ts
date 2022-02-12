import { Country as HotelCountry } from '~/types/misteraladin/api/hotels/countries'

export interface Country {
  code: string;
  name: string;
}

export default () => {
  const hotelCountryToCountry = (c: HotelCountry): Country => {
    return {
      code: String(c.id),
      name: c.name
    }
  }

  return {
    hotelCountryToCountry
  }
}
