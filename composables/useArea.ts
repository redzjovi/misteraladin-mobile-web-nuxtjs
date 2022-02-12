import { Area as HotelArea } from '~/types/misteraladin/api/hotels/areas'

export interface Area {
  code: string;
  name: string;
}

export default () => {
  const hotelAreaToArea = (a: HotelArea): Area => {
    return {
      code: String(a.id),
      name: a.name
    }
  }

  return {
    hotelAreaToArea
  }
}
