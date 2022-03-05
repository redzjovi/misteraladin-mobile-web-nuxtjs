import useGroup, {
  Group
} from '~/composables/useGroup';
import { Facility as HotelIdFacility } from '~/types/misteraladin/api/hotels/_id/facilities'
import { OptionExact as HotelSearchFilterOptionExact } from '~/types/misteraladin/api/hotels/searches/filters'

export interface Facility {
  code: string;
  name: string;
  group: Group | null;
}

export default () => {
  const group = useGroup()

  const hotelFacilityToFacility = (f: string) => {
    return {
      code: '',
      name: f,
      group: null
    }
  }

  const hotelIdFacilityToFacility = (f: HotelIdFacility) => {
    return {
      code: f.key,
      name: f.value,
      group: group.hotelIdFacilityToGroup(f)
    }
  }

  const hotelSearchFilterOptionExactToFacility = (o: HotelSearchFilterOptionExact): Facility => {
    return {
      code: String(o.value),
      name: o.label,
      group: null
    }
  }

  return {
    hotelFacilityToFacility,
    hotelIdFacilityToFacility,
    hotelSearchFilterOptionExactToFacility
  }
}
