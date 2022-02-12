<script lang="ts">
import {
  defineComponent,
  onMounted
} from '@nuxtjs/composition-api'
import usePromo from '~/composables/usePromo'

export default defineComponent({
  name: 'PromoPage',
  nuxtI18n: {
    paths: {
      en: '/promo',
      id: '/promo'
    }
  },
  setup() {
    const promo = usePromo()

    onMounted(() => {
      promo.getPromos()
    })

    return {
      promo
    }
  }
})
</script>

<template>
  <div>
    <v-app-bar app dense>
      <v-app-bar-nav-icon>
        <v-btn exact icon :to="localeRoute({ name: 'index' })">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-filter</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <template v-if="promo.state.loading">
          <v-card v-for="i in 5" :key="i" class="mb-4">
            <v-skeleton-loader type="image" />
          </v-card>
        </template>
        <template v-else>
          <v-card
            v-for="(p, i) in promo.state.promos"
            :key="i"
            class="mb-4"
            target="_blank"
            :to="{
              name: 'promo-slug',
              params: {
                slug: p.slug
              }
            }"
          >
            <v-img :src="p.imageUrl" />
            <v-card-actions v-if="p.dateFrom" class="d-flex">
              <div>{{ $t('period') }}</div>
              <div class="ml-auto">
                {{ p.dateFrom }}
                -
                {{ p.dateTo }}
              </div>
            </v-card-actions>
          </v-card>
        </template>
      </v-container>
    </v-main>
  </div>
</template>
