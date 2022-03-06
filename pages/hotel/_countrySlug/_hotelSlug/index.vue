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
      descriptionPopupShow: ref(false),
      facilityPopupShow: ref(false),
      photoIntersect: ref(false),
      photoPopupShow: ref(false),
      photoPopupShowIndex: ref(0),
      reviewPopupShow: ref(false),
      reviewSortPopupShow: ref(false),
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

    const stateReviewSortSubmit = () => {
      state.reviewSortPopupShow = false
      roomAvailability.getIncludedReviews()
    }

    const stateTopFacilitySeeAllClick = () => {
      state.facilityPopupShow = true
      roomAvailability.getIncludedGroupFacilities()
    }

    const stateTopReviewClick = (review: Review) => {
      state.topReview = review
      state.topReviewPopupShow = true
    }

    const stateTopReviewSeeAllClick = () => {
      state.reviewPopupShow = true
      roomAvailability.getIncludedReviews()
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
      stateReviewSortSubmit,
      stateTopFacilitySeeAllClick,
      stateTopReviewClick,
      stateTopReviewSeeAllClick
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
      <v-card-title>{{ $t('pages.hotel-countrySlug-hotelSlug.review.title') }}</v-card-title>
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
        <template v-if="roomAvailability.state.included.topReviews.data.length > 0">
          <div align="center">
            <v-btn
              color="primary"
              text
              @click="stateTopReviewSeeAllClick"
            >
              {{ $t('pages.hotel-countrySlug-hotelSlug.topReview.seeAll') }}
            </v-btn>
            <v-bottom-sheet v-model="state.reviewPopupShow" scrollable>
              <v-card>
                <v-card-title class="pa-0">
                  <v-app-bar dense>
                    <v-app-bar-nav-icon>
                      <v-btn icon @click="state.reviewPopupShow = false">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-app-bar-nav-icon>
                    <v-app-bar-title>{{ $t('pages.hotel-countrySlug-hotelSlug.review.title') }}</v-app-bar-title>
                  </v-app-bar>
                </v-card-title>
                <v-card-text class="pa-4">
                  <div>
                    <v-chip color="primary" small>{{ stateHotel.reviewRatingScore }}</v-chip>
                    {{ stateHotel.reviewRatingName }}
                  </div>
                  <div>{{ $tc('pages.hotel-countrySlug-hotelSlug.fromIReview', stateHotel.reviewRatingCount, { i: stateHotel.reviewRatingCount }) }}</div>
                  <v-divider class="mb-4" />
                  <template v-if="roomAvailability.state.included.reviews.loading">
                    <v-skeleton-loader
                      v-for="i in 10"
                      :key="i"
                      class="mb-4"
                      height="150"
                      type="image"
                    />
                  </template>
                  <template v-else>
                    <ReviewCard
                      v-for="(review, i) in roomAvailability.state.included.reviews.data"
                      :key="i"
                      class="mb-4"
                      :value="review"
                    />
                    <div class="mb-16"></div>
                  </template>
                  <div class="bottom-4 fixed left-0 right-0 text-center">
                    <v-btn-toggle rounded>
                      <v-btn
                        :disabled="roomAvailability.state.included.reviews.loading"
                        @click="state.reviewSortPopupShow = true"
                      >
                        <v-icon>mdi-sort-reverse-variant</v-icon>
                        {{ $t('pages.hotel-countrySlug-hotelSlug.review.sort.label') }}
                      </v-btn>
                    </v-btn-toggle>
                    <v-bottom-sheet v-model="state.reviewSortPopupShow">
                      <v-card>
                        <v-card-title class="pa-0">
                          <v-app-bar dense>
                            <v-app-bar-nav-icon>
                              <v-btn icon @click="state.reviewSortPopupShow = false">
                                <v-icon>mdi-close</v-icon>
                              </v-btn>
                            </v-app-bar-nav-icon>
                            <v-app-bar-title>{{ $t('pages.hotel-countrySlug-hotelSlug.review.sort.label') }}</v-app-bar-title>
                          </v-app-bar>
                        </v-card-title>
                        <v-card-text class="pa-0">
                          <v-list class="pa-0">
                            <v-list-item-group
                              v-model="roomAvailability.state.included.reviews.filter.sort"
                              mandatory
                              @change="stateReviewSortSubmit"
                            >
                              <template
                                v-for="(o, i) in roomAvailability.state.included.reviews.sort.options"
                              >
                                <v-list-item :key="i" :value="o.id">
                                  <template #default>
                                    <v-list-item-content>
                                      <v-list-item-title v-text="o.name"></v-list-item-title>
                                    </v-list-item-content>
                                    <v-list-item-action>
                                      <v-radio-group
                                        :value="roomAvailability.state.included.reviews.filter.sort"
                                      >
                                        <v-radio :value="o.id"></v-radio>
                                      </v-radio-group>
                                    </v-list-item-action>
                                  </template>
                                </v-list-item>
                              </template>
                            </v-list-item-group>
                          </v-list>
                        </v-card-text>
                      </v-card>
                    </v-bottom-sheet>
                  </div>
                </v-card-text>
              </v-card>
            </v-bottom-sheet>
          </div>
        </template>
      </v-card-text>
    </v-card>
    <v-card v-if="stateHotel" outlined tile>
      <v-card-title>{{ $t('pages.hotel-countrySlug-hotelSlug.topFacility.title') }}</v-card-title>
      <v-card-text v-if="stateHotel.facilities.length > 0">
        <ul>
          <li v-for="(facility, i) in stateHotel.facilities.slice(0, 8)" :key="i">
            {{ facility.name }}
          </li>
        </ul>  
        <div align="center">
          <v-btn
            color="primary"
            text
            @click="stateTopFacilitySeeAllClick"
          >
            {{ $t('pages.hotel-countrySlug-hotelSlug.topFacility.seeAll') }}
          </v-btn>
          <v-bottom-sheet v-model="state.facilityPopupShow" scrollable>
            <v-card>
              <v-card-title class="pa-0">
                <v-app-bar dense>
                  <v-app-bar-nav-icon>
                    <v-btn icon @click="state.facilityPopupShow = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-app-bar-nav-icon>
                  <v-app-bar-title>{{ $t('pages.hotel-countrySlug-hotelSlug.facility.title') }}</v-app-bar-title>
                </v-app-bar>
              </v-card-title>
              <v-list dense disabled>
                <v-subheader>{{ $t('pages.hotel-countrySlug-hotelSlug.topFacility.title') }}</v-subheader>
                <v-list-item v-for="(facility, i) in stateHotel.facilities" :key="i">
                  <v-list-item-content>
                    <v-list-item-title v-text="facility.name" />
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <template v-if="roomAvailability.state.included.groupFacilities.loading">
                <template v-for="i in 3">
                  <v-list :key="i" dense disabled>
                    <v-divider class="mb-4" />
                    <v-skeleton-loader v-for="j in 5" :key="j" type="list-item" />
                  </v-list>
                </template>
              </template>
              <template v-else>
                <template
                  v-for="([groupName, facilities], i) in roomAvailability.state.included.groupFacilities.data"
                >
                  <v-list :key="i" dense disabled>
                    <v-divider class="mb-4" />
                    <v-subheader>{{ groupName }}</v-subheader>
                    <v-list-item v-for="(facility, j) in facilities" :key="j">
                      <v-list-item-content>
                        <v-list-item-title v-text="facility.name" />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </template>
              </template>
            </v-card>
          </v-bottom-sheet>
        </div>
      </v-card-text>
    </v-card>
    <v-card v-if="stateHotel" outlined tile>
      <v-card-title>{{ $t('pages.hotel-countrySlug-hotelSlug.location.title') }}</v-card-title>
      <v-list dense disabled>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>mdi-map-marker-outline</v-icon>
          </v-list-item-icon>
          <v-list-item-content class="text-caption" v-text="stateHotel.address"></v-list-item-content>
        </v-list-item>
      </v-list>
      <v-card-text>
        <div align="center">
          <v-btn
            :href="`https://www.google.com/maps/search/?api=1&query=${stateHotel.latitude},${stateHotel.longitude}`"
            color="primary"
            target="_blank"
            text
          >
            {{ $t('pages.hotel-countrySlug-hotelSlug.location.seeMap') }}
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
    <v-card v-if="stateHotel" outlined tile>
      <v-card-title>{{ $t('pages.hotel-countrySlug-hotelSlug.description.title') }}</v-card-title>
      <v-card-text>
        <template v-if="roomAvailability.state.included.description.loading">
          <v-skeleton-loader type="paragraph" />
        </template>
        <template v-else>
          <div v-html="roomAvailability.state.included.description.data.length > 150 ? roomAvailability.state.included.description.data.slice(0, 150) + '...' : roomAvailability.state.included.description.data"></div>
        </template>
        <div align="center">
          <v-btn
            color="primary"
            text
            target="_blank"
            @click="state.descriptionPopupShow = true"
          >
            {{ $t('pages.hotel-countrySlug-hotelSlug.description.seeAll') }}
          </v-btn>
          <v-bottom-sheet v-model="state.descriptionPopupShow" scrollable>
            <v-card>
              <v-card-title class="pa-0">
                <v-app-bar dense>
                  <v-app-bar-nav-icon>
                    <v-btn icon @click="state.descriptionPopupShow = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-app-bar-nav-icon>
                  <v-app-bar-title>{{ $t('pages.hotel-countrySlug-hotelSlug.description.title') }}</v-app-bar-title>
                </v-app-bar>
              </v-card-title>
              <v-card-text v-html="roomAvailability.state.included.description.data" />
            </v-card>
          </v-bottom-sheet>
        </div>
      </v-card-text>
    </v-card>
    <v-main>
      <v-container></v-container>
    </v-main>
  </div>
</template>
