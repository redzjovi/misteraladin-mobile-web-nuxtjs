<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  useAsync,
  useContext,
  useMeta
} from '@nuxtjs/composition-api';
import useHotel from '~/composables/useHotel';
import { Review } from '~/composables/useReview';
import useRoomAvailability from '~/composables/useRoomAvailability';

export default defineComponent({
  name: 'HotelCountrySlugHotelSlugPage',
  components: {
    ReviewBottomSheet: () => import('~/components/ReviewBottomSheet.vue'),
    ReviewCard: () => import('~/components/ReviewCard.vue')
  },
  nuxtI18n: {
    paths: {
      en: '/hotel/:countrySlug/:hotelSlug',
      id: '/hotel/:countrySlug/:hotelSlug'
    }
  },
  setup() {
    const { error } = useContext()
    const hotel = useHotel()
    const roomAvailability = useRoomAvailability()

    const state = reactive({
      photoIntersect: ref(false),
      photoPopupShow: ref(false),
      photoPopupShowIndex: ref(0),
      topReview: ref<null | Review>(null),
      topReviewPopupShow: ref(false)
    })

    const stateHotel = useAsync(() => {
      roomAvailability.paramsToStateFilter()
      return hotel.getHotel(roomAvailability.state.filter.hotelCode)
        .then(p => p)
        .catch(() => error({ statusCode: 404 }))
    })

    const statePhotoIntersecting = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        state.photoIntersect = entry.isIntersecting
      })
    }

    const statePhotoPopupShow = (index: number) => {
      state.photoPopupShow = true
      state.photoPopupShowIndex = index
    }

    const stateTopReviewClick = (review: Review) => {
      state.topReview = review
      state.topReviewPopupShow = true
    }

    useMeta({
      title: stateHotel.value ? stateHotel.value.name : ''
    })

    onMounted(() => {
      roomAvailability.paramsToStateFilter()
      roomAvailability.getIncluded()
    })

    return {
      roomAvailability,
      state,
      stateHotel,
      statePhotoIntersecting,
      statePhotoPopupShow,
      stateTopReviewClick
    }
  },
  head: {}
})
</script>

