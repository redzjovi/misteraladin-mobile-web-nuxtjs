/* eslint-disable no-console */
import {
  reactive,
  ref,
  useContext
} from '@nuxtjs/composition-api'
import useFacility, {
  Facility
} from '~/composables/useFacility'
import { Hotel } from '~/composables/useHotel'
import useImage, {
  Image
} from '~/composables/useImage'
import {
  ResponseBody as HotelIdDescriptionResponseBody
} from '~/types/misteraladin/api/hotels/_id/descriptions'
import {
  ResponseBody as HotelIdFacilityResponseBody
} from '~/types/misteraladin/api/hotels/_id/facilities'
import {
  ResponseBody as HotelIdPhotoResponseBody
} from '~/types/misteraladin/api/hotels/_id/photos'
import useJson from '~/composables/useJson'
import useReview, {
  Review,
  Sort as ReviewSort
} from '~/composables/useReview'
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
    i18n,
    params
  } = useContext()
  const facility = useFacility()
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
      description: {
        data: ref(''),
        loading: false
      },
      groupFacilities: {
        data: ref<Map<string, Facility[]>>(new Map()),
        loading: false
      },
      images: {
        data: ref<Image[]>([]),
        loading: false
      },
      reviews: {
        data: ref<Review[]>([]),
        filter: {
          sort: ref(ReviewSort.Default)
        },
        loading: ref(false),
        sort: {
          options: [
            { id: ReviewSort.Default, name: i18n.t('composables.useReview.sort.default') },
            { id: ReviewSort.Latest, name: i18n.t('composables.useReview.sort.latest') },
            { id: ReviewSort.ScoreHighest, name: i18n.t('composables.useReview.sort.scoreHighest') },
            { id: ReviewSort.ScoreLowest, name: i18n.t('composables.useReview.sort.scoreLowest') }
          ]
        }
      },
      topReviews: {
        data: ref<Review[]>([]),
        loading: ref(false)
      }
    },
    loading: ref(false)
  })

  const getIncluded = () => {
    state.included.description.loading = true
    $axios.get($config.hotelApiUrl + '/' + state.filter.hotelCode + '/descriptions').then(r => {
      state.included.description.data = (r.data as HotelIdDescriptionResponseBody).data.description
    }).finally(() => {
      state.included.description.loading = false
    })

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
        perpage: 3
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
  }

  const getIncludedGroupFacilities = () => {
    state.included.groupFacilities.loading = true
    $axios.get($config.hotelApiUrl + '/' + state.filter.hotelCode + '/facilities').then(r => {
      state.included.groupFacilities.data = new Map();
      (r.data as HotelIdFacilityResponseBody).data.forEach(f => {
        const hiftf = facility.hotelIdFacilityToFacility(f)
        state.included.groupFacilities.data.set(hiftf.group.name, [
          ...state.included.groupFacilities.data.get(hiftf.group.name) || [],
          hiftf
        ])
      })
    }).finally(() => {
      state.included.groupFacilities.loading = false
    })
  }

  const getIncludedReviews = () => {
    state.included.reviews.loading = true
    $axios.post(
      'api/review' + '/search',
      json.pickBy({
        filter: {
          hotel_id: state.filter.hotelCode
        },
        sort: review.sortToHotelReviewSearchRequestBodySort(state.included.reviews.filter.sort),
        perpage: 10
      } as HotelReviewSearchRequestBody)
    ).then(r => {
      state.included.reviews.data = [];
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
    getIncludedGroupFacilities,
    getIncludedReviews,
    paramsToStateFilter,
    state
  }
}
