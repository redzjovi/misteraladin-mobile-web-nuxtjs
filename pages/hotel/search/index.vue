<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  useContext,
  useRouter
} from '@nuxtjs/composition-api';
import useHotelSearch from '~/composables/useHotelSearch';

export default defineComponent({
  name: 'HotelSearchPage',
  components: {
    DateRangePickerInput: () => import('~/components/DateRangePickerInput.vue'),
    DestinationInput: () => import('~/components/DestinationInput.vue'),
    RoomGuestPickerInput: () => import('~/components/RoomGuestPickerInput.vue')
  },
  nuxtI18n: {
    paths: {
      en: '/hotel/search',
      id: '/hotel/cari'
    }
  },
  setup() {
    const { app } = useContext()
    const changeSearch = useHotelSearch()
    const hotelSearch = useHotelSearch()
    const $router = useRouter()

    const state = reactive({
      changeSearchPopupShow: ref(false),
      filterAreaPopupShow: ref(false),
      filterFacilityPopupShow: ref(false),
      filterPopupShow: ref(false),
      filterReviewRatingPopupShow: ref(false),
      filterTypePopupShow: ref(false),
      sortPopupShow: ref(false)
    })

    const changeSearchSubmit = () => {
      changeSearch.stateFilterFilterReset()
      changeSearch.stateFilterSortReset()

      $router.push(app.localePath({
        name: 'hotel-search',
        query: changeSearch.stateToQuery()
      }))

      setTimeout(() => {
        changeSearch.queryToStateFilter()
        changeSearch.getIncluded()

        hotelSearch.queryToStateFilter()
        state.changeSearchPopupShow = false

        hotelSearch.stateDataReset()
        hotelSearch.getHotels()
      }, 100)
    }

    const filterSubmit = () => {
      $router.push(app.localePath({
        name: 'hotel-search',
        query: changeSearch.stateToQuery()
      }))

      setTimeout(() => {
        changeSearch.queryToStateFilter()

        hotelSearch.queryToStateFilter()
        state.filterPopupShow = false

        hotelSearch.stateDataReset()
        hotelSearch.getHotels()
      }, 100)
    }

    const sortSubmit = () => {
      $router.push(app.localePath({
        name: 'hotel-search',
        query: changeSearch.stateToQuery()
      }))

      setTimeout(() => {
        changeSearch.queryToStateFilter()

        hotelSearch.queryToStateFilter()
        state.sortPopupShow = false

        hotelSearch.stateDataReset()
        hotelSearch.getHotels()
      }, 100)
    }

    onMounted(() => {
      changeSearch.queryToStateFilter()
      changeSearch.getIncluded()

      hotelSearch.queryToStateFilter()
      hotelSearch.getHotels()
    })

    return {
      changeSearch,
      changeSearchSubmit,
      filterSubmit,
      hotelSearch,
      sortSubmit,
      state
    }
  }
})
</script>