<template>
  <div>
    <v-app-bar dense>
      <v-app-bar-nav-icon>
        <v-btn exact icon :to="localeRoute({ name: 'hotel' })">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>
    </v-app-bar>
    <template v-if="roomAvailability.state.included.images.loading">
      <v-skeleton-loader type="image" />
    </template>
    <template v-else>
      <v-row
        v-if="roomAvailability.state.included.images.data.length > 0"
        v-intersect="statePhotoIntersecting"
        no-gutters
      >
        <v-col>
          <v-img
            :height="250"
            :src="roomAvailability.state.included.images.data[0].thumbnailUrl"
            @click="statePhotoPopupShow(0)"
          />
        </v-col>
        <template v-if="roomAvailability.state.included.images.data.length > 1">
          <v-col>
            <template v-for="(image, i) in roomAvailability.state.included.images.data.slice(1, 3)">
              <v-row :key="i" no-gutters>
                <v-col>
                  <template v-if="i === 0">
                    <v-img :height="125" :src="image.thumbnailUrl" @click="statePhotoPopupShow(1)" />
                  </template>
                  <template v-if="i === 1">
                    <v-card @click="statePhotoPopupShow(2)">
                      <v-img :height="125" :src="image.thumbnailUrl" />
                      <v-overlay
                        v-if="roomAvailability.state.included.images.data.length > 3"
                        absolute
                      >
                        +
                        {{ $t('pages.hotel-countrySlug-hotelSlug.photo.more', { i: roomAvailability.state.included.images.data.length - 3 }) }}
                      </v-overlay>
                    </v-card>
                  </template>
                </v-col>
              </v-row>
            </template>
          </v-col>
        </template>
        <v-bottom-sheet v-model="state.photoPopupShow" fullscreen scrollable>
          <v-card>
            <v-card-title class="pa-0">
              <v-app-bar dense>
                <v-app-bar-nav-icon>
                  <v-btn icon @click="state.photoPopupShow = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-app-bar-nav-icon>
                <template v-if="stateHotel">
                  <v-app-bar-title>{{ stateHotel.name }}</v-app-bar-title>
                </template>
              </v-app-bar>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-img
                :max-height="800"
                :min-height="500"
                :src="roomAvailability.state.included.images.data[state.photoPopupShowIndex].url"
              />
            </v-card-text>
            <v-card-actions class="pa-0">
              <v-slide-group
                v-model="state.photoPopupShowIndex"
                class="pa-4"
                center-active
                mandatory
              >
                <v-slide-item
                  v-for="(image, i) in roomAvailability.state.included.images.data"
                  v-slot="{ active, toggle }"
                  :key="i"
                >
                  <v-card class="ma-1" height="100" width="100" @click="toggle">
                    <v-img :src="image.thumbnailUrl" />
                    <v-overlay v-if="active" absolute />
                  </v-card>
                </v-slide-item>
              </v-slide-group>
            </v-card-actions>
            <v-card-actions>
              <v-row>
                <v-col>{{ roomAvailability.state.included.images.data[state.photoPopupShowIndex].title }}</v-col>
                <v-col
                  align="right"
                >
                  {{ state.photoPopupShowIndex + 1 }} / {{ roomAvailability.state.included.images.data.length }}
                </v-col>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-bottom-sheet>
      </v-row>
    </template>
    <v-card v-if="stateHotel" outlined tile>
      <v-card-subtitle class="pb-0">{{ $t('pages.hotel-countrySlug-hotelSlug.hotel') }}</v-card-subtitle>
      <v-card-title class="pt-0">{{ stateHotel.name }}</v-card-title>
      <v-card-subtitle class="d-flex flex-row">
        <v-rating
          color="warning"
          dense
          half-increments
          size="14"
          :length="stateHotel.starRating"
          :value="stateHotel.starRating"
        />
        <div class="ml-2">
          {{ stateHotel.area.name }},
          {{ stateHotel.city.name }}
        </div>
      </v-card-subtitle>
    </v-card>
    <v-card v-if="stateHotel" outlined tile>
      <v-card-title>{{ $t('pages.hotel-countrySlug-hotelSlug.review') }}</v-card-title>
      <v-card-text>
        <div>
          <v-chip color="primary" small>{{ stateHotel.reviewRatingScore }}</v-chip>
          {{ stateHotel.reviewRatingName }}
        </div>
        <div>{{ $tc('pages.hotel-countrySlug-hotelSlug.fromIReview', stateHotel.reviewRatingCount, { i: stateHotel.reviewRatingCount }) }}</div>
        <template v-if="roomAvailability.state.included.topReviews.loading">
          <div class="overflow-x-scroll whitespace-nowrap">
            <v-skeleton-loader
              v-for="i in 5"
              :key="i"
              class="d-inline-block mr-1"
              height="150"
              type="image"
              width="250"
            />
          </div>
          <div align="center">
            <v-skeleton-loader type="button" x-small />
          </div>
        </template>
        <div
          v-if="roomAvailability.state.included.topReviews.data.length > 0"
          class="overflow-x-scroll whitespace-nowrap"
        >
          <ReviewCard
            v-for="(topReview, i) in roomAvailability.state.included.topReviews.data"
            :key="i"
            class="d-inline-block mr-1"
            height="150"
            width="250"
            :content-length-max="110"
            :value="topReview"
            @click.native="stateTopReviewClick(topReview)"
          />
          <ReviewBottomSheet v-model="state.topReviewPopupShow" :review="state.topReview" />
        </div>
        <template v-if="roomAvailability.state.included.reviews.data.length > 5">
          <div align="center">
            <v-btn color="primary" text>
              {{ $t('pages.hotel-countrySlug-hotelSlug.topReview.seeAll') }}
            </v-btn>
          </div>
        </template>
      </v-card-text>
    </v-card>
    <v-main>
      <v-container></v-container>
    </v-main>
  </div>
</template>
