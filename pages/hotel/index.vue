<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  useContext
} from '@nuxtjs/composition-api';
import { Destination } from '~/composables/useDestination'

export default defineComponent({
  name: 'HotelPage',
  components: {
    DateRangePickerInput: () => import('~/components/DateRangePickerInput.vue'),
    DestinationInput: () => import('~/components/DestinationInput.vue')
  },
  nuxtI18n: {
    paths: {
      en: '/hotel',
      id: '/hotel'
    }
  },
  setup() {
    const { $dayjs } = useContext()

    const state = reactive({
      destination: ref<Destination | null>(null),
      checkIn: ref($dayjs().format('YYYY-MM-DD')),
      checkOut: ref($dayjs().add(1, 'day').format('YYYY-MM-DD'))
    })

    return {
      state
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
                v-model="state.destination"
                dense
                persistent-placeholder
                prepend-inner-icon="mdi-map-marker-outline"
                :label="$t('pages.hotel.form.destination.label')"
                :placeholder="$t('pages.hotel.form.destination.placeholder')"
              />
              <DateRangePickerInput
                dense
                format="YYYY-MM-DD"
                prepend-inner-icon="mdi-calendar"
                readonly
                :from-show="true"
                :from-value.sync="state.checkIn"
                :label="$t('pages.hotel.form.checkIn.label')"
                :min="$dayjs().format('YYYY-MM-DD')"
                :placeholder="$t('pages.hotel.form.checkIn.placeholder')"
                :to-value.sync="state.checkOut"
              />
              <DateRangePickerInput
                dense
                format="YYYY-MM-DD"
                prepend-inner-icon="mdi-calendar"
                readonly
                :from-show="false"
                :from-value.sync="state.checkIn"
                :label="$t('pages.hotel.form.checkOut.label')"
                :min="$dayjs().format('YYYY-MM-DD')"
                :placeholder="$t('pages.hotel.form.checkOut.placeholder')"
                :to-show="true"
                :to-value.sync="state.checkOut"
              />
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>