<template>
  <div>
    <v-app-bar app dense>
      <v-app-bar-nav-icon>
        <v-btn exact icon :to="localeRoute({ name: 'hotel' })">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>
      <v-app-bar-title>{{ hotelSearch.stateFilterDestinationName.value }}</v-app-bar-title>
      <template #extension>
        <v-chip block label style="width: 100%" @click="state.changeSearchPopupShow = true">
          {{ hotelSearch.state.filter.checkIn }} -
          {{ hotelSearch.state.filter.checkOut }},
          {{ $tc('pages.hotel-search.appBar.totalNight', hotelSearch.stateFilterNight.value, { i: hotelSearch.stateFilterNight.value }) }} |
          <v-icon small>mdi-door</v-icon>
          {{ hotelSearch.state.filter.room }},
          <v-icon small>mdi-account</v-icon>
          {{ hotelSearch.state.filter.guest }}
        </v-chip>
        <v-bottom-sheet v-model="state.changeSearchPopupShow">
          <v-card>
            <v-card-title class="pa-0">
              <v-app-bar dense>
                <v-app-bar-nav-icon>
                  <v-btn icon @click="state.changeSearchPopupShow = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-app-bar-nav-icon>
                <v-app-bar-title>{{ $t('pages.hotel-search.changeSearch.title') }}</v-app-bar-title>
              </v-app-bar>
            </v-card-title>
            <v-card-text class="pa-0">
              <v-container>
                <v-form>
                  <DestinationInput
                    v-model="changeSearch.state.filter.destination"
                    dense
                    persistent-placeholder
                    prepend-inner-icon="mdi-map-marker-outline"
                    required
                    :label="$t('pages.hotel.form.destination.label')"
                    :placeholder="$t('pages.hotel.form.destination.placeholder')"
                  />
                  <DateRangePickerInput
                    dense
                    format="YYYY-MM-DD"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    :label="$t('pages.hotel.form.checkIn.label')"
                    :min="$dayjs().format('YYYY-MM-DD')"
                    :from-show="true"
                    :from-value.sync="changeSearch.state.filter.checkIn"
                    :placeholder="$t('pages.hotel.form.checkIn.placeholder')"
                    :to-value.sync="changeSearch.state.filter.checkOut"
                  />
                  <DateRangePickerInput
                    dense
                    format="YYYY-MM-DD"
                    prepend-inner-icon="mdi-calendar"
                    readonly
                    :label="$t('pages.hotel.form.checkOut.label')"
                    :min="$dayjs().format('YYYY-MM-DD')"
                    :from-show="false"
                    :from-value.sync="changeSearch.state.filter.checkIn"
                    :placeholder="$t('pages.hotel.form.checkOut.placeholder')"
                    :to-show="true"
                    :to-value.sync="changeSearch.state.filter.checkOut"
                  />
                  <RoomGuestPickerInput
                    dense
                    prepend-inner-icon="mdi-account"
                    :guest-value.sync="changeSearch.state.filter.guest"
                    :label="$t('pages.hotel.form.roomAndGuest.label')"
                    :room-value.sync="changeSearch.state.filter.room"
                  />
                  <v-btn
                    block
                    color="primary"
                    dense
                    @click="changeSearchSubmit"
                  >
                    {{ $t('pages.hotel-search.changeSearch.title') }}
                  </v-btn>
                </v-form>
              </v-container>
            </v-card-text>
          </v-card>
        </v-bottom-sheet>
      </template>
    </v-app-bar>
    <v-main>
      <v-container>
        <template v-if="hotelSearch.state.loading && hotelSearch.state.data.length === 0">
          <v-card v-for="i in 8" :key="i" class="mb-4">
            <v-card-text>
              <v-row>
                <v-col cols="3">
                  <v-skeleton-loader type="image" />
                </v-col>
                <v-col cols="9">
                  <v-skeleton-loader type="list-item-three-line" />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </template>
        <template v-for="(hotel, i) in hotelSearch.state.data">
          <v-card :key="hotel.code" class="mb-4">
            <v-card-text>
              <v-row>
                <v-col cols="3">
                  <template v-if="hotel.images.length > 0">
                    <v-img :src="hotel.images[0].url"></v-img>
                  </template>
                </v-col>
                <v-col cols="9">
                  <h5>{{ hotel.name }}</h5>
                  <div class="d-flex flex-row">
                    <v-rating
                      color="warning"
                      dense
                      size="12"
                      :length="hotel.starRating"
                      :value="hotel.starRating"
                    />
                    <h6 class="ml-1 text--disabled">
                      <template
                        v-if="hotelSearch.state.filter.latitude && hotelSearch.state.filter.longitude"
                      >
                        {{ $t('pages.hotel-search.totalDistance.label', { i: hotel.distance }) }}
                      </template>
                      <template v-else>
                        {{ hotel.area.name }},
                        {{ hotel.city.name }}
                      </template>
                    </h6>
                  </div>
                  <h6 v-if="hotel.freeCancellation" class="primary--text">
                    <v-icon x-small>mdi-calendar-refresh</v-icon>
                    {{ $t('pages.hotel-search.freeCancellation') }}
                  </h6>
                  <h6 v-if="hotel.freeBreakfast" class="primary--text">
                    <v-icon x-small>mdi-silverware</v-icon>
                    {{ $t('pages.hotel-search.freeBreakfast') }}
                  </h6>
                  <h5
                    class="text-decoration-line-through text-right text--secondary"
                  >
                    IDR {{ hotel.priceFrom }}
                  </h5>
                  <h4 class="red--text text-right">IDR {{ hotel.price }}</h4>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
          <template v-if="i === hotelSearch.state.data.length - 1 && !hotelSearch.state.loading">
            <div
              :key="'intersect-' + i"
              v-intersect="{
                handler: hotelSearch.loadMore,
                options: {
                  threshold: [0, 0.5, 1.0]
                }
              }"
            >
            </div>
          </template>
        </template>
        <template v-if="hotelSearch.state.loading">
          <div class="text-center">
            <v-progress-circular indeterminate></v-progress-circular>
          </div>
        </template>
        <div class="bottom-4 fixed left-0 right-0 text-center">
          <v-btn-toggle rounded>
            <v-btn
              :disabled="hotelSearch.state.data.length === 0 && hotelSearch.state.loading"
              @click="state.sortPopupShow = true"
            >
              <v-icon>mdi-sort-reverse-variant</v-icon>
              {{ $t('pages.hotel-search.sort.label') }}
            </v-btn>
            <v-btn
              :disabled="hotelSearch.state.data.length === 0 && hotelSearch.state.loading"
              @click="state.filterPopupShow = true"
            >
              <v-icon>mdi-filter</v-icon>
              {{ $t('pages.hotel-search.filter.label') }}
            </v-btn>
          </v-btn-toggle>
          <v-bottom-sheet v-model="state.sortPopupShow">
            <v-card>
              <v-card-title class="pa-0">
                <v-app-bar dense>
                  <v-app-bar-nav-icon>
                    <v-btn icon @click="state.sortPopupShow = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-app-bar-nav-icon>
                  <v-app-bar-title>{{ $t('pages.hotel-search.sort.title') }}</v-app-bar-title>
                </v-app-bar>
              </v-card-title>
              <v-card-text class="pa-0">
                <v-list class="pa-0">
                  <v-list-item-group
                    v-model="changeSearch.state.filter.sort"
                    mandatory
                    @change="sortSubmit"
                  >
                    <template v-for="(o, i) in hotelSearch.state.sort.options">
                      <v-list-item :key="i" :value="o.id">
                        <template #default>
                          <v-list-item-content>
                            <v-list-item-title v-text="o.name"></v-list-item-title>
                          </v-list-item-content>
                          <v-list-item-action>
                            <v-radio-group :value="changeSearch.state.filter.sort">
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
          <v-bottom-sheet v-model="state.filterPopupShow" scrollable>
            <v-card>
              <v-card-title class="pa-0">
                <v-app-bar dense>
                  <v-app-bar-nav-icon>
                    <v-btn icon @click="state.filterPopupShow = false">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-app-bar-nav-icon>
                  <v-app-bar-title>{{ $t('pages.hotel-search.filter.title') }}</v-app-bar-title>
                  <v-spacer />
                  <v-btn color="primary" text @click="changeSearch.stateFilterFilterReset">
                    {{ $t('pages.hotel-search.filter.reset.label') }}
                  </v-btn>
                </v-app-bar>
              </v-card-title>
              <v-card-text class="pa-0">
                <v-list dense>
                  <v-subheader>{{ $t('pages.hotel-search.filter.priceRange.label') }}</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-row no-gutters>
                        <v-col>
                          <v-text-field
                            v-model="changeSearch.state.filter.minPrice"
                            dense
                            hide-details
                            outlined
                            type="number"
                          />
                        </v-col>
                        <v-col align-self="center">
                          <v-divider></v-divider>
                        </v-col>
                        <v-col>
                          <v-text-field
                            v-model="changeSearch.state.filter.maxPrice"
                            dense
                            hide-details
                            outlined
                            type="number"
                          />
                        </v-col>
                      </v-row>
                      <v-row v-if="false">
                        <v-col>
                          <v-range-slider
                            v-model="changeSearch.state.filter.priceRange"
                            :max="changeSearch.state.included.priceRange.data.to"
                            :min="changeSearch.state.included.priceRange.data.from"
                            :step="50000"
                          />
                        </v-col>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-list dense>
                  <v-subheader>{{ $t('pages.hotel-search.filter.hotelStar.label') }}</v-subheader>
                  <v-list-item>
                    <v-list-item-content>
                      <v-btn-toggle v-model="changeSearch.state.filter.starRatings" multiple>
                        <v-row>
                          <v-col
                            v-for="starRating in changeSearch.state.included.starRating.data"
                            :key="starRating"
                            cols="4"
                          >
                            <v-btn block outlined>
                              <v-icon color="warning" small>mdi-star</v-icon>
                              {{ starRating }}
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-btn-toggle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-list dense>
                  <v-subheader>{{ $t('pages.hotel-search.filter.propertyType.label') }}</v-subheader>
                  <v-list-item-group v-model="changeSearch.state.filter.types" multiple>
                    <v-list-item
                      v-for="(type, i) in changeSearch.stateIncludeTypeDataActive.value"
                      :key="i"
                      :value="type.code"
                    >
                      <template #default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title v-text="type.name"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox :input-value="active"></v-checkbox>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-btn
                          color="primary"
                          text
                          x-small
                          @click="state.filterTypePopupShow = true"
                        >
                          {{ $t('pages.hotel-search.filter.showAll.label') }}
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-bottom-sheet v-model="state.filterTypePopupShow" scrollable>
                  <v-card>
                    <v-card-title class="pa-0">
                      <v-app-bar dense>
                        <v-app-bar-nav-icon>
                          <v-btn icon @click="state.filterTypePopupShow = false">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-app-bar-nav-icon>
                        <v-app-bar-title>{{ $t('pages.hotel-search.filter.propertyType.label') }}</v-app-bar-title>
                      </v-app-bar>
                    </v-card-title>
                    <v-card-text class="pa-0">
                      <v-list dense>
                        <v-list-item-group v-model="changeSearch.state.filter.types" multiple>
                          <v-list-item
                            v-for="(type) in changeSearch.state.included.type.data"
                            :key="type.code"
                            :value="type.code"
                          >
                            <template #default="{ active }">
                              <v-list-item-content>
                                <v-list-item-title v-text="type.name"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-checkbox :input-value="active"></v-checkbox>
                              </v-list-item-action>
                            </template>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn block color="primary" @click="state.filterTypePopupShow = false">
                        {{ $t('pages.hotel-search.filter.save.label') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-bottom-sheet>
                <v-list dense>
                  <v-subheader>{{ $t('pages.hotel-search.filter.facilities.label') }}</v-subheader>
                  <v-list-item-group v-model="changeSearch.state.filter.facilityCodes" multiple>
                    <v-list-item
                      v-for="(facility) in changeSearch.stateIncludeFacilityDataActive.value"
                      :key="facility.code"
                      :value="facility.code"
                    >
                      <template #default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title v-text="facility.name"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox :input-value="active"></v-checkbox>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-btn
                          color="primary"
                          text
                          x-small
                          @click="state.filterFacilityPopupShow = true"
                        >
                          {{ $t('pages.hotel-search.filter.showAll.label') }}
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-bottom-sheet v-model="state.filterFacilityPopupShow" scrollable>
                  <v-card>
                    <v-card-title class="pa-0">
                      <v-app-bar dense>
                        <v-app-bar-nav-icon>
                          <v-btn icon @click="state.filterFacilityPopupShow = false">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-app-bar-nav-icon>
                        <v-app-bar-title>{{ $t('pages.hotel-search.filter.facilities.label') }}</v-app-bar-title>
                      </v-app-bar>
                    </v-card-title>
                    <v-card-text class="pa-0">
                      <v-list dense>
                        <v-list-item-group
                          v-model="changeSearch.state.filter.facilityCodes"
                          multiple
                        >
                          <v-list-item
                            v-for="(facility, i) in changeSearch.state.included.facility.data"
                            :key="i"
                            :value="facility.code"
                          >
                            <template #default="{ active }">
                              <v-list-item-content>
                                <v-list-item-title v-text="facility.name"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-checkbox :input-value="active"></v-checkbox>
                              </v-list-item-action>
                            </template>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        block
                        color="primary"
                        @click="state.filterFacilityPopupShow = false"
                      >
                        {{ $t('pages.hotel-search.filter.save.label') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-bottom-sheet>
                <v-list dense>
                  <v-subheader>{{ $t('pages.hotel-search.filter.area.label') }}</v-subheader>
                  <v-list-item-group v-model="changeSearch.state.filter.areaCodes" multiple>
                    <v-list-item
                      v-for="(area) in changeSearch.stateIncludeAreaDataActive.value"
                      :key="area.code"
                      :value="area.code"
                    >
                      <template #default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title v-text="area.name"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox :input-value="active"></v-checkbox>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-btn
                          color="primary"
                          text
                          x-small
                          @click="state.filterAreaPopupShow = true"
                        >
                          {{ $t('pages.hotel-search.filter.showAll.label') }}
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-bottom-sheet v-model="state.filterAreaPopupShow" scrollable>
                  <v-card>
                    <v-card-title class="pa-0">
                      <v-app-bar dense>
                        <v-app-bar-nav-icon>
                          <v-btn icon @click="state.filterAreaPopupShow = false">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-app-bar-nav-icon>
                        <v-app-bar-title>{{ $t('pages.hotel-search.filter.area.label') }}</v-app-bar-title>
                      </v-app-bar>
                    </v-card-title>
                    <v-card-text class="pa-0">
                      <v-list dense>
                        <v-list-item-group v-model="changeSearch.state.filter.areaCodes" multiple>
                          <v-list-item
                            v-for="(area, i) in changeSearch.state.included.area.data"
                            :key="i"
                            :value="area.code"
                          >
                            <template #default="{ active }">
                              <v-list-item-content>
                                <v-list-item-title v-text="area.name"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-checkbox :input-value="active"></v-checkbox>
                              </v-list-item-action>
                            </template>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn block color="primary" @click="state.filterAreaPopupShow = false">
                        {{ $t('pages.hotel-search.filter.save.label') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-bottom-sheet>
                <v-list dense>
                  <v-subheader>{{ $t('pages.hotel-search.filter.hotelRating.label') }}</v-subheader>
                  <v-list-item-group v-model="changeSearch.state.filter.reviewRatings" multiple>
                    <v-list-item
                      v-for="(reviewRating) in changeSearch.stateIncludeReviewRatingDataActive.value"
                      :key="reviewRating.code"
                      :value="reviewRating.code"
                    >
                      <template #default="{ active }">
                        <v-list-item-content>
                          <v-list-item-title v-text="reviewRating.name"></v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-checkbox :input-value="active"></v-checkbox>
                        </v-list-item-action>
                      </template>
                    </v-list-item>
                  </v-list-item-group>
                  <v-list-item>
                    <v-list-item-content>
                      <v-list-item-title>
                        <v-btn
                          color="primary"
                          text
                          x-small
                          @click="state.filterReviewRatingPopupShow = true"
                        >
                          {{ $t('pages.hotel-search.filter.showAll.label') }}
                        </v-btn>
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
                <v-bottom-sheet v-model="state.filterReviewRatingPopupShow" scrollable>
                  <v-card>
                    <v-card-title class="pa-0">
                      <v-app-bar dense>
                        <v-app-bar-nav-icon>
                          <v-btn icon @click="state.filterReviewRatingPopupShow = false">
                            <v-icon>mdi-close</v-icon>
                          </v-btn>
                        </v-app-bar-nav-icon>
                        <v-app-bar-title>{{ $t('pages.hotel-search.filter.hotelRating.label') }}</v-app-bar-title>
                      </v-app-bar>
                    </v-card-title>
                    <v-card-text class="pa-0">
                      <v-list dense>
                        <v-list-item-group
                          v-model="changeSearch.state.filter.reviewRatings"
                          multiple
                        >
                          <v-list-item
                            v-for="(reviewRating, i) in changeSearch.state.included.reviewRating.data"
                            :key="i"
                            :value="reviewRating.code"
                          >
                            <template #default="{ active }">
                              <v-list-item-content>
                                <v-list-item-title v-text="reviewRating.name"></v-list-item-title>
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-checkbox :input-value="active"></v-checkbox>
                              </v-list-item-action>
                            </template>
                          </v-list-item>
                        </v-list-item-group>
                      </v-list>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn
                        block
                        color="primary"
                        @click="state.filterReviewRatingPopupShow = false"
                      >
                        {{ $t('pages.hotel-search.filter.save.label') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-bottom-sheet>
              </v-card-text>
              <v-card-actions>
                <v-btn block color="primary" @click="filterSubmit">
                  {{ $t('pages.hotel-search.filter.apply.label') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-bottom-sheet>
        </div>
      </v-container>
    </v-main>
  </div>
</template>
