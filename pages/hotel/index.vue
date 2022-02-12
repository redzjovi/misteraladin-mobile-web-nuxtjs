<script lang="ts">
import {
  defineComponent,
  reactive,
  ref
} from '@nuxtjs/composition-api';
import { Destination } from '~/composables/useDestination'

export default defineComponent({
  name: 'HotelPage',
  components: {
    DestinationInput: () => import('~/components/DestinationInput.vue')
  },
  nuxtI18n: {
    paths: {
      en: '/hotel',
      id: '/hotel'
    }
  },
  setup() {
    const state = reactive({
      destination: ref<Destination | null>(null)
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
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>
