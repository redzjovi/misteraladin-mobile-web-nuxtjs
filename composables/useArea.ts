import { Area as HotelArea } from '~/types/misteraladin/api/hotels/areas'
import { OptionExact as HotelSearchFilterOptionExact } from '~/types/misteraladin/api/hotels/searches/filters'

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

  const hotelSearchFilterOptionExactToArea = (o: HotelSearchFilterOptionExact): Area => {
    return {
      code: String(o.value),
      name: o.label
    }
  }

  return {
    hotelAreaToArea,
    hotelSearchFilterOptionExactToArea
  }
}
