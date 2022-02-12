import {
  computed,
  reactive,
  ref,
  useContext,
  useRoute
} from '@nuxtjs/composition-api'
import { Destination } from '~/composables/useDestination'
import useJson from '~/composables/useJson'

export default () => {
  const { $dayjs } = useContext()
  const json = useJson()
  const $route = useRoute()

  const state = reactive({
    filter: {
      checkIn: ref($dayjs().format('YYYY-MM-DD')),
      checkOut: ref($dayjs().add(1, 'day').format('YYYY-MM-DD')),
      destination: ref<Destination | null>(null),
      guest: ref(2),
      latitude: ref<null | number>(null),
      longitude: ref<null | number>(null),
      room: ref(1)
    }
  })

  const stateFilterDestinationName = computed(() => {
    return state.filter.destination?.name
  })

  const stateFilterNight = computed(() => {
    return $dayjs(state.filter.checkOut)
      .diff(state.filter.checkIn, 'day')
  })

  const queryToStateFilter = () => {
    if ($route.value.query.checkIn) {
      state.filter.checkIn = String($route.value.query.checkIn)
    }
    if ($route.value.query.checkOut) {
      state.filter.checkOut = String($route.value.query.checkOut)
    }
    state.filter.destination = queryToStateFilterDestination()
    if ($route.value.query.guest) {
      state.filter.guest = Number($route.value.query.guest)
    }
    if ($route.value.query.latitude) {
      state.filter.latitude = Number($route.value.query.latitude)
    }
    if ($route.value.query.longitude) {
      state.filter.longitude = Number($route.value.query.longitude)
    }
    if ($route.value.query.room) {
      state.filter.room = Number($route.value.query.room)
    }
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

  const stateToQuery = () => {
    const query = {
      checkIn: state.filter.checkIn.toString(),
      checkOut: state.filter.checkOut.toString(),
      'd.area': state.filter.destination?.areaCode,
      'd.city': state.filter.destination?.cityCode,
      'd.country': state.filter.destination?.countryCode,
      'd.hotel': state.filter.destination?.hotelCode,
      'd.name': state.filter.destination?.name,
      'd.poi': state.filter.destination?.poiCode,
      guest: state.filter.guest.toString(),
      latitude: state.filter.destination?.latitude?.toString(),
      longitude: state.filter.destination?.longitude?.toString(),
      room: state.filter.room.toString()
    }

    return json.pickBy(query)
  }

  return {
    queryToStateFilter,
    queryToStateFilterDestination,
    state,
    stateFilterDestinationName,
    stateFilterNight,
    stateToQuery
  }
}
