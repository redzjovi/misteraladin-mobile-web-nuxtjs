import { useContext } from '@nuxtjs/composition-api'
import useArea, {
  Area
} from '~/composables/useArea'
import useCity, {
  City
} from '~/composables/useCity'
import useCountry, {
  Country
} from '~/composables/useCountry'
import useFacility,
{
  Facility
} from '~/composables/useFacility'
import useImage, {
  Image
} from '~/composables/useImage'
import { Hotel as HotelHotel } from '~/types/misteraladin/api/hotels'

export interface Hotel {
  address: string;
  area: Area;
  city: City;
  code: string;
  country: Country;
  distance: string;
  facilities: Facility[];
  freeBreakfast: boolean;
  freeCancellation: boolean;
  images: Image[];
  latitude: number;
  longitude: number;
  name: string;
  priceFrom: null | number;
  price: null | number;
  reviewRatingCount: number;
  reviewRatingName: string;
  reviewRatingScore: number;
  slug: string;
  starRating: number;
}

export default () => {
  const area = useArea()
  const city = useCity()
  const {
    $axios,
    $config
  } = useContext()
  const country = useCountry()
  const facility = useFacility()
  const image = useImage()

  const getHotel = (code: string) => new Promise<Hotel>((resolve, reject) => {
    $axios.get(
      $config.hotelApiUrl + '/' + code
    ).then(r => {
      resolve(
        hotelHotelToHotel(r.data.data as HotelHotel)
      )
    }).catch(e => {
      reject(e)
    })
  })

  const hotelHotelToHotel = (h: HotelHotel): Hotel => {
    return {
      address: h.address,
      area: area.hotelAreaToArea(h.area),
      city: city.hotelCityToCity(h.area.city),
      code: String(h.id),
      country: country.hotelCountryToCountry(h.area.city.state.country),
      distance: h.distance,
      facilities: h.facilities?.map(f => facility.hotelFacilityToFacility(f)) || [],
      freeBreakfast: Number(h.cheapest_room?.breakfast) > 0,
      freeCancellation: Boolean(h.cheapest_room?.info?.non_refundable) === false,
      images: [image.hotelHotelToImage(h)],
      latitude: Number(h.latitude),
      longitude: Number(h.longitude),
      name: h.name,
      priceFrom: Number(h.cheapest_room?.rate.gimmick_room_night),
      price: Number(h.cheapest_room?.rate.average_room_night),
      reviewRatingCount: h.review.count,
      reviewRatingName: h.review.description,
      reviewRatingScore: h.review.score,
      slug: h.slug + '-' + h.id,
      starRating: h.star_rating
    }
  }

  return {
    getHotel,
    hotelHotelToHotel
  }
}