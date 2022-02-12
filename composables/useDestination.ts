import {
  reactive,
  ref,
  useContext,
  watch
} from '@nuxtjs/composition-api'
import _ from 'lodash'
import {
  Data,
  DataType
} from '~/types/misteraladin/api/generals/v2/autocompletes'

export interface Destination {
  address: string;
  areaCode: string;
  cityCode: string;
  countryCode: string;
  hotelCode: string;
  latitude: null | number;
  longitude: null | number;
  name: string;
  poiCode: string;
  totalHotel: number;
  typeName: string;
}

export default () => {
  const {
    $axios,
    $config,
    i18n
  } = useContext()

  const state = reactive({
    keyword: ref(''),
    loading: ref(false),
    options: ref<Destination[]>([])
  })

  const generalV2AutocompletesToDestinations = (data: Data): Destination[] => {
    const destinations: Destination[] = [];

    Object.entries(data)
      .forEach(([type, autocomplete]) => {
        autocomplete.value.forEach(acv => {
          if (destinations.length === 20) {
            return;
          }

          destinations.push({
            address: acv.location,
            areaCode: (type === DataType.areas ? acv.id.toString() : ''),
            cityCode: (type === DataType.cities ? acv.id.toString() : ''),
            countryCode: (type === DataType.countries ? acv.id.toString() : ''),
            hotelCode: (type === DataType.hotels ? acv.id.toString() : ''),
            latitude: acv.latitude,
            longitude: acv.longitude,
            name: acv.name,
            poiCode: (type === DataType.pois ? acv.id.toString() : ''),
            totalHotel: acv.hotel_count,
            typeName: autocomplete.title
          })
        })
      })

    return destinations
  }

  const getCurrentPosition = () => new Promise<Destination>((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      positionCallback => {
        resolve({
          address: '',
          areaCode: '',
          cityCode: '',
          countryCode: '',
          hotelCode: '',
          latitude: positionCallback.coords.latitude,
          longitude: positionCallback.coords.longitude,
          name: i18n.t('components.destinationInput.nearMe').toString(),
          poiCode: '',
          totalHotel: 0,
          typeName: ''
        })
      },
      positionErrorCallback => {
        reject(positionErrorCallback)
      },
      { enableHighAccuracy: true }
    )
  })

  watch(() => state.keyword, _.debounce((newKeyword: string) => {
    state.loading = true
    state.options = []
    $axios.get($config.generalApiUrl + '/v2/autocompletes', {
      params: {
        keyword: newKeyword,
        order_by: 'cities,areas',
      },
    }).then(r => {
      state.options = generalV2AutocompletesToDestinations(r.data.data as Data)
    }).finally(() => {
      state.loading = false
    })
  }, 1000))

  return {
    getCurrentPosition,
    state
  }
}
