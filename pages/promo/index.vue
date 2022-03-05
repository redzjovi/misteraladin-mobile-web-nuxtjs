<script lang="ts">
import {
  defineComponent,
  onMounted,
  reactive,
  ref,
  useContext,
  useRouter
} from '@nuxtjs/composition-api'
import useMenu from '~/composables/useMenu'
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
    const { app } = useContext()
    const menu = useMenu()
    const promo = usePromo()
    const $router = useRouter()

    const state = reactive({
      filterShow: ref(false)
    })

    const filterSubmit = () => {
      $router.push(app.localePath({
        name: 'promo',
        query: promo.stateToQuery()
      }))
      state.filterShow = false
      promo.getPromos()
    }

    onMounted(() => {
      menu.getMenus()
      promo.stateToQuery()
      promo.getPromos()
    })

    return {
      filterSubmit,
      menu,
      promo,
      state
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
      <v-btn icon @click="state.filterShow = true">
        <v-icon>mdi-filter</v-icon>
      </v-btn>
      <v-bottom-sheet v-model="state.filterShow">
        <v-list class="pa-0">
          <v-subheader>{{ $t('filter') }}</v-subheader>
          <v-list-item-group v-model="promo.state.filter.types" multiple>
            <template v-if="menu.state.loading">
              <v-skeleton-loader v-for="i in 5" :key="i" type="list-item-avatar" />
            </template>
            <template v-else>
              <v-list-item v-for="(m, i) in menu.stateActiveMenus.value" :key="i" :value="m.type">
                <template #default="{ active }">
                  <v-list-item-avatar>
                    <v-img :src="m.iconUrl"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-text="m.title"></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-checkbox :input-value="active"></v-checkbox>
                  </v-list-item-action>
                </template>
              </v-list-item>
            </template>
          </v-list-item-group>
          <v-list-item>
            <v-list-item-content>
              <v-row>
                <v-col>
                  <v-btn
                    block
                    color="error"
                    outlined
                    @click="state.filterShow = false"
                  >
                    {{ $t('cancel') }}
                  </v-btn>
                </v-col>
                <v-col>
                  <v-btn block color="primary" @click="filterSubmit">{{ $t('ok') }}</v-btn>
                </v-col>
              </v-row>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-bottom-sheet>
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
