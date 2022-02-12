<script lang="ts">
import {
  defineComponent,
  onMounted
} from '@nuxtjs/composition-api'
import useBanner from '~/composables/useBanner'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const banner = useBanner()

    onMounted(() => {
      banner.getBanners()
    })

    return {
      banner
    }
  }
})
</script>

<template>
  <div>
    <v-main>
      <v-skeleton-loader v-if="banner.state.loading" :height="250" type="image" />
      <v-carousel v-else :height="250" hide-delimiter-background>
        <v-carousel-item
          v-for="(b, i) in banner.state.banners"
          :key="i"
          :src="b.imageUrl"
          :to="localeRoute({
            name: 'promo-slug',
            params: {
              slug: b.slug
            }
          })"
          class="bg-contain"
        />
      </v-carousel>
    </v-main>
  </div>
</template>
