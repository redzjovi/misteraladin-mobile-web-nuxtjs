import { Country as HotelCountry } from '~/types/misteraladin/api/hotels/countries'

export interface Country {
  code: string;
  name: string;
  slug: string;
}

export default () => {
  const hotelCountryToCountry = (c: HotelCountry): Country => {
    return {
      code: String(c.id),
      name: c.name,
      slug: c.slug + '-' + String(c.id)
    }
  }

  return {
    hotelCountryToCountry
  }
}
