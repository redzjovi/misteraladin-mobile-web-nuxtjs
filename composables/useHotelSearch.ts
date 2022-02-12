/* eslint-disable no-console */
import {
  computed,
  reactive,
  ref,
  useContext,
  useRoute
} from '@nuxtjs/composition-api'
import { Destination } from '~/composables/useDestination'
import useHotel, {
  Hotel
} from '~/composables/useHotel'
import useJson from '~/composables/useJson'
import {
  RequestBody as HotelSearchRequestBody,
  RequestBodySort as HotelSearchRequestBodySort,
  ResponseBody as HotelSearchResponseBody
} from '~/types/misteraladin/api/hotels/searches'

export enum Sort {
  Default = '',
  PriceHighest = '-price',
  PriceLowest = 'price',
  StarRatingHighest = '-starRating',
  StarRatingLowest = 'starRating'
}

export default () => {
  const {
    $axios,
    $config,
    $dayjs,
    i18n
  } = useContext()
  const hotel = useHotel()
  const json = useJson()
  const $route = useRoute()

  const state = reactive({
    data: ref<Hotel[]>([]),
    filter: {
      areaCodes: ref<string[]>([]),
      checkIn: ref($dayjs().format('YYYY-MM-DD')),
      checkOut: ref($dayjs().add(1, 'day').format('YYYY-MM-DD')),
      cityCodes: ref<string[]>([]),
      countryCodes: ref<string[]>([]),
      destination: ref<Destination | null>(null),
      guest: ref(2),
      hotelCodes: ref<string[]>([]),
      latitude: ref<null | number>(null),
      longitude: ref<null | number>(null),
      room: ref(1),
      sort: ref(Sort.Default)
    },
    infiniteScroll: ref(false),
    loading: ref(false),
    meta: {
      page: ref(1),
      totalPage: ref<null | number>(null)
    },
    sort: {
      options: [
        { id: Sort.Default, name: i18n.t('pages.hotel-search.sort.options.default.label') },
        { id: Sort.PriceLowest, name: i18n.t('pages.hotel-search.sort.options.priceLowest.label') },
        { id: Sort.PriceHighest, name: i18n.t('pages.hotel-search.sort.options.priceHighest.label') },
        { id: Sort.StarRatingLowest, name: i18n.t('pages.hotel-search.sort.options.starRatingLowest.label') },
        { id: Sort.StarRatingHighest, name: i18n.t('pages.hotel-search.sort.options.starRatingHighest.label') }
      ]
    }
  })

  const stateFilterAreaCodes = computed(() => {
    const areaCodes = [...state.filter.areaCodes]
    if (state.filter.destination?.areaCode) {
      areaCodes.push(state.filter.destination.areaCode)
    }
    return areaCodes.filter(Boolean)
  })

  const stateFilterCityCodes = computed(() => {
    const cityCodes = [...state.filter.cityCodes]
    if (state.filter.destination?.cityCode) {
      cityCodes.push(state.filter.destination.cityCode)
    }
    return cityCodes.filter(Boolean)
  })

  const stateFilterCountryCodes = computed(() => {
    const countryCodes = [...state.filter.countryCodes]
    if (state.filter.destination?.countryCode) {
      countryCodes.push(state.filter.destination.countryCode)
    }
    return countryCodes.filter(Boolean)
  })

  const stateFilterDestinationName = computed(() => {
    return state.filter.destination?.name
  })

  const stateFilterHotelCodes = computed(() => {
    const hotelCodes = [...state.filter.hotelCodes]
    if (state.filter.destination?.hotelCode) {
      hotelCodes.push(state.filter.destination.hotelCode)
    }
    return hotelCodes.filter(Boolean)
  })

  const stateFilterNight = computed(() => {
    return $dayjs(state.filter.checkOut)
      .diff(state.filter.checkIn, 'day')
  })

  const getHotels = () => {
    state.loading = true
    $axios.post(
      $config.hotelApiUrl + '/searches',
      stateToHotelSearchRequestBody()
    ).then(r => {
      const responseBody = (r.data as HotelSearchResponseBody)
      responseBody.data.forEach(h => {
        const dataHotel = hotel.hotelHotelToHotel(h)
        if (Number(dataHotel?.price) > 0) {
          state.data.push(dataHotel)
        }
      })
      state.meta.totalPage = responseBody.meta.pagination.total_pages
    }).finally(() => {
      state.loading = false
    })
  }

  const loadMore = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (state.meta.page >= Number(state.meta.totalPage)) {
          return
        }

        state.infiniteScroll = true
        state.meta.page++
        getHotels()
      }
    })
  }

  const queryToStateFilter = () => {
    state.filter.areaCodes = $route.value.query.area ? String($route.value.query.area).split(',') : []
    if ($route.value.query.checkIn) {
      state.filter.checkIn = String($route.value.query.checkIn)
    }
    if ($route.value.query.checkOut) {
      state.filter.checkOut = String($route.value.query.checkOut)
    }
    state.filter.cityCodes = $route.value.query.city ? String($route.value.query.city).split(',') : []
    state.filter.countryCodes = $route.value.query.country ? String($route.value.query.country).split(',') : []
    state.filter.destination = queryToStateFilterDestination()
    if ($route.value.query.guest) {
      state.filter.guest = Number($route.value.query.guest)
    }
    state.filter.hotelCodes = $route.value.query.hotel ? String($route.value.query.hotel).split(',') : []
    state.filter.latitude = $route.value.query.latitude ? Number($route.value.query.latitude) : null
    state.filter.longitude = $route.value.query.longitude ? Number($route.value.query.longitude) : null
    if ($route.value.query.room) {
      state.filter.room = Number($route.value.query.room)
    }
    state.filter.sort = $route.value.query.sort ? String($route.value.query.sort) as Sort : Sort.Default
  }

  const queryToStateFilterDestination = () => {
    let destination: Destination | null = null

    if ($route.value.query['d.name']) {
      destination = {
        address: '',
        areaCode: $route.value.query['d.area'] ? String($route.value.query['d.name']) : '',
        cityCode: $route.value.query['d.city'] ? String($route.value.query['d.city']) : '',
        countryCode: $route.value.query['d.country'] ? String($route.value.query['d.country']) : '',
        hotelCode: $route.value.query['d.hotel'] ? String($route.value.query['d.hotel']) : '',
        latitude: $route.value.query.latitude ? Number($route.value.query.latitude) : null,
        longitude: $route.value.query.longitude ? Number($route.value.query.longitude) : null,
        name: String($route.value.query['d.name']),
        poiCode: $route.value.query['d.poi'] ? String($route.value.query['d.poi']) : '',
        totalHotel: 0,
        typeName: '',
      }
    }

    return destination
  }

  const stateDataReset = () => {
    state.data = []
    state.meta.page = 1
  }

  const stateFilterSortReset = () => {
    state.filter.sort = Sort.Default
  }

  const stateFilterSortToRequestBodySort = (sort: Sort) => {
    let newSort = ''
    if (sort === Sort.Default) {
      newSort = HotelSearchRequestBodySort.Default
    } else if (sort === Sort.PriceHighest) {
      newSort = HotelSearchRequestBodySort.PriceHighest
    } else if (sort === Sort.PriceLowest) {
      newSort = HotelSearchRequestBodySort.PriceLowest
    } else if (sort === Sort.StarRatingHighest) {
      newSort = HotelSearchRequestBodySort.StarRatingHighest
    } else if (sort === Sort.StarRatingLowest) {
      newSort = HotelSearchRequestBodySort.StarRatingLowest
    }
    return newSort
  }

  const stateToHotelSearchRequestBody = () => {
    const requestBody: HotelSearchRequestBody = {
      filter: {
        area_id: stateFilterAreaCodes.value.map(ac => Number(ac)),
        check_in: state.filter.checkIn,
        city_id: stateFilterCityCodes.value.map(cc => Number(cc)),
        coordinate: [state.filter.destination?.latitude, state.filter.destination?.longitude].filter(Boolean).map(d => String(d)).join(','),
        country_id: stateFilterCountryCodes.value.map(cc => Number(cc)),
        hotel_id: stateFilterHotelCodes.value.map(hc => Number(hc)),
        night: stateFilterNight.value,
        occupancy: state.filter.guest,
        room_quantity: state.filter.room
      },
      page: state.meta.page,
      sort: stateFilterSortToRequestBodySort(state.filter.sort) as HotelSearchRequestBodySort
    }

    return json.pickBy(requestBody)
  }

  const stateToQuery = () => {
    const query = {
      area: state.filter.areaCodes.join(','),
      checkIn: state.filter.checkIn.toString(),
      checkOut: state.filter.checkOut.toString(),
      city: state.filter.cityCodes.join(','),
      country: state.filter.countryCodes.join(','),
      'd.area': state.filter.destination?.areaCode,
      'd.city': state.filter.destination?.cityCode,
      'd.country': state.filter.destination?.countryCode,
      'd.hotel': state.filter.destination?.hotelCode,
      'd.name': state.filter.destination?.name,
      'd.poi': state.filter.destination?.poiCode,
      guest: state.filter.guest.toString(),
      hotel: state.filter.hotelCodes.join(','),
      latitude: state.filter.destination?.latitude?.toString(),
      longitude: state.filter.destination?.longitude?.toString(),
      room: state.filter.room.toString(),
      sort: state.filter.sort
    }

    return json.pickBy(query)
  }

  return {
    getHotels,
    loadMore,
    queryToStateFilter,
    queryToStateFilterDestination,
    state,
    stateDataReset,
    stateFilterDestinationName,
    stateFilterNight,
    stateFilterSortReset,
    stateToQuery
  }
}
