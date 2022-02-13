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
import useJson from '~/composables/useJson'
import useReview, { Review } from '~/composables/useReview'
import {
  RequestBody as HotelReviewSearchRequestBody,
  RequestBodySort as HotelReviewSearchRequestBodySort,
  ResponseBody as HotelReviewSearchResponseBody
} from '~/types/misteraladin/api/hotel-review/search'

export default () => {
  const {
    $axios,
    $config,
    $dayjs,
    params
  } = useContext()
  const image = useImage()
  const json = useJson()
  const review = useReview()

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
      },
      reviews: {
        data: ref<Review[]>([]),
        loading: ref(false)
      },
      topReviews: {
        data: ref<Review[]>([]),
        loading: ref(false)
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

    state.included.topReviews.loading = true
    $axios.post(
      'api/review' + '/search',
      json.pickBy({
        filter: {
          hotel_id: state.filter.hotelCode
        },
        sort: HotelReviewSearchRequestBodySort.RatingHighest,
        perpage: 5
      } as HotelReviewSearchRequestBody)
    ).then(r => {
      (r.data as HotelReviewSearchResponseBody).data.reviews.forEach(hrsrbdr => {
        state.included.topReviews.data.push(
          review.hotelReviewSearchReviewToReview(hrsrbdr)
        )
      })
    }).finally(() => {
      state.included.topReviews.loading = false
    })

    state.included.reviews.loading = true
    $axios.post(
      'api/review' + '/search',
      json.pickBy({
        filter: {
          hotel_id: state.filter.hotelCode
        },
        sort: HotelReviewSearchRequestBodySort.Newest,
        perpage: 10
      } as HotelReviewSearchRequestBody)
    ).then(r => {
      (r.data as HotelReviewSearchResponseBody).data.reviews.forEach(hrsrbdr => {
        state.included.reviews.data.push(
          review.hotelReviewSearchReviewToReview(hrsrbdr)
        )
      })
    }).finally(() => {
      state.included.reviews.loading = false
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
