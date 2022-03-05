import { Facility as HotelIdFacility } from '~/types/misteraladin/api/hotels/_id/facilities'

export interface Group {
  code: string;
  name: string;
}

export default () => {
  const hotelIdFacilityToGroup = (f: HotelIdFacility) => {
    return {
      code: f.group.toLowerCase(),
      name: f.group
    }
  }

  return {
    hotelIdFacilityToGroup
  }
}
