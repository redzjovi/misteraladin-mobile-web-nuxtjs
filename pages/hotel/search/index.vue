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
      changeSearchPopupShow: ref(false)
    })

    const changeSearchSubmit = () => {
      $router.push(app.localePath({
        name: 'hotel-search',
        query: changeSearch.stateToQuery()
      }))

      setTimeout(() => {
        state.changeSearchPopupShow = false
        hotelSearch.queryToStateFilter()
      }, 100)
    }

    onMounted(() => {
      changeSearch.queryToStateFilter()
      hotelSearch.queryToStateFilter()
    })

    return {
      changeSearch,
      changeSearchSubmit,
      hotelSearch,
      state
    }
  }
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
        <v-card>
          <v-card-text>
            <!--  -->
            <pre>{{ changeSearch.state }}</pre>
            <pre>{{ hotelSearch.state }}</pre>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>
