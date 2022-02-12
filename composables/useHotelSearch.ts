/* eslint-disable no-console */
import {
  computed,
  reactive,
  ref,
  useContext,
  useRoute,
  watch
} from '@nuxtjs/composition-api'
import useArea, {
  Area
} from '~/composables/useArea'
import { City } from '~/composables/useCity'
import { Destination } from '~/composables/useDestination'
import useHotel, {
  Hotel
} from '~/composables/useHotel'
import useFacility, {
  Facility
} from '~/composables/useFacility'
import useJson from '~/composables/useJson'
import useReviewRating, {
  ReviewRating
} from '~/composables/useReviewRating'
import useType, {
  Type
} from '~/composables/useType'
import {
  RequestBody as HotelSearchRequestBody,
  RequestBodySort as HotelSearchRequestBodySort,
  ResponseBody as HotelSearchResponseBody
} from '~/types/misteraladin/api/hotels/searches'
import {
  Filter as HotelSearchFilterFilter,
  Key as HotelSearchFilterKey,
  Method as HotelSearchFilterMethod,
  OptionExact as HotelSearchFilterOptionExact,
  OptionRange as HotelSearchFilterOptionRange,
  RequestBody as HotelSearchFilterRequestBody,
  ResponseBody as HotelSearchFilterResponseBody
} from '~/types/misteraladin/api/hotels/searches/filters'

export enum Sort {
  Default = '',
  PriceHighest = '-price',
  PriceLowest = 'price',
  StarRatingHighest = '-starRating',
  StarRatingLowest = 'starRating'
}

