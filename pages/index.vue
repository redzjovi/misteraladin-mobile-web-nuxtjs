<script lang="ts">
import {
  defineComponent,
  onMounted
} from '@nuxtjs/composition-api'
import useBanner from '~/composables/useBanner'
import useMenu from '~/composables/useMenu'

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const banner = useBanner()
    const menu = useMenu()

    onMounted(() => {
      banner.getBanners()
      menu.getMenus()
    })

    return {
      banner,
      menu
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
      <v-container>
        <v-row v-if="menu.state.loading">
          <v-col v-for="i in 8" :key="i" align="center" cols="3">
            <v-skeleton-loader type="avatar" />
          </v-col>
        </v-row>
        <v-row v-if="!menu.state.loading && menu.state.menus.length > 0">
          <v-col v-for="(m, i) in menu.state.menus" :key="i" align="center" cols="3">
            <Portal :to="'menu-avatar-' + i">
              <v-avatar>
                <v-img :src="m.iconUrl"></v-img>
              </v-avatar>
              <div class="caption">{{ m.title }}</div>
            </Portal>
            <template v-if="m.active">
              <NuxtLink :to="localeRoute({ name: m.type })" class="text-decoration-none">
                <PortalTarget :name="'menu-avatar-' + i"></PortalTarget>
              </NuxtLink>
            </template>
            <template v-else>
              <PortalTarget :name="'menu-avatar-' + i"></PortalTarget>
            </template>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>
