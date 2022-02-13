/* eslint-disable no-console */
import {
  reactive,
  ref,
  useContext
} from '@nuxtjs/composition-api'
import { Hotel } from '~/composables/useHotel'
import useImage, {
  Image
} from '~/composables/useImage'
import {
  ResponseBody as HotelIdPhotoResponseBody
} from '~/types/misteraladin/api/hotels/_id/photos'

export default () => {
  const {
    $axios,
    $config,
    $dayjs,
    params
  } = useContext()
  const image = useImage()

  const state = reactive({
    data: ref<Hotel[]>([]),
    filter: {
      checkIn: ref($dayjs().format('YYYY-MM-DD')),
      checkOut: ref($dayjs().add(1, 'day').format('YYYY-MM-DD')),
      countryCode: ref(''),
      guest: ref(2),
      hotelCode: ref(''),
      room: ref(1)
    },
    included: {
      images: {
        data: ref<Image[]>([]),
        loading: false
      }
    },
    loading: ref(false)
  })

  const getIncluded = () => {
    state.included.images.loading = true
    $axios.get($config.hotelApiUrl + '/' + state.filter.hotelCode + '/photos').then(r => {
      state.included.images.data = [];
      (r.data as HotelIdPhotoResponseBody).data.forEach(p => {
        state.included.images.data.push(
          image.hotelIdPhotoToImage(p)
        )
      })
    }).finally(() => {
      state.included.images.loading = false
    })
  }

  const paramsToStateFilter = () => {
    if (params.value.hotelSlug) {
      state.filter.hotelCode = String(params.value.hotelSlug.split('-').pop())
    }
  }

  return {
    getIncluded,
    paramsToStateFilter,
    state
  }
}