export default () => {
  const area = useArea()
  const {
    $axios,
    $config,
    $dayjs,
    i18n
  } = useContext()
  const facility = useFacility()
  const hotel = useHotel()
  const json = useJson()
  const reviewRating = useReviewRating()
  const $route = useRoute()
  const type = useType()

  const state = reactive({
    data: ref<Hotel[]>([]),
    filter: {
      areaCodes: ref<string[]>([]),
      checkIn: ref($dayjs().format('YYYY-MM-DD')),
      checkOut: ref($dayjs().add(1, 'day').format('YYYY-MM-DD')),
      cityCodes: ref<string[]>([]),
      countryCodes: ref<string[]>([]),
      destination: ref<Destination | null>(null),
      facilityCodes: ref<string[]>([]),
      guest: ref(2),
      hotelCodes: ref<string[]>([]),
      latitude: ref<null | number>(null),
      longitude: ref<null | number>(null),
      maxPrice: ref<null | number>(null),
      minPrice: ref<null | number>(null),
      priceRange: ref<Array<null | number>>([null, null]),
      reviewRatings: ref<string[]>([]),
      room: ref(1),
      sort: ref(Sort.Default),
      starRatings: ref<number[]>([]),
      types: ref<string[]>([])
    },
    included: {
      area: {
        data: ref<Area[]>([])
      },
      city: {
        data: ref<City[]>([])
      },
      facility: {
        data: ref<Facility[]>([])
      },
      priceRange: {
        data: {
          from: ref(0),
          to: ref(15000000)
        }
      },
      reviewRating: {
        data: ref<ReviewRating[]>([])
      },
      starRating: {
        data: [0, 1, 2, 3, 4, 5]
      },
      type: {
        data: ref<Type[]>([])
      }
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

  const stateIncludeAreaDataActive = computed(() => {
    return [...state.included.area.data.filter(t => state.filter.areaCodes.includes(t.code))]
  })

  const stateIncludeFacilityDataActive = computed(() => {
    return [...state.included.facility.data.filter(t => state.filter.facilityCodes.includes(t.code))]
  })

  const stateIncludeReviewRatingDataActive = computed(() => {
    return [...state.included.reviewRating.data.filter(t => state.filter.reviewRatings.includes(t.code))]
  })

  const stateIncludeTypeDataActive = computed(() => {
    return [...state.included.type.data.filter(t => state.filter.types.includes(t.code))]
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

  const getIncluded = () => {
    $axios.post(
      $config.hotelApiUrl + '/searches/filters',
      stateToHotelSearchFilterRequestBody()
    ).then(r => {
      const responseBody = (r.data as HotelSearchFilterResponseBody)
      responseBody.data.forEach(f => {
        hotelSearchFilterFilterToIncluded(f)
      })
    }).finally(() => {
      state.loading = false
    })
  }

  const hotelSearchFilterFilterToIncluded = (f: HotelSearchFilterFilter) => {
    if (f.key === HotelSearchFilterKey.Area && f.method === HotelSearchFilterMethod.Exact) {
      (f.options as HotelSearchFilterOptionExact[]).forEach(o => {
        state.included.area.data.push(
          area.hotelSearchFilterOptionExactToArea(o)
        )
      })
      state.included.area.data.sort((a, b) => a.name.localeCompare(b.name))
    } else if (f.key === HotelSearchFilterKey.Facility && f.method === HotelSearchFilterMethod.Exact) {
      (f.options as HotelSearchFilterOptionExact[]).forEach(o => {
        state.included.facility.data.push(
          facility.hotelSearchFilterOptionExactToFacility(o)
        )
      })
      state.included.facility.data.sort((a, b) => a.name.localeCompare(b.name))
    } else if (f.key === HotelSearchFilterKey.PriceRange && f.method === HotelSearchFilterMethod.Range) {
      (f.options as HotelSearchFilterOptionRange[]).forEach(o => {
        if (o.from !== null) {
          state.filter.minPrice = o.from
          state.included.priceRange.data.from = o.from
        }
        if (o.to) {
          state.filter.maxPrice = o.to
          state.filter.priceRange = [state.filter.minPrice, state.filter.maxPrice]
          state.included.priceRange.data.to = o.to
        }
      })
    } else if (f.key === HotelSearchFilterKey.Review && f.method === HotelSearchFilterMethod.Range) {
      (f.options as HotelSearchFilterOptionRange[]).forEach(o => {
        state.included.reviewRating.data.push(
          reviewRating.hotelSearchFilterOptionRangeToReviewRating(o)
        )
      })
    } else if (f.key === HotelSearchFilterKey.Type && f.method === HotelSearchFilterMethod.Exact) {
      (f.options as HotelSearchFilterOptionExact[]).forEach(o => {
        state.included.type.data.push(
          type.hotelSearchFilterOptionExactToType(o)
        )
      })
      state.included.type.data.sort((a, b) => a.name.localeCompare(b.name))
    }
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
    state.filter.maxPrice = $route.value.query.maxPrice ? Number($route.value.query.maxPrice) : state.included.priceRange.data.to
    state.filter.minPrice = $route.value.query.minPrice ? Number($route.value.query.minPrice) : state.included.priceRange.data.from
    if ($route.value.query.room) {
      state.filter.room = Number($route.value.query.room)
    }
    state.filter.reviewRatings = $route.value.query.reviewRatings ? String($route.value.query.reviewRatings).split(',') : []
    state.filter.sort = $route.value.query.sort ? String($route.value.query.sort) as Sort : Sort.Default
    state.filter.starRatings = $route.value.query.starRatings ? String($route.value.query.starRatings).split(',').map(starRating => Number(starRating)) : []
    state.filter.types = $route.value.query.types ? String($route.value.query.types).split(',') : []
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

  const stateFilterFilterReset = () => {
    state.filter.areaCodes = []
    state.filter.cityCodes = []
    state.filter.countryCodes = []
    state.filter.facilityCodes = []
    state.filter.hotelCodes = []
    state.filter.maxPrice = state.included.priceRange.data.to
    state.filter.minPrice = state.included.priceRange.data.from
    state.filter.reviewRatings = []
    state.filter.starRatings = []
    state.filter.types = []
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

  const stateToHotelSearchFilterRequestBody = () => {
    const requestBody: HotelSearchFilterRequestBody = {
      filter: {
        area_id: stateFilterAreaCodes.value.map(ac => Number(ac)),
        check_in: state.filter.checkIn,
        city_id: stateFilterCityCodes.value.map(cc => Number(cc)),
        coordinate: [state.filter.destination?.latitude, state.filter.destination?.longitude].filter(Boolean).map(d => String(d)).join(','),
        country_id: stateFilterCountryCodes.value.map(cc => Number(cc)),
        night: stateFilterNight.value,
        occupancy: state.filter.guest,
        room_quantity: state.filter.room
      }
    }

    return json.pickBy(requestBody)
  }

  const stateToHotelSearchRequestBody = () => {
    const requestBody: HotelSearchRequestBody = {
      filter: {
        area_id: stateFilterAreaCodes.value.map(ac => Number(ac)),
        check_in: state.filter.checkIn,
        city_id: stateFilterCityCodes.value.map(cc => Number(cc)),
        coordinate: [state.filter.destination?.latitude, state.filter.destination?.longitude].filter(Boolean).map(d => String(d)).join(','),
        country_id: stateFilterCountryCodes.value.map(cc => Number(cc)),
        facility: state.filter.facilityCodes.map(fc => Number(fc)),
        hotel_id: stateFilterHotelCodes.value.map(hc => Number(hc)),
        night: stateFilterNight.value,
        occupancy: state.filter.guest,
        price: (
          state.filter.maxPrice === null ||
          state.filter.minPrice === null ||
          (
            state.filter.maxPrice === state.included.priceRange.data.to &&
            state.filter.minPrice === state.included.priceRange.data.from
          )
        )
          ? null
          : {
            from: Number(state.filter.minPrice),
            to: Number(state.filter.maxPrice)
          },
        review: state.filter.reviewRatings
          .map(rr => rr.split('-'))
          .map(rrs => {
            return {
              from: (typeof rrs[0] !== 'undefined') ? Number(rrs[0]) : null,
              to: (typeof rrs[1] !== 'undefined') ? Number(rrs[1]) : null
            }
          }),
        room_quantity: state.filter.room,
        star_rating: state.filter.starRatings,
        type_id: state.filter.types.map(t => Number(t))
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
      maxPrice: state.filter.maxPrice === null || state.filter.maxPrice === state.included.priceRange.data.to ? null : state.filter.maxPrice.toString(),
      minPrice: state.filter.minPrice === null || state.filter.minPrice === state.included.priceRange.data.from ? null : state.filter.minPrice.toString(),
      reviewRatings: state.filter.reviewRatings.join(','),
      room: state.filter.room.toString(),
      sort: state.filter.sort,
      starRatings: state.filter.starRatings.join(','),
      types: state.filter.types.join(',')
    }

    return json.pickBy(query)
  }

  watch(() => state.filter.maxPrice, (f, f2) => {
    if (f !== Number(f2)) {
      state.filter.priceRange = [state.filter.minPrice, Number(f)]
    }
  })

  watch(() => state.filter.minPrice, (f, f2) => {
    if (f !== Number(f2)) {
      state.filter.priceRange = [Number(f), state.filter.maxPrice]
    }
  })

  watch(() => state.filter.priceRange, (f, f2) => {
    if (f !== f2) {
      f.forEach((p, i) => {
        if (i === 0) {
          state.filter.minPrice = p
        } else if (i === 1) {
          state.filter.maxPrice = p
        }
      })
    }
  })

  return {
    getHotels,
    getIncluded,
    loadMore,
    queryToStateFilter,
    queryToStateFilterDestination,
    state,
    stateDataReset,
    stateFilterDestinationName,
    stateFilterNight,
    stateFilterFilterReset,
    stateFilterSortReset,
    stateIncludeAreaDataActive,
    stateIncludeFacilityDataActive,
    stateIncludeReviewRatingDataActive,
    stateIncludeTypeDataActive,
    stateToQuery
  }
}
