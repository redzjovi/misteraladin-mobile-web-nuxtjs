<script lang="ts">
import {
  defineComponent,
  useAsync,
  useContext
} from '@nuxtjs/composition-api'
import usePromo from '~/composables/usePromo'

export default defineComponent({
  nuxtI18n: {
    paths: {
      en: '/promotion/:slug',
      id: '/promosi/:slug'
    }
  },
  setup() {
    const {
      error,
      params
    } = useContext()
    const promo = usePromo()

    const detail = useAsync(() => {
      return promo.getPromoBySlug(params.value.slug)
        .then(p => p)
        .catch(() => error({ statusCode: 404 }))
    })

    return {
      detail
    }
  }
})
</script>

<template>
  <div>
    <v-app-bar app dense>
      <v-app-bar-nav-icon>
        <v-btn exact icon :to="localeRoute({ name: 'promo' })">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
      </v-app-bar-nav-icon>
    </v-app-bar>
    <v-main>
      <v-container v-if="detail">
        <v-img :src="detail.imageUrl"></v-img>
        <h3>{{ detail.title }}</h3>
      </v-container>
    </v-main>
  </div>
</template>
