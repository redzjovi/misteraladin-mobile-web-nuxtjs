<script lang="ts">
import {
  defineComponent,
  useContext,
  useRouter
} from '@nuxtjs/composition-api'
import useDestination from '~/composables/useDestination'
import useHotelSearch from '~/composables/useHotelSearch'

export default defineComponent({
  name: 'HotelPage',
  components: {
    DateRangePickerInput: () => import('~/components/DateRangePickerInput.vue'),
    DestinationInput: () => import('~/components/DestinationInput.vue'),
    RoomGuestPickerInput: () => import('~/components/RoomGuestPickerInput.vue')
  },
  nuxtI18n: {
    paths: {
      en: '/hotel',
      id: '/hotel'
    }
  },
  setup() {
    const {
      app,
      i18n
    } = useContext()
    const destination = useDestination();
    const hotelSearch = useHotelSearch()
    const $router = useRouter()

    const submit = async () => {
      let validate = false

      if (hotelSearch.state.filter.destination) {
        validate = true
      } else if (!hotelSearch.state.filter.destination) {
        await destination.getCurrentPosition().then(d => {
          hotelSearch.state.filter.destination = d
          validate = true
        }).catch(() => {
          window.alert(i18n.t('pages.hotel.form.gps.alert'))
        })
      }

      if (validate) {
        $router.push(app.localePath({
          name: 'hotel-search',
          query: hotelSearch.stateToQuery()
        }))
      }
    }

    return {
      hotelSearch,
      submit
    }
  }
})
</script>

<template>
  <div>
    <v-app-bar dense>
      <v-app-bar-nav-icon>
        <v-btn exact icon :to="localeRoute({ name: 'index' })">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>
      <v-app-bar-title>{{ $t('pages.hotel.title') }}</v-app-bar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <v-card>
          <v-card-text>
            <v-form>
              <DestinationInput
                v-model="hotelSearch.state.filter.destination"
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
                :from-show="true"
                :from-value.sync="hotelSearch.state.filter.checkIn"
                :label="$t('pages.hotel.form.checkIn.label')"
                :min="$dayjs().format('YYYY-MM-DD')"
                :placeholder="$t('pages.hotel.form.checkIn.placeholder')"
                :to-value.sync="hotelSearch.state.filter.checkOut"
              />
              <DateRangePickerInput
                dense
                format="YYYY-MM-DD"
                prepend-inner-icon="mdi-calendar"
                readonly
                :from-show="false"
                :from-value.sync="hotelSearch.state.filter.checkIn"
                :label="$t('pages.hotel.form.checkOut.label')"
                :min="$dayjs().format('YYYY-MM-DD')"
                :placeholder="$t('pages.hotel.form.checkOut.placeholder')"
                :to-show="true"
                :to-value.sync="hotelSearch.state.filter.checkOut"
              />
              <RoomGuestPickerInput
                dense
                prepend-inner-icon="mdi-account"
                :guest-value.sync="hotelSearch.state.filter.guest"
                :label="$t('pages.hotel.form.roomAndGuest.label')"
                :room-value.sync="hotelSearch.state.filter.room"
              />
              <v-btn
                block
                color="primary"
                dense
                @click="submit"
              >
                {{ $t('pages.hotel.form.submit.label') }}
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>
